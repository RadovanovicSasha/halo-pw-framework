import * as dotenv from 'dotenv';
dotenv.config();

const DEFAULT_BASE_URL = 'https://www.halooglasi.com';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`[config] Required environment variable not set: ${name}`);
  }
  return value;
}

export const config = {
  baseUrl: process.env.BASE_URL ?? DEFAULT_BASE_URL,

  get haloUser(): string {
    return requireEnv('HALO_USER');
  },

  get haloPass(): string {
    return requireEnv('HALO_PASS');
  },
};
