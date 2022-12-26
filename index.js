const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.winrso3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        const productCollection = client.db('moontech').collection('product');
        app.get('/product', async (req, res) => {
            const product = await productCollection.find({}).toArray();
            res.send(product);
        });
        app.post('/product', async (req, res) => {
            const body = req.body;
            const result = await productCollection.insertOne(body);
            res.send(result);
        });
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const result = await productCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        });
    }
    finally { }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World !');
});

app.listen(port, () => console.log('Listing to port', port))