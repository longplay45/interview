// utilities.ts

export function copyObject<T>(obj: T): T {
    const copy = JSON.parse(JSON.stringify(obj)) as T;
    return copy;
}