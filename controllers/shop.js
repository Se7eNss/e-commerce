const Product= require('../models/product')
const Category = require('../models/category')
const Order = require('../models/order')
const session = require('express-session')

exports.getIndex = (req,res,next)=>{
    Product.find()
    .then(products =>{
        return products;
    }).then(products=>{
        Category.find().then(categories=>{
            res.render('shop/index', 
            {
                title:'Homepage',
                products:products,
                categories:categories,
                path:'/'
            })  
        })
    }).catch((err) => {
        next(err);
    });
   
        
}
        


exports.getProducts = (req,res,next)=>{
    Product.find()
    .then(products =>{
      return products;
        })
        .then(products=>{
            Category.find()
            .then(categories=>{
                res.render('shop/products', 
                {
                    title:'Products',
                    products:products,
                    categories:categories,
                    path:'/products'
                })  
            })
        }).catch(err=>{
        console.log(err)
    })
    .catch((err) => {
        next(err);
    });
        
    }
    

exports.getProductsByCategoryId = (req,res,next)=>{
    const categoryid = req.params.categoryid;
    const model=[];
    Category.find().then(categories=>{
        model.categories= categories;
        return Product.find({
            categories:categoryid
        });
    }).then(products=>{
        res.render('shop/products', 
                {
                    title:'Products',
                    products:products,
                    categories :model.categories,
                    activeCategory:categoryid,
                    path:'/products'
                })
    }).catch((err) => {
        next(err);
    });
    
}
exports.getProduct = (req,res,next)=>{
    Product.findById(req.params.productid).then(product =>{
        res.render('shop/product-detail',
    {
        title: product.name,
        product: product,
        path:'/produtcs'

    })}
    ).catch((err) => {
        next(err);
    });
    
}

exports.getCart= (req,res,next)=>{
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user=>{
            console.log(user.cart.items)
            res.render('shop/cart', 
            {
                title:'Cart',
                path:'/cart',
                products:user.cart.items
            })
        }
        )
        .catch((err) => {
            next(err);
        });
    }

exports.postCart= (req,res,next)=>{
    const productId = req.body.productId;
    Product.findById(productId).then(product=>{
        return req.user.addToCart(product);
    }).then(()=>{
        res.redirect('/cart')
    })
    .catch((err) => {
        next(err);
    });
}
exports.postDeleteCartItem= (req,res,next)=>{
    const productid = req.body.productid;

   req.user
    .deleteCartItem(productid)
    .then(()=>{
        res.redirect('/cart');
    })
    
}

exports.getOrders = (req,res,next)=>{
   Order
   .find({'user.userId': req.user._id})
   .then(orders =>{
       console.log(orders);
       res.render('shop/orders',{
           title:'Orders',
           path:'/orders',
           orders:orders
       })
   }).catch((err) => {
    next(err);
});
}
exports.postOrders = (req,res,next)=>{
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user=>{
            const order = new Order({
                user:{
                    userId:req.user._id,
                    name:req.user.name,
                    email:req.user.email,
                },
                items:user.cart.items.map(p=>{
                    return{
                        product:{
                            _id:p.productId._id,
                            name:p.productId.name,
                            price:p.productId.price,
                            imageurl:p.productId.imageurl,
                        },
                        quantity:p.quantity
                    };
                })
            });
            return order.save(); 
        }).then(()=>{
            return req.user.clearCart();
        }).then(()=>{
            res.redirect('/order')
        }).catch((err) => {
            next(err);
        });
    
}
