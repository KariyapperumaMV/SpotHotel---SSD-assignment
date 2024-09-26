const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Helmet security headers
app.use(helmet());

/**CSP with strict directives
 *  will prevent CSP - wildcard directive vulnerability and
 *  CSP header not found vulnerability*/  
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://apis.google.com"],  // External script sources
        styleSrc: ["'self'", "https://fonts.googleapis.com"], // External style sources
        imgSrc: ["'self'", "https://res.cloudinary.com"],  // Cloudinary images
        objectSrc: ["'none'"],  // Prevent embedding objects like Flash
        frameAncestors: ["'self'"],  // Prevent clickjacking
    }
}));

/** Remove X-Powered-By header
 *  will prevet server information leakage.*/ 
app.use(function (req, res, next) {
    res.removeHeader("X-Powered-By");
    next();
});

/**Setting X-Frame-Options to sameorigin
 * will prevent missing anti-clickjacking header missing vulnerability*/  
app.use(helmet.frameguard({ action: 'sameorigin' }));

/** Setting X-Content-Type-Options to nosniff
 *  will prevent X-Content-Type-Options header missing vulnerability*/ 
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

/** CORS configuration
 *  will prevent cross-domain misconfiguration*/
app.use(cors({
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    optionsSuccessStatus: 200,
}));

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require('dotenv').config({ path: "backend/config/config.env" });
}

// Routes import
const userRoute = require('./routes/userRoute');
const hotelRoute = require('./routes/hotelRoute');
const roomRoute = require('./routes/roomRoute');
const bookingRoute = require('./routes/bookingRoute');
const errorMiddleware = require('./middlewares/errorMiddleware');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.use('/api/v1', userRoute);
app.use('/api/v1', hotelRoute);
app.use('/api/v1', roomRoute);
app.use('/api/v1', bookingRoute);

app.use(express.static(path.join(__dirname, "./../frontend/build")));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "./../frontend/build/index.html"));
});

// Error middleware
app.use(errorMiddleware);

module.exports = app;
