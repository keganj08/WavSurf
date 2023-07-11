import pg from 'pg'; // PostgreSQL
const { Pool } = pg; 

export const jwtSecretKey = '%bBrqQ70m5FF**uQwypEDaevDJ%AWd6H*K*';

export const pool = new Pool();