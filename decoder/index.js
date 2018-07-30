const constants = require('../constants');

const AlphaDecoder = require('./AlphaDecoder');
const BetaDecoder = require('./BetaDecoder');
const GammaDecoder = require('./GammaDecoder');


module.exports = function(options) {

    const decoders = {
        [constants.ALPHA_RECORD]: new AlphaDecoder(options),
        [constants.BETA_RECORD]: new BetaDecoder(options),
        [constants.GAMMA_RECORD]: new GammaDecoder(options),
    };

    const defaultDecoder = {
        decode: (recordStr, parser) => {
            console.log('Unknown record: ' + recordStr);
            return {};
        },
    };

    return {
        decode: (recordStr, parser) => {
            selectedDecoder = decoders[recordStr.charAt(0)] || defaultDecoder;
            return selectedDecoder.decode(recordStr, parser);
        },
    };
};
