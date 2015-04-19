var mongoose = require('mongoose')
mongoose.connect('129.21.114.52:27017');

var conn = mongoose.connection;

var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

// A Twilio number you control - choose one from:
// https://www.twilio.com/user/account/phone-numbers/incoming
// Specify in E.164 format, e.g. "+16519998877"
var twilioNumber = process.env.TWILIO_NUMBER;

var authyKey = process.env.AUTHY_API_KEY;

var authy = require('authy')(authyKey);
var twilioClient = require('twilio')(accountSid, authToken);

// Define user model schema
var UserSchema = new mongoose.Schema({
    countryCode: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    authyId: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    interests: [
    	{
    		genre: String,
    		frequency: Number
    	}
    ]
});

UserSchema.pre('save', function(next) {
    var self = this;

    // only hash the password if it has been modified (or is new)
    if (!self.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(self.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            self.password = hash;
            next();
        });
    });
});

// app.post('/users', users.create);

exports.create = function(req, res) {
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
};

// Send a verification token to this user
UserSchema.methods.sendAuthyToken = function(cb) {
    var self = this;

    if (!self.authyId) {
        // Register this user if it's a new user
        authy.register_user(self.email, self.phone, self.countryCode, 
            function(err, response) {
                
            if (err || !response.user) return cb.call(self, err);
            self.authyId = response.user.id;
            self.save(function(err, doc) {
                if (err || !doc) return cb.call(self, err);
                self = doc;
                sendToken();
            });
        });
    } else {
        // Otherwise send token to a known user
        sendToken();
    }

    // With a valid Authy ID, send the 2FA token for this user
    function sendToken() {
        authy.request_sms(self.authyId, true, function(err, response) {
            cb.call(self, err);
        });
    }
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

UserSchema.methods.verifyAuthyToken = function(otp, cb) {
    var self = this;
    authy.verify(self.authyId, otp, function(err, response) {
        cb.call(self, err, response);
    });
};
