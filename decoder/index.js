const constants = require('../constants');

const AlphaDecoder = require('./AlphaDecoder');
const BetaDecoder = require('./BetaDecoder');
const GammaDecoder = require('./GammaDecoder');

/**
 * module - Returns an object to be used as a decoder
 *
 * @param  {type} options description
 * @return {type}         description
 */
module.exports = function(options) {

    // decoder implementations
    const decoders = {
        [constants.ALPHA_RECORD]: new AlphaDecoder(options),
        [constants.BETA_RECORD]: new BetaDecoder(options),
        [constants.GAMMA_RECORD]: new GammaDecoder(options),
    };

    // to be used when no other decoder will suffice
    const defaultDecoder = {

        /**
         * decode - decodes an unknown record type
         *
         * @param  {string} options input record
         * @param  {object} parser  parser implementation to
         * @return {object}         whatever the parser returns
         */
        decode: (recordStr, parser) => {
            // nothing to do except notify the parser
            return parser.parseUnknownRecord(recordStr);
        },
    };

    return {

        /**
         * decode - decodes the specified record and returns an object
         * that contains the tokenized fields of that record. The specified
         * parser is used to
         *
         * @param  {string} recordStr a string that corresponds to a single
         *                            input record
         * @param  {object} parser    the parser driving this decoder
         * @return {object}           an object with the tokenized fields from
         *                            the input record
         */
        decode: (recordStr, parser) => {

            // property-selection in lieu of switch statement (faster)
            selectedDecoder = decoders[recordStr.charAt(0)] || defaultDecoder;

            return selectedDecoder.decode(recordStr, parser);
        },
    };
};
