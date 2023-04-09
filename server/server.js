import express from 'express';
//import bodyParser from 'body-parser';
import router from './routes.js';
import { server_expensivelyUpdateSounds } from "./sounds.js";
import cors from 'cors';

export let allSounds = [];

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve pages from ./public
app.use('/', router); // Handle requests using router

app.listen(port, () => {
    console.log(`WavSurf app listening on port ${port}`)
    server_expensivelyUpdateSounds();
});