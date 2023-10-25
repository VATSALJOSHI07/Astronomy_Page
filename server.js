const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Connect to MongoDB (replace the connection string and database name)
mongoose.connect('mongodb://localhost/login', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User schema with passport-local-mongoose
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    username: String,
    password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

// Passport setup
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Express configuration
app.use(expressSession({
    secret: '48a45b791c899eb04f198c7e9824bf712192aad7b5b0a1f70e120a53d67cb0e07', // Use your generated secret key
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static('public'));

// Define your routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Authentication failed, store the error message in the session
            req.session.errorMessage = 'Password incorrect';
            return res.redirect('/fail');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/success');
        });
    })(req, res, next);
});

app.get('/success', (req, res) => {
    // Check if the user is authenticated before redirecting to demo2.html
    if (req.isAuthenticated()) {
        res.sendFile(__dirname + '/public/demo2.html');
    } else {
        // Handle unauthenticated access
        res.redirect('/fail');
    }
});

app.get('/fail', (req, res) => {
    const errorMessage = req.session.errorMessage;
    if (errorMessage) {
        req.session.errorMessage = null; // Clear the error message from the session
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background-image: url("twinkling-stars.png");
                        background-repeat: no-repeat;
                        background-attachment: fixed;
                        background-size: 100%;
                    }
                    .container {
                        text-align: center;
                        background-color: #f2f2f2;
                        padding: 20px;
                        border-radius: 5px;
                        box-shadow: 0 2px 5px #00000020;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <p>Please <a href="/signup">Sign up</a> if you are not registered.</p>
                </div>
            </body>
            </html>
        `);
    } else {
        res.redirect('/');
    }
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});

app.get('/details.html', (req, res) => {
    res.sendFile(__dirname + '/details.html');
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    User.register(new User({ username }), password, (err, user) => {
        if (err) {
            console.error(err);
            return res.send('Error: Registration failed.');
        }
        passport.authenticate('local')(req, res, () => {
            // Redirect the user back to the login page after successful signup
            res.redirect('/');
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
