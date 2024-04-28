const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uj1q2ho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const islandCollection = client.db("islandDB").collection("island")

    app.get('/images', async (req, res) => {
      const cursor = islandCollection.find()
      const result = await cursor.toArray();
      res.send(result)
    });

    app.post('/images', async (req, res) => {
      const newImage = req.body;
      const result = await islandCollection.insertOne(newImage);
      res.send(result);
    });
    
    app.get('/images/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await islandCollection.findOne(query)
      res.send(result)
    })

    app.get('/double/:name', async(req, res)=>{
      const name = req.params.name;
      const result = await islandCollection.find({countryName : name}).toArray();
      res.send(result);
    })

    app.get('/sorted', async(req, res)=>{
      const sortedData = islandCollection.find().sort({totalVisitor : 1});
      const result = await sortedData.toArray()
      res.send(result)
    });

    app.get('/myList/:email', async (req, res) => {
      // console.log(req.params.email)
      const result = await islandCollection.find({ userEmail: req.params.email }).toArray();
      res.send(result)
    });


    app.get('/singleData/:id', async (req, res) => {
      console.log(req.params.id)
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await islandCollection.findOne(query);
      res.send(result)
    });

    app.put('/update/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const update = {
        $set: {
          touristName: updatedCoffee.touristName,
          countryName: updatedCoffee.countryName,
          supplier: updatedCoffee.supplier,
          location: updatedCoffee.location,
          photo: updatedCoffee.photo,
          averageCost: updatedCoffee.averageCost,
          seasonality: updatedCoffee.seasonality,
          travelTime: updatedCoffee.travelTime,
          totalVisitor: updatedCoffee.totalVisitor,
          description: updatedCoffee.description
        }
      }
      const result = await islandCollection.updateOne(filter, update, options);
       res.send(result);
    });

    app.delete('/singleData/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await islandCollection.deleteOne(query);
      res.send(result)
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
  res.send('welcome our Island-Hopper-server')
});

app.listen(port, () => {
  console.log('this Island-Hopper-server port is running', port);
})