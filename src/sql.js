import mysql from 'mysql2';
import bcrypt from 'bcryptjs'; // import the password encryption library
import { config } from 'dotenv';  // import the database credentials from the .env file

// get the database credentials from the .env file
config();

// assign the database credentials to variables
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// Create a connection to the database
const connection = mysql.createConnection({
  host: DB_HOST, // Amazon RDS server endpoint
  user: DB_USER, // MySQL username
  password: DB_PASSWORD, //  MySQL password
  database: DB_NAME // Database name
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

const defaultUser = {
  iduser: '', // Generated UNIQUE PK ID
  username: '',
  password: '',
  cellphone: '',
};

// Function to add a new user
const addUser = (user) => {
  return new Promise((resolve, reject) => {
    // Hash the password before storing it
    bcrypt.hash(user.password, 10, (err, hashedPassword) => {

      if (err) {
        return reject(new Error('Error hashing password.'));
      }
      const query = 'INSERT INTO user (username, password, cellphone) VALUES (?, ?, ?)';
      connection.query(query, [user.username, hashedPassword, user.cellphone], (err, results) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return reject(new Error('Username/Cellphone is already connected to an account.'));
          }
          console.error('Error adding user: ', err);
          return reject(err);
        }
        user.iduser = results.insertId;
        resolve(user);
      });
    });
  });
};

// function for user authentication
const userLogin = (user) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM user WHERE username = ?';
    connection.query(query, [user.username], (err, results) => {
      if (err) {
        console.error('Error querying the database: ', err);
        return reject(err);
      }
      if (results.length === 0) {
        return reject(new Error('Invalid username or password'));
      }
      const storedUser = results[0]; 
      bcrypt.compare(user.password, storedUser.password, (err, isMatch) => { // Compare the entered password with the stored hashed password
        if (err) {
          console.error('Error comparing passwords: ', err);
          return reject(new Error('Password comparison failed'));
        }
        if (isMatch) {
          Object.assign(user, storedUser);
          resolve(user);
        } else {
          return reject(new Error('Invalid username or password'));
        }
      });
    });
  });
};

// Export the functions
export {
  addUser, // creates a new user
  userLogin, // login the user
};