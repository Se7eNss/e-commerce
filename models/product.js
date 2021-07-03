const mongoose = require('mongoose');

const productSchema =mongoose.Schema({
    name:{
        type: String,
        required: [true, 'ürün ismi girmelisiniz'],
        minlength: [5, 'ürün ismi için minimum 5 karakter girmelisiniz.'],
        maxlength: [255, 'ürün ismi için maksimum 255 karakter girmelisiniz.'],
        lowercase: true,
        // uppercase: true
        trim: true
    },
    price:{
        type: Number,
        required: function () {
            return this.isActive;
        },
        min: 0,
        max: 10000,
        get: value => Math.round(value), //10.2 => 10 10.8=> 11
        set: value => Math.round(value)  // 10.2 => 10 10.8=>11
    },
    desc:String,
    imageurl:String,
    date:{
        type:Date,
        default:Date.now
    },
    isActive:Boolean,
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    categories:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:false,
    }],
    tags: {
        type: Array,
        validate: {
            validator: function (value) {
                return value && value.length > 0;
            },
            message: 'ürün için en az bir etiket giriniz'
        }
    },
})
module.exports = mongoose.model('Product',productSchema);
































// const getdb = require('../utilty/database').getdb;
// const mongodb = require('mongodb');
// class Product{
//     constructor(name,price,desc,imageurl,categories,id,userId){
//         this.name = name;
//         this.price = price;
//         this.desc = desc;
//         this.imageurl = imageurl;
//         this.categories =(categories && !Array.isArray(categories))? Array.of(categories):categories;
//         this._id = id ? new mongodb.ObjectID(id) : null;
//         this.userId =userId;

//     }
//     save(){
//         let db = getdb();
//         if(this._id){
//             db = db.collection('products').updateOne({_id:this._id},{$set:this});
//         }
//         else{
//             return  db.collection('products').insertOne(this)
//         }
//             return db
//             .then(result=>{
//                 console.log(result);

//             })
//             .catch(err=>{console.log(err)});
//     }
//     static findAll(){
//         const db = getdb();
//        return db.collection('products')
//             .find()
//             .project({desc:0})
//             .toArray()
//             .then(products=>{
//                 return products;
//             }).catch(err=>{console.log(err)})
//     }
//     static findById(productid){
//         const db = getdb();
//         return db.collection('products')
//                 .findOne({_id: new mongodb.ObjectID(productid)})
//                 .then(product =>{
//                     return product;
//                 }).catch(err=>{console.log(err)})
//     }
//     static deleteById(productid){
//         const db = getdb();
//         return db.collection('products')
//             .deleteOne({_id: new mongodb.ObjectID(productid)})
//             .then(()=>{
//                 console.log('deleted');
//             })
//             .catch(err=>{console.log(err)});
//     }
//     static findByCategoryId(categoryid){
//         const db=getdb();
//         return db.collection('products')
//             .find({categories:categoryid})
//             .toArray()
//             .then(products=>{
//                 return products;
//             })
//             .catch(err => console.log(err))
//     }
// }


// module.exports= Product;











