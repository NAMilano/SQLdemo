import express from 'express';
import cors from 'cors';
import {
  addUser,
  userLogin,
} from './sql.js';
import { body, validationResult } from 'express-validator';
import sanitizeHtml from 'sanitize-html';

const app = express();
app.use(cors());
app.use(express.json());


// API endpoint to create a new user
app.post(
  '/api/createUser',
  [
    // double check the validation and sanitization that is done on the front end again on the backend
    body('username')
      .trim() // remove any extra spaces
      .notEmpty() // make sure it is not empty
      .isLength({ min: 3 }) // minimum length of 3
      .isAlphanumeric(), // only allow alphanumeric characters
    body('password')
      .trim() // remove any extra spaces
      .notEmpty() // make sure it is not empty
      .isLength({ min: 5 }) // minimum length of 5
      .custom((value) => { // custom check for the strong password requirments
        // require at least one lowercase letter
        if (!/[a-z]/.test(value)) {
          throw new Error('Password must contain at least one lowercase letter');
        }
        // require at least one uppercase letter
        if (!/[A-Z]/.test(value)) {
          throw new Error('Password must contain at least one uppercase letter');
        }
        // require at least one number
        if (!/\d/.test(value)) {
          throw new Error('Password must contain at least one number');
        }
        // require at least one special character
        if (!/[!@#$%^&*]/.test(value)) {
          throw new Error('Password must contain at least one special character (e.g., !@#$%^&*)');
        }
        return true;
      }),
    body('cellphone')
      .trim() // remove any extra spaces
      .notEmpty() // make sure it is not empty
      .isMobilePhone(), // check if it is a valid phone number
  ],
  async (req, res) => {
    // check for errors during the validation process
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
    }

    const { username, password, cellphone } = req.body;

    // sanitize the user inputs to check for and remove any HTML/JS code from the input 
    const sanitizedUsername = sanitizeHtml(username);
    const sanitizedPassword = sanitizeHtml(password);
    const sanitizedCellphone = sanitizeHtml(cellphone);

    try {
      const newUser = await addUser({ username: sanitizedUsername, password: sanitizedPassword, cellphone: sanitizedCellphone });
      res.json(newUser);
    } catch (err) {
      res.status(500).send('Error creating user');
    }
  }
);


// API endpoint to login user
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userLogin({ username, password });
    if (user) {
      res.json(user);
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    res.status(500).send('Error logging in');
  }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
