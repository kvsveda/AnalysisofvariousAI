exports.signup = (req, res) => {
  res.status(410).json({ error: 'Local signup is disabled. Use Clerk Sign Up.' });
};

exports.login = (req, res) => {
  res.status(410).json({ error: 'Local login is disabled. Use Clerk Sign In.' });
};

exports.syncUser = (req, res) => {
  res.json({
    message: 'User synced from Clerk token.',
    user: req.user,
  });
};

exports.getMe = (req, res) => {
  res.json({ user: req.user, userId: req.userId });
};
