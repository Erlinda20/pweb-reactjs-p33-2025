import { z } from 'zod';
import * as svc from '../services/auth.service';
import { ok, fail } from '../utils/response';
const RegisterDto = z.object({ username: z.string().optional(), email: z.string().email(), password: z.string().min(6) });
const LoginDto = z.object({ email: z.string().email(), password: z.string().min(6) });
export async function register(req, res) {
    const parsed = RegisterDto.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json(fail('Invalid body'));
    try {
        const data = await svc.register(parsed.data);
        res.status(201).json(ok('Registered', data));
    }
    catch (e) {
        if (e.code === 'P2002')
            return res.status(409).json(fail('Email already used'));
        throw e;
    }
}
export async function login(req, res) {
    const parsed = LoginDto.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json(fail('Invalid body'));
    const data = await svc.login(parsed.data);
    res.json(ok('Logged in', data)); // { access_token }
}
export async function me(_req, res) {
    const user = res.req.user;
    const data = await svc.me(user.id);
    res.json(ok('Profile', data));
}
