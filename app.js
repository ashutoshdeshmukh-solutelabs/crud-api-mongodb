const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let db;

MongoClient.connect('mongodb://0.0.0.0:27017/CRUD', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    db = client.db();
    console.log('Connected!');
  })
  .catch((err) => {
    console.log(err);
    throw err;
  });

app.post('/create-data', function (req, res) {
  // Sending request to create a data
  db.collection('data').insertOne(
    { text: req.body.text },
    function (err, info) {
      if (!err) res.status(200).json(info.ops[0]);
      else res.status(404).send('Error');
    }
  );
});

app.get('/', function (req, res) {
  // getting all the data
  db.collection('data')
    .find()
    .toArray(function (err, items) {
      if (!err) res.send(items);
      else res.send(err);
    });
});

app.put('/update-data', function (req, res) {
  // updating a data by it's ID and new value
  db.collection('data').findOneAndUpdate(
    { _id: new mongodb.ObjectId(req.body.id) },
    { $set: { text: req.body.text } },
    function () {
      res.send('Success updated!');
    }
  );
});

app.delete('/delete-data', function (req, res) {
  // deleting a data by it's ID
  db.collection('data').deleteOne(
    { _id: new mongodb.ObjectId(req.body.id) },
    function () {
      res.send('Successfully deleted!');
    }
  );
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
