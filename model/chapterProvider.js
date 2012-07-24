var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/1001nights');


var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Chapter = new Schema({
    id:         ObjectId,
    title:      String,
    paragraphs: [String],
    chapterNum: Number,
    rate:       Number
});

mongoose.model('Chapter', Chapter);
var Chapter = mongoose.model('Chapter');

ChapterProvider = function () {

    //Find all chapters
    this.findAll = function (callback) {
        Chapter.find({}, function (err, chapters) {
            callback(null, chapters)
        });
    };

    //Find all chapters
    this.findAllTitle = function (callback) {
        Chapter.find({}, ['title', 'chapterNum'], { sort: { chapterNum: 1 }}, function (err, titles) {
            callback(null, titles)
        });
    };

    //Find post by ChapterNum
    this.findByChapterNum = function (num, callback) {
        Chapter.findOne({chapterNum: num}, function (err, chapter) {
            if (!err) {
                callback(null, chapter);
            }
        });
    };

    this.search = function (text, callback) {
        var expr = new RegExp(/*'^.*' + */text/* + '.*$'*/, 'ig');
        Chapter.find({'paragraphs': expr}, function (err, chapters) {
            if (!err) {
                callback(null, chapters);
            }
        });
    };
};

exports.ChapterProvider = ChapterProvider;