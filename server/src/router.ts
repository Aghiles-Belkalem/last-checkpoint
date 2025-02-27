import express from "express";

const router = express.Router();

/*************************************************************************** */
import userActions from "./modules/user/userActions";

router.post("/api/user", authMiddleware.hashPassword, userActions.add);

/* ************************************************************************* */
import contactActions from "./modules/contact/contactActions";

// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import upload from "./middleware/UploadingMiddleware";
import authMiddleware from "./middleware/authMiddleware";
import itemActions from "./modules/item/itemActions";

router.post("/api/auth/login", authMiddleware.login);

router.get("/api/items", itemActions.browse);
router.get("/api/items/:id", itemActions.read);
router.post("/api/items", itemActions.add);

/* ************************************************************************* */
router.use(authMiddleware.verifyToken);
router.get("/api/user", userActions.browse);
router.get("/api/user/:id", authMiddleware.verifyToken, userActions.read);
router.put("/api/user/:id", userActions.edit);
router.delete("/api/user/:id", userActions.destroy);
router.post(
  "/api/contact",
  authMiddleware.verifyToken,
  upload.single("photo"),
  contactActions.add,
);
router.get("/api/contact", authMiddleware.verifyToken, contactActions.browse);
router.get("/api/contact/:id", authMiddleware.verifyToken, contactActions.read);
router.put(
  "/api/contact/:id",
  authMiddleware.verifyToken,
  upload.single("photo"),
  contactActions.edit,
);
router.delete(
  "/api/contact/:id",
  authMiddleware.verifyToken,
  contactActions.destroy,
);

export default router;
