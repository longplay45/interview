import * as elements from "./elements";
import { addCategoryListeners, addHelpListeners } from "./events";
import { highlightSearchString } from "./highlight";
import { getSearchFieldValue, searchMe } from "./search";
import { getState, toggleCategorySelection } from "./state.ts";
import type { DataEntry } from "./types.ts";

export function renderCategories(): void {
    const state = getState();
    const categories = [...state.categories].sort();

    const list = document.createElement("ul");
    list.classList.add("navigation");

    categories.forEach((category) => {
        const isSelected = state.selectedCategories.includes(category);
        const item = document.createElement("li");
        item.classList.toggle("selected", isSelected);
        item.classList.add("category");
        item.dataset.category = category;
        item.textContent = category;
        list.appendChild(item);
    });

    const helpItem = document.createElement("li");
    helpItem.classList.add("cat");
    helpItem.id = "help";
    helpItem.textContent = "Help";
    list.appendChild(helpItem);

    elements.categoriesContainer.replaceChildren(list);
    addHelpListeners();
    addCategoryListeners();
}

export function toggleCategory(event: Event): void {
    const target = event.currentTarget as HTMLElement | null;
    const clickedCategory = target?.dataset.category;
    if (clickedCategory) {
        toggleCat(clickedCategory);
    }
}

export function toggleCat(category: string): void {
    toggleCategorySelection(category);
    renderCategories();
    renderSearchResults(searchMe(getSearchFieldValue()));

    if (getState().selectedCategories.length < 1) {
        elements.container.replaceChildren();
    }
}

export function renderSearchResults(data: DataEntry[]): void {
    const fragment = document.createDocumentFragment();

    data.forEach((item) => {
        const column = document.createElement("div");
        column.className = "column";

        const heading = document.createElement("h2");
        heading.className = "up";

        const categorySpan = document.createElement("span");
        categorySpan.className = "cat";
        categorySpan.textContent = `${item.category.substring(0, 2)} `;

        const titleSpan = document.createElement("span");
        titleSpan.className = "title";
        titleSpan.textContent = item.title;

        const description = document.createElement("p");
        description.className = "description";
        description.textContent = item.content;

        heading.append(categorySpan, titleSpan);
        column.append(heading, description);
        fragment.appendChild(column);
    });

    elements.container.replaceChildren(fragment);
    highlightSearchString();
}

export function help(): void {
    const state = getState();
    const fragment = document.createDocumentFragment();

    fragment.appendChild(
        createSection("SEARCH", (paragraph) => {
            paragraph.textContent =
                "Type to initiate a fuzzy search for quick answers.";
        })
    );

    fragment.appendChild(
        createSection("BROWSE", (paragraph) => {
            paragraph.append(
                document.createTextNode("Enter an asterisk "),
                createCode("*"),
                document.createTextNode(
                    " to switch to browsing mode, displaying entries based on selected categories."
                )
            );
        })
    );

    fragment.appendChild(
        createSection("TOGGLE CATEGORIES", (paragraph) => {
            paragraph.append(
                document.createTextNode("Use "),
                createCode(`:c[1-${state.categories.length}]`),
                document.createTextNode(" to toggle categories. "),
                createCode(":c0"),
                document.createTextNode(
                    " toggles all. For example, "),
                createCode(":c2"),
                document.createTextNode(" toggles the second category.")
            );
        })
    );

    fragment.appendChild(
        createSection("THRESHOLD", (paragraph) => {
            paragraph.append(
                document.createTextNode(
                    "Default search threshold is 3. Adjust using the slider or "
                ),
                createCode(":t[0-9]"),
                document.createTextNode(" for precision (0 for exact match).")
            );
        })
    );

    fragment.appendChild(
        createSection("DATASET", (paragraph) => {
            paragraph.textContent = `Contains ${state.data.length} entries. ${renderStats(
                state.data
            )}`;
        })
    );

    fragment.appendChild(
        createSection("MODEL", (paragraph) => {
            paragraph.append(
                document.createTextNode("This dataset was generated using the LLM "),
                createLink(
                    "Dolphin 2.0 Mistral 7B",
                    "https://huggingface.co/TheBloke/dolphin-2.0-mistral-7B-GGUF"
                ),
                document.createTextNode(".")
            );
        })
    );

    fragment.appendChild(
        createSection("COPYLEFT & -RIGHT", (paragraph) => {
            paragraph.append(
                document.createTextNode("By "),
                createLink("lonplay45", "https://lp45.net"),
                document.createTextNode(
                    ", licensed under the "
                ),
                createLink(
                    "MIT License",
                    "https://github.com/longplay45/interview/blob/main/LICENSE"
                ),
                document.createTextNode(". Source code on "),
                createLink(
                    "GitHub",
                    "https://github.com/longplay45/interview"
                ),
                document.createTextNode(".")
            );
        })
    );

    fragment.appendChild(
        createSection("LEGALS", (paragraph) => {
            paragraph.append(
                document.createTextNode("Learn more about the project: "),
                createLink("Imprint", "https://lp45.net/imprint/"),
                document.createTextNode(".")
            );
        })
    );

    elements.container.replaceChildren(fragment);
    elements.searchField.focus();
    elements.searchField.value = "";
}

function createSection(
    title: string,
    contentBuilder: (paragraph: HTMLParagraphElement) => void
): HTMLDivElement {
    const section = document.createElement("div");
    const heading = document.createElement("h2");
    heading.textContent = title;

    const paragraph = document.createElement("p");
    contentBuilder(paragraph);

    section.append(heading, paragraph);
    return section;
}

function createCode(text: string): HTMLElement {
    const code = document.createElement("code");
    code.className = "help";
    code.textContent = text;
    return code;
}

function createLink(text: string, href: string): HTMLAnchorElement {
    const link = document.createElement("a");
    link.className = "help";
    link.href = href;
    link.textContent = text;
    return link;
}

function renderStats(data: DataEntry[]): string {
    const countEntriesPerCategory = data.reduce<Record<string, number>>(
        (accumulator, entry) => {
            accumulator[entry.category] = (accumulator[entry.category] || 0) + 1;
            return accumulator;
        },
        {}
    );

    return Object.entries(countEntriesPerCategory)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([category, count]) => `${category}: ${count}`)
        .join(", ");
}

export function threshold(): void {
    renderContainer(`Fuzzy search threshold: ${getState().threshold}.`);
}

export function renderContainer(text: string): void {
    elements.container.replaceChildren();

    if (!text) {
        return;
    }

    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    elements.container.appendChild(paragraph);
}
