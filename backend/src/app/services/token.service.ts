import prisma from '../../config/prisma';

export interface IToken {
  token: string;
  user_id: string;
}

// Create token
export const createToken = async (data: IToken) => {
  const { user_id } = data;

  const tokenExist = await prisma.tokens.findUnique({
    where: {
      user_id,
    },
  });

  if (tokenExist) {
    await deleteToken(tokenExist.id);
  }

  const token = await prisma.tokens.create({ data });

  return token;
};

// Get token
export const getToken = async (token: string, user_id: string) => {
  return await prisma.tokens.findUnique({
    where: {
      user_id,
      token,
    },
  });
};

// Delete token
export const deleteToken = async (id: string) => {
  return await prisma.tokens.delete({
    where: {
      id,
    },
  });
};
