//data.json

export async function fetchJSON<T>(url: string): Promise<T | null> {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            mode: 'cors'
        });
        if (response.ok) {
            const data = await response.json() as T;
            return data;
        } else {
            throw new Error('Error: ' + response.status);
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}
