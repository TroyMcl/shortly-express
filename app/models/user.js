var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');


var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,

  createUser: function(username, password) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, function(err, salt) {
        console.log('salt', salt)
        bcrypt.hash(password, salt, null, function(err, hash) {
          console.log('hashes', hash)
          db.knex('users')
            .insert([{username: username, password: hash, salt: salt}])
            .then((result) => {
              resolve(result)
            })
            .catch((result) => {
              reject(result)
            })
        });
      });
    })
  },

  authUser: function(username, password, callback) {
    // var username = username;
    // var hashedPassword = bcrypt.hashSync(password);
    return new Promise((resolve, reject) => {
      db.knex('users')
      .where({username: username}).select('username','salt', 'password')

      .then((userinfo) => {
        console.log('line 36 of user.js',userinfo)
        bcrypt.compare(password, userinfo.password, null, function(err, res) {
          if (res) {
            resolve(res);
          }
          // res == true
        })
      .catch((res) => {
        reject(res);
      })
        // var salt = user.salt;
        //   var hashedPassword = bcrypt.hashSync(password, salt);
        //   if (hashedPassword === user.password) {
        //     callback(null, 'success');

        //   } else {
        //     callback(null, 'error');
        //   }
        })

    })
  }
});

module.exports = User;
