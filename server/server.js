const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5500;
const loginAuth = require("./routes/loginAuth");
const todoRoutes = require("./routes/todoRoutes");

dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/api/users", loginAuth);
app.use("/api/todos", todoRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(err));
