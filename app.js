var express = require('express');
var http = require('http');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 8080);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

var ChapterProvider = require('./model/chapterProvider').ChapterProvider;
var ChapterProvider = new ChapterProvider();


app.get('/', function (req, res) {
    ChapterProvider.findAllTitle(function (error, titles) {
        res.render('index', { title: '1001 Nights', contents: titles });
    });
});
app.get('/:id', function (req, res) {
    ChapterProvider.findByChapterNum(req.params.id, function (error, _chapter) {
        res.render('chapter', { title: '1001 Nights - ' + _chapter.title, chapter: _chapter });
    });
});

app.post('/search', function (req, res) {
    res.redirect('/search/' + req.param('search'));
});

app.get('/search/:text', function (req, res) {
    ChapterProvider.search(req.params.text, function (error, _chapters) {
        var startTime = new Date().getTime();
        var expr = new RegExp(req.params.text, 'ig');
        _paragNums = [];
        for (var i = 0; i < _chapters.length; i++) {
            var max = 0;
            var paragNum = 0;
            for (var j = 0; j < _chapters[i].paragraphs.length; j++) {
                var matches = _chapters[i].paragraphs[j].match(expr);
                if (matches) {
                    var tempMatchCount = matches.length;
                    if(tempMatchCount > max) {
                        max = tempMatchCount;
                        paragNum = j;
                    }
                }
            }
            _chapters[i].paragraphs[paragNum] = _chapters[i].paragraphs[paragNum].replace(expr, '<b style="color: rgb(0, 41, 255);">' + req.params.text + '</b>');
            _paragNums.push(paragNum);
        }
        console.log(new Date().getTime() - startTime);
        res.render('search', { title: req.params.text, paragNums: _paragNums, chapters: _chapters });
    });
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
