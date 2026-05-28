import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db.js";
import {
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const router = Router();

// ✅ ADD THIS
export const localCart = [];

// ─────────────────────────────────────────
// GET /api/cart
// ─────────────────────────────────────────
router.get("/", requireAuth, async (req, res) => {
  const userId = req.user.sub;

  try {
    const data = await db.send(
      new QueryCommand({
        TableName: "Cart",
        KeyConditionExpression: "userId = :uid",
        ExpressionAttributeValues: {
          ":uid": userId,
        },
      })
    );

    res.json(data.Items || []);
  } catch (err) {
    console.error("GET cart error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// PUT /api/cart/:productId
// ─────────────────────────────────────────
router.put("/:productId", requireAuth, async (req, res) => {
  const userId = req.user.sub;
  const productId = req.params.productId;

  try {
    await db.send(
      new UpdateCommand({
        TableName: "Cart",
        Key: { userId, productId },
        UpdateExpression:
          "SET quantity = if_not_exists(quantity, :zero) + :inc",
        ExpressionAttributeValues: {
          ":inc": 1,
          ":zero": 0,
        },
      })
    );

    res.json({ success: true });
  } catch (err) {
    console.error("PUT cart error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// POST /api/cart/add
// ─────────────────────────────────────────
router.post("/add", requireAuth, async (req, res) => {
  const userId = req.user.sub;
  const { productId, quantity = 1 } = req.body;

  try {
    await db.send(
      new UpdateCommand({
        TableName: "Cart",
        Key: { userId, productId: String(productId) },
        UpdateExpression:
          "SET quantity = if_not_exists(quantity, :zero) + :inc",
        ExpressionAttributeValues: {
          ":inc": quantity,
          ":zero": 0,
        },
      })
    );

    res.json({ message: "Added to cart" });
  } catch (err) {
    console.error("POST cart error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// DELETE /api/cart/:productId
// ─────────────────────────────────────────
router.delete("/:productId", requireAuth, async (req, res) => {
  const userId = req.user.sub;
  const productId = req.params.productId;

  try {
    await db.send(
      new DeleteCommand({
        TableName: "Cart",
        Key: { userId, productId },
      })
    );

    res.json({ deleted: true });
  } catch (err) {
    console.error("DELETE cart error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;