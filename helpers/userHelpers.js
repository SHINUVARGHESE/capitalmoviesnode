var collections = require("../config/collection");
var db = require("../config/connection");
var bcrypt = require("bcryptjs");
var objectId = require("mongodb").ObjectID;

module.exports = {
    userSignup: (data, callback) => {
        return new Promise(async (resolve, reject) => {
            data.password = await bcrypt.hash(data.password, 10);
            db.get()
                .collection(collections.user_collections)
                .insertOne(data)
                .then((result) => {
                    callback(result);
                });
        });
    },

    userSignin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {};
            let data = await db
                .get()
                .collection(collections.user_collections)
                .findOne({ emailaddress: userData.emailaddress });
            if (data) {
                bcrypt.compare(userData.password, data.password).then((status) => {
                    if (status) {
                        response.data = data;
                        response.status = true;
                        resolve(response);
                    } else {
                        resolve({ status: false });
                    }
                });
            } else {
                resolve({ status: false });
            }
        });
    },

    findMail: (mail, callback) => {
        db.get()
            .collection(collections.user_collections)
            .findOne({ emailaddress: mail })
            .then((result) => {
                callback(result);
            });

    },

    addtofavorate: (data, callback) => {
        db.get()
            .collection(collections.user_collections)
            .updateOne({ _id:objectId(data.userid) },{
                $addToSet: { favorate:{movieid:data.moviedetails.id,moviedata:data.moviedetails}}
            })
            .then((result) => {
                callback(result);
            });
    },

    findfavorate: (userid, callback) => {
        db.get()
            .collection(collections.user_collections)
            .findOne({ _id:objectId(userid) })
            .then((result) => {
                callback(result.favorate);
            });
    }

};
