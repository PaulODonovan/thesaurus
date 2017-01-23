var express = require('express'),
	thesaurus = require("thesaurus"),
	Lemmer = require('lemmer');
    cors = require('cors'),
    app = express(),
    results = [],
    synsFound = [],
    totalSynsFound = [];
    router = new express.Router();
	app.set('port', process.env.PORT || 3500);
	router.get('/lookup', cors({credentials: true, origin: true}), function(req, res) {
		totalSynsFound = [];
		// console.log('server called');
		// console.log('req.query.words: ' + req.query.words);
		var reqQueryWords = req.query.words.split(' ');
		var newReqQueryWords = [];
		var customCount = 0;
		reqQueryWords.forEach(function(x){
			if(x.length>0){
				newReqQueryWords.push(x);
			}
		});
		reqQueryWords = newReqQueryWords;
		// console.log('reqQueryWords: ' + reqQueryWords);
		var reqQueryWordsLen = reqQueryWords.length;
		// console.log('reqQueryWordsLen: ' + reqQueryWordsLen);
		reqQueryWords.forEach(function(w){
			if(w.length>0){
				Lemmer.lemmatize(w, function(err, word){
					if(err){
						console.log('lemma err: ' + err);
					}
					if(word.length>0){
						var word = word[0];
						// console.log('lemma: ' + word);
						synsFound = thesaurus.find(word);
						// console.log('synsFound.length for lemma: ' + synsFound.length);
						if(synsFound.length===0){
							// synsFound = thesaurus.find(w);
							synsFound = thesaurus.find(w);
							// console.log('synsFound.length for w: ' + synsFound.length);
							if(synsFound.length===0){
								//just return the keyword itself for now
								totalSynsFound = addUniqueToBunch([w], totalSynsFound);
								// console.log('no synsFound');
							}
						}
						if(synsFound.length>0){
							totalSynsFound = addUniqueToBunch(synsFound, totalSynsFound);
						}else{
							// console.log('!synsFound.length>0');
						}
					}else{
						// console.log('!word.length>0');
					}
					// customCount++;
					// // console.log('customCount: ' + customCount);
					// var perCntDone = customCount / reqQueryWordsLen;
					// perCntDone = (Math.floor(perCntDone*100) + '%');
					// console.log(perCntDone);
					if(customCount===reqQueryWordsLen){		
						// console.log('got here!!!!!!!!!!!!!!!!!!!!!!!!');
						if(totalSynsFound.length>0){
							// console.log('totalSynsFound.length: ' + totalSynsFound.length);
							sendBackSyns(totalSynsFound, res);
						}
					}

				});
			}
		});
		console.log('req.headers.host: ' + req.headers.host);
	});

app.use('/', router);

var server = app.listen(app.get('port'), function() {
    console.log('Server up: http://localhost:' + app.get('port'));
});


function addUniqueToBunch(newArr, bigArr){
	// console.log('addUniqueToBunch called');
	for(j=0;j<newArr.length;j++){
		var wrd = newArr[j];
		if(bigArr.indexOf(wrd)===-1){
			bigArr.push(wrd);
		}
	}
	return bigArr;
}

function sendBackSyns(synsFound, res){
	console.log('sendBackSyns called');
	res.json(synsFound);
	synsFound = [];
}