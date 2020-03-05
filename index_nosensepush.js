const express = require('express')
const app = express()
const port = 3000
const fs = require('fs-extra')
const bodyParser = require('body-parser')

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

fs.removeSync('./log');
fs.mkdirSync('./log')

app.get('/', (req, res) => res.send('Dash push demo has been started.'))

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
    var deviceName = body.deviceInfo.device.deviceName
    var uuid = guid()
    var fileName = taskId + "|" + trackId + "|" + objectId + "|" + capturedTime + "|" + receivedTime + "|" + quality  + "|" + score + "|" + deviceName + "|" + uuid
    console.log(fileName)
    var i = i + 1
    // With a callback:
    fs.writeJson('./log/' + fileName + '.json', body, err => {
        if (err)
            return console.error(err)
        res.send('Dash push demo get post request.')
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
