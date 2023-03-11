class APIREsponse {
    constructor(status, http, message, data = undefined) {
        this.status = status;
        this.http = http;
        this.message = message;
        this.data = data;
    }
}

module.exports = APIREsponse;
