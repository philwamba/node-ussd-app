const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3030;

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const places = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 
  'Homa Bay', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 
  'Machakos', 'Makueni', 'Mandera', 'Meru', 'Migori', 'Marsabit', 
  'Muranga', 'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 
  'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita Taveta', 'Tana River', 
  'Tharaka Nithi', 'Trans Nzoia', 'Uasin Gishu', 'Vihiga', 'West Pokot'
];

const menus = {
  'home': {
    'title': 'Welcome to app test \n1. My Account \n2. My phone number',
    '1': {
      'title': 'Choose account information you want to view \n1. Account number\n2. Account balance',
      '1': {
        'title': 'Your account number is A/C283041001',
      },
      '2': {
        'title': 'Your balance is KES 5,000',
      }
    },
    '2': {
      'title': 'Your phone number is',
    }
  }
};

class UssdMenu {
  con(text) {
    return 'CON ' + text;
  }

  end(text) {
    return 'END ' + text;
  }

  showNextScreen() {
    // Placeholder for showing the next screen
  }

  showError() {
    // Placeholder for showing error
  }
}

class UssdService {
  constructor(text) {
    this.text = text;
  }

  get isFirstRequest() {
    return this.text === '';
  }

  get menuLevel() {
    return this.text.split("*").length;
  }

  get lastRequestItem() {
    let items = this.text.split("*");
    return items[items.length - 1];
  }

  get isExitRequest() {
    return this.lastRequestItem === '00';
  }

  get isGoBackRequest() {
    return this.lastRequestItem === '0';
  }
}

app.get('*', (req, res) => {
  res.send('A simple Node.js USSD app.');
});

app.post('*', (req, res) => {
  let { sessionId, serviceCode, phoneNumber, text } = req.body;

  const ussd = new UssdMenu();
  const service = new UssdService(text);

  if (service.isFirstRequest) {
    let response = ussd.con(menus.home.title);
    res.send(response);
  } else {
    // Handle the menu navigation
    let steps = text.split("*");
    let currentMenu = menus['home'];

    for (let step of steps) {
      if (currentMenu[step]) {
        currentMenu = currentMenu[step];
      } else {
        res.status(400).send(ussd.end('Invalid option!'));
        return;
      }
    }

    if (currentMenu.title) {
      let response = currentMenu.title;
      if (steps[steps.length - 1] === '2' && service.menuLevel === 2) {
        response += ` ${phoneNumber}`;
      }
      res.send(ussd.end(response));
    } else {
      res.status(400).send(ussd.end('Invalid request!'));
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
