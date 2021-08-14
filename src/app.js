const path = require("path");
const express = require("express");
const hbs = require("hbs");
const forecast = require("./utils/forecast");
const geocode = require("./utils/geocode");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebars and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Gregorio Undurraga",
    message: "Use this site to get the weather!",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Gregorio Undurraga ",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Gregorio Undurraga",
    message: "Do you need any help?",
  });
});

// app.get("/products", (req, res) => {
//   if (!req.query.search) {
//     return res.send({
//       error: "You must provide a search term",
//     });
//   }

//   console.log(req.query.search);
//   res.send({
//     products: [],
//   });
// });

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }
  const address = req.query.address;
  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }
      res.send({
        address: req.query.address,
        location,
        forecast: forecastData,
      });
    });
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    errorMessage: "Help article not found",
    title: "Error 404 Help",
    name: "Gregorio Undurraga",
  });
});

app.get("*", function (req, res) {
  res.render("404", {
    errorMessage: "Page not found",
    title: "Error 404",
    name: "Gregorio Undurraga",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
