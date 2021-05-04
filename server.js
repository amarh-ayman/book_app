'use strict';
require('dotenv').config();
const express = require('express');
const server = express();
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
server.set('view engine', 'ejs');
server.use(express.static('./public'));
server.use(express.static('./img'));

server.use(express.urlencoded({ extended: true }));
server.use(cors());
const PORT = process.env.PORT || 3000;
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

server.get('/', (req, res) => {
  let SQL = `SELECT * FROM books`;
  client
    .query(SQL)
    .then(result => {
      res.render('./pages/index', { booksChosen: result.rows });
    })
    .catch(err => {
      res.render('pages/error', { error: err });
    });
});

server.get('/searches/new', (req, res) => {
  res.render('pages/searches/new');
});

server.post('/searches', (req, res) => {
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
});

server.post('/books', (req, res) => {
  let { img, title, author, description, isbn } = req.body;
  let SQL = `INSERT INTO books (img ,title, author ,description ,isbn) VALUES ($1,$2,$3,$4,$5) RETURNING *;`;

  let safeValues = [img, title, author, description, isbn];

  client
    .query(SQL, safeValues)
    .then(result => {
      res.redirect(`/books/${result.rows[0].id}`);
    })
    .catch(err => res.render('pages/error', { error: err }));
});

server.get('/books/:id', (req, res) => {
  let SQL = `SELECT * FROM books WHERE id=$1;`;
  let safeValues = [req.params.id];
  client
    .query(SQL, safeValues)
    .then(result => {
      res.render('./pages/books/show', { bookViewDetailes: result.rows[0] });
    })
    .catch(err => res.render('pages/error', { error: err }));
});

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
  this.isbn = `${item.volumeInfo.industryIdentifiers[0].type || 'ISBN'}  : ${
    item.volumeInfo.industryIdentifiers[0].identifier || 'not avaliable'
  }`;

  // console.log(
  //   item.volumeInfo.industryIdentifiers[0].identifier || 'not avaliable'
  // );
  // console.log(this.isbn);
}

/************the most dangerous command , so it must be in the bottom******************** */
client.connect().then(() => {
  server.listen(PORT, () => {
    console.log(`listening to PORT ${PORT}`);
  });
});

server.get('*', (req, res) =>
  res.render('pages/error', { error: 'Page not availabe 404 ERRoR' })
);
