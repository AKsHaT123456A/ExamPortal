import { JWTPayload, SignJWT, jwtVerify } from "jose";

interface JwtClaims extends JWTPayload {
  id: string;
  role?: string;
}

const generateJWT = async (claims: JwtClaims): Promise<string> => {
  const secret = process.env.JWT_SECRET || "secret";

  const jwt = await new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(new TextEncoder().encode(secret));

  return jwt;
};

const verifyJWT = async (token: string): Promise<JwtClaims | null> => {
  const secret = process.env.JWT_SECRET || "secret";

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload as JwtClaims;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};

export { generateJWT, verifyJWT };
