import { verify } from 'jsonwebtoken';
import { FieldResolveInput } from 'stucco-js';

const decodeToken = (token: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret not set');
  }
  const verifiedToken = verify(token, process.env.JWT_SECRET);
  if (typeof verifiedToken !== 'object') {
    throw new Error('Token is not an object');
  }
  if (!('username' in verifiedToken)) {
    throw new Error('Invalid token');
  }
  return verifiedToken as { username: string };
};

export const getUserFromSource = (input: FieldResolveInput) => {
  let token: string = '';
  let user = null;
  if (input.protocol?.headers?.Authorization && input.protocol?.headers?.Authorization.length)
    token = input.protocol?.headers?.Authorization[0];
  if (token) user = decodeToken(token).username;
  return user;
};
