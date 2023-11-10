const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 3005;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


//defining mongoose schema

var books_schema = new mongoose.Schema({
    title : String,
    author : String,
    summary : String,
    id : Number
} )

//creating a model

const books_data = mongoose.model('books_data' , books_schema);

//connecting to mongoose

mongoose.connect('mongodb+srv://radadiyaDhruti:as145%40Dh@dhrutin.vced37w.mongodb.net/books_data' ,
 {
    dbName: "books_data"
  });
  
// creating crud API's

// getting list of books

app.get('/lists_of_books', ()=>{
    books_data.find({})
    .then(books=>
        {console.log(books);
        })
        .catch(err =>{
            console.error(err);
            console.log("internal server error");
        })
    }
)

//posting book details

var counter = 0;
app.post('/addBook', (req , res) => {

    var newBook = {
        title : req.body.title,
        author : req.body.author, 
        summary :  req.body.summary,
        id: counter
    }
    counter++; 
    var bookData = new books_data(newBook);
    bookData.save().then(savedData => {
        console.log('Data saved to MongoDB:', savedData);
        res.send(savedData);
    })
    .catch(error => {
        console.error('Error saving data:', error);
    });
})

//get book details by id

app.get('/book/:id',(req,res) => {
    var bookId = req.params.id;
    books_data.findById(bookId)
    .then(book => {
        
        if(book){
            console.log(book);
            res.send(book);
        } else{
            res.send("book not found");
        }
       
    })
        .catch(err => {
           console.error('error on fetching book',err) 
        })
    })

   // getting and updating book details by Id

app.put('/bookUpdate/:id' ,(req ,res)=>{
    const bookId = req.params.id;
    var updation = {
        title:req.body.title,
        summary : req.body.summary,
        author: req.body.author
    }
    books_data.findOneAndUpdate(
        { _id: bookId },
        updation,
        { new: true, useFindAndModify: false },
    ).then(updatedBook => {
        if (updatedBook) {
            console.log('Book updated:', updatedBook);
            res.send(updatedBook);
        } else {
            res.status(404).send('Book not found');
        }
    })
    .catch(err => {
        console.error('Error updating book:', err);
        res.status(500).send('Internal server error');
    });
});


//api to delete a book by Id

app.delete('/deleteBook/:id', (req , res)=>{
    const id = req.params.id;

        books_data.findOneAndDelete({_id:id})
        .then(bookid=>{
            if(bookid){
                res.send("successfully deleted book");
            }else{
                res.send("not able to delete book")
            }
            
        })
        .catch(error => {
            console.error("error on deleting data");
        })
        
    })
app.listen(PORT,()=>{
    console.log(`listening at port ${PORT}`)
})

