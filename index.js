const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const app = express()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors())
app.use(express.json())

// mongodb connection 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eyzkx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const database = client.db("todolist");
        const noteCollection = database.collection("notes");


        // send data to the server 
        app.post('/notes', async (req, res) => {
            const note = req.body;
            const result = await noteCollection.insertOne(note)
            res.send(result)
        })



        // get the data according to the user
        app.get('/notes/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const result = await noteCollection.find({}).toArray()
            res.send(result)
        })




        // delete the task
        app.delete("/notes/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await noteCollection.deleteOne(query)
            res.send(result)
        })


    }
    finally { }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send("Note App")
})
app.listen(port, () => {
    console.log("app listening")
})