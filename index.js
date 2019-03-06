const app = require('express')()
const bodyParser = require('body-parser')
const morgan = require('morgan')

const port = process.env.PORT || 3030

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('*', (req, res) => {
  res.send('A simple node js USSD app.')
})

app.post('*', (req, res) => {
  let {sessionId, serviceCode, phoneNumber, text} = req.body
  if (text == '') {
    // This is the first request. Note how we start the response with CON
    let response = 'CON What would you want to check \n1. My Account \n2. My phone number'
    res.send(response)
  } else if (text == '1') {
    // Business logic for first level response
    let response = 'CON Choose account information you want to view \n1. Account number\n2. Account balance'
    res.send(response)
  } else if (text == '2') {
    // Business logic for first level response
    let response = `END Your phone number is ${phoneNumber}`
    res.send(response)
  } else if (text == '1*1') {
    // Business logic for first level response
    let accountNumber = 'A/C283041001'
    // This is a terminal request. Note how we start the response with END
    let response = `END Your account number is ${accountNumber}`
    res.send(response)
  } else if (text == '1*2') {
    // This is a second level response where the user selected 1 in the first instance
    let balance = 'KES 5,000'
    // This is a terminal request. Note how we start the response with END
    let response = `END Your balance is ${balance}`
    res.send(response)
  } else {
    res.status(400).send('Invalid request!')
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})