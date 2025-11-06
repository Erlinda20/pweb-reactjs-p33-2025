import { prisma } from '../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export async function register(input) {
    const hashed = await bcrypt.hash(input.password, 10);
    const user = await prisma.users.create({ data: { username: input.username, email: input.email, password: hashed } });
    return { id: user.id, email: user.email, username: user.username };
}
export async function login(input) {
    const user = await prisma.users.findUnique({ where: { email: input.email } });
    if (!user)
        throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    const ok = await bcrypt.compare(input.password, user.password);
    if (!ok)
        throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    const access_token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return { access_token };
}
export async function me(userId) {
    return prisma.users.findUnique({ where: { id: userId }, select: { id: true, email: true, username: true } });
}
