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
            Be typing an * (Asterix) you enter the browsing mode diplaying all entries depending on the selected categories.
    </div>
    <div>
        <h2>Categories <code>:c[1-${globalThis.CATS.length}]</code></h2>
            Enter <b><code>:c[1-${globalThis.CATS.length}]</code></b> to toggle the categories, where<b><code>:c0</code></b> toggles them all on/off. For example <code>:c2</code> toogles the second category on off.
    </div>
    <div>
        <h2>Settings</h2>
            All parameter can be set via mouse interaction or shortcuts.
    </div>
    <div>
        <h2>Fuzzy search</h2>
        <table>
            <tr>
                <td>Token</td>
                <td>Description</td>
            </tr>
            <tr>
                <td><code>jscript</code></td>
                <td>Items that fuzzy match <code>jscript</code></td>
            </tr>
            <tr>
                <td><code>=scheme</code></td>
                <td>Items that are <code>scheme</code></td>
            </tr>
            <tr>
                <td><code>'python</code></td>
                <td>Items that include <code>python</code></td>
            </tr>
            <tr>
                <td><code>!ruby</code></td>
                <td>Items that do not include <code>ruby</code></td>
            </tr>
            <tr>
                <td><code>^java</code></td>
                <td>Items that start with <code>java</code></td>
            </tr>
            <tr>
                <td><code>!^earlang</code></td>
                <td>Items that do not start with <code>earlang</code></td>
            </tr>
            <tr>
                <td><code>.js$</code></td>
                <td>Items that end with <code>.js</code></td>
            </tr>
            <tr>
                <td><code>!.go$</code></td>
                <td>Items that do not end with <code>.go</code></td>
            </tr>
        </table>
    </div>
    <div>
        <h2>Threshold :t[0-9]</h2>
            Default setting is 6. Enter <b>:t1-5</b> to set the approximate string matching aka. Fuzzy Search Threshold from 0-9 where 0 is an exact match.
    </div>
    <div>
        <h2>Distance :d[0-1000]</h2>
            Default setting is 100. Enter <b>:d1-5</b> to set the approximate distance matching aka. Fuzzy Search Distance wich  determines how close the match must be to the fuzzy location from 0-1000 words where 0 is an exact match.
    </div>
    <div>
        <h2>Api</h2>
            The following endpoint is available.<br>
            <code>/api/get/strings/cats</code>
            where cats is optional, for example<br>
            <code>/api/get/DA TA BA SE/5</code>
            will produce <a href="/s=DA TA BA SE">this</a> outout.       
    </div>
    
`
}

export function threshold() {
    renderContainer(`Fuzzy search threshold: ${globalThis.THRESHOLD}.`)
}

export function renderContainer(html: any): void {
    elements.container.innerHTML = html
}