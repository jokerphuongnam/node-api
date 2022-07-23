module.exports = (statusCode, status, message, data) => {
    return {
        status_code: statusCode,
        status,
        message,
        data
    }
}