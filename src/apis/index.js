const express = require("express");
const BaseAuthMiddleWare =  require("../commons/base_auth_middleware.js");
const baseAuthMiddleWare = new BaseAuthMiddleWare();

// add your routes
const UserRoute = require('./user/user_route');

exports.setRoutes =(app) => {
  app.use(baseAuthMiddleWare.checkAuthentication.bind(baseAuthMiddleWare));

  // add route here
  app.use("/api/v1.0/user", UserRoute.router);
};
