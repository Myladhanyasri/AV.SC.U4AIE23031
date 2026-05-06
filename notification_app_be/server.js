const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const notifications = [
  {
    message: "TCS Hiring Drive",
    type: "Placement",
    createdAt: "2026-05-06",
  },
  {
    message: "Mid Sem Results Published",
    type: "Result",
    createdAt: "2026-05-05",
  },
  {
    message: "Tech Fest Tomorrow",
    type: "Event",
    createdAt: "2026-05-04",
  },
];

app.get("/notifications", (req, res) => {
  res.json(notifications);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});