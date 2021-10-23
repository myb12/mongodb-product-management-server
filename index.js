const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://mydbuser1213:I6LCQjMTFX7VpKqf@cluster0.ig1ef.mongodb.net/productManagement?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db("productManagement");
        const productCollection = database.collection("productCollection");

        // GET API 
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();

            res.send(products);
        });

        // GET single item API 
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const product = await productCollection.findOne(query);
            res.send(product);
        })
        // POST API 
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);

            res.json(result);
        })

        // UPDATE API
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    title: updatedProduct.title,
                    price: updatedProduct.price,
                    quantity: updatedProduct.quantity
                },
            };

            const result = await productCollection.updateOne(filter, updateDoc, options);

            res.json(result);
        })

        //DELETE API
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await productCollection.deleteOne(query);

            console.log('hitting delete', result);

            res.json(result);
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

// app.get('/', (req, res) => {
//     res.send('kuluk');
// })


app.listen(port, () => {
    console.log('listening to port', port);
})




/* username: myuser1213
password: I6LCQjMTFX7VpKqf */