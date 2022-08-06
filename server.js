import express from 'express';
//import bodyParser from 'body-parser';
import router from './routes.js';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.static('public')); // Serve pages from ./public
app.use('/', router) // Handle requests using router

app.listen(port, () => {
    console.log(`WavSurf app listening on port ${port}`)
})