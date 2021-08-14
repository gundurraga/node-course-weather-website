const request = require("request");

const forecast = (longitude, latitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=55538fd36ed2c6d90d56a0c6e6efd0eb&query=${longitude},${latitude}`;

  request({ url, json: true }, (error, response) => {
    if (error) {
      callback("Unable to connect to weather service!", undefined);
    } else if (response.body.error) {
      callback("Unable to find a location with this coordinates.");
    } else {
      callback(
        undefined,
        `${response.body.current.weather_descriptions[0]}. It is currently ${response.body.current.temperature} degrees celsius and there is ${response.body.current.humidity}% humidity.`
      );
    }
  });
};

module.exports = forecast;
