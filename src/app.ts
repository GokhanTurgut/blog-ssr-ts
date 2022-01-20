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

const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: DATABASE_URL,
  collection: "sessions",
});

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(cookieParser());
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

app.use(checkUser);

app.use(blogRoutes);
app.use(authRoutes);

app.use(get500);

app.use(get404);

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
