const fs = require('fs');
const ParserV1 = require('./decoder/parser/parserV2');

const options = {};

fs.readFile('SampleInput.txt', 'ascii', (err, dataStr) => {
    const parserImpl = new ParserV1(options);
    console.log(JSON.stringify(parserImpl.parse(dataStr)));
});
