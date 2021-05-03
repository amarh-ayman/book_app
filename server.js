'use strict';
require('dotenv').config();
const express = require('express');
const server = express();
const superagent = require('superagent');

server.set('view engine', 'ejs');
server.use(express.static('./public'));
server.use(express.static('./img'));

server.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

/*-----------------Start web pages-----------------*/
server.get('/', homePage);
server.get('/new', resultPage);
server.post('/searches', searchPage);
server.get('*', (req, res) =>
  res.render('pages/error', { error: 'Page not availabe 404 ERRoR' })
);
server.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});

/*-----------------End web pages-----------------*/

/*--------------start functions Handler----------------*/
function homePage(req, res) {
  res.render('pages/index'); ///render for the ejs ,and dont out ext ,the engie will consider what u mean
}
function resultPage(req, res) {
  res.render('pages/searches/new');
}

function searchPage(req, res) {
  let searchbox = req.body.searching;
  let checkbox = req.body.check;
  let bookURL = `https://www.googleapis.com/books/v1/volumes?q=${searchbox}:${checkbox}`;
  superagent
    .get(bookURL)
    .then(bookData => {
      let bookStoreInfo = bookData.body.items.map(item => new BOOKS(item));
      res.render('pages/searches/show', { booKDataArray: bookStoreInfo });
    })
    .catch(err => {
      res.render('pages/error', { error: err });
    });
}
/*--------------End functions Handler----------------*/

/*------------------render books for show page----------------*/
function BOOKS(item) {
  this.img =
    item.volumeInfo.imageLinks.smallThumbnail ||
    item.volumeInfo.imageLinks.thumbnail ||
    `https://i.imgur.com/J5LVHEL.jpg`;
  this.title = item.volumeInfo.title || 'not avaliable';
  this.author = item.volumeInfo.authors || 'not avaliable';
  this.description = item.volumeInfo.description || 'not avaliable';
}
