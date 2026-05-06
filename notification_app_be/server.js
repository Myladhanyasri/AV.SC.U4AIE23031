const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const API =
  "http://20.244.56.144/evaluation-service/notifications";

const weights = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function getPriorityScore(notification) {
  const typeWeight = weights[notification.type] || 0;

  const timeScore =
    new Date(notification.createdAt).getTime() / 1000000000;

  return typeWeight * 1000 + timeScore;
}

app.get("/notifications", async (req, res) => {
  try {
    const response = await axios.get(API);

    const notifications = response.data.notifications || [];

    const sorted = notifications.sort(
      (a, b) =>
        getPriorityScore(b) - getPriorityScore(a)
    );

    const top10 = sorted.slice(0, 10);

    res.json(top10);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching notifications",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});