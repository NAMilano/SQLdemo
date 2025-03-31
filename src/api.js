import express from 'express';
import cors from 'cors';
import {
  addUser,
  userLogin,
} from './sql.js';

const app = express();
app.use(cors());
app.use(express.json());


// API endpoint to create a new user
app.post('/api/createUser',async (req, res) => {

    const { username, password, cellphone } = req.body;
    
    try {
      const newUser = await addUser({ username, password, cellphone });
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
