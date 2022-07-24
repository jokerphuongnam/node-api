const login = require('./loginService')
const register = require('./registerService')
const getAccessTokenApp = require('./getTokenApp')
const updateProfile = require('./updateProfile')

module.exports = {
    login,
    register,
    getAccessTokenApp,
    updateProfile
}