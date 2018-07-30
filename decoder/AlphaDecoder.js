module.exports = function(options) {

    const getBatchId = (recordStr) => {
        return recordStr.substr(1, 12); // could be a Mongo ObjectId ;)
    };

    const getBatchTotal = (recordStr) => {
        return parseInt(recordStr.substr(13, 6)) / 100;
    };

    return {
        decode: (recordStr, parser) => {
            return parser.parseAlphaRecord({
                batchId: getBatchId(recordStr),
                batchTotal: getBatchTotal(recordStr),
            });
        },
    };
};
