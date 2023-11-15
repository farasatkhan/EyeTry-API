require('dotenv').config({ path: './src/config/.env' });

const jwt = require('jsonwebtoken');

const { hashPassword, comparePassword } = require('../../helpers/hashing');

var CustomerSupportModel = require('../../models/CustomerSupport')

/*
    TODO: Store JWT tokens in the database once authentication is completed
    Currently, we are only using the refreshTokens array to manage refresh tokens.
*/
var tokens = require('../../helpers/refreshToken');
// const refreshTokens = [];


/*
    Customer Support Registration is only used for testing purposes. Customer Support cannot register account normally.
    Admin would be responsible for creating their account
*/
exports.register = async (req, res, next) => {
    try {

        const { firstname, lastname, email, password, confirmpassword } = req.body;

        const isAgentAlreadyExists = await CustomerSupportModel.findOne({ email: email });

        if (isAgentAlreadyExists) return res.status(400).json({ message: "Agent already exists." });

        if (password !== confirmpassword) return res.status(400).json({ message: "The password and confirm password fields do not match." });

        const hashedPassword = hashPassword(password);

        const createAgent = await CustomerSupportModel.create({
            firstName: firstname,
            lastName: lastname,
            email: email,
            password: hashedPassword,
            role: "customer_support"
        });

        if (!createAgent) return res.status(400).json({ message: "Unable to create an account." });

        const token = this.generateAccessToken(createAgent);
        const refreshToken = this.generateRefreshToken(createAgent);

        tokens.addRefreshTokens(refreshToken);

        res.set('Authorization', `Bearer ${token}`);

        res.status(201).json(
            {
                user: createAgent,
                accessToken: token,
                refreshToken: refreshToken,
                message: "Agent account is created."
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error occured during account creation." });
    }

};

exports.login = async (req, res, next) => {
    try {

        const authorizationHeader = req.headers['authorization'];
        const Authtoken = authorizationHeader && authorizationHeader.split(' ')[1];

        console.log("Verify Auth Access:", this.verifyAccessToken(Authtoken));
        console.log("Verify Refresh Access:", this.verifyRefreshToken(Authtoken));

        if (this.verifyAccessToken(Authtoken)) return res.status(301).json({ message: "Agent is already logged in." });

        const { email, password } = req.body;

        const agent = await CustomerSupportModel.findOne({ email: email });

        if (!agent) return res.status(400).json({ message: "Agent account not found." });

        const comparedPassword = comparePassword(password, agent.password);

        if (!comparedPassword) return res.status(400).json({ message: "Password is incorrect." });

        // const agentObject = {
        //     email: agent.email,
        //     role: agent.role
        // }

        const token = this.generateAccessToken(agent);
        const refreshToken = this.generateRefreshToken(agent);

        tokens.addRefreshTokens(refreshToken);

        res.set('Authorization', `Bearer ${token}`);

        res.status(201).json(
            {
                user: agent,
                accessToken: token,
                refreshToken: refreshToken,
                message: "Support Agent is logged in."
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error occured during login." });
    };
};

exports.logout = (req, res, next) => {

    tokens.filterRefreshTokens(req.body.token);
    res.status(204).json({ message: "Logout successful." });
};

exports.generateAccessToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.AGENT_ACCESS_TOKEN_SECRET, { expiresIn: '60m' });
};

exports.generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.AGENT_REFRESH_TOKEN_SECRET);
}

exports.generateNewAccessToken = (req, res, next) => {

    try {

        const refreshToken = req.body.token;

        if (refreshToken == null) return res.status(401).json({ message: "No refresh token is present." });

        if (!tokens.getRefreshTokens().includes(refreshToken)) return res.status(403).json({ message: "Invalid refresh token." });

        jwt.verify(refreshToken, process.env.AGENT_REFRESH_TOKEN_SECRET, (err, user) => {

            if (err) return res.status(403).json({ message: "Invalid refresh token is present." });

            const accessToken = this.generateAccessToken(user);

            res.status(201).json({ accessToken: accessToken });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal error occured." });
    }
};

exports.authenticateToken = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    const token = authorizationHeader && authorizationHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: "No authorization header is present." });

    jwt.verify(token, process.env.AGENT_ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid Token." });

        req.user = user;
        next();
    });
};

exports.verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    const token = authorizationHeader && authorizationHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: "No authorization header is present." });

    jwt.verify(token, process.env.AGENT_ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid Token." });

        res.sendStatus(200);
    });
};

exports.verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.AGENT_ACCESS_TOKEN_SECRET, (err, res) => {
        if (err) return false;

        return true;
    });
};

exports.verifyRefreshToken = (refreshToken) => {
    return jwt.verify(refreshToken, process.env.AGENT_REFRESH_TOKEN_SECRET, (err, res) => {
        if (err) return false;

        return true;
    });
};