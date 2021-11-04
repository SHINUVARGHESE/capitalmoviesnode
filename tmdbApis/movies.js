const request = require('request')
require('dotenv').config();
const api_key =process.env.API_KEY;
 
_POPULARMOVIES_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=1`;

_LATESTMOVIES_URL = `https://api.themoviedb.org/3/movie/latest?api_key=${api_key}&language=en-US`;

_TRENDINGMOVIES_URL = `https://api.themoviedb.org/3/trending/all/week?api_key=${api_key}&language=en-US`;


module.exports.popularmovies = (callback) => {
    request(_POPULARMOVIES_URL, { json: true }, (err, res, body) => {
    if (err) { 
        return callback(err);
     }
    return callback(body);
    });
}

module.exports.latestmovies = (callback) => {
    request(_LATESTMOVIES_URL, { json: true }, (err, res, body) => {
    if (err) { 
        return callback(err);
     }
    return callback(body);
    });
}

module.exports.trendingmovies = (callback) => {
    request(_TRENDINGMOVIES_URL, { json: true }, (err, res, body) => {
    if (err) { 
        return callback(err);
     }
    return callback(body);
    });
}

module.exports.findvideoid =(id, callback)=>{
    request(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${api_key}&language=en-US`, { json: true },(err, res, body)=>{
        if(err){
            return callback(err);
        }
        return callback(body);
    });
}


