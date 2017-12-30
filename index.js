var express = require('express')
var app = express()
const axios = require('axios');
var token='';
var weatherData = [];

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.get('/getweather', function(request, responsefromWeb) {
  axios.get('https://api.weather.gov/alerts?active=1&state=MN')
  .then(function (response) {
  	var datafromCall = response.data.features;
  	for(var x=0;x<datafromCall.length;x++){
  		var weatherItem = {
  			"keys":{
  				"id" : datafromCall[x].properties.id
  			},
  			"values":{
  				"type": datafromCall[x].type,
  				"effective": datafromCall[x].properties.effective,
  				"expires": datafromCall[x].properties.expires,
  				"certainty": datafromCall[x].properties.certainty,
  				"event": datafromCall[x].properties.event,
  				"response": datafromCall[x].properties.response,
  				"headline": datafromCall[x].properties.headline,
  				"description": datafromCall[x].properties.description
  			}
  		}
  		weatherData.push(weatherItem);
  	}
  	console.log(weatherData);
    responsefromWeb.send(response.data.features);
  })
  .catch(function (error) {
    console.log(error);
    responsefromWeb.send(error);
  });
})

app.get('/connecttoMC', function(request, responsefromWeb) {
	var conData = {
    'clientId': process.env.CLIENT_ID,
    'clientSecret': process.env.CLIENT_SECRET  
  	}
	axios({
	  method:'post',
	  url:'https://auth.exacttargetapis.com/v1/requestToken',
	  data: conData,
	  headers:{
       'Content-Type': 'application/json',
	  }
	})
	  .then(function(response) {
	  	console.log(response);
	  		responsefromWeb.send('Authorization Sent');
	  		token = response.data.accessToken;
	  	
	}).catch(function (error) {
	    console.log(error);
	    responsefromWeb.send(error);
	  });
})

 

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
