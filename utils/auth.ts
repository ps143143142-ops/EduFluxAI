import { User } from '../types';

// This is a simplified simulation of JWT. In a real application, use a library like 'jsonwebtoken'.

/**
 * Creates a base64 encoded token string from a user object.
 * @param user The user object to encode.
 * @returns A simulated JWT string.
 */
export const createToken = (user: User): string => {
  const payload = {
    ...user,
    exp: Date.now() + 60 * 60 * 1000, // Expires in 1 hour
  };
  return btoa(JSON.stringify(payload));
};

/**
 * Decodes a token string back into a user object and expiration.
 * @param token The token string.
 * @returns An object with the user and expiration, or null if decoding fails.
 */
export const decodeToken = (token: string): { user: User; exp: number } | null => {
  try {
    const decoded = JSON.parse(atob(token));
    const { exp, ...user } = decoded;
    return { user, exp };
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

/**
 * Checks if a token's expiration timestamp is in the past.
 * @param exp The expiration timestamp.
 * @returns True if the token is expired, false otherwise.
 */
export const isTokenExpired = (exp: number): boolean => {
  return Date.now() >= exp;
};

/**
 * Retrieves the token from localStorage.
 * @returns The token string or null if not found.
 */
export const getToken = (): string | null => {
  return localStorage.getItem('jwt_token');
};

/**
 * Stores the token in localStorage.
 * @param token The token string to store.
 */
export const setToken = (token: string): void => {
  localStorage.setItem('jwt_token', token);
};

/**
 * Removes the token from localStorage.
 */
export const removeToken = (): void => {
  localStorage.removeItem('jwt_token');
};
