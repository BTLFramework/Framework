import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db";

export const register = async (req: any, res: any) => {
  try {
    if (process.env.ALLOW_PRACTITIONER_REGISTRATION !== "true") {
      res.status(403).send("Practitioner registration is disabled")
      return
    }
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send("Email and password are required");
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).send("User already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, password: hashedPassword } });

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
