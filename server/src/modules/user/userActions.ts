import type { RequestHandler } from "express";
import userRepository from "../../modules/user/userRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const user = await userRepository.readAll();
    res.json(user);
  } catch (err) {
    next(err);
  }
};
const read: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const user = await userRepository.read(userId);
    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    next(err);
  }
};
const add: RequestHandler = async (req, res, next) => {
  try {
    const { firstname, lastname, mail, password } = req.body;

    if (!firstname || !lastname || !mail || !password) {
      res.status(400).json({ error: "Missing required fields" });
    }
    const existingUser = await userRepository.readByEmail(mail);
    if (existingUser) {
      res.status(400).json({ error: "Email already in use" });
    }

    const newContact = {
      firstname,
      lastname,
      mail,
      password,
    };
    const insertId = await userRepository.create(newContact);
    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const updateduser = {
      id: userId,
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      mail: req.body.mail,
      password: req.body.password,
    };

    const result = await userRepository.update(updateduser);

    if (!result) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    const destroyedId = await userRepository.delete(userId);

    if (destroyedId) {
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add, edit, destroy };
