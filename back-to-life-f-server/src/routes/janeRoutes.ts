import express from "express";
import { getPractitioners } from "../services/janeAppService";

const router = express.Router();

router.get("/practitioners", async (req, res) => {
  try {
    const data = await getPractitioners();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch practitioners" });
  }
});

// Add more routes as needed

export default router;
