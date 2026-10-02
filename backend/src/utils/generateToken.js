import jwt from "jsonwebtoken";

const genertaeToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export default genertaeToken;
