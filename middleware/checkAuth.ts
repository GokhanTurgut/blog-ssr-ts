import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.PRIVATE_KEY) {
  throw new Error("Private key does not exist!");
}

const PRIVATE_KEY = process.env.PRIVATE_KEY;

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

export const checkUser: RequestHandler = (req, res, next) => {
  if (req.session.user && req.session.browser === req.headers["user-agent"]) {
    res.locals.isLoggedIn = true;
  } else {
    res.locals.isLoggedIn = false;
  }
  next();
};
