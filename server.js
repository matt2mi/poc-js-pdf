var express = require('express');
var bodyParser = require('body-parser');
var wkhtmltopdf = require('wkhtmltopdf');
var fs = require('fs');

var app = express();

//app.use(require('connect-livereload')({ port: 35729 }));
app.use(express.static(__dirname + '/src'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/',function(req,res){
    res.sendFile('/src/index.html');
});

app.post('/buildPDF', function(req,res){
    console.log(req.body.htmlToRender);

    ///TODO : handle promises
    fs.unlink('./generated_files/result.pdf', function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The pdf file was deleted!");

        wkhtmltopdf(req.body.htmlToRender, function(code, signal) {
            console.log(code);
            console.log(signal);
            fs.createWriteStream('./generated_files/result.pdf', function(err) {
                if(err) console.log(err);
                
                fs.readFile('./generated_files/result.pdf', function(err,data){
                    if(err){
                        res.json({'status':'error', msg:err});
                    }else{
                        res.writeHead(200, {"Content-Type": "application/pdf"});
                        res.write(data);
                        res.end();
                    }
                });
            });
        });
    });

});

app.listen(9000, function() {
    console.log("Listening on 9000");
});