import express from "express";
import cors from "cors";
import "dotenv/config";
import categoryRoutes from "./routes/category.route.js";
import productRoutes from "./routes/product.route.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Đang hoạt động tại cổng ${port}`);
});
