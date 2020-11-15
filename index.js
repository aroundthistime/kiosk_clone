import express from "express";
import path from "path";
const app = express();

const PORT = 5000;

const handleListening = () =>
  console.log(`✅ Listening on https://localhost/${PORT}`);

let db = [];
let number = 1;

app.listen(PORT, handleListening);
app.set('view engine', 'pug');
app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "static")));
app.get("/", (req, res) => res.render("index"));
app.get("/order", (req, res) => res.render("order"));
app.get("/alert", (req, res) => res.render("alert"));
app.post("/api", (req, res) => {
  db.push(number);
  res.json(number);
  number += 1;
  res.end();
}); // just an example, in the real case you don't need axios to send orders.

app.get("/api", (req, res) => {
  res.json(db);
  res.end();
})

app.get("/api/alert", (req, res) => {
  res.json(db);
  res.end();
})

app.get("/api/alert/:id", (req, res) => {
  res.json(db);
  res.end();
})

app.post("/api/alert/:id", (req, res) => {
  const {
    params : {id}
  } = req;
  const index = db.indexOf(id);
  if (index > -1){
    db.splice(index, 1);
  }
  res.end();
})