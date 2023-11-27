const express = require('express')
const rateLimit = require('express-rate-limit')
const { createProxyMiddleware } = require('http-proxy-middleware');

const { AuthRequestMiddlewares } = require('./middlewares');

const { ServerConfig } = require('./config')

const apiRoutes = require('./routes')

const app = express()

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	max: 5, // Limit each IP to 5 requests per `window` (here, per 2 minutes)
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(limiter);

// still need to implement that only admins and flight_company will
// be able to make changes in flights

// let arr = [AuthRequestMiddlewares.checkAuth, AuthRequestMiddlewares.isAdminOrFlightService];

// 2 ways to implement proxy middleware
app.use('/flightsService', createProxyMiddleware({ 
    target: ServerConfig.FLIGHT_SERVICE, 
    changeOrigin: true, 
    pathRewrite: {'^/flightsService' : '/'} 
}));

app.use('/bookingService', createProxyMiddleware({ 
    target: ServerConfig.BOOKING_SERVICE, 
    changeOrigin: true 
}));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`successfully started the server on PORT : ${ServerConfig.PORT}`)
})

/**
 * user
 *  |
 *  v
 * localhost:5000 (API Gateway) --> localhost:4000/api/v1/bookings
 *  |
 *  v
 * localhost:3000/api/v1/flights
 */