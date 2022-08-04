var express = require('express');
var router = express.Router();

router.post('/listBuckets', function(req, res){
    console.log('Got list buckets request');
    listBuckets();
});

router.post('/login', function(req, res){
    console.log('Got login request');
    let content = {'data' : 'The server recieved your login request!'};
    res.send(content)
    console.log('  Sent response')
});

module.exports = router;