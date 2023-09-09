require('dotenv').config({ path: './src/config/.env' });

const jwt = require('jsonwebtoken');

const { hashPassword, comparePassword } = require('../../helpers/hashing');

var AdminModel = require('../../models/Admin');

/*
    TODO: Store JWT tokens in the database once authentication is completed
    Currently, we are only using the refreshTokens array to manage refresh tokens.
*/
var tokens = require('../../helpers/refreshToken');
// const refreshTokens = [];


/*
    Admin Registration is only used for testing purposes. Admin cannot register account normally.
*/
exports.register = async (req, res, next) => {
    try {
        // const authorizationHeader = req.headers['authorization'];
        // const Authtoken = authorizationHeader && authorizationHeader.split(' ')[1];

        // if (this.verifyAccessToken(Authtoken)) return res.status(301).json({message: "Admin is logged in."});

        const {firstname, lastname, email, password, confirmpassword} = req.body;

        const isAdminAlreadyExists = await AdminModel.findOne({email: email});

        if (isAdminAlreadyExists) return res.status(400).json({message: "Admin already exists."});

        if (password !== confirmpassword) return res.status(400).json({message: "The password and confirm password fields do not match."});

        const hashedPassword = hashPassword(password);

        const createAdmin = await AdminModel.create({
            firstName: firstname,
            lastName: lastname,
            email: email,
            password: hashedPassword,
            role: "admin"
        });

        if (!createAdmin) return res.status(400).json({message: "Unable to create an account."});

        // const token = this.generateAccessToken(createAdmin);
        // const refreshToken = this.generateRefreshToken(createAdmin);
        
        // tokens.addRefreshTokens(refreshToken);

        // res.set('Authorization', `Bearer ${token}`);

        res.status(201).json(
            {
                user: createAdmin,
                // accessToken: token,
                // refreshToken: refreshToken,
                message: "Admin account is created."
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "error occured during account creation."});
    }

};

exports.login = async (req, res, next) => {
    try {

        const authorizationHeader = req.headers['authorization'];
        const Authtoken = authorizationHeader && authorizationHeader.split(' ')[1];

        console.log("Verify Auth Access:", this.verifyAccessToken(Authtoken));
        console.log("Verify Refresh Access:", this.verifyRefreshToken(Authtoken));

        if (this.verifyAccessToken(Authtoken)) return res.status(301).json({message: "Admin is already logged in."});

        const {email, password} = req.body;

        const isAdminExists = await AdminModel.findOne({email: email});

        if (!isAdminExists) return res.status(400).json({message: "Admin account not found."});

        const comparedPassword = comparePassword(password, isAdminExists.password);

        if (!comparedPassword) return res.status(400).json({message: "Password is incorrect."});

        const token = this.generateAccessToken(isAdminExists);
        const refreshToken = this.generateRefreshToken(isAdminExists);

        tokens.addRefreshTokens(refreshToken);

        res.set('Authorization', `Bearer ${token}`);

        res.status(201).json(
            {
                user: isAdminExists,
                accessToken: token,
                refreshToken: refreshToken,
                message: "Admin is logged in."
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "error occured during login."});
    };
};

exports.logout = (req, res, next) => {
    
    tokens.filterRefreshTokens(req.body.token);
    res.status(204).json({message: "Logout successful."});
};

exports.generateAccessToken = (user) => {
    return jwt.sign({id: user.id}, process.env.ADMIN_ACCESS_TOKEN_SECRET, {expiresIn: '60m'});
};

exports.generateRefreshToken = (user) => {
    return jwt.sign({id: user.id}, process.env.ADMIN_REFRESH_TOKEN_SECRET);
}

exports.generateNewAccessToken = (req, res, next) => {

    try {
        const refreshToken = req.body.token;

        if (refreshToken == null) return res.status(401).json({message: "No refresh token is present."});

        if (!tokens.getRefreshTokens().includes(refreshToken)) return res.status(403).json({message: "Invalid refresh token."});

        jwt.verify(refreshToken, process.env.ADMIN_REFRESH_TOKEN_SECRET, (err, user) => {

            if (err) return res.status(403).json({message: "Invalid refresh token is present."});

            const accessToken = this.generateAccessToken(user);

            res.status(201).json({ accessToken: accessToken });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal error occured."});
    }
};

exports.authenticateToken = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    const token = authorizationHeader && authorizationHeader.split(' ')[1];

    if (token == null) return res.status(401).json({message: "No authorization header is present."});

    jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({message: "Invalid Token."});

        req.user = user;
        next();
    });
};

exports.verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET, (err, res) => {
        if (err) return false;

        return true;
    });
};

exports.verifyRefreshToken = (refreshToken) => {
    return jwt.verify(refreshToken, process.env.ADMIN_REFRESH_TOKEN_SECRET, (err, res) => {
        if (err) return false;

        return true;
    });
};