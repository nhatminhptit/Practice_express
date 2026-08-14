import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.ts";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const prisma = new PrismaClient({ adapter });

export const createProduct = async (req, res) => {
  try {
    const { name, price, category_id } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        price,
        category: {
          connect: { id: category_id },
        },
      },
    });
    res.status(201).json(product);
  } catch (error) {
    console.log("CHI TIẾT LỖI PRISMA:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { search } = req.query;

    const products = await prisma.product.findMany({
      where: search ? { name: { contains: search } } : {},
    });

    res.status(200).json(products);
  } catch (error) {
    console.log("CHI TIẾT LỖI PRISMA:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.log("CHI TIẾT LỖI PRISMA:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category_id } = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: { name, price, category_id },
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log("CHI TIẾT LỖI PRISMA:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await prisma.product.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(deletedProduct);
  } catch (error) {
    console.log("CHI TIẾT LỖI PRISMA:", error);
    res.status(500).json({ error: error.message });
  }
};