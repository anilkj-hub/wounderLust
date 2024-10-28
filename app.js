const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const connection = require("./database");
const path = require("path");
const ejs = require("ejs");
const methodOverride = require("method-Override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const{ listingSchema } =require("./schema.js");


// const MONGO_URL = "mongodb://localhost:27017/Wanderlust";
// main().then(() => {
//     console.log("connected to DB");
// }).catch(err => {
//     console.log(err);
// })

connection()



// async function main(){
//     await mongoose.connect("MONGO_URL");
// }
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



app.get("/", (req, res) => {
  res.send("Hi,I am root");
});
//Index Route

app.get("/listing", wrapAsync(async (req, res) => {
  
    const allListings = await Listing.find({});
    return res.render("index.ejs", { allListings });
  
    const listing = await Listing.findById(id)
  
}));

//new Route
app.get("/listing/new", wrapAsync(async (req, res) => {
  let { id } = req.params;
  // const listing =await Listing.findById(id);
  res.render("new.ejs");

}));





//show Route
app.get("/listing/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  console.log(id);
  const listing = await Listing.findById(id);
  res.render("show.ejs", { listing });

}));


//create Route
app.post("/listing",
wrapAsync(async (req, res, next) => {
  let result = listingSchema.validation(req.body);
  console.log(result);
  if(result.error){
    throw new ExpressError(400,result.error);
  }
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listing");
  })
);

//edit ROute
app.get("/listing/edit/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;

  console.log(id.length);
    const listing = await Listing.findById(id);

    console.log(listing);

    res.render("edit.ejs", { listing });

}));

//update ROute
app.put("/listing/:id",
   wrapAsync(async (req, res) => {
    if(!req.body.listing) {
      throw new ExpressError(400, "send valid data for listing");
    }
  let { id } = req.params;
  const respons = await Listing.findOneAndUpdate({ _id: id }, { ...req.body.listing });
  res.redirect("/listing");
  
}));
//Delete ROute
app.delete("/listing/delete/:id", wrapAsync(async (req, res) =>{
  const { id } = req.params;
  console.log(id);
    
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listing");
  
}));



// app.get("/testListing", async (req, res) => {
//       let sampleListing = new Listing({
//         title: "My New villa",
//         describtion:" By the beach",
//         price: 1200,
//         location:"calangute,goa",
//         country:"India",
//       });
//       await sampleListing.save();
//       console.log ("smaple was saved");
//       res.send ("successful testing");
// });

app.all("*" , async (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
let {statusCode=500, message="Something went wrong!" } = err;
 res.status(statusCode).send(message);
});


app.listen(8080, () => {
  console.log("server is listing to port 8080");
});