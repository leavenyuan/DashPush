const express = require('express')
const app = express()
const port = 3000
const fs = require('fs-extra')
const bodyParser = require('body-parser')
var path = require('path')

var http = require('http')
var https = require('https')

var privateKey  = fs.readFileSync(path.join(__dirname, './certificate/private.pem'), 'utf8');
var certificate = fs.readFileSync(path.join(__dirname, './certificate/file.crt'), 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

var PORT = 3001;
var SSLPORT = 3002;

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

fs.removeSync('./log');
fs.mkdirSync('./log')

//app.get('/', (req, res) => res.send('Dash push demo has been started.'))

app.get('/', function (req, res) {
    if(req.protocol === 'https') {
        res.status(200).send('This is https visit!');
    }
    else {
        res.status(200).send('This is http visit!');
    }
});

// uuid
function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

app.post('/', jsonParser, (req, res) => {
    var i = 0
    var body = req.body
    var taskId = body.taskInfo.task.taskId
    var trackId = body.detectInfo.faceInfo.trackId
    var objectId = body.objectId
    var capturedTime = body.detectInfo.capturedTime
    var receivedTime = body.detectInfo.receivedTime
    var quality = body.detectInfo.faceInfo.quality
    var score = body.detectInfo.score
    var uuid = guid()
    var fileName = taskId + "|" + trackId + "|" + objectId + "|" + capturedTime + "|" + receivedTime + "|" + quality  + "|" + score + "|" + uuid
    console.log(fileName)
    var i = i + 1
    // With a callback:
    fs.writeJson('./log/' + fileName + '.json', body, err => {
        if (err)
            return console.error(err)
        res.send('Dash push demo get post request.')
    })
})

//httpServer.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

//创建http服务器
httpServer.listen(PORT, function() {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});
 
//创建https服务器
httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});

