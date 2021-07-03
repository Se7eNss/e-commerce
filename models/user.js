const mongoose = require('mongoose');
const Product = require('./product');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        validate: [isEmail, 'invalid email']
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    resetTokenExpiration:Date,
    isAdmin:{
        type:Boolean,
        default:false,
    },
    cart:{
        items:[{
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'Product',
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
            }
        }]
    }




})
userSchema.methods.addToCart = function(product){
                const index =this.cart.items.findIndex(cp=>{
                    return cp.productId.toString() === product._id.toString();
                })
                const updatedCartItems =[...this.cart.items];
                let itemQuantity=1;
                if(index>=0){
                    itemQuantity=this.cart.items[index].quantity+1;
                    updatedCartItems[index].quantity = itemQuantity;
        
                }
                else{   
                    updatedCartItems.push({
                        productId :product._id ,
                        quantity :itemQuantity,
                    })
                }
                
                this.cart={
                    items:updatedCartItems
                }
                return this.save();               
}
userSchema.methods.getCart =function(){
    const ids = this.cart.items.map(i=>{
                    return i.productId;
                })
              
                return Product
                    .find({_id:{$in:ids} })
                    .select('name price imageurl')
                    .then(products=>{
                        return products.map(p=>{
                            return{
                                name:p.name,
                                price:p.price,
                                imageurl:p.imageurl,
                                quantity:this.cart.items.find(i=>{
                                   return i.productId.toString() === p._id.toString()
                                }).quantity
                            }
                        })
                    })
}
userSchema.methods.deleteCartItem = function(productid){
    const cartItems = this.cart.items.filter(item =>{
                    return item.productId.toString() !== productid.toString()
                });
    this.cart.items= cartItems;
    return this.save();     
}
userSchema.methods.clearCart =function(){
    this.cart ={items:[]};
    return this.save(); 
}

module.exports = mongoose.model('User',userSchema);
































// const getdb = require('../utilty/database').getdb;
// const mongodb = require('mongodb');


// class User{
//     constructor(name,email,cart,_id){
//         this.name=name;
//         this.email=email;
//         this.cart=cart ? cart : {} ;
//         this.cart.items = cart ? cart.items:[];
//         this._id = _id;
//     }

//     save(){
//         const db = getdb();
//         return db.collection('users')
//             .insertOne(this);
//     }
//     getCart(){
//         const ids = this.cart.items.map(i=>{
//             return i.productId;
//         })
//         const db=getdb();
//         return db.collection('products')
//             .find({_id:{$in:ids} })
//             .toArray()
//             .then(products=>{
//                 return products.map(p=>{
//                     return{
//                         ...p,
//                         quantity:this.cart.items.find(i=>{
//                            return i.productId.toString() === p._id.toString()
//                         }).quantity
//                     }
//                 })
//             })
//     }

//     addToCart(product){
//         const index =this.cart.items.findIndex(cp=>{
//             return cp.productId.toString() === product._id.toString();
//         })
//         const updatedCartItems =[...this.cart.items];
//         let itemQuantity=1;
//         if(index>=0){
//             itemQuantity=this.cart.items[index].quantity+1;
//             updatedCartItems[index].quantity = itemQuantity;

//         }
//         else{   
//             updatedCartItems.push({
//                 productId : new mongodb.ObjectID(product._id),
//                 quantity :itemQuantity,
//             })
//         }
//         const db = getdb();
//         return db.collection('users')
//             .updateOne(
//                 {_id : new mongodb.ObjectID(this._id) },
//                 {
//                     $set:{
//                         cart:{items:updatedCartItems}
//                     }
//                 }
//             )
//     }



//     static findById(userid){
//         const db = getdb();
//       return  db.collection('users')
//         .findOne({_id: new mongodb.ObjectID(userid)})
//         .then(user=>{
//             return user;
//         })
//         .catch(err=>{
//             console.log(err);
//         })
//     }
//     static findByUserName(name){
//         const db = getdb();
//       return  db.collection('users')
//         .findOne({name: name})
//         .then(user=>{
//             return user;
//         })
//         .catch(err=>{
//             console.log(err);
//         })
//     }

//     deleteCartItem(productid){
//         const cartItems = this.cart.items.filter(item =>{
//             return item.productId.toString() !== productid.toString()
//         });
//         const db = getdb();
//         return db.collection('users')
//             .updateOne(
//                 {_id: new mongodb.ObjectID(this._id)},
//                 {
//                     $set:{
//                         cart:{items:cartItems}
//                     }
//                 }
//             )
//     }

//     addOrder(product){
//         // get cart
//         // create order object
//         // save
//         // update cart
//         const db =getdb();
//        return this.getCart()
//             .then(products=>{
//                 const order = {
//                     items : products.map(item=>{
//                         return{
//                             _id:item._id,
//                             name:item.name,
//                             price:item.price,
//                             imageurl:item.imageurl,
//                             userId:item.useId,
//                             quantity:item.quantity

//                         }
//                     }),
//                     user :{
//                         _id : mongodb.ObjectID(this._id),
//                         name:this.name,
//                         email:this.email
//                     },
//                     date: new Date().toLocaleString(),
//                 }
//                return db.collection('orders')
//                         .insertOne(order);
//             }).then(()=>{
//                 this.cart ={items:[]};
//                 return db.collection('users')
//                         .updateOne({_id: new mongodb.ObjectID(this._id)},
//                         {
//                             $set:{
//                                 cart:{
//                                     items: []
//                                 }
//                             }
//                         } 
                        
//                         )
//             })


//     }
//     getOrders(){
//         const db =getdb();
//         return db.collection('orders')
//                 .find({'user._id':mongodb.ObjectID(this._id)})
//                 .toArray()
//     }

// }


// module.exports = User;