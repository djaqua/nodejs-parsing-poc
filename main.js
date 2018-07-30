const fs = require('fs');

const ParserV1 = require('./decoder/parser/parserV1');
const ParserV2 = require('./decoder/parser/parserV2');

const options = {
    endOnUnknown: true, // if the parser encounters an unknown record, end parse
};

// read the file in; use ASCII encoding
fs.readFile('SampleInput.txt', 'ascii', (err, dataStr) => {

    const loggerImpl = new ParserV1(options);
    loggerImpl.parse(dataStr);

    const parserImpl = new ParserV2(options);
    let parseTree = parserImpl.parse(dataStr);
    console.log(JSON.stringify(parseTree));
});
