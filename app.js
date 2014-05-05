var app = require('http').createServer(handler);
var url = require('url');
var fs  = require('fs');
var io  = require('socket.io');

function handler(request, response) {
    console.log('Connection');

    var path = url.parse(request.url).pathname;
    console.log('this is the path: ' + path);

    switch(path) {
        case '/':
            response.writeHeader(200, {'Content-Type' : 'text/html'});
            response.write('hey there from the document root yo');
            break;
        case '/socket.html':
            fs.readFile(__dirname + path, function(error, data) {
                if (error){
                    response.writeHeader(404);
                    response.write("404, sorry");
                    response.end();
                }
                else {
                    response.writeHeader(200, {'Content-Type' : 'text/html'});
                    response.write(data, 'utf8');
                    response.end();
                    io.listen(app).set('log level', 1).on('connection', function (socket){
                        //send data to client - the time every second
                        setInterval(function(){
                            var d = new Date();
                            socket.emit('date', {'date': d.getSeconds()});
                        }, 1000);
                    });
                }
            });
            break;
        default:
            response.writeHeader(404);
            response.write("opps this does not exist - 404");
            response.end();
            break;
    }
}

//  Listen to this port
app.listen(8001);
