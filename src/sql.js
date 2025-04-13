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
    console.log("Attempted query: ", query); // display the attempted query
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

const userLogin = (user) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM user WHERE username = "' + user.username + '" AND password = "' + user.password + '";';
    console.log("Attempted query: ", query);
    connection.query(query, (err, results) => {
      if (err) {
        console.error('SQL Error:', err);
        return reject(new Error('Error message: ' + err.sqlMessage));
      }
      // Some inputs resultin warning instead of errors so check for warnings
      connection.query('SHOW WARNINGS', (warnErr, warnings) => {
        if (warnErr) {
          console.error('Warning error:', warnErr);
        } else if (warnings.length > 0) {
          // if more than one then combine all warnings together and display them
          const warningMessage = warnings.map(w => `${w.Level}: ${w.Message}`).join('; ');
          console.log('MySQL Warnings:', warnings);
          return reject(new Error('Error message: ' + warningMessage));
        }
        console.log('Query results:', results);
        if (results.length === 0) {
          return reject(new Error('Invalid username or password'));
        }
        const user = results[0];
        console.log('User returned:', user);
        resolve(user);
      });
    });
  });
};

// Export the functions
export {
  addUser, // creates a new user
  userLogin, // login the user
};