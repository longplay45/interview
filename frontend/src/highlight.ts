//highlight.ts

import { getSearchFieldValue } from "./search";

export function highlightSearchString(): void {
    const titles = document.querySelectorAll('.title');

    const search = getSearchFieldValue().trim();
    const searchArray = search.split(' ').filter(term => term.length > 0);

    if (searchArray.length > 0) {
        titles.forEach(title => {
            let titleHTML = title.innerHTML;

            searchArray.forEach((searchTerm: string, index: number) => {
                const className = `highlight-${index % searchArray.length}`;
                const regex = new RegExp(`(?<!<[^>]*)${escapeRegExp(searchTerm)}`, 'gi');
                titleHTML = titleHTML.replace(regex, `<span class="${className}">${searchTerm}</span>`);
            });

            title.innerHTML = titleHTML;
        });
    }

    const counter = searchArray.filter(term => term.length > 0).length;
    renderStats(counter);
}

function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}


function renderStats(tocken: number) {
    const elm = document.getElementById('tocken') as HTMLInputElement;
    let tockens: string[] = []
    if (elm) elm.innerHTML = ''
    for (let i = 0; i < tocken; i++) {

        tockens.push(`<span style="width:${(100 / tocken)}%;" class="bg line highlight-${i}"></span>`)
    }
    if (elm) elm.innerHTML = tockens.reverse().join('')
}