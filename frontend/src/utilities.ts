// utilities.ts

export function copyObject<T>(obj: T): T {
    const copy = JSON.parse(JSON.stringify(obj)) as T;
    return copy;
}


export function compressString(str: string): string {
    // Convert the string to a URI-encoded format to handle special characters
    const encodedString = encodeURIComponent(str);

    // Base64 encode the encoded string
    const base64String = btoa(encodedString);

    return base64String;
}

export function decompressString(compressedString: string): string {
    // Base64 decode the compressed string
    const decodedString = atob(compressedString);

    // Decode the URI-encoded string
    const decompressedString = decodeURIComponent(decodedString);

    return decompressedString;
}
