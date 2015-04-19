var mongoose = require('mongoose')
mongoose.connect('129.21.114.52:27017/BRICKHACK');

var conn = mongoose.connection;

var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

var twilio = require('twilio'); 
var request = require('request');

// A Twilio number you control - choose one from:
// https://www.twilio.com/user/account/phone-numbers/incoming
// Specify in E.164 format, e.g. "+16519998877"
var twilioNumber = process.env.TWILIO_NUMBER;

var authyKey = process.env.AUTHY_API_KEY;

var authy = require('authy')(authyKey);
var twilioClient = require('twilio')(accountSid, authToken);

var User = require('../models/User');

exports.getUser = function(req, res) {
    conn.collection('users').findOne({'phone': req.params.phone}, function(err, items) {
          if(err) {
              return console.log('findOne error:', err);
          }
          else {
            res.json(items);
          }
      });

};

exports.create = function(req, res) {
    /*
    var params = req.body;
    
    // Create a new user based on form parameters
    var user = new User({
        email: params.email,
        phone: params.phone,
        countryCode: params.countryCode,
        password: params.password
    });

    user.save(function(err, doc) {
        if (err) {
            // To improve on this example, you should include a better
            // error message, especially around form field validation. But
            // for now, just indicate that the save operation failed
            req.flash('errors', 'There was a problem creating your'
                + ' account - note that all fields are required. Please'
                + ' double-check your input and try again.');

            res.redirect('/users/new');

        } else {
            // If the user is created successfully, send them an account
            // verification token
            user.sendAuthyToken(function(err) {
                if (err) {
                    request.flash('errors', 'There was a problem sending '
                        + 'your token - sorry :(');
                }

                // Send to token verification page
                res.redirect('/users/'+doc._id+'/verify');
            });
        }
    });
    */

    var params = req.body;
    
    // Create a new user based on form parameters
    var user = new User({
        email: params.email,
        phone: params.phoneNumber,
        password: params.password,
        interests: []
    });

    for (var i = 0; i < params.genres.length; i++) {
        user.interests.push({
            genre: params.genres[i].name,
            frequency: 0
        });
    };

    console.log(user);

    user.save(function(err, doc) {
        if (err) {
            // To improve on this example, you should include a better
            // error message, especially around form field validation. But
            // for now, just indicate that the save operation failed
            /*
            req.flash('errors', 'There was a problem creating your'
                + ' account - note that all fields are required. Please'
                + ' double-check your input and try again.');
            */
            console.log(err);
        } else {
            // If the user is created successfully, send them an account
            // verification token
            /*
            user.sendAuthyToken(function(err) {
                if (err) {
                    request.flash('errors', 'There was a problem sending '
                        + 'your token - sorry :(');
                }

                // Send to token verification page
                res.redirect('/users/'+doc._id+'/verify');
            });
            */
            
            // res.redirect('/sign-up/finish');

            var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            client.sendMessage({
                to: doc.phone,
                body: "Welcome to Uncharted!\n" +
                      "We're sending your first recommendation now." +
                      "Send 'recommend' to get more!",
                from: process.env.TWILIO_NUMBER
            }, function(err, messageData) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Sent welcome");
                }
            });

            var response = {
                status: 200,
                success: ''
            }

            res.end(JSON.stringify(response));
        }
    });
};

// Handle submission of verification token
exports.verify = function(request, response) {
    var user;

    // Load user model
    User.findById(request.params.id, function(err, doc) {
        if (err || !doc) {
            return die('User not found for this ID.');
        }

        // If we find the user, let's validate the token they entered
        user = doc;
        user.verifyAuthyToken(request.body.code, postVerify);
    });

    // Handle verification response
    function postVerify(err) {
        if (err) {
            return die('The token you entered was invalid - please retry.');
        }

        // If the token was valid, flip the bit to validate the user account
        user.verified = true;
        user.save(postSave);
    }

    // after we save the user, handle sending a confirmation
    function postSave(err) {
        if (err) {
            return die('There was a problem validating your account '
                + '- please enter your token again.');
        }

        // Send confirmation text message
        var message = 'You did it! Signup complete :)';
        user.sendMessage(message, function(err) {
            if (err) {
                request.flash('errors', 'You are signed up, but '
                    + 'we could not send you a message. Our bad :(');
            }

            // show success page
            request.flash('successes', message);
            response.redirect('/users/'+user._id);
        });
    }

    // respond with an error
    function die(message) {
        request.flash('errors', message);
        response.redirect('/users/'+request.params.id+'/verify');
    }
};
