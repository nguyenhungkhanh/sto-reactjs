var express = require('express');
var bodyParser = require('body-parser');
import mongoose from 'mongoose';

let app = express();

let db = 'mongodb://127.0.0.1:27017/project_2';
// let db = 'mongodb://admin:admin@ds121222.mlab.com:21222/sto';
mongoose.Promise = global.Promise
mongoose.connect(db, { useMongoClient: true })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log(error))

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.use(express.static('public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));

import products from './api/products.js';
import utils from './api/utils.js';
import config from './api/config.js';
import hire from './api/hire.js';
import blog from './api/blog.js';

app.use('/api/products', products);
app.use('/api/utils', utils);
app.use('/api/config', config);
app.use('/api/hire', hire);
app.use('/api/blog', blog);

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/public/index.html');
}) 

app.listen(8080); 
