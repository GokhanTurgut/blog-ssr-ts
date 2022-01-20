import { RequestHandler, ErrorRequestHandler } from "express";

export const get404: RequestHandler = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
  });
};

export const get500: ErrorRequestHandler = (error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Server Error",
    error: error,
  });
};
