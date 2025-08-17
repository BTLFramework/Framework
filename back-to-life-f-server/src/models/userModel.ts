import prisma from "../db";

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const createUser = async (email: string, password: string) => {
  return await prisma.user.create({ data: { email, password } });
};
