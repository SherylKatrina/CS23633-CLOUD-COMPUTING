import { CognitoJwtVerifier } from "aws-jwt-verify";
import "dotenv/config";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID,
});

const DEV_MODE = process.env.NODE_ENV !== "production";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    // 🚫 No token
    if (!token || token.trim() === "") {
      // ✅ Allow demo access ONLY in development
      if (DEV_MODE) {
        req.user = { sub: "demo-user" };
        return next();
      }

      return res.status(401).json({
        error: "Unauthorized - Missing token",
      });
    }

    // 🚫 Fake/demo tokens
    const invalidTokens = [
      "dummy-token",
      "session-active-token",
      "null",
      "undefined",
    ];

    if (invalidTokens.includes(token)) {
      if (DEV_MODE) {
        req.user = { sub: "demo-user" };
        return next();
      }

      return res.status(401).json({
        error: "Unauthorized - Invalid token",
      });
    }

    // ✅ Verify real Cognito token
    const payload = await verifier.verify(token);

    req.user = payload;
    return next();
  } catch (err) {
    console.error("Auth verification failed:", err.message);

    // ✅ Demo fallback ONLY in development
    if (DEV_MODE) {
      req.user = { sub: "demo-user" };
      return next();
    }

    return res.status(401).json({
      error: "Unauthorized",
    });
  }
};