class APiData {
    constructor(models, urlQuery) {
        this.mongoQuery = models;
        this.urlQuery = urlQuery;
    }

    #constructGeospatial(query, coordinates) {
        query.location = {
            $geoWithin: {
                $centerSphere: [coordinates, 12 / 6378]
            }
        };
    }

    filterOrGet() {
        if (this.urlQuery) {
            const query = this.urlQuery;
            const excludedQuery = ["page", "sort", "limit", "fields"];
            const includedQuery = ["name", "model", "bodyType", "ATMT", "brand", "price", "cc", "coordinates"];
            excludedQuery.forEach((value) => delete query[value]);

            Object.keys(query).forEach((value) => {
                if (value === "name" || value === "brand") {
                    query[value] = {
                        "$regex": new RegExp(`(${query[value]})`, "i")
                    }
                }
                if (!includedQuery.includes(value)) delete query[value];
            });

            if ("coordinates" in query) {
                const [longitude, latitude] = query.coordinates.split(",");

                if (longitude && latitude) {
                    this.#constructGeospatial(query, [longitude * 1, latitude * 1])
                    delete query["coordinates"];
                };

            }

            this.mongoQuery = this.mongoQuery.find({ ...query, status: "Posted" });

            return this;
        };

        this.mongoQuery = this.mongoQuery.find({ status: "Posted" });

        return this;
    }


    pagination() {
        const [page, itemsPerPage] = [(this.urlQuery.page * 1 || 1) - 1, this.urlQuery.itemsPerPage * 1 || 10];

        this.mongoQuery = this.mongoQuery.skip(page * itemsPerPage).limit(itemsPerPage);
        return this;
    }

}

module.exports = APiData;