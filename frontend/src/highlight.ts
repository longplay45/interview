import { getSearchFieldValue } from "./search";

export function highlightSearchString(): void {
    const titles = document.querySelectorAll<HTMLElement>(".title");

    const search = getSearchFieldValue().trim();
    const searchTerms = search
        .split(" ")
        .map((term) => term.trim())
        .filter((term) => term.length > 0);

    titles.forEach((titleElement) => {
        const storedRaw = titleElement.dataset.rawTitle;
        const rawText = storedRaw ?? titleElement.textContent ?? "";
        titleElement.dataset.rawTitle = rawText;

        if (searchTerms.length === 0) {
            titleElement.replaceChildren(document.createTextNode(rawText));
            return;
        }

        titleElement.replaceChildren(buildHighlightFragment(rawText, searchTerms));
    });

    renderStats(searchTerms.length);
}

function buildHighlightFragment(text: string, terms: string[]): DocumentFragment {
    const fragment = document.createDocumentFragment();
    const uniqueTerms = Array.from(new Set(terms));
    const escapedTerms = uniqueTerms
        .map((term) => escapeRegExp(term))
        .sort((a, b) => b.length - a.length);

    if (escapedTerms.length === 0) {
        fragment.appendChild(document.createTextNode(text));
        return fragment;
    }

    const matcher = new RegExp(`(${escapedTerms.join("|")})`, "gi");
    const termColorIndex = new Map<string, number>();
    uniqueTerms.forEach((term, index) => {
        termColorIndex.set(term.toLowerCase(), index % uniqueTerms.length);
    });

    const parts = text.split(matcher);
    parts.forEach((part) => {
        if (!part) {
            return;
        }

        const colorIndex = termColorIndex.get(part.toLowerCase());
        if (colorIndex === undefined) {
            fragment.appendChild(document.createTextNode(part));
            return;
        }

        const mark = document.createElement("span");
        mark.className = `highlight-${colorIndex}`;
        mark.textContent = part;
        fragment.appendChild(mark);
    });

    return fragment;
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderStats(tokenCount: number): void {
    const element = document.getElementById("tocken");
    if (!element) {
        return;
    }

    element.replaceChildren();

    if (tokenCount < 1) {
        return;
    }

    const parts: HTMLElement[] = [];
    for (let i = 0; i < tokenCount; i += 1) {
        const line = document.createElement("span");
        line.className = `bg line highlight-${i}`;
        line.style.width = `${100 / tokenCount}%`;
        parts.push(line);
    }

    parts.reverse().forEach((line) => element.appendChild(line));
}
