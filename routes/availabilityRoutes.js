const express = require("express");
const { createAvailability, getAvailabilities, getAvailabilityById, updateAvailability, deleteAvailability } = require("../controllers/availabilityController");

const router = express.Router();

router.post("/", createAvailability);
router.get("/", getAvailabilities);
router.get("/:id", getAvailabilityById);
router.put("/:id", updateAvailability);
router.delete("/:id", deleteAvailability);

module.exports = router;
