const request = require('request');

//json property auto parses, no need to use JSON.parse
const forecast = (long, lat, callback) => {
  const url = 'https://api.darksky.net/forecast/dcb1c0386acab4cc66ac3055d3cf70f6/' + lat + ',' + long + '?units=si';
  request({ url, json: true }, (error, {body}) => {
    if(error) {
      callback('Unable to connect to weather service...', undefined);
    } else if (body.error) {
      callback('Unable to find location...', undefined);
    } else {
      const rainChance = body.currently.precipProbability * 100;
      const temperature = body.currently.temperature;
      const returnString = body.daily.data[0].summary + ' It is currently ' + temperature + ' degrees out. There is a ' + rainChance + '% chance of rain. The expected high for the day is ' + body.daily.data[0].temperatureHigh + ' degrees celsius.';
      callback(undefined, returnString);
    }
  })
}

module.exports = forecast;
