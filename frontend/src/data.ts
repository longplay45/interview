export async function fetchJSON<T>(url: string): Promise<T | null> {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json"
            },
            mode: "cors"
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = (await response.json()) as T;
        return data;
    } catch (error: unknown) {
        console.error(error);
        return null;
    }
}
