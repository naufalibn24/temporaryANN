import rateLimit from "express-rate-limit";

export const limiter: any = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
});
