define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('clickedNext', save);

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

    }

    function initialize(data) {
        console.log('--Inside initialize');
        console.log(data);
        if (data) {
            payload = data;
        }

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};
        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                $('#'+key).val(val); 
            });
        });
        
        connection.trigger('updateButton', {
            button: 'next',
            text: 'Get Voucher Code',
            visible: true
        });

        var express = require('express')
    var app = express()
    const axios = require('axios');
    const CircularJSON = require('circular-json');
    var token = '';
    var voucherData = [];

    app.set('port', (process.env.PORT || 5000))
    app.use(express.static(__dirname + '/public'))
    require('dotenv').load();
    app.get('/', function (request, response) {
        response.send('Hello World!')
    })

    app.get('/connecttoMCData', function (request, responsefromWeb) {
        console.log('--Inside connecttoMCData method--');
        console.log(request);
        //var fName = $('#first_name').val();
        //console.log('--fName::'+fName);
    
        var voucherItem = {
            "keys": {
                "unique_key":  "12345",
                "email_id":    "sunny.bansal@ibm.com"
            },
            "values": {
                "first_name":  "Sunny",
                "last_name":   "Bansal",
                "age":         "28",
                "birth_date":  "10/06/1992",
                "phone_number":"9999614829",
                "voucher_code":  "SunnyBansal123"
            }
        }
        voucherData.push(voucherItem);
    
        axios({
            method: 'post',
            url: 'https://mctg9llgcpl0dff718-t9898wqh1.rest.marketingcloudapis.com/hub/v1/dataevents/key:testdataextension/rowset',
            data: voucherData,
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
    })
    
    }

    function onGetTokens(tokens) {
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        console.log(endpoints);
    }

    function save() {
        
        var firstName = $('#first_name').val();
        var lastName = $('#last_name').val();
        var voucherCode = firstName + '' + lastName + '12345';

        payload['arguments'].execute.outArguments = [{
            "voucher_code": voucherCode
        }];
        
        payload['metaData'].isConfigured = true;
        console.log(payload);
        connection.trigger('updateActivity', payload);
    }

});