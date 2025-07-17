import express from "express"
import pg from "pg"
import bodyParser from "body-parser"

const app=express();

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");

app.use(express.static("public"));

const db=new pg.Client({
    host:"localhost",
    user:"postgres",
    password:"Mahendra@7",
    port:5432,
    database:"booknotes"
});

db.connect();

app.get("/",async(req,res)=>{
    try{
        const result=await db.query("SELECT * FROM books ORDER BY id");
        const books_details=result.rows;
        res.render("index.ejs",{
            books_details:books_details,
        });
    }
    catch(err){
        console.log(err);
    }
});

app.get("/add",(req,res)=>{
    res.render("add.ejs");
});

app.post("/add",async(req,res)=>{
    const result=req.body;
    try{
        await db.query(`INSERT INTO books (book_title,date_read,summary,notes,rating,isbn,author) VALUES ($1,$2,$3,$4,$5,$6,$7)`,[result.book_title,result.date,result.summary,result.notes,result.rating,result.isbn,result.author]);
        res.redirect("/");
    }
    catch(err){
        console.log(err);
    }
    
});

app.get("/edit/:id",async(req,res)=>{
    const result=await db.query(`SELECT * FROM books WHERE id=$1`,[req.params.id]);
    const book = result.rows[0];
    book.date_read = new Date(book.date_read).toISOString().split('T')[0];
    res.render("edit.ejs", { books_details: [book] });
});

app.post("/edit/:id",async(req,res)=>{
    const result=req.body;
    const formattedDate = new Date(result.date).toISOString().split('T')[0];
    try{
        await db.query(
        `UPDATE books SET book_title=$1, date_read=$2, summary=$3, notes=$4, rating=$5, isbn=$6, author=$7 WHERE id=$8`,
        [result.book_title, formattedDate, result.summary, result.notes, result.rating, result.isbn, result.author, req.params.id]
        );
        res.redirect("/");
    }
    catch(err){
        console.log(err);
    }
});

app.get("/delete/:id",async(req,res)=>{
    try{
        await db.query(`DELETE FROM books WHERE id=$1`,[req.params.id]);
        res.redirect("/");
    }
    catch(err){
        console.log(err);
    }
});

app.get("/detail/:id",async(req,res)=>{
    try{
        const result=await db.query(`SELECT * FROM books WHERE id=$1`,[req.params.id]);
        const books_details=result.rows;
        res.render("detail.ejs",{
            books_details:books_details,
        });
    }
    catch(err){
        console.log(err);
    }
});

app.get("/sortbytitle",async(req,res)=>{
    try{
        const result=await db.query("SELECT * FROM books ORDER BY book_title ASC");
        const books_details=result.rows;
        res.render("index.ejs",{
            books_details:books_details,
        });
    }
    catch(err){
        console.log(err);
    }
});

app.get("/sortbydate",async(req,res)=>{
    try{
        const result=await db.query("SELECT * FROM books ORDER BY date_read DESC");
        const books_details=result.rows;
        res.render("index.ejs",{
            books_details:books_details,
        });
    }
    catch(err){
        console.log(err);
    }
});

app.get("/sortbyrating",async(req,res)=>{
    try{
        const result=await db.query("SELECT * FROM books ORDER BY rating DESC");
        const books_details=result.rows;
        res.render("index.ejs",{
            books_details:books_details,
        });
    }
    catch(err){
        console.log(err);
    }
});

app.listen(3000,()=>{
    console.log("Server is running successfully on port 3000");
});