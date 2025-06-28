import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const clerkDomain = 'fair-polecat-13.clerk.accounts.dev';

const client = jwksClient({
  jwksUri: `https://${clerkDomain}/.well-known/jwks.json`,
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid as string, function (err, key) {
    if (err) {
      return callback(err, null);
    }
    const signingKey = key!.getPublicKey();
    callback(null, signingKey);
  });
}

export async function verifyClerkToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        // Remove or update the audience to match your real token
        // audience: 'authenticated',
        issuer: `https://${clerkDomain}`,
        algorithms: ['RS256'],
      },
      (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      }
    );
  });
}
