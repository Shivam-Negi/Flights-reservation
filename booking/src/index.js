const express = require('express');
// const axios = require('axios');
const { ServerConfig, Queue } = require('./config');

const apiRoutes = require('./routes');

const CRON = require('./utils/common/cron-jobs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);
/* app.get('/callDockerService', async (req, res) => {
    const response = await axios.get('http://docker_service:8000/home');
    console.log('response: ', response.data);
    return res.json(response.data);
}) */
// proxy middleware
app.use('/bookingService/api', apiRoutes);

app.listen(ServerConfig.PORT, async () => {
    console.log(`successfully started the server on PORT : ${ServerConfig.PORT}`);
    CRON();
    await Queue.connectQueue();
    console.log('queue connected');
})
//console.log(process.env)