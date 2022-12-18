import { Router } from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const router = Router();

router.get("/", (req, res) => {
  res.render("productForm", { titulo: "E-commerce" });
});

export default router;
