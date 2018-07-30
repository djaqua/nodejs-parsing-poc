module.exports = function(options) {

    const getItemId = (recordStr) => {
        return recordStr.substr(1, 12); // and yet another Mongo ObjectId ;)
    };

    const getUnitCost = (recordStr) => {
        return parseInt(recordStr.substr(13, 6)) / 100;
    };

    const getItemQuantity = (recordStr) => {
        return parseInt(recordStr.substr(19, 3));
    };


    return {
        decode: (recordStr, parser) => {
            return parser.parseGammaRecord({
                itemId: getItemId(recordStr),
                unitCost: getUnitCost(recordStr),
                itemQuantity: getItemQuantity(recordStr),
            });
        },
    };
};
