import { fail } from '../utils/response';
export function errorHandler(err, _req, res, _next) {
    res.status(err.status ?? 500).json(fail(err.message ?? 'Internal Server Error'));
}
