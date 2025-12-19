import jwt from 'jsonwebtoken';
import { config } from '../config';

interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}


const asSecret= (s: string) => s as unknown as jwt.Secret;

export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, asSecret(config.jwtSecret), {
        expiresIn: config.jwtExpire,
    } as jwt.SignOptions);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, asSecret(config.jwtRefreshSecret), {
        expiresIn: config.jwtRefreshExpire,
    } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): TokenPayload => {
    return jwt.verify(token, asSecret(config.jwtSecret)) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
    return jwt.verify(token, asSecret(config.jwtRefreshSecret)) as TokenPayload;
};
