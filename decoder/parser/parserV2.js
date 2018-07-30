const ExampleDecoder = require('..');

module.exports = function(options) {

    const example = new ExampleDecoder(options);

    let currentBatch = {
        batchTotal: 0.00
    };
    let currentUser  = null;

    let calculatedUserTotals = 0.00;
    let calculatedItemTotals = 0.00;

    const parser = {
        parseAlphaRecord: (obj) => {
            // console.log('parsing alpha record: ' + currentBatch);
            if (calculatedItemTotals != calculatedUserTotals) {
                console.log('WARNING: user totals do not match item totals for user record');
            }
            currentBatch = obj;
            currentUser = null;
            calculatedUserTotals = 0.00;
            calculatedItemTotals = 0.00;
            // console.log('finishing alpha record: ' + currentBatch);
            return obj;
        },

        parseBetaRecord: (obj) => {
            if (currentUser && calculatedItemTotals != currentUser.amountDue) {
                console.log('WARNING: user totals do not match item totals for user record');
            }
            currentUser = obj;
            (currentBatch.users || (currentBatch.users=[])).push(obj);

            calculatedItemTotals = 0.00;
            calculatedUserTotals += obj.amountDue;
            return obj;
        },

        parseGammaRecord: (obj) => {
            (currentUser.items || (currentUser.items = [])).push(obj);
            calculatedItemTotals += (obj.unitCost * obj.itemQuantity);
            return obj;
        },
    };

    const reset = () => {
        currentBatch = null;
        currentUser = null;
        calculatedUserTotals = 0.00;
        calculatedItemTotals = 0.00;
    };

    return {
        parse: (dataStr) => {
            const records = dataStr.split('\n');

            return records.reduce((batchResult, recordStr) => {

                let lastObj = null;

                if (recordStr) {
                    lastObj = example.decode(recordStr, parser);
                }

                if (!lastObj) {
                    batchResult.push(currentBatch);
                    reset();
                }

                return batchResult;
            }, []);
        },
    };
};
