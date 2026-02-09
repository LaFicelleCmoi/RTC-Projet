import express from "express";
import { createUser, getAllUser, getUser } from "../Controllers/UserController.js";

const router = express.Router();

router.get ("/User", getAllUser);
router.get ("/User/:id", getUser);
router.post("/User", createUser);

export default router ;