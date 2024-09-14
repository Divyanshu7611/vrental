import jwt from "jsonwebtoken";

export interface DecodedToken {
  userId: string;
  // Add any other properties that your JWT payload includes
  iat?: number;
  exp?: number;
}

export async function verifyJwtToken(token: string): Promise<DecodedToken> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded as DecodedToken);
    });
  });
}
