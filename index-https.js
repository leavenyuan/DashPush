const express = require('express')
const app = express()
const fs = require('fs-extra')
const bodyParser = require('body-parser')
const path = require('path')
const sep = path.sep;
const http = require('http')
const https = require('https')

// Reset limit size for request.
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

const privateKey = fs.readFileSync(path.join(__dirname, './certificate/private.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, './certificate/file.crt'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const PORT = 3001;
const SSLPORT = 3002;

// create application/json parser
const jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

fs.removeSync('./log');
fs.mkdirSync('./log')

//app.get('/', (req, res) => res.send('Dash push demo has been started.'))


app.get('/', function (req, res) {
    if (req.protocol === 'https') {
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
    return (S4() + S4() + S4() + S4() +  S4() + S4() + S4());
}

app.post('/', jsonParser, (req, res) => {

    var count = 0
    var body = req.body
    var msg_id = body.json.msg_id
    var camera_name = body.json.data.camera_name
    var device_id = body.json.data.device_id
    var camera_name = body.json.data.camera_name
    var trigger = body.json.data.trigger.replace(/\s/g,'')
    var logPath = './log' + sep + device_id + sep + camera_name 
    try {
        fs.mkdirSync(logPath, { recursive: true });
    } catch (e) {
        console.log('Cannot create folder ', e);
    }
    //console.log(body)
    var uuid = guid()
    var fileName = msg_id + '-' + camera_name + '-' +  device_id + '-' + trigger + '-' + uuid
    console.log(fileName)
    count += 1
    // With a callback:
    fs.writeJson(logPath + sep + fileName + '.json', body, err => {
        if (err)
            return console.error(err)
        res.send('Dash push demo get post request.')
    })
})

//httpServer.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

//创建http服务器
httpServer.listen(PORT, function () {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});

//创建https服务器
httpsServer.listen(SSLPORT, function () {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});

