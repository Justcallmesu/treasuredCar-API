class APiData {
    constructor(models, urlQuery) {
        this.mongoQuery = models;
        this.urlQuery = urlQuery;
    }

    filterOrGet() {

        if (this.urlQuery) {

        };

        this.mongoQuery = this.mongoQuery.find();

        return this;
    }

}

module.exports = APiData;