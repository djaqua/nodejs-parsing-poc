const ExampleDecoder = require('..');


/**
 * module - returns an object to be used as a parser.
 *
 * @param  {object} options options for constructing a parse tree
 * @return {object}         an object with a 'parse' method
 */
module.exports = function(options) {

    const example = new ExampleDecoder(options);

    let currentBatch = {
        batchTotal: 0.00
    };
    let currentUser  = null;

    let calculatedUserTotals = 0.00;
    let calculatedItemTotals = 0.00;

    /**
     * The decoder/token-generator uses this to build the parse-tree.
     */
    const parser = {

        /**
         * parseAlphaRecord - pushes alpha record tokens onto the parse tree at
         * the batch level. A new batch results in a new parse tree.
         *
         * @param  {object} obj an object that corresponds to a alpha record
         * @return {object}     an object that corresponds to a alpha record
         */
        parseAlphaRecord: (obj) => {
            if (currentBatch && currentBatch.batchTotal != calculatedUserTotals) {
                // even though this parser only handles one batch/alpha record
                // per parse, this catches accounting discrepencies for the LAST
                // alpha record and its corresponding beta records
                console.log('WARNING: user totals do not match item totals for user record');
            }

            // reset parse tree
            currentBatch = obj;
            currentUser = null;
            calculatedUserTotals = 0.00;
            calculatedItemTotals = 0.00;

            return obj;
        },

        /**
         * parseBetaRecord - pushes beta record tokens onto the parse tree at
         * the user level.
         *
         * @param  {object} obj an object that corresponds to a beta record
         * @return {object}     an object that corresponds to a beta record
         */
        parseBetaRecord: (obj) => {
            if (currentUser && calculatedItemTotals != currentUser.amountDue) {
                // this catches accounting discrepencies for the LAST beta
                // record and its corresponding gamma records
                console.log('WARNING: user totals do not match item totals for user record');
            }
            currentUser = obj;
            (currentBatch.users || (currentBatch.users=[])).push(obj);

            calculatedItemTotals = 0.00;
            calculatedUserTotals += obj.amountDue;
            return obj;
        },

        /**
         * parseGammaRecord - pushes gamma record tokens onto the parse tree at
         * user items level.
         *
         * @param  {object} obj the object that corresponds to a gamma record
         * @return {object}     the object that corresponds to a gamma record
         */
        parseGammaRecord: (obj) => {
            (currentUser.items || (currentUser.items = [])).push(obj);
            calculatedItemTotals += (obj.unitCost * obj.itemQuantity);
            return obj;
        },

        /**
         * parseUnknown - responsible for handling an unknown record.
         *
         * @param  {object} obj a descriptor object for an unknown record
         * @return {object}     'null' if the parse should end, an empty object otherwise
         */
        parseUnknownRecord: (obj) => {
            return options.endOnUnknown ? null : {};
        },
    };

    /**
     * const reset - resets the state of this parser in preparation for the next
     * parse.
     */
    const reset = () => {
        currentBatch = null;
        currentUser = null;
        calculatedUserTotals = 0.00;
        calculatedItemTotals = 0.00;
    };

    return {

        /**
         * parse - parses an input string and returns the parse tree
         *
         * @param  {string} dataStr a multi-record input string
         * @return {object}         a parse tree
         */
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
