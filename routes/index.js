var express = require('express');
var request = require('request')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/giphy', function(req, res, next) {
	var url = 'https://api.giphy.com/v1/gifs/search?q='+ req.query.keyword + '&api_key=dc6zaTOxFJmzC'
	var response = {};
	request.get(url, {}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body)['data'];
			var response_link = data[Math.floor(Math.random() * (data.length - 0 + 1)) + 0]['url'];
            response = {'type': 'giphy', 'data': response_link, 'result': 'success'}
        } else {
        	response = {'type': 'giphy', 'data': 'no data', 'result': 'failure'}
        }
        res.send(JSON.stringify(response));
	})
	
});

router.get('/youtube', function(req, res, next) {
	mod_input = req.query.keyword.replace(" ", "+")
    API_key = 'AIzaSyBQB5ELmm4MbpQUJLT3xR9rfyhYFEksgvc'
    url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + mod_input + "&key=" + API_key
    var response = {};
	request.get(url, {}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body)['items'];
			if (data.length > 0) {
				video_id = data[0]['id']['videoId'];
				var url = 'https://www.youtube.com/watch?v=' + video_id;
            	response = {'type': 'youtube', 'data': url, 'result': 'success'}
			} else {
				response = {'type': 'youtube', 'data': 'no data', 'result': 'failure'}
			}
        } else {
        	response = {'type': 'youtube', 'data': 'no data', 'result': 'failure'}
        }
      	res.send(JSON.stringify(response));
	})
});

router.get('/youtube/list', function(req, res, next) {
	mod_input = req.query.keyword.replace(" ", "+")
    API_key = 'AIzaSyBQB5ELmm4MbpQUJLT3xR9rfyhYFEksgvc'
    url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + mod_input + "&key=" + API_key
    var response = {};
    request.get(url, {}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body)['items'];
			link_list = [];
			data.forEach(function (element) {
				if (element['id']['kind'] === "youtube#video") {
					link_list.push(element['snippet']['title'], 'https://www.youtube.com/watch?v=' + element['id']['videoId'])
				}
			});
            response = {'type': 'youtube', 'data': link_list, 'result': 'success'}
        } else {
        	response = {'type': 'youtube', 'data': 'no data', 'result': 'failure'}
        }
        res.send(JSON.stringify(response));
	})
});

module.exports = router;
