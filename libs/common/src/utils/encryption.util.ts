import * as bcrypt from 'bcrypt';

export const generateHashedPassword: (password: string) => string = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

export const validPassword = (password, passwordHash) => {
  return bcrypt.compareSync(password, passwordHash);
};
