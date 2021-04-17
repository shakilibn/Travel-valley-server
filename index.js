const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express()
app.use(bodyParser.json());
app.use(cors());
bodyParser.urlencoded({ extended: false })

const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.llhcr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("travelValley").collection("services");
  const adminCollection = client.db("travelValley").collection("admin");
  const reviewCollection = client.db("travelValley").collection("review");
  const bookingsCollection = client.db("travelValley").collection("bookings");
  const guidesCollection = client.db("travelValley").collection("guides");
  const destinationsCollection = client.db("travelValley").collection("destinations");

  //api for add service in mongodb
  app.post('/addService', (req, res) => {
    const newService = req.body;
    servicesCollection.insertOne(newService)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  //api for get services
  app.get('/services', (req, res) => {
    servicesCollection.find()
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  //api for get specific service by id
  app.get('/service/:serviceId', (req, res) => {
    const serviceId = ObjectId(req.params.serviceId);
    servicesCollection.find({ _id: serviceId })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })

  //api for add admin
  app.post('/addAdmin', (req, res) => {
    const newAdmin = req.body;
    adminCollection.insertOne(newAdmin)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  //api for get admin
  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({email: email})
    .toArray((err, documents) =>{
      res.send(documents.length > 0)
    })
  })

  //api for post review
  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    reviewCollection.insertOne(newReview)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  //api for get review
  app.get('/reviews', (req, res) => {
    reviewCollection.find()
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  //api for post booking
  app.post('/addBooking', (req, res) => {
    const newBooking = req.body;
    bookingsCollection.insertOne(newBooking)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  //api for get specific bookings by email for user
  app.get('/bookings', (req, res) => {
    bookingsCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  //api for get All bookings for Admin
  app.get('/allBookings', (req, res) => {
    bookingsCollection.find()
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  //api for get specific booking by id for Admin to modify status
  app.patch('/update/:itemId', (req, res) => {
    const id = req.params.itemId;
    bookingsCollection.updateOne({ _id: ObjectId(id) }, {
      $set: { status: req.body.value }
    })
      .then(result => {
        res.send(result.modifiedCount > 0)
      })
  })

  // api for delete service
  app.delete('/delete', (req, res) => {
    const id = req.query.id;
    servicesCollection.deleteOne({_id: ObjectId(id)})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
  })

   //api for add Guide in mongodb
   app.post('/addGuide', (req, res) => {
    const newGuide = req.body;
    guidesCollection.insertOne(newGuide)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  //api for get guides
  app.get('/guides', (req, res) => {
    guidesCollection.find()
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

    //api for add destination in mongodb
    app.post('/addDestination', (req, res) => {
      const newDestination = req.body;
      destinationsCollection.insertOne(newDestination)
        .then(result => {
          res.send(result.insertedCount > 0)
        })
    })
  
    //api for get destinations
    app.get('/destinations', (req, res) => {
      destinationsCollection.find()
        .toArray((err, documents) => {
          res.send(documents)
        })
    })
});


app.listen(process.env.PORT || port)