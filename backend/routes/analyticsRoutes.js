const express = require("express");
const { getAnalytics, getTopClients } = require("../controllers/analyticsController");

const router = express.Router();

router.get("/", getAnalytics);
router.get("/manager/top-clients", getTopClients);

module.exports = router;
