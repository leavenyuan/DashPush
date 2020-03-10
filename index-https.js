const express = require('express')
const app = express()
const fs = require('fs-extra')
const bodyParser = require('body-parser')
const path = require('path')
const sep = path.sep;
const http = require('http')
const https = require('https')

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
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

app.post('/', jsonParser, (req, res) => {
    var eventTypeMap = {
        "1": "白名单比中",
        "2": "白名单异常",
        "4": "陌生人",
        "3": "黑名单告警",
        "5": "非活体攻击",
        "6": "密码攻击",
        "101": "人体抓拍记录",
        "102": "人体越线告警",
        "103": "人体区域闯入告警",
        "104": "车辆违停告警",
        "105": "车辆抓拍记录",
        "106": "非机动车抓拍记录",
    }
    var typeMap = {
        "1": "人脸",
        "2": "结构化"
    }

    var count = 0
    var body = req.body
    if (body.hasOwnProperty('eventType')) {
        var eventType = body.eventType
    }
    if (body.hasOwnProperty('type')) {
        var type = body.type
    }
    if (body.data.hasOwnProperty('deviceInfo')) {
        var deviceId = body.data.deviceInfo.device.deviceId
    }
    if (body.data.hasOwnProperty('taskInfo')) {
        var taskId = body.data.taskInfo.task.taskId
    }
    var logPath = './log' + sep + typeMap[type] + sep + eventTypeMap[eventType] + sep + deviceId + sep + taskId
    try {
        fs.mkdirSync(logPath, { recursive: true });
    } catch (e) {
        console.log('Cannot create folder ', e);
    }
    console.log("type:" + typeMap[type] + " eventType:" + eventTypeMap[eventType] + " deviceId: " + deviceId + " taskId:" + taskId)
    // var taskId = body.taskInfo.task.taskId
    // var trackId = body.detectInfo.faceInfo.trackId
    // var objectId = body.objectId
    // var capturedTime = body.detectInfo.capturedTime
    // var receivedTime = body.detectInfo.receivedTime
    // var quality = body.detectInfo.faceInfo.quality
    // var score = body.detectInfo.score
    var uuid = guid()
    // var fileName = taskId + "|" + trackId + "|" + objectId + "|" + capturedTime + "|" + receivedTime + "|" + quality + "|" + score + "|" + uuid
    var fileName = uuid
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

