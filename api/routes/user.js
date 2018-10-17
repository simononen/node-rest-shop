const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
            .exec()
            .then(user => {
                console.log(user);
                if (user.length >= 1) {
                    res.status(409).json({
                        message: 'Mail Exists'
                    });
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            res.status(500).json({
                                error: err
                            });
                        } else {
                            const user = new User({
                                _id: mongoose.Types.ObjectId(),
                                email: req.body.email,
                                password: hash
                            });

                            user
                                .save()
                                .then(result => {
                                    console.log('The saved data', result);
                                    res.status(201).json({
                                        message: 'User created'
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json(err => {
                                        error: err
                                    });
                                });
                        }
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
});

router.delete('/:userId', (req, res, next) => {
    User.remove({ _id: req.param._id })
            .exec()
            .then(res => {
                res.status(200).json({
                    message: 'User Deleted'
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
});



module.exports = router;