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
    <h2>SEARCH</h2>
    <p>Type to initiate a fuzzy search for quick answers.</p>
</div>
<div>
    <h2>BROWSE</h2>
    <p>Enter an asterisk <code class='help'><b>*</b></code> to switch to browsing mode, displaying entries based on selected categories.</p>
</div>
<div>
    <h2>TOGGLE CATEGORIES</h2>
    <p>Use <code class='help'>:c[1-${globalThis.CATS.length}]</code> to toggle categories. <code class='help'>:c0</code> toggles all. E.g., <code class='help'>:c2</code> toggles the second category.</p>
</div>
<div>
    <h2>THRESHOLD</h2>
    <p>Default search threshold is 3. Adjust using the magenta slider or <code class='help'>:t[0-9]</code> for precision (0 for exact match).</p>
</div>
<div>
    <h2>DATASET</h2>
    <p>Contains ${globalThis.DATA.length} entries.<p>${render_stats(globalThis.DATA)}</p></p> 
</div>
<div>
    <h2>MODEL</h2>
    <p>This dataset was generated using the LLM <a class="help" href="https://huggingface.co/TheBloke/dolphin-2.0-mistral-7B-GGUF">Dolphin 2.0 Mistral 7B</a>.</p> 
</div>
<div>
    <h2>COPYLEFT & -RIGHT</h2>
    <p>By <a class='help' href="https://lp45.net">lonplay45</a>, licensed under the <a class='help' href="https://github.com/longplay45/interview/blob/main/LICENSE">MIT License</a>. Source code on <a class='help' href="https://github.com/longplay45/interview">GitHub</a>.</p>
</div>
<div>
    <h2>LEGALS</h2>
    <p>Learn more about the project: <a class='help' href="https://lp45.net/imprint/">Imprint</a>.</p>
</div>

`
    elements.searchField.focus()
    elements.searchField.value = ''
}


function render_stats(data: any[]):String {
    interface Entry {
        id: number;
        category_id: number;
        category: string;
        title: string;
        content: string;
    }
    
    const entries: Entry[] = data;
    
    const countEntriesPerCategory = (entries: Entry[]): Record<string, number> => {
        return entries.reduce((accumulator, entry) => {
            const { category } = entry;
            accumulator[category] = (accumulator[category] || 0) + 1;
            return accumulator;
        }, {} as Record<string, number>);
    };
    
    const categoryCounts = countEntriesPerCategory(entries);
    const categoryCountsArray: [string, number][] = Object.entries(categoryCounts);
    const sortedCategoryCountsArray = categoryCountsArray.sort((a, b) => {
        return a[0].localeCompare(b[0]);
    });
    const categoryCountString = sortedCategoryCountsArray.map(([category, count]) => {
        return `${category}: ${count}`;
    }).join(", ");
    return categoryCountString;
}


export function threshold() {
    renderContainer(`Fuzzy search threshold: ${globalThis.THRESHOLD}.`)
}

export function renderContainer(html: any): void {
    elements.container.innerHTML = html
}
