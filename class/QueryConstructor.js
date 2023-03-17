class APiData {
    constructor(models, urlQuery) {
        this.mongoQuery = models;
        this.urlQuery = urlQuery;
    }

    filterOrGet() {
        if (this.urlQuery) {
            const query = this.urlQuery;
            const excludedQuery = ["page", "sort", "limit", "fields"];
            const includedQuery = ["name", "model", "bodyType", "ATMT", "brand", "price", "cc"];
            excludedQuery.forEach((value) => delete query[value]);

            Object.keys(query).forEach((value) => {
                if (value === "name" || value === "brand") {
                    query[value] = {
                        "$regex": new RegExp(`(${query[value]})`, "i")
                    }
                }
                if (!includedQuery.includes(value)) delete query[value];
            });

            this.mongoQuery = this.mongoQuery.find(query);

            return this;
        };

        this.mongoQuery = this.mongoQuery.find();

        return this;
    }

    pagination() {
        const [page, itemsPerPage] = [(this.urlQuery.page * 1 || 1) - 1, this.urlQuery.itemsPerPage * 1 || 10];

        this.mongoQuery = this.mongoQuery.skip(page * itemsPerPage).limit(itemsPerPage);
        return this;
    }

}

module.exports = APiData;