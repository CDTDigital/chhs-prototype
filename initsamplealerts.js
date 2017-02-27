var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

// Connection URL 
var url = 'mongodb://localhost:27017/test'
var alertCollectionName = 'alerts'

var alerts = [{ 'Date': '2/19/2017',
                'Time': '1:44PM',
                'Type': 'Emergency',
                'Title': 'Emergency Title 1',
                'Message': 'Test message',
                'Notifications': [{'Name': 'Sample User', 'Email': 'sample@user.test', 'Phone': '9165551212'}] },

                { 'Date': '2/21/2017',
                'Time': '4:30AM',
                'Type': 'Non-emergency',
                'Title': 'Non emergency Title 2',
                'Message': 'Test message',
                'Notifications': [{'Name': 'Sample User', 'Email': 'sample@user.test', 'Phone': '9165551212'}] },

                { 'Date': '2/24/2017',
                'Time': '6:12PM',
                'Type': 'Emergency',
                'Title': 'Emergency Title 3',
                'Message': 'Test message',
                'Notifications': [{'Name': 'Sample User', 'Email': 'sample@user.test', 'Phone': '9165551212'}] }]

//insert defaultUser
var insertDocuments = function (db, callback) {
  var collection = db.collection(alertCollectionName)
  collection.insertMany(alerts, function (err, result) {   
    console.log("Inserted sample alerts")
    callback(result)
  });
}

// Use connect method to connect to the Server 
MongoClient.connect(url, function (err, db) {
  assert.equal(null, err)
  var collection = db.collection(alertCollectionName)
  collection.drop()

  insertDocuments(db, function () {
    db.close()
  })
})
