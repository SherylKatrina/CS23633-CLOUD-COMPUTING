import { Router } from "express";
import { db } from "../db.js";
import { ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const router = Router();

// ─────────────────────────────────────────
// 🧪 Dummy Products (UI fallback)
// ─────────────────────────────────────────
const dummyProducts = [
  {
    productId: "1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    description: "Noise-cancelling with crystal clear sound.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
  },
  {
    productId: "2",
    name: "Minimalist Watch",
    price: 150.0,
    description: "Elegant design for the modern professional.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
  },
  {
    productId: "3",
    name: "Smart Speaker",
    price: 89.99,
    description: "Your virtual assistant at home.",
    image:
      "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500",
  },
  {
    productId: "4",
    name: "Mechanical Keyboard",
    price: 129.99,
    description: "Tactile and satisfying typing experience.",
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500",
  },
];

// ─────────────────────────────────────────
// GET /api/products
// ─────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const data = await db.send(
      new ScanCommand({
        TableName: "Products",
      })
    );

    // 👉 fallback if DB empty
    if (!data.Items || data.Items.length === 0) {
      return res.json(dummyProducts);
    }

    res.json(data.Items);
  } catch (err) {
    console.error("GET products error:", err);

    // fallback if DB fails
    res.json(dummyProducts);
  }
});

// ─────────────────────────────────────────
// GET /api/products/:id
// ─────────────────────────────────────────
router.get("/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const data = await db.send(
      new GetCommand({
        TableName: "Products",
        Key: { productId },
      })
    );

    if (!data.Item) {
      // fallback to dummy
      const dummy = dummyProducts.find(p => p.productId === productId);
      if (!dummy) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.json(dummy);
    }

    res.json(data.Item);
  } catch (err) {
    console.error("GET product error:", err);

    // fallback
    const dummy = dummyProducts.find(p => p.productId === productId);
    if (!dummy) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(dummy);
  }
});

export default router;