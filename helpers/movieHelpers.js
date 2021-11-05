var collections = require('../config/collection');
var db = require('../config/connection');
var bcrypt = require('bcryptjs');
var objectId = require("mongodb").ObjectID;

module.exports = {
    addPopularMovies: async (popularmovies, callback) => {
        var response = await db
            .get()
            .collection(collections.popularmovie_collections)
            .updateOne(
                { _id: objectId('618130e78b33d84cefc0d35f') },
                {
                    $set: {
                        popularmovies: popularmovies
                    },
                }
            );
        callback(response);
        // db.get()
        // .collection(collections.popularmovie_collections)
        // .insertOne({popularmovies:popularmovies})
        // .then((data) => { 
        //   callback(data);
        // });
    },

    addLatestMovies: async(latestmovies, callback) => {
        var response = await db
            .get()
            .collection(collections.latestmovie_collections)
            .updateOne(
                { _id: objectId('617b855e0501b1b0b13a356f') },
                {
                    $set: {
                        latestmovies: latestmovies
                    },
                }
            );
        callback(response);

        // db.get()
        //     .collection(collections.latestmovie_collections)
        //     .insertOne({ latestmovies: latestmovies })
        //     .then((data) => {
        //      callback(data);
        // });
    },

    addTrendingMovies:async(trendingmovies, callback) => {
        var response = await db
            .get()
            .collection(collections.trendingmovie_collections)
            .updateOne(
                { _id: objectId('617fc0e38754a61255f09329') },
                {
                    $set: {
                        trendingmovies: trendingmovies.results
                    },
                }
            );
        callback(response);
        // db.get()
        // .collection(collections.trendingmovie_collections)
        // .insertOne({trendingmovies:trendingmovies.results})
        // .then((data) => {
        //   callback(data);
        // });
    },

    popularMovies:async (callback)=>{       
        var response = await db.get()
        .collection(collections.popularmovie_collections)
        .find().toArray();
        callback(response);  
    }, 

    latestMovies:async (callback)=>{ 
        var response = await db
        .get()
        .collection(collections.latestmovie_collections)
        .find().toArray();
        callback(response); 
    },

    trendingMovies:async (callback)=>{
        var response = await db
        .get()
        .collection(collections.trendingmovie_collections)
        .find().toArray();
        callback(response); 
    }

}