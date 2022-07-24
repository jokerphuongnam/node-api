const login = require('./loginService')
const register = require('./registerService')
const getAccessTokenApp = require('./getTokenApp')
const updateProfile = require('./updateProfile')
const changePassword = require('./changePassword')

module.exports = {
    login,
    register,
    getAccessTokenApp,
    updateProfile,
    changePassword
}