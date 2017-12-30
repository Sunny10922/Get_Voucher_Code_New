var express = require('express')
var app = express()
const axios = require('axios');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.get('/getweather', function(request, response) {
  axios.get('https://api.weather.gov/alerts?active=1&state=MN')
  .then(function (response) {
    console.log(response);
    response.send(response);
  })
  .catch(function (error) {
    console.log(error);
    response.send(error);
  });
})
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
