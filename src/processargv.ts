const path = require('path');
const cmdInput = process.argv[2];
const mockfile = process.argv[3];


export function cmdlineOptions(): string {
    var destination :string;
    if (cmdInput && cmdInput.trim().toUpperCase() === "--MOCK") {
        if (!mockfile) {
            throw "missing mock file destination. use --help"
        }
        destination = 'file://' + path.join(__dirname,'../mockfile/')  + mockfile.trim() + '.html';
    } else {
        destination = "https://billundpizza.dk/menu/"
    }
    return destination;
}

export function cmdlineHelp () {
    if (cmdInput && cmdInput.trim().toUpperCase() == "--HELP") {
        console.log("To mock a file use --mock [html filename]")
        console.log("example with mock-index.html : node index --mock mock-index")
        process.exit(1);
    }
}
