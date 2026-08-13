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

export const createCategory = async (req, res) => {
  try {
    const { name, status } = req.body;

    const newCategory = await prisma.category.create({
      data: {
        name: name,
        status: status,
      },
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.log("CHI TIẾT LỖI PRISMA:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const search = req.query.search;

    const categories = await prisma.category.findMany();

    res.json(categories);
  } catch (error) {
    console.log("CHI TIẾT LỖI PRISMA:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: { name, status },
    });

    res.json(updateCategory)
  } catch (error) {
    console.log("CHI TIẾT LỖI PRISMA:", error);
    res.status(500).json({ error: error.message });
  }
};
