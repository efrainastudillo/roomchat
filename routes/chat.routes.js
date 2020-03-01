const ChatController = require('../controllers/chat.controller');

const chatrouter = require('express').Router();

chatrouter.get('/chat', ChatController.index);

module.exports = chatrouter;