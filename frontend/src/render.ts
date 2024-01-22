// render.js

import * as elements from "./elements.js";
import { getSearchFieldValue, searchMe } from "./search.js";
import { addCategoryListeners } from "./events.js";
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
    li.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://lp45.net/imprint/">Imprint</a>';
    ul.appendChild(li);

    const elm = document.getElementById('categories');
    if (elm != null) {
        elm.innerHTML = '';
        elm.appendChild(ul);

    }
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
            Just start typing and we'll be fuzzysearching the best we can, to get you straight to your answer.
    </div>
    <div>
        <h2>Browse *</h2>
            By typing an * (Asterix) you enter the browsing mode diplaying all entries depending on the selected categories.
    </div>
    <div>
        <h2>Toggle Categories</h2>
            Enter <b><code>:c[1-${globalThis.CATS.length}]</code></b> to toggle the categories, where<b><code>:c0</code></b> toggles them all on/off. For example <code>:c2</code> toogles the second category on off.
    </div>
    <div>
        <h2>Threshold</h2>
            The default threshold is set to 6. Use <b><code>:t0-9</code></b> to adjust the fuzzy search threshold from 0 to 9, where 0 represents an exact match.
    </div>   
`
}

export function threshold() {
    renderContainer(`Fuzzy search threshold: ${globalThis.THRESHOLD}.`)
}

export function renderContainer(html: any): void {
    elements.container.innerHTML = html
}
