import { createHash } from 'crypto';

export const encryptData = (data: string): string => {
    const hash = createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
};