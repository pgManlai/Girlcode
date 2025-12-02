import jwt from "jsonwebtoken";

const createJWT = (res, userId) => {
  // Token хугацаа: 1 хоног
  const expiresIn = "1d";
  const maxAgeMs = 1 * 24 * 60 * 60 * 1000; // 1 day in milliseconds

  const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn,
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: maxAgeMs, // Cookie болон token хугацаа ижил
  });
};

export default createJWT;
