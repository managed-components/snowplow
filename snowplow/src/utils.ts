import { MCEvent } from '@managed-components/types';

export const getDomainHash = str => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let hash = str
    .split('')
    .reduce((acc, char, i) => acc + char.charCodeAt(0) * Math.pow(10, i), 0);

  return Array
    .from(characters.slice(0, 4))
    .map(() => {
      const digit = hash % characters.length;
      hash = Math.floor(hash / characters.length);
      return characters[digit];
    })
    .join('');
};

export const getEventPayloadValue = (event: MCEvent, key: string) => {
  return (event.payload?.ecommerce || event.payload || {})?.[key] ?? null;
};

export const uuidv4 = () => {
  return crypto.randomUUID();
}