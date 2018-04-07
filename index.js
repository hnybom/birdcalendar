// copy this into your app.js
const express = require('express');  
const path = require('path');  
const app = express();
const PORT = process.env.PORT || 5000

// view engine setup
app.set('views', path.join(__dirname, 'views'));  
app.set('view engine', 'jade');

app.get('/api/v1/login', function(req, res) {  
  let data = {
    message: 'Hello World!'
  };
  res.status(200).send(data);
});

app.use('/', express.static('ui-app/dist'));

app.listen(PORT, () => console.log('Example app listening on port ${PORT}!'))