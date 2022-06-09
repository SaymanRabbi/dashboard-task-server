const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors');
app.use(cors());
app.use(express.json());
require('dotenv').config()
//done

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0rbfs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const UserCollection = client.db("UsersCollection").collection("users");
        //get all users
        app.get('/employee', async (req, res) => {
            const employee = await UserCollection.find().toArray();
            res.send(employee);
        })
        app.post('/employeeadd', async (req, res) => {
            const data = req.body;
            const employee = await UserCollection.insertOne(data);
            res.send({ messages: 'success' });
        })

        //update user
        app.put('/employee/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    avatar: data.avatar, first_name: data.first_name, last_name: data.last_name, email: data.email
                }
            };
            const result = await UserCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})