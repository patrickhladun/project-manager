const { createServer } = require('./utils/server.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const DB = process.env.DB;
const HOST = process.env.HOST;
const PORT = process.env.PORT || 8080;

const app = createServer();

const db = require('./models/models');
const Role = db.role;

app.get('/', (req, res) => {
    res.json({ message: "Welcome to Project Manager." });
});

const dbURI = `mongodb://${HOST}:/${DB}`;

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Successfully connected to MongoDb');
    initial();
})
.catch(err => {
    console.error("Connection error", err);
    process.exit();
});

app.listen(PORT);

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'user' to roles collection");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            });

            new Role({
                name: "customer"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'customer' to roles collection");
            });
        }
    });
}
