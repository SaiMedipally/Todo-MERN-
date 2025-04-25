const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");
const Todo = require("../models/todo");

// GET /api/todos - Fetch all todo lists
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId });
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/todos - Create a new todo list
router.post("/", auth, async (req, res) => {
  const { todoName, itemsList = [] } = req.body;

  if (!todoName || !todoName.trim()) {
    return res.status(400).json({ error: "Todo name is required" });
  }

  try {
    const newTodoList = new Todo({
      userId: req.userId,
      todoName,
      itemsList,
    });

    await newTodoList.save();
    res.status(201).json(newTodoList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/todos/:id - Update the todo name
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { todoName: req.body.todoName },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo list not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/todos/:id - Delete a todo list
router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo list not found" });
    }

    res.status(200).json({ message: "Todo list deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/todos/:id/add - Add item to a todo list
router.post("/:id/add", auth, async (req, res) => {
  const { item } = req.body;

  if (!item || !item.trim()) {
    return res.status(400).json({ error: "Item text is required" });
  }

  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo list not found" });
    }

    todo.itemsList.push({ text: item, done: false });
    await todo.save();

    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/todos/:todoId/items/:itemId - Update item
router.put("/:todoId/items/:itemId", auth, async (req, res) => {
  const { done, text } = req.body;

  try {
    const todo = await Todo.findById(req.params.todoId);
    if (!todo) {
      return res.status(404).json({ error: "Todo list not found" });
    }

    const item = todo.itemsList.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (text) item.text = text;
    if (done !== undefined) item.done = done;

    await todo.save();

    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/todos/:todoId/items/:itemId - Delete item from todo list
router.delete("/:todoId/items/:itemId", auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.todoId);
    if (!todo) {
      console.log("Todo not found:", req.params.todoId);
      return res.status(404).json({ error: "Todo list not found" });
    }

    const item = todo.itemsList.id(req.params.itemId);
    if (!item) {
      console.log("Item not found:", req.params.itemId);
      return res.status(404).json({ error: "Item not found" });
    }

    item.deleteOne();
    await todo.save();

    console.log("Deleted item:", item);
    res.status(200).json(todo);
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
