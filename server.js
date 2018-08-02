const express = require('express');
const http = require('http');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const socketio = require('socket.io');
const { Strategy: TwitterStrategy } = require('passport-twitter');

const TWITTER_CONFIG = {
    consumerKey: 'p2vVlGHuMaR65Uj33GEtRKki4', 
    consumerSecret: 'a8jpFhigRwIhjb0Z9H5GH4CC3QeF1tfA0S1jtcGJG58VajzltP', 
    callbackURL: 'https://127.0.0.1:8080/twitter/callback'
}

const app = express();
const server = http.createServer(app)
const io = socketio(server)

app.use(express.json)
app.use(passport.initialize())

app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use(session({
    secret: 'KeyboardKittens',
    resave: true, 
    saveUninitialized: true
}))

passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((user, cb) => cb(null, obj))

passport.use(new TwitterStrategy(
    TWITTER_CONFIG,
    (accessToken, refreshToken, profile, cb) => {
        const user = {
            name: profile.username, 
            photo: profile.photos[0].value.replace(/_normal/, '')
        }
        cb(null, user)
    })
)

const twitterAuth = passport.authenticate('twitter')

const addSocketIdToSession = (req, res, next) => {
    req.session.socketId = req.query.socketId
    next()
}
app.get('/twitter', addSocketIdToSession, twitterAuth)

app.get('twitter/callback', twitterAuth, (req, res) => {
    io.in(req.session.socketId).emit('user', req.user)
    res.end()
})
server.listen(8080, () => {
    console.log('listening...')
})