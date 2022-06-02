const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secret = process.env.SECRET;

const db = require('../models/models');
const User = db.user;
const Role = db.role;

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.errors;
        res.send(error);
        return;
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = bcrypt.hashSync(req.body.password, 8);

    const user = new User({
        email: email,
        password: password,
        name: name
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (req.body.role) {
            Role.find(
                {
                    name: { $in: req.body.role }
                },
                (err, role) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    user.role = role.map(item => item._id);
                    user.save(err => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        res.send({ message: "User was registered successfully!" });
                    });
                }
            );
        } else {
            Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                user.roles = [role._id];
                user.save(err => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    res.send({ message: "User was registered successfully!" });
                });
            });
        }
    });
};

exports.login = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.errors;
        res.send(error);
        return;
    }

    User.findOne({
        email: req.body.email
    })
        .populate("role", "-__v")
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            const token = jwt.sign({ id: user.id }, secret, {
                expiresIn: 86400 // 24 hours
            });

            const authorities = [];

            for (let i = 0; i < user.role.length; i++) {
                authorities.push("ROLE_" + user.role[i].name.toUpperCase());
            }

            res.status(200).send({
                id: user._id,
                email: user.email,
                role: authorities,
                accessToken: token
            });
        });   
};

exports.verifyJWT = (req, res, next) => {
    const token = req.headers['x-access-token'];
    // const userId = req.body.userId;

    if (!token) {
        res.send('You need a valid token!');
    } else {
        jwt.verify(token, secret, (err, decoded) => {
            if(err) {
                res.json({auth: false, message: 'Authentication failed.'});
            } else {
                req.userId = decoded.id;
                console.log(`Token: ${token}`);
                console.log(`Secret: ${secret}`);
                console.log(`Decoded: ${JSON.stringify(decoded)}`);
                next();
            }
        });
    }
};

exports.auth = (req, res) => {
    res.send('Authenticated.');
};