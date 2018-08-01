const express = require('express');
const http = require('http');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const socketio = require('socket.io');
const { Strategy: TwitterStrategy } = require('passport-twitter');

const TWITTER_CONFIG = {
    consumerKey: 'my key from twitter', 
    consumerSecret: 'my secret from twitter', 
    callbackURL: 'http etc'
}