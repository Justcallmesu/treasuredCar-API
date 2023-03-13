class APIREsponse {
    constructor(statusCode, status, message, data = {}) {
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
        this.results = Object.keys(data).length;
        this.data = { ...data };
    }
}

module.exports = APIREsponse;
