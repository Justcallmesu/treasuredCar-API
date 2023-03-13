class APIError {
    constructor(http, message) {
        this.statusCode = http;
        this.status = String(http).startsWith("4") ? "Client Error" : "Server Error";
        this.message = message;
    }
}

module.exports = APIError;