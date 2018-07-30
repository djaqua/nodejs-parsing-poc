const ExampleDecoder = require('..');

module.exports = function(options) {

    const example = new ExampleDecoder(options); 

    const parser = {
        parseAlphaRecord: (obj) => {
            console.log(obj);
        },

        parseBetaRecord: (obj) => {
            console.log(obj);
        },

        parseGammaRecord: (obj) => {
            console.log(obj);
        },
    };

    return {
        parse: (dataStr) => {
            const records = dataStr.split('\n');

            return records.reduce((batchResult, recordStr) => {
                if (recordStr)
                    example.decode(recordStr, parser);


                return batchResult;
            }, []);
        },
    };
};
