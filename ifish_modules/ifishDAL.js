var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
 
var ifishDAL = function () {
    this.url = 'mongodb://localhost:27017/test'
    
    //find one user (default and only user)
    this.getUser = function(db, callback) {
        var collection = db.collection('users');        
        collection.findOne({}, {_id: false},  function(err, docs) { 
            assert.equal(err, null)                
            callback(docs)
        })
    }

    //updates a user
    this.setUser = function(user, newData, db, callback) {        
        var collection = db.collection('users')        
        collection.updateOne( user, { $set: newData }, function(err, result) {
            assert.equal(err, null)            
            callback(result)
        })
    }
}

ifishDAL.prototype.GetUserProfile = function (callback) {
    //Use connect method to connect to the Server    
    var _this = this
    MongoClient.connect(_this.url, function(err, db) {
        assert.equal(null, err)            
        _this.getUser(db, function(docs) {
            db.close()
            callback(docs)
        })
    })
}

ifishDAL.prototype.SetUserProfile = function (newData, callback) {
    var _this = this
    MongoClient.connect(_this.url, function(err, db) {
        assert.equal(null, err)
        _this.getUser(db, function(docs) { //get the only user on the db
            _this.setUser(docs, newData, db, function() { //and update it
                db.close()
                callback(docs)
            })
        })
    })
}

module.exports = ifishDAL
