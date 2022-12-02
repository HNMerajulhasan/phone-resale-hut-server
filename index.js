const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { query } = require("express");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());


 //const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yalqvm0.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0vbsoxh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri);


function varifyJWT(req, res, next) {
  //   console.log("Token inside verifyJWT", req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("Unauthorized Access");
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      res.status(403).send({ message: "Forbidden Access" });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    const AllCategory = client.db("mobileHut").collection("AllCategories");
    const AllProducts = client.db("mobileHut").collection("AllProducts");
    const userCollection = client.db("mobileHut").collection("users");
    const bookingCollection = client.db("mobileHut").collection("bookings");

    app.get("/category", async (req, res) => {
      const query = {};
      const options = await AllCategory.find(query).toArray();
      res.send(options);
    });
    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { categoryId: id };
      const products = await AllProducts.find(query).toArray();
      res.send(products);
    });

  //   app.get('/category/:id',async(req,res)=>{
  //     const id=req.params.id;
  //     const query={_id:ObjectId(id)};
  //     const products=await AllCategory.findOne(query);
  //     res.send(products);
  //  });

    app.post("/products", async (req, res) => {
      const products = req.body;
      const result = await AllProducts.insertOne(products);
      res.send(result);
    });