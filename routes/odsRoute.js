import express from "express";
import { generarODS } from "../controllers/odsController";

const router = express.Router();

router.get('/prueba',generarODS);
export default router;