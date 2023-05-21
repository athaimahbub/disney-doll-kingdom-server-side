const express = require ('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express ();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jgqhclb.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const dollCollection = client.db('dollDB').collection('doll');
    const addToyCollection = client.db('dollDB').collection('addToy');

    app.get('/toy', async(req,res) =>{
        const cursor = dollCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/toy/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const options = {
        projection: {toy_name: 1, price: 1,sub_category: 1},
      };
      const result = await dollCollection.findOne(query, options);
      res.send(result);
    })


    // Add Toy

    app.get('/addToy', async(req,res) =>{
      console.log(req.query.email);
      let query = {};
      if(req.query ?.email){
        query = {email: req.query.email}
        console.log(query);

      }
      const result = await addToyCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/addToy', async(req,res) => {
      const addToy = req.body;
      console.log(addToy);

      const result = await addToyCollection.insertOne(addToy);
      res.send(result);
    })

    app.patch('/addToy/:id', async(req,res) => {
         
         const id = req.params.id;
         const filter = {_id: new ObjectId(id)}
         const updateToy = req.body;
         console.log(updateToy);
         const updateDoc = {
           $set: {
              status:updateToy.status
           },
         }
    })

    // all Toys
    app.get('/addToy', async(req,res) =>{
      const cursor = addToyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

    app.get('/addToy/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const options = {
        projection: {tName: 1,sName:1, email:1,rating:1,quantity:1,detail:1, price: 1, toyPhoto: 1},
      };
      const result = await addToyCollection.findOne(query, options);
      res.send(result);
    })

    // Delete Operation

    app.delete('/addToy/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      
      const result = await addToyCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res) => {
    res.send('Toy market is opened')
})

app.listen(port, () => {
    console.log(`Disney Doll Kingdom is running on port ${port}`)
})