/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = "https://boilerplate-project-library.mariamawitashen.repl.co";
let testData = JSON.parse(process.env.TEST_DATA);

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('Routing tests', function() {
    this.timeout(1500);
    suite('POST /api/books with title => create book object/expect book object', function() {
      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .post("/api/books")
          .send({
            title: "BookTitle"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.title, "BookTitle");
            assert.isString(res.body["_id"]);
            done();
          })
      })

      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post("/api/books")
          .send({
            title: ""
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "text/html");
            assert.equal(res.text, "missing required field title");
            done();
          })
      });
    });


    suite('GET /api/books => array of books', function() {
      test('Test GET /api/books', function(done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.length, 1);
            assert.equal(res.body[0].title, "Book1");
            done();
          })
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function() {
      test('Test GET /api/books/[id] with id not in db', function(done) {
        chai
          .request(server)
          .get("/api/books/10")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "text/html");
            assert.deepEqual(res.text, "no book exists");
            done();
          })
      });

      test('Test GET /api/books/[id] with valid id in db', function(done) {
        let expectedResult = { ...testData };
        delete expectedResult["commentcount"];
        chai
          .request(server)
          .get("/api/books/5452121")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, expectedResult);
            done();
          })
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function() {
      test('Test POST /api/books/[id] with comment', function(done) {
        let expectedResult = { ...testData };
        let comment = "Even better than before";
        expectedResult["comments"].push(comment);
        delete expectedResult["commentcount"];

        chai
          .request(server)
          .post("/api/books/5452121")
          .send({
            comment: comment
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, expectedResult);
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done) {
        chai
          .request(server)
          .post("/api/books/5452121")
          .send({
            comment: ""
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "text/html");
            assert.equal(res.text, "missing required field comment");
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done) {
        chai
          .request(server)
          .post("/api/books/10")
          .send({
            comment: "Even better still"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "text/html");
            assert.equal(res.text, "no book exists");
            done();
          })
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function() {
      test('Test DELETE /api/books/[id] with valid id in db', function(done) {
        chai
          .request(server)
          .delete("/api/books/5452121")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "text/html");
            assert.equal(res.text, "delete successful");
            done();
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done) {
        chai
          .request(server)
          .delete("/api/books/10")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "text/html");
            assert.equal(res.text, "no book exists");
            done();
          })
      });

    });

  });

});
