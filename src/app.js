const path = require('path');
const express = require('express');
const hbs = require('hbs');
const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');

const app = express();

//Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//this lets us actualy use hbs. hbs needs everything in the root/views folder by default
app.set('view engine', 'hbs');
app.set('views', viewsPath);   //overrides the default
hbs.registerPartials(partialsPath);

//For static html we are serving
app.use(express.static(publicDirectoryPath));   //Looks through this first, and since index.html is in there, it will overtake any route

//Call render to get itto render, no need for extension. The second object is the args being passed in
app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Jon Schlebach'
  });
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    name: 'Jon Schlebach'
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    name: 'Jon Schlebach',
    message: 'This is a test help message'
  })
})

app.get('/weather', (req, res) => {
  if(!req.query.address) {
    return res.send({
      error: 'Address must be provided'
    })
  } 
  geocode(req.query.address, (error, {longitude, latitude, location} = {}) => {
    if(error) {
      return res.send({
        error
      })
    }
    forecast(longitude, latitude, (error, forecastData) => {
      if(error) {
        return res.send({
          error
        })
      } 
      res.send({
        forecast: forecastData,
        location,
        address: req.query.address
      })
    })
  });
  
})

app.get('/products', (req, res) => {
  if(!req.query.search) {
    return res.send({
      error: 'You must provide a search term'
    })
  } 

  console.log(req.query)
  res.send({
    products: []
  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Jon Schlebach',
    errorMessage: 'The help article you are looking for was not found'
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Jon Schlebach',
    errorMessage: 'Page not found'
  })
})

app.listen(3000, () => {
  console.log('Server started on port 3000.');
});