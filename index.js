const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const app = express();
app.use(express.json());
var database;

app.get("/product", (req, res) => {
  database
    .collection("product")
    .find({})
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

app.get("/product/:id", (req, resp) => {
  database
    .collection("product")
    .find({ product: req.params.id })
    .toArray((err, result) => {
      if (err) throw err;
      resp.send(result);
    });
});

app.post("/product/addproduct", (req, resp) => {
  let res = database.collection("product").find({}).sort({ id: -1 }).limit(1);
  res.forEach((obj) => {
    if (obj) {
      let product1 = {
        product: req.body.product,
        price: req.body.price,
      };
      database.collection("product").insertOne(product1, (err, result) => {
        if (err) resp.status(500).send(err);
        resp.send("Added Successfully");
      });
    }
  });
});

app.put("/product/:id", (req, resp) => {
  let product1 = {
    price: req.body.price,
  };
  database
    .collection("product")
    .updateOne(
      { product: req.params.id },
      { $set: product1 },
      (err, result) => {
        if (err) throw err;
        resp.send(product1);
      }
    );
});

app.delete("/product/:id", (req, resp) => {
  database
    .collection("product")
    .deleteOne({ product: req.params.id }, (err, result) => {
      if (err) throw err;
      resp.send("Product is deleted");
    });
});

app.listen(8080, () => {
  MongoClient.connect(
    "mongodb://localhost:27017",
    { useNewUrlParser: true },
    (error, result) => {
      if (error) throw error;
      database = result.db("store");
      console.log("connection sucessful");
    }
  );
});
