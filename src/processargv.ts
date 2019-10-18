const path = require('path');
const cmdInput = process.argv[2];


export function cmdlineOptions(destination, mockfile): string {
    var _destination: string;
    if (cmdInput && cmdInput.trim().toUpperCase() === "--MOCK") {
        if (!mockfile) {
            throw "missing mock file destination"
        }
        _destination = 'file://' + path.join(__dirname, '../mockfile/') + mockfile + '.html';
    } else {
        _destination = destination
    }
    return _destination;
}

