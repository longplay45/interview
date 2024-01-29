// render.js

import * as elements from "./elements.js";
import { getSearchFieldValue, searchMe } from "./search.js";
import { addCategoryListeners, addHelpListeners } from "./events.js";
import { highlightSearchString } from "./highlight.js";

export function renderCategories(): void {
    const categories = globalThis.CATS.sort();
    const ul = document.createElement('ul');
    ul.classList.add('navigation');

    categories.forEach((category:any) => {
        const isSelected = globalThis.CATS_SELECTED.includes(category);
        const li = document.createElement('li');
        li.classList.toggle('selected', isSelected);
        li.classList.add('category')
        li.dataset.category = category;
        li.textContent = category;
        ul.appendChild(li);
    });

    const li = document.createElement('li');
    li.classList.add('cat');
    li.id = 'help';
    li.textContent = 'Help';
    ul.appendChild(li);

    const elm = document.getElementById('categories');
    if (elm != null) {
        elm.innerHTML = '';
        elm.appendChild(ul);

    }
    addHelpListeners()
    addCategoryListeners()
}

export function toggleCategory(event: any): void {
    const clickedCategory = event.target.dataset.category
    if (clickedCategory) toggleCat(clickedCategory)
}

export function toggleCat(category: string): void {
    console.log('category: ', category)
    const index = globalThis.CATS_SELECTED.indexOf(category)

    if (index > -1) {
        globalThis.CATS_SELECTED.splice(index, 1)
    } else {
        globalThis.CATS_SELECTED.push(category)
    }
    renderCategories()
    addHelpListeners()
    addCategoryListeners()
    renderSearchResults(searchMe(getSearchFieldValue()))
    if (globalThis.CATS_SELECTED < 1) elements.container.innerHTML = ''
}

export function renderSearchResults(data: any[]): void {
    const container = elements.container
    if (container) {
        container.innerHTML = '';

        data.forEach(item => {
            const column = document.createElement('div');
            column.className = 'column';

            const h2 = document.createElement('h2');
            h2.className = 'up';

            const categorySpan = document.createElement('span');
            categorySpan.className = 'cat';
            categorySpan.textContent = item.category.substr(0, 2) + ' ';

            const titleSpan = document.createElement('span');
            titleSpan.className = 'title';
            titleSpan.textContent = item.title;

            const description = document.createElement('p');
            description.className = 'description';
            description.textContent = item.content;

            h2.appendChild(categorySpan);
            h2.appendChild(titleSpan);
            column.appendChild(h2);
            column.appendChild(description);

            container.appendChild(column);
        });
    }

    highlightSearchString();
}

export function help(): void {
    elements.container.innerHTML = `
    <div>
    <h2>Search</h2>
    <p>Type to initiate a fuzzy search for quick answers.</p>
</div>
<div>
    <h2>Browse</h2>
    <p>Enter an asterisk (<b>*</b>) to switch to browsing mode, displaying entries based on selected categories.</p>
</div>
<div>
    <h2>Toggle Categories</h2>
    <p>Use <code>:c[1-${globalThis.CATS.length}]</code> to toggle categories. <code>:c0</code> toggles all. E.g., <code>:c2</code> toggles the second category.</p>
</div>
<div>
    <h2>Threshold</h2>
    <p>Default search threshold is 6. Adjust using the magenta slider or <code>:t[0-9]</code> for precision (0 for exact match).</p>
</div>
<div>
    <h2>Dataset</h2>
    <p>Contains 1259 entries across six categories: BI (167), DA (170), Excel (153), ML (359), Python (161), SQL (249). Last updated: 2024-01-28.</p>
</div>
<div>
    <h2>Copyleft & Copyright</h2>
    <p>Project licensed under the <a class='help' href="https://github.com/longplay45/interview/blob/main/LICENSE">MIT License</a>. Source code on <a class='help' href="https://github.com/longplay45/interview">GitHub</a>.</p>
</div>
<div>
    <h2>Legals</h2>
    <p>Learn more about the project: <a class='help' href="https://lp45.net/imprint/">Imprint</a>.</p>
</div>

`
    elements.searchField.focus()
    elements.searchField.value = ''
}

export function threshold() {
    renderContainer(`Fuzzy search threshold: ${globalThis.THRESHOLD}.`)
}

export function renderContainer(html: any): void {
    elements.container.innerHTML = html
}
