const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user.model');
const authController = require('../controllers/auth');
const db = require('../models/models');
const router = express.Router();

router.put(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, {req}) => {
                return new Promise((resolve, reject) => {
                  User.findOne({email:req.body.email}, function(err, user){
                    if(err) {
                      reject(new Error('Server Error'))
                    }
                    if(Boolean(user)) {
                      reject(new Error('E-Mail address already exists!'))
                    }
                    resolve(true)
                  });
                });
              })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 5 })
    ],
    authController.signup
);

router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .normalizeEmail()
    ],
    authController.login
);

router.get(
  '/isUserAuth',
  authController.verifyJWT,
  authController.auth
);

module.exports = router;
