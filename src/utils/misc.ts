const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateSalt = async (rounds?: number) => {
  const salt = await bcrypt.genSalt(rounds);
  return salt;
};

const generateHashedPassword = async (password: string, salt: string) => {
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const isPasswordValid = async (password: string, dbPassword: string) => {
  const isValid = await bcrypt.compare(password, dbPassword);
  return isValid;
};

const createAccessToken = async (payload: { id: string }) => {
  const token = await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

const createRefreshToken = async (payload: { id: string }) => {
  const token = await jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  return token;
};

export {
  generateSalt,
  generateHashedPassword,
  isPasswordValid,
  createAccessToken,
  createRefreshToken,
};
