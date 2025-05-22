
const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'SID_JWT';
    

    const decoded = jwt.verify(token, secret);
    

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT error:', err.message);
    res.status(400).json({ message: 'Invalid token', error: err.message });
  }
};



module.exports = verifyAdmin;
