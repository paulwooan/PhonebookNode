const fs = require('fs');
const readline = require('readline');

const http = require('http');
var phoneBook = [];
var localStorage = 'entries.json';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const contacts = {
    'Name': 'Paul An',
    'phoneNumber': '678-469-6494',
    'id': '0'
};

var readContacts = function (callback) {
    fs.readFile(localStorage, (err, data) => {
        var json = JSON.parse(data);
        callback(json);
    })
}

var writeContacts = function (content) {
    var tempPhoneBook = [];
    readContacts(
        function (data) {
            tempPhoneBook.push(data)
            tempPhoneBook.push(content)
            console.log(tempPhoneBook)
            fs.writeFile(localStorage, JSON.stringify(tempPhoneBook), function (err) {
                if (err) throw err;
            })
        })
}

var server = http.createServer(function (request, response) {
    console.log(request.method, request.url)
    if (request.method === "GET") {
        readContacts(
            function (data) {
                response.end(JSON.stringify(data))
            }
        )

    } else if (request.method === "POST") {
        var body = '';
        request.on('data', function (chunk) {
            body += chunk.toString();
        })
        request.on('end', function () {
            var parseBody = JSON.parse(body)
            writeContacts(parseBody);
            response.end()
        })

    } else if (request.method === "PUT") {
        console.log('Put')
    } else if (request.method === "DELETE") {
        console.log('Delete')
    }
})

server.listen(4000);



var mainMenu = (`
=====================
Electronic Phone Book
=====================
1. Look up an entry
2. Set an entry
3. Delete an entry
4. List all entries
5. Save entries
6. Restore saved entries
7. Quit
`);


var mainMenuPrint = function () {
    console.log(mainMenu)

    rl.question('Pick one of the following menu options (1-7)? ', function (answer) {
        if (answer === '1') {
            rl.question('Name: ', function (name) {
                for (var i = 0; i < phoneBook.length; i++) {
                    if (phoneBook[i].firstName === name) {
                        console.log('Found entry for ' + name + ': ' + phoneBook[i].phoneNumber);
                        mainMenuPrint()
                    }
                }
            })
        }

        else if (answer === '2') {
            rl.question('Name: ', function (name) {
                rl.question('Phone Number: ', function (phone) {
                    phoneBook.push({ 'firstName': name, 'phoneNumber': phone });
                    console.log('Entry stored for ' + name);
                    mainMenuPrint()
                });
            })
        } else if (answer === '3') {
            console.log('working')

        } else if (answer === '4') {
            for (var i = 0; i < phoneBook.length; i++) {
                console.log('Found entry for ' + phoneBook[i].firstName + ': ' + phoneBook[i].phoneNumber)
            }
            mainMenuPrint()
        } else if (answer === '5') {
            fs.writeFile(localStorage, JSON.stringify(phoneBook), function (err) {
                if (err) throw err;
                console.log('Entries saved to ' + localStorage)
                mainMenuPrint();
            })

        } else if (answer === '6') {
            fs.readFile(localStorage, function (err, data) {
                var json = JSON.parse(data);
                phoneBook = json;
                mainMenuPrint();
            })

        } else if (answer === '7') {
            console.log('Done')
            rl.close();
        }

    });
}

mainMenuPrint();
