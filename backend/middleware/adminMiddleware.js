import jwt from 'jsonwebtoken';

/**
 * Admin authentication middleware.
 *
 * Reads the Authorization: Bearer <token> header and verifies the JWT.
 * The token must contain { role: 'admin' } (issued by POST /api/admin/login).
 *
 * On success  → attaches req.admin and calls next().
 * On failure  → returns 401 (no token) or 403 (invalid / non-admin token).
 */
export const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: no token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: admin access only' });
        }

        req.admin = decoded;
        next();
    } catch (err) {
        const message =
            err.name === 'TokenExpiredError'
                ? 'Forbidden: token has expired'
                : 'Forbidden: invalid token';

        return res.status(403).json({ message });
    }
};
