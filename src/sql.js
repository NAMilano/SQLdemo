import mysql from 'mysql2';

const DB_HOST = "csi3480-courseproject.cds6mc4ieyzx.us-east-2.rds.amazonaws.com";
const DB_USER = "admin";
const DB_PASSWORD = "adminpassword";
const DB_NAME = "sqldemo";

// Create a connection to the database
const connection = mysql.createConnection({
  host: DB_HOST, // Amazon RDS server endpoint
  user: DB_USER, // MySQL username
  password: DB_PASSWORD, //  MySQL password
  database: DB_NAME, // Database name
  multipleStatements: true, // allows for multiple sql statement per query - vulnerable to injections
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
  iduser: '', // Generated UNIQUE PK ID by database
  username: '',
  password: '',
  cellphone: '',
};

// Function to add a new user
const addUser = (user) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO user (username, password, cellphone) VALUES ("' + user.username + '", "' + user.password + '", "' + user.cellphone + '")';
    connection.query(query, (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return reject(new Error('Username/Cellphone is already connected to an account.'));
        }
        console.error('Error adding user: ', err);
        return reject(err);
      }
      user.iduser = results.insertId;
      console.log(user.iduser);
      resolve(user);
    });
  });
};

// function for user authentication
const userLogin = (user) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM user WHERE username = "' + user.username + '" AND password = "' + user.password + '";';
    console.log(query);
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error querying the database: ', err);
        return reject(err);
      }
      if (results.length === 0) {
        return reject(new Error('Invalid username or password'));
      }
      console.log("user returned:", results[0]);
      const user = results[0];
      resolve(user);
    });
  });
};

// Export the functions
export {
  addUser, // creates a new user
  userLogin, // login the user
};