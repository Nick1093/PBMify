// Step 4: Set up a basic server with Express.js
const express = require("express");
const app = express();
const port = 8001;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Step 5: Start your server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
