const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
    fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        console.log(docs);
        if (docs.length >= 0) {
            res.status(200).json(docs);
        } else {
            res.status(404).json({
                message: 'No Entries Found'
            });
        }
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
    // res.status(200).json({
    //     message: 'Handling GET requests to /products'
    // });
});

router.post('/', upload.single('productImage') , (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage:req.file.path
    });
    product.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST requests to /products',
                createdProduct: product
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error:err
            });
        });

});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    // if (id === 'special') {
    //     res.status(200).json({
    //         message: 'You discoveredFile a special ID'
    //     });
    // } else {
    //     res.status(200).json({
    //         message: 'You passed an ID'
    //     });
    // }
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        const response = {
            cont: docs.length,
            products: docs.map(doc => {
                return {
                    name: docs.name,
                    price: docs.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        }
        console.log('From  the database', doc);
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({message: 'No valid entrey found for provided Id'})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({erorr: err});
    });

});

router.patch('/:productId', (req, res, next) => {
    // res.status(200).json({
    //     message: 'Updated Product!'
    // });
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Product.update({_id: id}, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:productId', (req, res, next) => {
    // res.status(200).json({
    //     message: 'Deleted Product!'
    // });
    const id = req.params.productId;
    Product.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;