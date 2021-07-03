const Product= require('../models/product')
const Category = require('../models/category')

exports.getProducts =(req,res,next)=>{

    Product
    .find({userId:req.user._id})
    .populate('userId', 'name -_id')
    .select('name price imageurl userId')
    .then(products=>{
        res.render('admin/products',
        {
            title:'Products',
            products:products,
            path:'/admin/products',
            action:req.query.action

        })
    }).catch((err) => {
        next(err);
    });
    
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        title: 'New Product',
        path: '/admin/add-product',
        inputs: {
            name: '',
            price: '',
            desc: ''
        }
    });
}

exports.postAddProduct = (req,res,next)=>{
    
    const name = req.body.name
    const price = req.body.price
    const imageurl = req.body.imageurl
    const desc = req.body.desc
    const categories = req.body.categoryids

    const product = new Product({
        name:name,
        price:price,
        imageurl:imageurl,
        desc:desc,
        categories:categories,
        userId:req.user,
        isActive: false,
        tags: ['akıllı telefon']
    });
    product.save()
    .then(()=>{
        res.redirect('/admin/products');
    }).catch(err => {

        if (err.name == 'ValidationError') {
            let message = '';
            for (field in err.errors) {
                message += err.errors[field].message + '<br>';
            }

            res.render('admin/add-product', {
                title: 'New Product',
                path: '/admin/add-product',
                errorMessage: message,
                inputs: {
                    name: name,
                    price: price,
                    desc:desc
                }
            });
        } else {
            // hata mesajı
            // yönlendirme
            // 500 page

            // res.status(500).render('admin/add-product', {
            //     title: 'New Product',
            //     path: '/admin/add-product',
            //     errorMessage: 'Beklenmedik bir hata oluştu. Lütfen tekrar deneyiniz.',
            //     inputs: {
            //         name: name,
            //         price: price,
            //         description: description
            //     }
            // });
            // res.redirect('/500');
            next(err);
        }

    });
}

 exports.getEditProduct =(req,res,next)=>{
    
    Product.findOne({_id:req.params.productid, userId:req.user._id})
    .then(product=>{
        if(!product){
            return res.redirect('/');
        }
        return product;
    })
        .then(product=>{
            Category.find()
            .then(categories=>{
                categories=categories.map(category =>{
                   if(product.categories){
                       product.categories.find(item=>{
                           if(item.toString() ===  category._id.toString()){
                               category.selected=true;
                           }
                       })
                   }
                   return category;
                })
                res.render('admin/edit-product',
            {
                title:'Edit Product',
                path:'/admin/products',
                product:product,
                categories:categories
            })
            })

            
        })
        .catch(err => { next(err); });
    
   
}

exports.postEditProduct = (req,res,next)=>{
    
    const id=req.body.id;
    const name=req.body.name;
    const price=req.body.price;
    const desc=req.body.desc;
    const imageurl=req.body.imageurl;
    const ids =req.body.categoryids;
        Product.update({_id:id,userId:req.user._id},{
            $set:{
                name:name,
                price:price,
                desc:desc,
                imageurl:imageurl,
                categories:ids,
            }
        })
        .then(()=>{
            res.redirect('/admin/products/?action=edit')
        })
        .catch(err => next(err));
    
}
exports.postDeleteProduct = (req,res,next) =>{
    const id =req.body.productid;
    Product.deleteOne({_id:id,userId:req.user._id})
    .then((result)=>{
        if(result.deletedCount===0){
            return res.redirect('/')
        }
        res.redirect('/admin/products/?action=delete')
    }    
    ).catch(err => next(err));
}


//-------------------------------------------------------Categories------------------------------------------------------------


exports.getCategories = (req ,res , next)=>{
    Category.find()
        .then(categories =>{
            res.render('admin/categories',{
                title:'Categories',
                path:'/admin/categories',
                categories:categories,
                action:req.query.action
            })
        }).catch(err => next(err));
}

exports.getAddCategory = (req,res,next)=>{
    res.render('admin/add-category',
    {
        title:'Add Category',
        path:'/admin/add-category'
        
    })
}
exports.postAddCategory = (req,res,next)=>{
    const name=req.body.name;
    const desc = req.body.desc;
    category = new Category({
        name:name,
        desc:desc,
    })
    category.save().then(()=>{
        res.redirect('/admin/categories?action=create')
    }).catch(err => next(err));
}

exports.getEditCategory = (req,res, next) =>{
    Category.findById(req.params.categoryid)
    .then(category=>{
            res.render('admin/edit-category',
            {
                title:'Edit Category',
                path:'/admin/categories',
                category:category
            })
        
        })
        .catch(err => next(err));
}
exports.postEditCategory = (req,res,next)=>{
    
    const id=req.body.id;
    const name=req.body.name;
    const desc=req.body.desc;
        Category.findById(id).then(category=>{
            category.name=name;
            category.desc=desc;
            return category.save();
        })
        .then(()=>{
            res.redirect('/admin/categories/?action=edit')
        })
        .catch(err => next(err));
    
}
exports.postDeleteCategory = (req,res,next) =>{
    const id =req.body.categoryid;
    Category.findByIdAndRemove(id)
    .then(()=>{
        console.log('removed')
        res.redirect('/admin/categories/?action=delete')
    }    
    ).catch(err => next(err));
}