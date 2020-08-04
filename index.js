const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const port = process.env.PORT || 3030;

app.use(morgan('dev'));
app.use(helmet());
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const places = ['Baringo','Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Homa Bay', 'Kajiado', 'Kakamega','Kericho', 'Kiambu', 'Kilifi','Kirinyaga','Kisii', 'Kisumu','Kitui','Kwale','Laikipia','Lamu', 'Machakos', 'Makueni','Mandera', 'Meru', 'Migori','Marsabit','Muranga','Nairobi', 'Nakuru','Nandi','Narok','Nyamira','Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi', 'Trans Nzoia', 'Uasin Gishu', 'Vihiga','West Pokot'];

const menus = {
  'home': {
     'title': 'Welcome to app test \n1. My Account \n2. My phone number',
     '1': {
        'title': 'Choose account information you want to view \n1. Account number\n2. Account balance',
        '1': {
          'title': 'Your account balance is',
        },
        '2': {
          'title': 'Your account number is',
        }
     },
     '2': {
        'title': 'Your phone number is',
     }
  }
}

class UssdMenu {
  con(text) {
    return 'CON ' + text;
  }

  end(text) {
    return 'END ' + text;
  }

  showNextScreen() {

  }

  showError() {

  }
}

class UssdService {

  // constructor() { }
  constructor(text) {
    this.text = text;
  }

  get isFirstRequest() {
    if (this.text == '') {
      return true;
    }
    return false;
  }

  get menuLevel() {
    let items = this.text.split("*");

    return items.length;
  }

  //get the last ussd string item
  get lastRequestItem() {
    let items = this.text.split("*");

    return items[items.length-1];
  }

  get isExitRequest() {
    return this.lastRequestItem == '00';
  }

  get isGoBackRequest() {
    return this.lastRequestItem == 0;
  }
}



app.get('*', (req, res) => {
  res.send('A simple node js USSD app.')
})

app.post('*', (req, res) => {
  let {sessionId, serviceCode, phoneNumber, text} = req.body
  
  const ussd = new UssdMenu();
  const service = new UssdService(text);

  if(service.isFirstRequest) {
    switch(service.isFirstRequest) {
      case true:
        let response = ussd.con(menus.home.title);
        res.send(response);
        break;
      default:
        res.status(400).send('END Invalid request!');
    }
  } else {
    let response = ussd.end("Level:" + service.menuLevel + "Go Back:"+ service.isGoBackRequest);
    res.send(response);
  }

  
  

  // if(service.isFirstRequest) {
  //   switch(text) {
  //     case '':
  //       let response = ussd.con(menus.home.title);
  //       res.send(response);
  //       break;
  //     case '1':
  //       let response2 = ussd.con('Choose account information you want to view \n1. Account number\n2. Account balance');
  //       res.send(response2);
  //       break;
  //     case '2':
  //       let response3 = ussd.con(`Your phone number is ${phoneNumber}`);
  //       res.send(response3);
  //       break;
  //     default:
  //       res.status(400).send('Invalid request!');
  //   }
  // } else {
  //   ussd.showNextScreen()
  // }

  

  // if (text == '' || text == '0') {
  //   // This is the first request. Note how we start the response with CON
  //   let response = ussd.con('Welcome to Ussd test \n1. My Account \n2. My phone number');
  //   res.send(response);
  // } else if (text == '1') {
  //   // Business logic for first level response
  //   let response = ussd.con('Choose account information you want to view \n1. Account number\n2. Account balance');
  //   res.send(response)
  // } else if (text == '2') {
  //   // Business logic for first level response
  //   text = '';
  //   let response = ussd.con(`Your phone number is ${phoneNumber}`); 
  //   res.send(response)
  // } else if (text == '1*1') {
  //   // Business logic for first level response
  //   let accountNumber = 'A/C283041001'
  //   // This is a terminal request. Note how we start the response with END
  //   let response = `END Your account number is ${accountNumber}`
  //   res.send(response)
  // } else if (text == '1*2') {
  //   // This is a second level response where the user selected 1 in the first instance
  //   let balance = 'KES 5,000'
  //   // This is a terminal request. Note how we start the response with END
  //   let response = `END Your balance is ${balance}`
  //   res.send(response)
  // } else {
  //   res.status(400).send('Invalid request!')
  // }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});