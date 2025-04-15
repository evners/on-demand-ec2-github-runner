/**
 * Patches the global `crypto` object to add support for `getRandomValues`
 * in environments where it's not available, such as when running under `act`.
 *
 * This is a workaround for libraries like `uuid@9+` that rely on `crypto.getRandomValues()`
 * and may fail in minimal environments (e.g. Docker containers without full WebCrypto support).
 */
export function patchCryptoForAct() {
  // Check if the global `crypto` object is missing
  if (typeof globalThis.crypto === 'undefined') {
    // Import Node.js's native randomUUID as a fallback
    const { randomUUID } = require('crypto');

    // Create a minimal polyfill for `crypto.getRandomValues`
    globalThis.crypto = {
      getRandomValues: (arr: any) => {
        const uuid = randomUUID().replace(/-/g, '');
        const hex = Buffer.from(uuid, 'hex');
        for (let i = 0; i < arr.length; i++) arr[i] = hex[i];
        return arr;
      },
    } as Crypto;
  }
}
