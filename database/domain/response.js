export default (statusCode, status, data, message) => {
    return {
        status_code: statusCode,
        status,
        message,
        data
    }
}