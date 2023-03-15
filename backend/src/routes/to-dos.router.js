import express from "express";
import { getDBConnection } from "../db/index.js";
import { validatorPost, validatorID } from "../middlewares/validator.js";

export const TodosRouter = express.Router();
//CRUD Implemented
//Create
TodosRouter.post("/to-do", validatorPost, async function (request, response) {
  try {
    const { title, description } = request.body;
    const db = await getDBConnection();

    await db.run(
      "INSERT INTO todos (title, description) VALUES (?, ?)",
      title,
      description
    );

    await db.close();

    response.send({
      newTodo: { title, description },
    });
  } catch (error) {
    console.error(error);
    response.status(500).send({
      message: "Something went wrong trying to create a new to do",
      error,
    });
  }
});
//Read
TodosRouter.get("/to-dos", async function (request, response) {
  try {
    const db = await getDBConnection();

    const todos = await db.all("SELECT * FROM todos ORDER BY is_done ASC");

    await db.close();

    response.send({ todos });
  } catch (error) {
    response.status(500).send({
      message: "Something went wrong trying to get to dos",
      error,
    });
  }
});
//Update
TodosRouter.patch(
  "/to-do/:id",
  validatorID,
  async function (request, response) {
    try {
      const { id } = request.params;
      const db = await getDBConnection();

      const todoExists = await db.get("SELECT * FROM todos WHERE id = ?", id);

      if (!todoExists) {
        return response.status(404).send({ message: "To Do Not Found" });
      }

      const { title, description, is_done } = request.body;
      console.log(request.body)

      await db.run("UPDATE todos SET title = ?, description = ?, is_done = ?, date_edit = CURRENT_TIMESTAMP WHERE id = ?",
        title || todoExists.title,
        description || todoExists.description,
        is_done !== undefined ? is_done : todoExists['is_done'],
        id
      );

      await db.close();

      response.send({ message: "To do updated" });
    } catch (error) {
      response.status(500).send({
        message: "Something went wrong trying to update a todo",
        error,
      });
    }
  }
);
//Delete
TodosRouter.delete(
  "/to-do/:id",
  validatorID,
  async function (request, response) {
    try {
      const id = request.params.id;

      const db = await getDBConnection();

      const todoExists = await db.get("SELECT id FROM todos WHERE id = ?", id);

      if (!todoExists) {
        return response.status(404).send({ message: "To Do Not Found" });
      }

      const deletionInfo = await db.run("DELETE FROM todos WHERE id = ?", id);

      await db.close();

      response.send({ deletionInfo });
    } catch (error) {
      response.status(500).send({
        message: "Something went wrong trying to delete a todo",
        error,
      });
    }
  }
);

TodosRouter.get("/to-do/:id",
  validatorID,
  async function (request, response) {
    try {
      const { id } = request.params;
      const db = await getDBConnection();

      const todo = await db.get("SELECT * FROM todos WHERE id = ?", id);

      if (!todo) {
        return response.status(404).send({ message: "To Do Not Found" });
      }

      await db.close();

      response.send({ todo });
    } catch (error) {
      response.status(500).send({
        message: "Something went wrong trying to get a todo",
        error,
      });
    }
  }
);
