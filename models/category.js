const mongoose = require('mongoose');


const categorySchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
    }



})

module.exports = mongoose.model('Category',categorySchema);





































// const getdb = require('../utilty/database').getdb;
// const mongodb = require('mongodb');

// class Category {
//         constructor(name,desc,id){
//             this.name = name;
//             this.desc = desc;
//             this._id = id ? new mongodb.ObjectID(id) : null;
//         }

//         save(){
//             let db = getdb();
//             if(this._id){
//                 db = db.collection('categories').updateOne({_id:this._id},{$set:this});
//             }
//             else{
//                 return  db.collection('categories').insertOne(this)
//             }
//                 return db
//                 .then(result=>{
//                     console.log(result);
    
//                 })
//                 .catch(err=>{console.log(err)});
//         }
//         static findAll(){
//             const db = getdb();
//             return db.collection('categories')
//             .find()
//             .toArray()
//             .then(category =>{
//                 return category;
//             }).catch(err=>{console.log(err)})
//         }
//         static findById(categoryid){
//             const db = getdb();
//           return db.collection('categories')
//             .findOne({_id : mongodb.ObjectID(categoryid) })
//             .then(category =>{
//                 return category;
//             }).catch(err=>{console.log(err)});
//         }
//         static deleteById(categoryid){
//             const db = getdb();
//            return db.collection('categories')
//             .deleteOne({_id : mongodb.ObjectID(categoryid)})
//             .then(()=>{
//                 console.log('deleted')
//             })
//             .catch(err=>{console.log(err)})
//         }

// }



// module.exports= Category;

