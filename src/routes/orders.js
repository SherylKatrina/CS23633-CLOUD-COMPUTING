import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db.js";
import {
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const router = Router();

// ─────────────────────────────────────────
// 🧪 Dummy Orders (fallback for UI/demo)
// ─────────────────────────────────────────
const dummyOrders = [
  {
    orderId: "ORD-1001",
    date: "Jul 20, 2026",
    items: 2,
    total: 199.99,
    status: "Delivered",
  },
  {
    orderId: "ORD-1002",
    date: "Jul 18, 2026",
    items: 1,
    total: 89.99,
    status: "Processing",
  },
];

// ─────────────────────────────────────────
// GET /api/orders
// ─────────────────────────────────────────
router.get("/", requireAuth, async (req, res) => {
  const userId = req.user.sub;

  try {
    const data = await db.send(
      new QueryCommand({
        TableName: "Orders",
        KeyConditionExpression: "userId = :uid",
        ExpressionAttributeValues: {
          ":uid": userId,
        },
        ScanIndexForward: false,
      })
    );

    // 👉 If no real data → return dummy
    if (!data.Items || data.Items.length === 0) {
      return res.json(dummyOrders);
    }

    res.json(data.Items);
  } catch (err) {
    console.error("GET orders error:", err);

    // fallback even on error
    res.json(dummyOrders);
  }
});

// ─────────────────────────────────────────
// POST /api/orders  (create new order)
// ─────────────────────────────────────────
router.post("/", requireAuth, async (req, res) => {
  const userId = req.user.sub;
  const { items = [], total = 0 } = req.body;

  if (items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const orderId = `ORD-${Date.now()}`;

  const order = {
    userId,
    orderId,
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    items: items.length,
    total,
    status: "Processing",
  };

  try {
    await db.send(
      new PutCommand({
        TableName: "Orders",
        Item: order,
      })
    );

    res.status(201).json(order);
  } catch (err) {
    console.error("POST order error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;