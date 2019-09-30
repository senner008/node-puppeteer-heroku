const cmdInput = process.argv[2];
const mockfile = process.argv[3];


export function cmdlineOptions(): string {
 

    var destination :string;
    if (cmdInput && cmdInput.trim().toUpperCase() === "--MOCK") {
        if (!mockfile) {
            throw "missing mock file destination. use --help"
        }
        destination = 'file://' + __dirname + '/' + mockfile.trim() + '.html';
        console.log(__dirname)
    } else {
        destination = "https://billundpizza.dk/menu/"
    }
    return destination;
}

export function cmdlineHelp () {
    if (cmdInput && cmdInput.trim().toUpperCase() == "--HELP") {
        console.log("To mock a file use --mock [html filename]")
        console.log("example with mock-index.html : node index --mock mock-index")
        throw "exiting...";
    }
}
