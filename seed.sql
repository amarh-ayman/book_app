DROP TABLE IF EXISTS books;
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  author VARCHAR(5000),
  title VARCHAR(5000),
  isbn VARCHAR(255),
  img VARCHAR(255),
  description TEXT

  -- unique (author,title,isbn) 
);
-- INSERT INTO books (author, title, isbn, img, description) 
-- VALUES('Frank Herbert','Dune','9780441013593','http://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api','Follows the adventures of Paul Atreides, the son of a betrayed duke given up for dead on a treacherous desert planet and adopted by its fierce, nomadic people, who help him unravel his most unexpected destiny.');
-- INSERT INTO books (author, title, isbn, img, description) 
-- VALUES('Frank Herbert22','Dune22','978044101359322','http://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api','Follows the adventures of Paul Atreides, the son of a betrayed duke given up for dead on a treacherous desert planet and adopted by its fierce, nomadic people, who help him unravel his most unexpected destiny.22');

