import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Alternatively, you can use:
  // host: 'your_host',
  // port: 5432,
  // user: 'your_username',
  // password: 'your_password',
  // database: 'your_database',
});

export default {
  query: (text, params) => pool.query(text, params),
};
