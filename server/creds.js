import pg from 'pg'; // PostgreSQL

export const jwtSecretKey = '%bBrqQ70m5FF**uQwypEDaevDJ%AWd6H*K*';

const { Pool } = pg; 
export const pool = new Pool({
    user: 'keganj08',
    host: 'db.bit.io',
    database: 'keganj08/WavSurf', // public database 
    password: 'v2_44Kyq_fTmXnAkrEEVHkWncmpkJcLi', // key from bit.io database page connect menu
    port: 5432,
    ssl: true,
});