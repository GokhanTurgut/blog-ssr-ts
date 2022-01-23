import path from "path";

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import { default as connectMongoDBSession } from "connect-mongodb-session";

import { get404, get500 } from "./controllers/error";
import blogRoutes from "./routes/blog";
import authRoutes from "./routes/auth";
import { checkUser } from "./middleware/checkAuth";

dotenv.config();

// Accessing environment variables and checking them to
// make sure they exists.
const PORT = Number(process.env.PORT) || 5000;

if (!process.env.DATABASE_URL) {
  throw new Error("Database URL does not exist!");
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!process.env.SESSION_SECRET) {
  throw new Error("Session secret does not exist!");
}

const SESSION_SECRET = process.env.SESSION_SECRET;

const app = express();

// Creating a database connection for session
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: DATABASE_URL,
  collection: "sessions",
});

app.set("view engine", "ejs");

// Middleware for parsing incoming request body from form data
app.use(express.urlencoded({ extended: false }));
// Middleware for setting our public folder as accessible
app.use(express.static(path.join(__dirname, "..", "public")));
// Middleware for parsing cookies inside requests
app.use(cookieParser());
// Middleware for creating our session with a cookie 2 hours long
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
      httpOnly: true,
    },
  })
);

// Custom middleware for checking session data 
// and adding isLoggedIn to locals
app.use(checkUser);

// Routes
app.use(blogRoutes);
app.use(authRoutes);

// Server error handler
app.use(get500);

// Page not found error handler
app.use(get404);

// Connecting to our database through mongoose
// and start listening on our chosen port
mongoose
  .connect(DATABASE_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
