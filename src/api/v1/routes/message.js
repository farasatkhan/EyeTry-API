var express = require('express');
const { addMessage, getMessages } = require('../controllers/Chat/MessageController');
var router = express.Router();


router.post("/",addMessage)
router.get("/:chatId",getMessages)



module.exports = router; 