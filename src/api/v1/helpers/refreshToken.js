let refreshTokens = [];

module.exports = {
    getRefreshTokens: function() {
        return refreshTokens;
    },
    setRefreshTokens: function(tokens) {
        refreshTokens = tokens;
    },
    addRefreshTokens: function(token) {
        refreshTokens.push(token);
    },
    filterRefreshTokens: function(token) {
        refreshTokens = refreshTokens.filter(tokens => tokens !== token);
    }
};