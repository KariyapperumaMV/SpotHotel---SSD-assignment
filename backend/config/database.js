const mongoose = require('mongoose');

const databaseConnect = () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true
    })
        .then((data) => {
            console.log("Database connected")
        })
        .catch((err) => {
            console.error("Database connection error: ", err);
        })
}

module.exports = databaseConnect;