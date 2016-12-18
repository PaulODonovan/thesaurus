var express = require('express'),
	thesaurus = require("thesaurus"),
    cors = require('cors'),
    app = express(),
	synsFound = [],
    router = new express.Router();
	app.set('port', process.env.PORT || 3500);
	router.get('/lookup', cors({credentials: true, origin: true}), function(req, res) {
		var w = req.query.word;
		console.log('w:' + w);
		synsFound = thesaurus.find(w);
		res.json(synsFound);
	});
app.use('/', router);
var server = app.listen(app.get('port'), function() {
    console.log('Server up: http://localhost:' + app.get('port'));
});