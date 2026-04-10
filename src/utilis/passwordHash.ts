import bcrypt from "bcryptjs";

export function hashPassword(plain: string, rounds = 10): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plain, rounds, (err, hash) =>
      err ? reject(err) : resolve(hash)
    );
  });
}

export function comparePassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plain, hashed, (err, match) =>
      err ? reject(err) : resolve(Boolean(match))
    );
  });
}
