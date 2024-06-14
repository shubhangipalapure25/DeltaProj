if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./util/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbURl = process.env.ATLASDB_URL; //MongoDb Atlas Cloud Service connection string

async function main() {
  try {
    await mongoose.connect(dbURl);
    console.log("Connected successfully to DB.");
  } catch (err) {
    console.error("Error connecting to the database", err);
  }
}

main();

const store = MongoStore.create({
  mongoUrl: dbURl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.engine("ejs", ejsMate);

app.use(session(sessionOption));
app.use(flash());

// Authentation using passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  // console.log(res.locals.currUser);
  next();
});

//Home Route
// app.get("/", (req, res) => {
//   res.send("root working");
// });

app.use("/listings", listingsRouter);
app.use("/listings/:id/review", reviewsRouter);
app.use("/", userRouter);

//if no path match from client side
app.use("*", (req, res, next) => {
  next(new ExpressError(400, "Page not Found!"));
});

//Error Handler Middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "some error caught" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is Listening on port 8080");
});


// user signup or login
// app.get("/demoUser", async(req,res) =>{
//   const fakeUser = new User ({
//     email:"deltastudent@gmail.com",
//     username:"delta-student",
//   });
//   const registeredUser = await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
// });
