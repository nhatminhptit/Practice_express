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
    const { search, page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const whereCondition = search ? { name: { contains: search } } : {};

    const [categories, totalItems] = await Promise.all([
      prisma.category.findMany({
        where: whereCondition,
        skip: skip,
        take: limitNumber,
      }),
      prisma.category.count({
        where: whereCondition,
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limitNumber);

    res.status(200).json({
      data: categories,
      pagination: {
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
        totalItems: totalItems,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    console.log("CHI TIẾT LỖI PRISMA:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      return res.status(404).json({ error: "Danh mục không tồn tại" });
    }

    res.json(category);
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

    res.json(updatedCategory);
  } catch (error) {
    console.log("CHI TIẾT LỖI PRISMA:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.log("CHI TIẾT LỖI PRISMA:", error);
    res.status(500).json({ error: error.message });
  }
};
