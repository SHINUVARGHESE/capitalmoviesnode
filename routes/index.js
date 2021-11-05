var express = require('express');
var router = express.Router();
var movies = require('../tmdbApis/movies')
var movieHelpers = require('../helpers/movieHelpers')
var userHelpers = require('../helpers/userHelpers');
const { createTokens, validateToken } = require('../tokens/jwt')
router.get('/', function (req, res, next) {
  console.log('base root success');
  res.send('base root success')
});

router.post('/signup', function (req, res) {
  const userdata = req.body.user
  const data = {
    username: userdata.username,
    contact: userdata.contact,
    emailaddress: userdata.emailaddress,
    password: userdata.password,
  }
userHelpers.findMail((data.emailaddress),(response)=>{
  if(response){
    res.json({message:"email exists"})
  }else{
    userHelpers.userSignup(data, (results) => {
    if (results) {
      console.log('data added in database');
      return res.status(201).json(true);
    } else {
      console.log('data not added in database, find some error');
      return res.status(404).json(false)
    }
  });
  }
})
  
})

router.post('/signin', function (req, res) {
  userHelpers.userSignin(req.body.user).then((response) => {
    if (response.status) {
      const userdata = {
        username: response.data.username,
        id: response.data._id
      }
      const accessToken = createTokens(response.data)
      res.status(201).json({ accessToken, user: userdata })
      // res.cookie('accesstoken', accessToken, { maxAge: 900000 }) 

    } else {
      return res.status(404).json({ error: "wrong EmailId and Password!" });
    }
  });
})

router.get('/allmovies', function (req, res) {
  movieHelpers.popularMovies((result) => {
    const popular = result[0].popularmovies
    movieHelpers.latestMovies((response) => {
      movieHelpers.trendingMovies((trendingresponse) => {
        const trending = trendingresponse[0].trendingmovies;
        const allmovies = { 
          popular,
          trending,
          latest: [response[0].latestmovies],
        }
        res.status(201).json(allmovies)
      })
    })
  })
})

router.post('/checktoken', validateToken, function (req, res) {
  res.status(200).json({ cookie: true })
})

router.post('/findvideoid',function (req, res) { 
  movies.findvideoid(req.body.id,(videoId)=>{ 
    if(videoId.results){
    const videoid = videoId.results[0].key
    res.status(200).json({ youtubeVideoId: videoid })
    }else{
      res.status(200).json({error:"no video"})
    }
  })
})

router.post('/addtofavorate',function (req,res) {
  if(req.body.category=="popularmovies"){
    movieHelpers.popularMovies( async (result) => {
      const movies = result[0].popularmovies
      const find = movies.map((item,ky)=>{
        if(req.body.movieId==item.id){
          return item
        } 
    })
     let filtered = await find.filter(function(x) {
        return x !== undefined;
      })
       const obj = {moviedetails: filtered[0],userid:req.body.userId}
        userHelpers.addtofavorate((obj),(response)=>{
          if(response){
            res.status(200).json({status:true})
          }else{
            res.status(400).json({staus:false})
          }
        })

      
    })
  }else if(req.body.category == "trendingmovies"){
    movieHelpers.trendingMovies( async (result) => {
      const movies = result[0].trendingmovies
      const find = movies.map((item,ky)=>{
        if(req.body.movieId==item.id){
          return item
        } 
    })
     let filtered = await find.filter(function(x) {
        return x !== undefined;
      })
       const obj = {moviedetails: filtered[0],userid:req.body.userId}
        userHelpers.addtofavorate((obj),(response)=>{
          if(response){
            res.status(200).json({status:true})
          }else{
            res.status(400).json({staus:false})
          }
        })

      
    })
  }
  
})

router.post("/deletefavorate",function(req,res) {
  userHelpers.deletefavorate((req.body),(response)=>{
    if(response){
      res.status(200).json({status:true})
    }else{
      res.status(200).json(false)
    }
  })
})

router.post("/userfavorate",function(req,res){
  userHelpers.findfavorate((req.body.userid),(response)=>{
    if(response){
      res.status(200).json({favoratemovies:response})
    }else{
      res.status(200).json(false)
    }
  })
})

router.get('/storepopularmovies', function (req, res) {
  movies.popularmovies((popularmovies) => {
    if (popularmovies) {
      movieHelpers.addPopularMovies(popularmovies.results, (response) => {
        if (response) {
          res.send('popular movies added')
        } else {
          res.send('popular movies not added in database')
        }
      })
    } else {
      res.send('some proble in calling popular movies api')
    }
  })
})

router.get('/storelatestmovies', function (req, res) {
  movies.latestmovies((latestmovies) => {
    if (latestmovies) {
      movieHelpers.addLatestMovies(latestmovies, (response) => {
        if (response) {
          res.send('latest movies added')
        } else {
          res.send('latest movies not added in database')
        }
      })
    } else {
      res.send('some proble in calling latest movies api')
    }
  })
})

router.get('/storetrendingmovies', function (req, res) {
  movies.trendingmovies((trendingmovies) => {
    if (trendingmovies) {
      movieHelpers.addTrendingMovies(trendingmovies, (response) => {
        if (response) {
          res.send('trending movies added')
        } else {
          res.send('trending movies not added in database')
        }
      })
    } else {
      res.send('some proble in calling trending movies api')
    }
  })
})

module.exports = router;
