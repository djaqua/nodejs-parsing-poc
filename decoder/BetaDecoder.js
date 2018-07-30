module.exports = function(options) {

    const getUserId = (recordStr) => {
        return recordStr.substr(1, 12); // could be another Mongo ObjectId ;)
    };

    const getAmountDue = (recordStr) => {
        return parseInt(recordStr.substr(13, 6)) / 100;
    };

    return {
        decode: (recordStr, parser) => {
            return parser.parseBetaRecord({
                userId: getUserId(recordStr),
                amountDue: getAmountDue(recordStr),
            });
        },
    };
};
