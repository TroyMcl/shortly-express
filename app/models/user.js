var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');


var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,

  createUser: function (username, password) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, null, function (err, hash) {
          db.knex('users')
            .insert([{ username: username, password: hash, salt: salt }])
            .then((result) => {
              resolve(result);
            })
            .catch((result) => {
              reject(result);
            });
        });
      });
    });
  },

  authUser: function (username, password, callback) {
    return new Promise((resolve, reject) => {
      db.knex('users')
        .where({ username: username }).select('username', 'salt', 'password')

        .then((userinfo) => {
          if (userinfo.length > 0) {
            var userHash = userinfo[0].password;
            bcrypt.compare(password, userHash, function (err, res) {
              if (err) {
                reject(err);
              }
              resolve(res);
            });
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
});

module.exports = User;
