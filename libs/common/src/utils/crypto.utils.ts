import * as jwt from 'jsonwebtoken';

const secret = 'djfhsejhfgsehgfhsegfsegufyuewgfuyzweyufywefguyegfu9843hffh';

export const SkeletonsDecrypt = (token: string) => {
  try {
    return jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return null;
      }
      return decoded;
    });
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log(e);
  }
};

export const SkeletonsEncrypt = (value: string): string => {
  try {
    return jwt.sign(
      { exp: Math.floor(Date.now() / 1000) + 60 * 60, key: value },
      secret,
    );
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log(e);
  }
};
