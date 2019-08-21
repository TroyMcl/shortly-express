var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');



var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  defaults: {
    
  },
  createUser: function(username, password, callback) {
    var salt = bcrypt.genSalt(10);
    var hash = bcrypt.hashSync(password, salt);
    db.knex('users')
      .insert([{username: username}, {password: hash}, {salt: salt}])
      .then(function(result) {
        return result;
      })
    // async into database
    //success of db write is path????
  },
  getUser: function() {
    // this.on('creating', function(model, attrs, options) {
    //   var shasum = crypto.createHash('sha1');
    //   shasum.update(model.get('url'));
    //   model.set('code', shasum.digest('hex').slice(0, 5));
    // });
  }
});

module.exports = User;

//Shorthand for calling .then(function() { return value }).

//Without return:
knex.insert(values).into('users')
  .then(function() {
    return {inserted: true};
  });

knex.insert(values).into('users').return({inserted: true});