var express = require('express');
var router = express.Router();


var SupportTicketsController = require('../controllers/SupportAgent/SupportTicketsController')
var { authenticateToken } = require('../controllers/Auth/CustomerSupportAuthController');
var AuthController = require('../controllers/Auth/AuthController')



router.post('/ticket', AuthController.authenticateToken, SupportTicketsController.createTicket)

router.get('/tickets', authenticateToken, SupportTicketsController.retrieveTickets)
router.get('/tickets_user', AuthController.authenticateToken, SupportTicketsController.retrieveTicketsUser)
router.get('/tickets/:id', authenticateToken, SupportTicketsController.viewSpecificTicket)
router.get('/tickets_user/:id', AuthController.authenticateToken, SupportTicketsController.viewSpecificTicket)

// Only Support Agent is updating tickets
router.put('/tickets/:id', authenticateToken, SupportTicketsController.updateTicket)


router.delete('/tickets/:id', authenticateToken, SupportTicketsController.deleteTicket)
router.delete('/tickets_user/:id', AuthController.authenticateToken, SupportTicketsController.deleteTicket)


module.exports = router; 