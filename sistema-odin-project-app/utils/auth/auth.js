import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";
import { getPlatformUser } from '@/src/controllers/platform/platform_user/platform_user';

export const getUserFromToken = async () => {
  try {
    const token = cookies.get('session_token');
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { data: user } = await getPlatformUser(decoded.id);
    return user;
  } catch (error) {
    console.error('Error fetching user from token:', error);
    return null;
  }
};
