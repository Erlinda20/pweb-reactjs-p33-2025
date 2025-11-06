import jwt from 'jsonwebtoken';
import { fail } from '../utils/response';
export function authGuard(req, res, next) {
    const hdr = req.headers.authorization;
    if (!hdr?.startsWith('Bearer '))
        return res.status(401).json(fail('Authentication required. Please login first.'));
    try {
        const token = hdr.split(' ')[1];
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch {
        return res.status(401).json(fail('Invalid token'));
    }
}
