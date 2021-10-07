var express = require('express');
var router = express.Router();
const request = require('request');

const apiKey = '1e448e0dfcdbb565f5d329820065b4d2';
const apiBaseUrl = 'https://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

router.use((req, res, next)=>{
  res.locals.imageBaseUrl = imageBaseUrl;
  next()
})


router.get('/', function(req, res, next) {

  request.get(nowPlayingUrl,(error, response, movieData)=>{

    const parsedData = JSON.parse(movieData)
    res.render('index', {
      parsedData: parsedData.results
    })
 
  })
});

router.get('/movie/:id',(req, res, next)=>{
 
  const movieId = req.params.id;
  const thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`
 
  request.get(thisMovieUrl,(error, response, movieData)=>{
    console.log(typeof(movieData))
    const parsedData = JSON.parse(movieData)
    res.render('single-movie',{
      parsedData
    })
  })
})

router.post('/search',(req, res, next)=>{
  
  const userSearchTerm = encodeURI(req.body.movieSearch);
  const cat = req.body.cat;
  const movieUrl = `${apiBaseUrl}/search/${cat}?query=${userSearchTerm}&api_key=${apiKey}`
  
  request.get(movieUrl,(error, response, movieData)=>{
    let parsedData = JSON.parse(movieData);
    
    if(cat=="person"){
      parsedData.results = parsedData.results[0].known_for;
    }
    res.render('index', {
      parsedData: parsedData.results
    })
  })
})

module.exports = router;
