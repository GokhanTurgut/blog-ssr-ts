import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

// Checking our environment variables that 
// private key exists
if (!process.env.PRIVATE_KEY) {
  throw new Error("Private key does not exist!");
}

const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Custom middleware for checking JWT tokens
// and setting userId and username from JWT payload to
// our request object 
export const checkAuth: RequestHandler = (req, res, next) => {
  const token = req.cookies.token;
  if (token === "Null") {
    return res.redirect("/");
  }
  try {
    const decodedToken = jwt.verify(token, PRIVATE_KEY);
    if (!decodedToken) {
      return res.redirect("/");
    }
    if (typeof decodedToken !== "string") {
      req.userId = decodedToken.userId;
      req.username = decodedToken.username;
    }
    next();
  } catch (err) {
    throw new Error(err as string);
  }
};

// Custom middleware for checking session data and setting 
// isLoggedIn to our locals for frontend use
export const checkUser: RequestHandler = (req, res, next) => {
  if (req.session.user && req.session.browser === req.headers["user-agent"]) {
    res.locals.isLoggedIn = true;
  } else {
    res.locals.isLoggedIn = false;
  }
  next();
};
