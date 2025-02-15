import path from "node:path";
import type { RequestHandler } from "express";
import contactRepository from "./contactRepository";

const hostUrl = process.env.HOST_URL || "http://localhost:3310";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const contact = await contactRepository.readAll();
    res.json(contact);
  } catch (err) {
    next(err);
  }
};
const read: RequestHandler = async (req, res, next) => {
  try {
    const contactId = Number(req.params.id);
    const contact = await contactRepository.read(contactId);
    if (contact == null) {
      res.sendStatus(404);
    } else {
      res.json(contact);
    }
  } catch (err) {
    next(err);
  }
};
const add: RequestHandler = async (req, res, next) => {
  try {
    const { user_id, firstname, lastname, mail, address, phone_number } =
      req.body;

    if (!firstname || !lastname || !mail || !address || !phone_number) {
      res.status(400).json({ error: "Missing required fields" });
    }
    let photoUrl = null;

    if (req.file) {
      if (req.file) {
        const photoPath = path.join("assets/images", req.file.filename);
        photoUrl = `${hostUrl.replace(/\\/g, "/")}/${photoPath.replace(/\\/g, "/")}`;
      }
    }

    const newContact = {
      user_id,
      firstname,
      lastname,
      mail,
      address,
      phone_number,
      photo_url: photoUrl,
    };
    const insertId = await contactRepository.create(newContact);
    res.status(201).json({ insertId, photoUrl });
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const contactId = Number(req.params.id);
    const { user_id, firstname, lastname, mail, address, phone_number } =
      req.body;

    let photoUrl = req.body.photo_url;
    if (req.file) {
      const photoPath = path.join("assets/images", req.file.filename);
      photoUrl = `${hostUrl.replace(/\\/g, "/")}/${photoPath.replace(/\\/g, "/")}`;
    }

    const updatedContact = {
      id: contactId,
      user_id,
      firstname,
      lastname,
      mail,
      address,
      phone_number,
      photo_url: photoUrl,
    };

    const result = await contactRepository.update(updatedContact);

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
    const contactId = Number(req.params.id);

    const destroyedId = await contactRepository.delete(contactId);

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
