import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma";

export const register = async (req: any, res: any) => {
  try {
    console.log("Registration attempt - Request body:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password:", { email: !!email, password: !!password });
      res.status(400).send("Email and password are required");
      return;
    }

    console.log("Checking if user exists:", email);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log("User already exists:", email);
      res.status(400).send("User already exists");
      return;
    }

    console.log("Creating new user:", email);
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, password: hashedPassword } });

    console.log("User registered successfully:", email);
    res.status(201).send("User registered");
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send(`Internal server error: ${error}`);
  }
};

export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).send("Invalid credentials");
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).send("Invalid credentials");
      return;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};
