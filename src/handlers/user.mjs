import Joi from "joi";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth.mjs";
import prisma from "../modules/db.mjs";

// Define the validation schema
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const createAdmin = async (req, res) => {
  const { email, password } = req.body;

  const { error } = schema.validate({ email, password });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });
  if (existingAdmin) {
    return res.status(400).json({ error: 'Admin with this email already exists.' });
  }

  try {
    const hashedPassword = await hashPassword(password);
    const user = await prisma.admin.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });
    const token = createJWT(user);
    res.json({ token });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signin = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is empty" });
  }
  const { email, password } = req.body;
  console.log(email,password)
  const user = await prisma.admin.findUnique({
    where: {
      email,
    },
  });
  if (user === null){
   return res.status(400).json({ error: "No Email Associated" });
  }
  const isValid = await comparePasswords(password, user.password);

  if (!isValid) {
    return res.status(401).json({message: 'No Valid Credentials'})
  }

  const token = createJWT(user);
  res.json({ token });
};
