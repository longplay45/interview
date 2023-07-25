//highlight.ts

import { getSearchFieldValue } from "./search";

export function highlightSearchString(): void {

    const titles = document.getElementsByClassName('title');
    const search = getSearchFieldValue().trim();
    const searchArray = search.split(' ').filter(term => term.length > 0);

    if (searchArray.length > 0) {
        for (let i = 0; i < titles.length; i++) {
            const title = titles[i] as HTMLElement;
            const parser = new DOMParser();
            const doc = parser.parseFromString(title.innerHTML, 'text/html');

            searchArray.forEach((searchTerm: string, index: number) => {
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                const className = `highlight-${index % searchArray.length}`;

                const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
                let node: Text | null;
                while ((node = walker.nextNode() as Text | null)) {
                    if (
                        node.parentNode &&
                        node.parentNode instanceof HTMLElement &&
                        node.textContent
                    ) {
                        const parent = node.parentNode;

                        // Check that the parent of the text node is not a highlight span
                        if (!Array.from(parent.classList).some(c => c.startsWith('highlight-'))) {
                            const textParts = node.textContent.split(regex);
                            for (let i = 0; i < textParts.length; i++) {
                                if (i % 2 === 0) {
                                    parent.appendChild(doc.createTextNode(textParts[i]));
                                } else {
                                    const span = doc.createElement('span');
                                    span.className = className;
                                    span.textContent = textParts[i];
                                    parent.appendChild(span);
                                }
                            }
                            parent.removeChild(node);
                        }
                    }
                }
            });

            title.innerHTML = doc.body.innerHTML;
        }
    }


    let counter: number = 0
    for (let i = 0; i < searchArray.length; i++) {
        if (searchArray[i].length > 0) counter++
    }
    renderStats(counter)
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