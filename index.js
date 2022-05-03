const express = require("express")
const app = express();
const pool = require('./db')
// const bodyParser = require('body-parser')

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));


app.use(express.json()); 
app.use(                
  express.urlencoded({
    extended: true,
  })
); 

//create 
app.post("/todos", async (req,res) => {
    try {
        console.log(req.body, "  body")
        const {description} = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES ($1) RETURNING *",
            [description]
        );
        res.json(newTodo)
    } catch (error) {
        console.log(error)
    }
})


//get
app.get("/todos/:id", async (req, res) => {
    const {id} = req.params;

    try {
        const todo = await pool.query("SELECT * FROM todo  WHERE todo_id = $1", [id])
        res.json(todo.rows[0])
    } catch (error) {
        console.log(error);
    }
})


// get all
app.get("/todos", async (req, res) => {
try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows)
} catch (error) {
    console.log(error.message);
}
});


//update
app.put("/todos/:id", async (req, res) =>{
    try {
        const {id} = req.params;
        const {description} = req.body;

        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2",
            [description,id]
        )
        res.json("Todo updated");
    } catch (error) {
        console.log(error);
    }
})


//delete 
app.delete("/todos/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const deleteTodo = await pool.query(
            "DELETE FROM todo WHERE todo_id = $1",
            [id]
        )
        res.json("Todo was deleted")
    } catch (error) {
        console.log(error);
    }
})


app.listen(3000, () => {
    console.log("server is running 3000 ...");
})