import pako from 'pako';
import type { ShareableState } from '../types';

// Helper to convert Uint8Array to Base64
const uint8ArrayToBase64 = (array: Uint8Array): string => {
    let binary = '';
    const len = array.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(array[i]);
    }
    return btoa(binary);
};

// Helper to convert Base64 to Uint8Array
const base64ToUint8Array = (base64: string): Uint8Array => {
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
};


export const encodeState = (state: ShareableState): string => {
    try {
        const jsonString = JSON.stringify(state);
        const compressed = pako.deflate(jsonString);
        const base64 = uint8ArrayToBase64(compressed);
        // URL-safe encoding
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (error) {
        console.error("Failed to encode state:", error);
        return '';
    }
};

export const decodeState = (encodedString: string): ShareableState | null => {
    try {
        let base64 = encodedString.replace(/-/g, '+').replace(/_/g, '/');
        // Add padding
        while (base64.length % 4) {
            base64 += '=';
        }
        const compressed = base64ToUint8Array(base64);
        const jsonString = pako.inflate(compressed, { to: 'string' });
        return JSON.parse(jsonString) as ShareableState;
    } catch (error) {
        console.error("Failed to decode state:", error);
        return null;
    }
};
