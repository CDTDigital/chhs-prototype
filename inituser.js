var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
 
// Connection URL 
var url = 'mongodb://localhost:27017/test'

var defaultUser = 
{
"Name": "Joe Smith",
"Email": "jsmith@ifishgroup.com",
"Phone": "9165551213"
}

var insertDocuments = function(db, callback) {
  // Get the documents collection 
  var collection = db.collection('users')
  // Insert some documents 
  collection.insertMany([defaultUser], function(err, result) {
    assert.equal(err, null)
    assert.equal(1, result.result.n)
    assert.equal(1, result.ops.length)
    console.log("Inserted default user")
    callback(result)
  });
} 

var updateDocument = function(db, callback) {
  // Get the documents collection 
  var collection = db.collection('users');
  // Update document where a is 2, set b equal to 1 
  collection.updateOne( defaultUser, { $set: { "Phone" : "9165551212" } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated default user");
    callback(result);
  });  
}

var findDocuments = function(db, callback) {
  // Get the documents collection 
  var collection = db.collection('users');
  // Find some documents 
  collection.findOne({}, {_id: false},  function(err, docs) {
    assert.equal(err, null);    
    console.log("Found the following records");
    console.dir(docs);
    callback(docs);
  });
}

// Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err)
  var collection = db.collection('users')
  collection.drop()

  insertDocuments(db, function() {
    updateDocument(db, function() {
      findDocuments(db, function() {
        db.close()
      })
    })
  })
})
