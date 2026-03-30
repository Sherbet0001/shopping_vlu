const express = require("express");
const router = express.Router();

// utils
const CryptoUtil = require("../utils/CryptoUtil");
const EmailUtil = require("../utils/EmailUtil");
const JwtUtil = require("../utils/JwtUtil");

// daos
const CategoryDAO = require("../models/CategoryDAO");
const ProductDAO = require("../models/ProductDAO");
const CustomerDAO = require("../models/CustomerDAO");
const OrderDAO = require("../models/OrderDAO");

/* ================= CATEGORY ================= */

router.get("/categories", async (req, res) => {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

/* ================= PRODUCT ================= */

router.get("/products/new", async (req, res) => {
  const products = await ProductDAO.selectTopNew(3);
  res.json(products);
});

router.get("/products/hot", async (req, res) => {
  const products = await ProductDAO.selectTopHot(3);
  res.json(products);
});

router.get("/products/category/:cid", async (req, res) => {
  const _cid = req.params.cid;
  const products = await ProductDAO.selectByCatID(_cid);
  res.json(products);
});

router.get("/products/search/:keyword", async (req, res) => {
  const keyword = req.params.keyword;
  const products = await ProductDAO.selectByKeyword(keyword);
  res.json(products);
});

router.get("/products/:id", async (req, res) => {
  const _id = req.params.id;
  const product = await ProductDAO.selectByID(_id);
  res.json(product);
});

/* ================= CUSTOMER SIGNUP ================= */

router.post("/signup", async (req, res) => {
  const { username, password, name, phone, email } = req.body;

  const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);

  if (dbCust) {
    res.json({ success: false, message: "Exists username or email" });
  } else {
    const now = new Date().getTime();
    const token = CryptoUtil.md5(now.toString());

    const newCust = {
      username,
      password,
      name,
      phone,
      email,
      active: 0,
      token
    };

    const result = await CustomerDAO.insert(newCust);

    if (result) {
      const send = await EmailUtil.send(email, result._id, token);

      if (send) {
        res.json({ success: true, message: "Please check email" });
      } else {
        res.json({ success: false, message: "Email failure" });
      }
    } else {
      res.json({ success: false, message: "Insert failure" });
    }
  }
});

/* ================= CUSTOMER ACTIVE ACCOUNT ================= */

router.post("/active", async (req, res) => {
  const { id, token } = req.body;
  const result = await CustomerDAO.active(id, token, 1);
  res.json(result);
});

/* ================= CUSTOMER LOGIN ================= */

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    const customer = await CustomerDAO.selectByUsernameAndPassword(
      username,
      password
    );

    if (customer) {
      if (customer.active === 1) {
        const token = JwtUtil.genToken();

        res.json({
          success: true,
          message: "Authentication successful",
          token: token,
          customer: customer
        });
      } else {
        res.json({
          success: false,
          message: "Account is deactive"
        });
      }
    } else {
      res.json({
        success: false,
        message: "Incorrect username or password"
      });
    }
  } else {
    res.json({
      success: false,
      message: "Please input username and password"
    });
  }
});

/* ================= CHECK TOKEN ================= */

router.get("/token", JwtUtil.checkToken, (req, res) => {
  const token =
    req.headers["x-access-token"] || req.headers["authorization"];

  res.json({
    success: true,
    message: "Token is valid",
    token: token
  });
});

/* ================= UPDATE MY PROFILE ================= */

router.put("/customers/:id", JwtUtil.checkToken, async (req, res) => {
  const _id = req.params.id;

  const customer = {
    _id: _id,
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email
  };

  const result = await CustomerDAO.update(customer);

  res.json(result);
});

/* ================= CHECKOUT ================= */

router.post("/checkout", JwtUtil.checkToken, async (req, res) => {
  const now = new Date().getTime();

  const order = {
    cdate: now,
    total: req.body.total,
    status: "PENDING",
    customer: req.body.customer,
    items: req.body.items
  };

  const result = await OrderDAO.insert(order);
  res.json(result);
});

/* ================= MY ORDERS ================= */

router.get("/orders/customer/:cid", JwtUtil.checkToken, async (req, res) => {
  const _cid = req.params.cid;

  const orders = await OrderDAO.selectByCustID(_cid);

  res.json(orders);
});

module.exports = router;