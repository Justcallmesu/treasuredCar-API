class APIError extends Error {
    constructor(http, message) {
        this.http = http;
        this.status = String(http).startsWith("4") ? "Client Error" : "Server Error";
        super(message);
    }
}

module.exports = APIError;