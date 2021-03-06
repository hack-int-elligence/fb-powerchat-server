var express = require('express');
var request = require('request')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/giphy', function(req, res, next) {
    if (req.query.keyword) {
        var url = 'https://api.giphy.com/v1/gifs/search?q='+ req.query.keyword + '&api_key=dc6zaTOxFJmzC';
        var response = {};
        request.get(url, {}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body)['data'];
                if (data.length > 0) {
                    var response_link = data[Math.floor(Math.random() * (data.length - 0 + 1)) + 0]
                    if (response_link) {
                    	response = {'type': 'giphy', 'data': response_link['embed_url'], 'result': 'success'};
                    } else {
                    	response = {'type': 'giphy', 'data': 'no data', 'result': 'failure'};
                    }
                } else {
                    response = {'type': 'giphy', 'data': 'no data', 'result': 'failure'};
                }
            } else {
                response = {'type': 'giphy', 'data': 'no data', 'result': 'failure'};
            }
            res.send(JSON.stringify(response));
        });
    } else {
        res.send(JSON.stringify({'type': 'giphy', 'data': 'no data', 'result': 'failure'}));
    }

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
					link_list.push([element['snippet']['title'], 'https://www.youtube.com/watch?v=' + element['id']['videoId']])
				}
			});
            response = {'type': 'youtube', 'data': link_list, 'result': 'success'}
        } else {
        	response = {'type': 'youtube', 'data': 'no data', 'result': 'failure'}
        }
        res.send(JSON.stringify(response));
	})
});

router.get('/instagram', function(req, res, next) {
	tag = req.query.keyword.replace(" ", "+")
    clientKey = '39cf0d72a0e44fcc85d1b92cdc611ee3'
    url = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?client_id=" + clientKey
	request.get(url, {}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body)['data'];
			if (data.length > 0) {
				var url = data[0]['link'] + 'embed'
				response = {'type': 'instagram', 'data': url, 'result': 'success'}
			} else {
				response = {'type': 'youtube', 'data': 'no data', 'result': 'failure'}
			}
        } else {
        	response = {'type': 'instagram', 'data': 'no data', 'result': 'failure'}
        }
      	res.send(JSON.stringify(response));
	})
});

router.get('/stream/:filename', function(req, res, next) {

	var filename = req.params.filename;
	if (global[filename]) {
		console.log(global[filename]);
		global[filename].pipe(res);
	}
    // fs.createReadStream(filename).pipe(res);
});

module.exports = router;
