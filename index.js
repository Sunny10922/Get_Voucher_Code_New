var express = require('express')
var app = express()
const axios = require('axios');
const CircularJSON = require('circular-json');
var token='';
var weatherData = [];

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
require('dotenv').load();
app.get('/', function(request, response) {
  response.send('Hello World!')
})
app.get('/getweather', function(request, responsefromWeb) {
  axios.get('https://api.weather.gov/alerts/active/area/MN')
  .then(function (response) {
  	var datafromCall = response.data.features;
  	for(var x=0;x<datafromCall.length;x++){
  		var weatherItem = {
  			"keys":{
  				"theid" : datafromCall[x].properties.id
  			},
  			"values":{
					"field1": datafromCall[x].type,
					"field2": datafromCall[x].properties.sender
  			}
  		}
  		weatherData.push(weatherItem);
  	}
    responsefromWeb.send(response.data.features);
  })
  .catch(function (error) {
    console.log(error);
    responsefromWeb.send(error);
  });
})

app.get('/connecttoMC', function(request, responsefromWeb) {
	console.log(process.env.CLIENT_ID);
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
	  		responsefromWeb.send('Authorization Sent');
	  		token = response.data.accessToken;
	  	
	}).catch(function (error) {
	    console.log(error);
	    responsefromWeb.send(error);
	  });
})

app.get('/connecttoMCData', function(request, responsefromWeb) {
	
	axios({
	    method: 'post',
	    url: 'https://www.exacttargetapis.com/hub/v1/dataevents/key:testdataextension/rowset',
	    data: weatherData,
	    headers:{
	       'Authorization': 'Bearer ' + token,
	       'Content-Type': 'application/json',
	    }
	  })
	    .then(function(response) {
				var json = CircularJSON.stringify(response);
	      console.log(json);
	      responsefromWeb.send(json);
		}) 
		 .catch(function (error) {
			console.log(error);
		});
})
 

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
