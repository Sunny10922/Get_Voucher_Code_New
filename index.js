var express = require('express')
var app = express()
const axios = require('axios');
const CircularJSON = require('circular-json');
var token = '';
var weatherData = [];

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
require('dotenv').load();
app.get('/', function (request, response) {
	response.send('Hello World!')
})
/*app.get('/getweather', function (request, responsefromWeb) {
	axios.get('https://api.weather.gov/alerts/active/area/IL')
		.then(function (response) {
			var datafromCall = response.data.features;
			for (var x = 0; x < datafromCall.length; x++) {
				var weatherItem = {
					"keys": {
						"unique_key": datafromCall[x].properties.id,
						"email_id": "test@gmail.com"
					},
					"values": {
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
})*/

app.get('/connecttoMC', function (request, responsefromWeb) {
	console.log(process.env.CLIENT_ID);
	var conData = {
		'grant_type': 'client_credentials',
		'client_id': process.env.CLIENT_ID,
		'client_secret': process.env.CLIENT_SECRET
	}
	axios({
		method: 'post',
		url: 'https://mctg9llgcpl0dff718-t9898wqh1.auth.marketingcloudapis.com/v2/token',
		data: conData,
		headers: {
			'Content-Type': 'application/json',
		}
	})
		.then(function (response) {
			token = response.data.access_token;
			console.log(token);
			responsefromWeb.send('Authorization Sent');

		}).catch(function (error) {
			console.log(error);
			responsefromWeb.send(error);
		});
})

/*app.get('/connecttoMCData', function (request, responsefromWeb) {

	axios({
		method: 'post',
		url: 'https://mctg9llgcpl0dff718-t9898wqh1.rest.marketingcloudapis.com/hub/v1/dataevents/key:testdataextension/rowset',
		data: weatherData,
		headers: {
			'Authorization': 'Bearer ' + token,
			'Content-Type': 'application/json',
		}
	})
		.then(function (response) {
			var json = CircularJSON.stringify(response);
			console.log(json);
			responsefromWeb.send(json);
		})
		.catch(function (error) {
			console.log(error);
		});
})*/


app.listen(app.get('port'), function () {
	console.log("Node app is running at localhost:" + app.get('port'))
})
