const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (callback)=>{
    
    MongoClient.connect('mongodb://localhost/node-app')
    // MongoClient.connect('mongodb+srv://mongo:mongo@cluster0.wxump.mongodb.net/node-app?retryWrites=true&w=majority')
        .then(client =>{
            console.log('connected');
            _db = client.db();
            callback();
        }).catch(err=>{
            console.log(err);
            throw err;
        })
}
const getdb =()=>{
    if(_db){
        return _db;
    }
    throw 'no database';
}
exports.getdb = getdb;
exports.mongoConnect = mongoConnect;

//--------------------------------------Without ORM----------------------------------------
// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     database:'node-app',
//     password:'Oguzhan.18'
// })
// module.exports = connection.promise();