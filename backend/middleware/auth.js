const { verifyToken } = require('../utils/clerkAuth');
const { normalizeUserFromClaims, createUserIfNotExists } = require('../config/userRepository');

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token is required.' });
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    const claims = await verifyToken(token);
    if (!claims?.sub) {
      return res.status(401).json({ error: 'Invalid token subject.' });
    }

    const normalized = normalizeUserFromClaims(claims);
    const safeUser = createUserIfNotExists(normalized);

    req.auth = claims;
    req.userId = claims.sub;
    req.user = safeUser;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: invalid or expired Clerk token.' });
  }
}

module.exports = requireAuth;
