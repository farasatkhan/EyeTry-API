const bcrypt = require('bcryptjs');
const crypto = require('crypto');

function hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

function comparePassword(raw, hash) {
    return bcrypt.compareSync(raw, hash);
};

function randomImageName(bytes = 16) {
    return crypto.randomBytes(bytes).toString('hex');
}

module.exports = {
    hashPassword,
    comparePassword,
    randomImageName
};