// backend/src/auth/constants.ts
export const jwtConstants = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'YOUR_ACCESS_SECRET_KEY_REPLACE_ME',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'YOUR_REFRESH_SECRET_KEY_REPLACE_ME',
};