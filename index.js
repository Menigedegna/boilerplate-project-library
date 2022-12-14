'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}

mongoose.set('strictQuery', true);

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//connect to db
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

//create library schema
let bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  _id: String,
  commentcount: Number,
  comments: [String]
});

//create a Book model
let Book = mongoose.model('Book', bookSchema);

//Index page (static HTML)
app.route('/')
  .get(function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app, Book);

//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
  if (process.env.NODE_ENV === 'test' && process.env.TEST_DATA) {
    console.log('Running Tests...');
    setTimeout(function() {
      try {
        //delete any book in db
        Book.deleteMany((err, books) => {
          if (err) return console.log(err);
          console.log("reset data");
        });
        //create test data and save it in db
        let test_data = JSON.parse(process.env.TEST_DATA);
        const book = new Book(test_data);
        book.save(function(err, data) {
          if (err) return console.log(err);
          if (data) console.log("test data is generated");
        });
        //run tests
        runner.run();
      } catch (e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 2000);

  }
});

module.exports = app; //for unit/functional testing
