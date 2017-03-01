var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

// Connection URL 
var url = 'mongodb://localhost:27017/test'

var defaultUser =
  {
    "FirstName": "John",
    "LastName": "Doe",
    "Email": "jdoe@example.com",
    "Phone": "9165551212",
<<<<<<< HEAD
    "ZipCode":"95833",
=======
>>>>>>> a81208a28fe986c797beaa27885ce7e1c5770172
    "ReceiveText": false,
    "ReceiveEmail": false
  }

//insert defaultUser
var insertDocuments = function (db, callback) {
  var collection = db.collection('users')
  collection.insertMany([defaultUser], function (err, result) {
    assert.equal(err, null)
    assert.equal(1, result.result.n)
    assert.equal(1, result.ops.length)
    console.log("Inserted default user")
    callback(result)
  });
}

//change the phone number
var updateDocument = function (db, callback) {
  var collection = db.collection('users');
  collection.updateOne(defaultUser, { $set: { "Phone": "9165551212" } }, function (err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated default user");
    callback(result);
  });
}

//find single document
var findDocuments = function (db, callback) {
  var collection = db.collection('users');
  collection.findOne({}, { _id: false }, function (err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.dir(docs);
    callback(docs);
  });
}

// Use connect method to connect to the Server 
MongoClient.connect(url, function (err, db) {
  assert.equal(null, err)
  var collection = db.collection('users')
  collection.drop()

  insertDocuments(db, function () {
    updateDocument(db, function () {
      findDocuments(db, function () {
        db.close()
      })
    })
  })
})
