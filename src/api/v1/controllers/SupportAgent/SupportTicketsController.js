var fs = require('fs');

var UserModel = require('../../models/User')
var SupportTicketModel = require('../../models/SupportTicket')


// Customer aka user will create support tickets

exports.createTicket = async (req, res, next) => {
    try {
        const customer = await UserModel.findById(req.user.id).select("firstName lastName"); // returns 
        if (!customer) return res.status(400).json({ message: "User Account account not found." });
        const { dateIssued, orderNumber, type, priority, status, description } = req.body
        const ticket = await SupportTicketModel.create({
            customerId: req.user.id,
            customerName: customer.firstName + '' + customer.lastName,
            dateIssued: dateIssued,
            orderNumber: orderNumber,
            type: type,
            priority: priority,
            status: "Open",
            description: description
        });
        if (!ticket) return res.status(400).json({ message: "400: Error occured while creating ticket" });

        res.status(200).json(ticket);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured" });
    }
}

exports.retrieveTickets = async (req, res, next) => {
    try {
        const tickets = await SupportTicketModel.find();
        if (!tickets) return res.status(404).json({ message: "404: No Tickets Present" });
        res.status(200).json(tickets)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured" });
    }
}

exports.retrieveTicketsUser = async (req, res, next) => {
    try {
        const tickets = await SupportTicketModel.find({ customerId: req.user.id });
        if (!tickets) return res.status(404).json({ message: "404: No Tickets Present" });
        res.status(200).json(tickets)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured" });
    }
}

exports.viewSpecificTicket = async (req, res, next) => {
    try {
        const ticket = await SupportTicketModel.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: "404: Ticket Not Found" });
        res.status(200).json(ticket)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured" });
    }
}

exports.updateTicket = async (req, res, next) => {
    try {
        const { message, status } = req.body;
        const ticket = await SupportTicketModel.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: "404: Ticket Not Found" });
        if (status) {
            ticket.status = status
        }
        if (message && message.length !== 0) {
            const newResponse = {
                message: message,
                dateTime: new Date(),
                agentId: req.user.id
            };
            ticket.supportAgentResponses.push(newResponse)
        }
        const updatedTicket = await ticket.save()
        res.status(200).json(updatedTicket)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured" });
    }
}

exports.deleteTicket = async (req, res, next) => {
    try {
        const deletedTicket = await SupportTicketModel.findByIdAndDelete(req.params.id);
        if (!deletedTicket) return res.status(404).json({ message: "404: Ticket Not Found" });

        res.status(204).json({ message: "204: Ticket is removed." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured" });
    }
}
