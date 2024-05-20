import { comparePasswords, createJWT, hashPassword } from "../utils/auth.mjs"
import prisma from "../modules/db.mjs";
import { serialize } from 'cookie';
import { userSchema } from "../utils/validation.mjs"



export const createAdmin = async (req, res) => {
  const { email, password } = req.body;

  const { error } = userSchema.validate({ email, password });
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

export const login = async (req, res) => {
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
   return res.status(400).json({ error: "User Not Found" });
  }
  const isValid = await comparePasswords(password, user.password);

  if (!isValid) {
    return res.status(401).json({message: 'No Valid Credentials'})
  }

  const token = createJWT(user);
  // Serialize the cookie
const serializedCookie = serialize('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Set to true in production
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: '/admin', // Make cookie available for all routes
});

// Set the cookie header
res.setHeader('Set-Cookie', serializedCookie);
  res.json({ user,token });
};

