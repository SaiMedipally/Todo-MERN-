const mongoose = require("mongoose");

const todoList = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  todoName: { type: String, required: true },
  itemsList: [
    {
      text: { type: String, required: true },
      done: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("Todo", todoList);
