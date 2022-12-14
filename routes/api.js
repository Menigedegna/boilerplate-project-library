/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
//package to generate random book id
const { v4: uuidv4 } = require('uuid');

module.exports = function(app, Book) {
  
  app.route('/api/books')
    .get(function(req, res) {
      //response will be array of book objects
      Book.find({}, function(err, data) {
        if(err) return console.log(err);
        if(data) res.json(data);
      });
    })

    .post(function(req, res) {
      let title = req.body.title;

      //if title is provided
      if (title) {
        let book = {
          title: title,
          _id: uuidv4()
        };
        let bookComplete = {
          ...book,
          comments: [],
          commentcount: 0
        }
        const newBook = new Book(bookComplete);
        newBook.save(function(err, data) {
          if(err) return console.log(err);
          if(data){
            res.send(book);
          }
        });
      } //end if title is provided
      else {
        res.send("missing required field title")
      }
    })

    .delete(function(req, res) {
      // delete all books in the database
      Book.deleteMany((err, books) => {
        if (err) return console.log(err);
        console.log(books);
      });
      res.send("complete delete successful");
    });



  app.route('/api/books/:id')
    .get(function(req, res) {
      let bookid = req.params.id;
      
      Book.findById({_id: bookid}, function (err, bookFound) {
        if (err) return console.log(err);
        if(!bookFound) res.send("no book exists");
        if(bookFound){
          let searchResult = {
            title: bookFound["title"],
            _id: bookFound["_id"],
            comments: bookFound["comments"]
          };
          res.send(searchResult);
        }
      });
    })

    .post(function(req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //if comment is provided
      if (comment) {
        Book.findById({_id: bookid}, function (err, bookFound) {
          if (err) return console.log(err);
          //if book _id is not found
          if (!bookFound) res.send("no book exists");
          //if book _Id is found
          if( bookFound ){
            //add comment
            bookFound.comments.push(comment);
            //increment comment count
            bookFound.commentcount = bookFound.comments.length;
            //save changes
            bookFound.save(function(err, updatedBook) {
              if (err) return console.log(err);
              else{
                let searchResult = {
                  title: bookFound["title"],
                  _id: bookFound["_id"],
                  comments: bookFound["comments"]
                }
                res.send(searchResult);
              }
            });
          }//end if book is found
        });//end find book and update
      }//end if comment is provided
      else {
        res.send("missing required field comment")
      }
    })

    .delete(function(req, res) {
      let bookid = req.params.id;
      Book.findById({_id: bookid}, function(err, book){
        if(err) return console.log(err);
        if(!book) res.send("no book exists");
        if(book){
          book.remove();
          res.send("delete successful");
        }
      });
    });

};

