import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Helmet from 'helmet';
import { db } from './Models/database.js';
import Emprestimos from './Models/Emprestimos.js';
const app = express();



// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(Helmet())
// Sample route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

export default app