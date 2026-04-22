let jwks;

async function verifyToken(token) {
  const issuer = process.env.CLERK_ISSUER;
  if (!issuer) {
    throw new Error('Missing CLERK_ISSUER');
  }

  const jwksUrl = process.env.CLERK_JWKS_URL || `${issuer}/.well-known/jwks.json`;

  const { createRemoteJWKSet, jwtVerify } = await import('jose');
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(jwksUrl));
  }

  const { payload } = await jwtVerify(token, jwks, {
    issuer,
    algorithms: ['RS256'],
  });

  return payload;
}

module.exports = {
  verifyToken,
};
