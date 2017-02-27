var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

// Connection URL 
var url = 'mongodb://localhost:27017/test'
var alertCollectionName = 'alerts'
var alerts = [{
              'Date': '2/13/2017',
              'Time': '1:44PM',
              'Title': 'Oroville Evacuation',
              'Message': 'Damage to a spillway on California\'s Oroville Dam -- urgent call for residents downstream to evacuate to higher ground.',
              'Type': 'Emergency',
              'Lat': '39.5387752',
              'Long': '-121.4855237',
              'SMSCount': 46,
              'EmaiCount': 54
            },
            {
              'Date': '2/17/2017',
              'Time': '4:30AM',
              'Title': 'Hwy 50 Mud slide',
              'Message': 'Highway 50 in Kyburz to Remain Closed ‘Indefinitely’ Due to Mudslides.',
              'Type': 'Emergency',
              'Lat': '38.7746298',
              'Long': '-120.2968596',
              'SMSCount': 0,
              'EmailCount': 25
            },
            {
              'Date': '2/21/2017',
              'Time': '6:12PM',
              'Title': 'Manteca Levee',
              'Message': 'A levee has broken in San Joaquin County south of Manteca. NWS is urging immediate evacuation.',
              'Type': 'Emergency',
              'Lat': '37.7290953',
              'Long': '-121.1979953',
              'SMSCount': 53,
              'EmailCount': 58
            }
]


//insert defaultUser
var insertDocuments = function (db, callback) {
  var collection = db.collection(alertCollectionName)
  collection.insertMany(alerts, function (err, result) {
    console.log('Inserted sample alerts')
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
