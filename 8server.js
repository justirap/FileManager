const express = require('express');
const app = express();
const PORT = process.env.PORT||3000;
const path = require('path');
app.use(
  express.urlencoded({
    extended: true,
  })
);

var hbs = require('express-handlebars');
var formidable = require('formidable');
var context = {
  tab: [],
  info: [],
  id: []
}
console.log(context);

app.listen(PORT, function () {
  console.log('start serwera na porcie ' + PORT);
});

app.set('views', path.join(__dirname, 'views')); // ustalamy katalog views
app.engine('hbs', hbs({
  defaultLayout: 'main.hbs',
  helpers: {
    indeks: function (index) {
      index++;
      return index;
    },
    zdjecie: function (type) {
      if (type == "image/jpeg") {
        return "gfx/jpg.png"
      }
      else if (type == "text/plain") {
        return "gfx/txt.png"
      }
      else return "gfx/znak.png"
    }
  }
})); // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');

app.use(express.static('static'));

let tablica = [];


app.get('/', function (req, res) {
  res.render('upload.hbs');
});
app.get('/filemanager', function (req, res) {
  if (req.query.usun) {
    context.tab = [];
    res.render('filemanager.hbs', context);
  }
  else if (req.query.id) {
    console.log(req.query.id);
    if (req.query.a == "d") {
      for (var i = 0; i < context.tab.length; i++) {
        if (i == req.query.id) {
          context.tab.splice(i, 1);
          res.render('filemanager.hbs', context);
        }
      }
    }
    else if (req.query.a == "i") {
      for (var i = 0; i < context.tab.length; i++) {
        if (i == req.query.id) {
          context.info = [];
          context.info = (context.tab[i]);
          context.id = parseInt(req.query.id) + 1;
          console.log(context.tab);
          res.render('info.hbs', context);
        }
      }
    }
    else if (req.query.a == "dow") {
      for (var i = 0; i < context.tab.length; i++) {
        if (i == req.query.id) {
          var plik = (context.tab[i]);
          var sciezka = plik.path;
          sciezka = sciezka.toString();
          console.log(sciezka);
          sciezka = sciezka.split("upload");
          sciezka = (sciezka.pop());
          var plik = "./static/upload/upload" + sciezka.toString();
          res.download(plik);
          // res.render('filemanager.hbs', context);
        }
      }
    }
  }
  else {
    res.render('filemanager.hbs', context);
  }
});
app.get('/info', function (req, res) {
  res.render('info.hbs');
});

app.post('/handleUpload', function (req, res) {
  console.log(req.body);
  let form = formidable({});
  form.keepExtensions = true;
  form.multiples = true;
  form.uploadDir = './static/upload/';

  form.parse(req, function (err, fields, files) {
    if (Array.isArray(files.filename)) {
      for (var i = 0; i < files.filename.length; i++) {
        context.tab.push(files.filename[i]);
      }
    } else {
      context.tab.push(files.filename)

    }
  });

  res.render('upload.hbs');
});


