// events.js
import { getSearchFieldValue, searchMe } from "./search"
import * as elements from "./elements"
import * as render from "./render"
import * as keymap from "./keymap"


export function initEventListeners(): void {
    addHelpListeners()
    addCategoryListeners()
    addKeyUpListeners()
    addKeyDownListeners()
    addThresholdSliderListener()

}

export function addHelpListeners(): void {
    const helpElement = document.getElementById('help')
    helpElement?.addEventListener('click', render.help)
}

export function addCategoryListeners(): void {
    const categoryElements = document.querySelectorAll('#categories li')
    categoryElements.forEach(element => {
        element.addEventListener('click', render.toggleCategory)
    })
}

function addKeyDownListeners(): void {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
        const key = event.key;
        const isModifierKey = event.metaKey || event.altKey || event.ctrlKey;

        if (!isModifierKey || (event.metaKey && key === 'c') || (event.altKey && key === 'c') || (event.ctrlKey && key === 'c')) {
            // Allow Ctrl+C for copy action
            if ((event.metaKey && key === 'c') || (event.altKey && key === 'c') || (event.ctrlKey && key === 'c')) {
                // Do nothing special here, allowing the browser to handle Ctrl+C
                return;
            }

            // Set focus on every keystroke that's not solely a modifier key or part of an ignored combination
            elements.searchField.focus();

            if (key === 'Enter') {
                event.preventDefault();
                // Clear the search field when Enter is pressed
                elements.searchField.value = '';
            }
        }
    });
}



function addThresholdSliderListener(): void {
    elements.thresholdSlider.addEventListener('change', () => {
        const v: number = +elements.thresholdSlider.value //cast number
        globalThis.THRESHOLD = v / 10
        render.renderSearchResults(searchMe(getSearchFieldValue()))
    })
}


function addKeyUpListeners(): void {
    elements.searchField.addEventListener('keyup', (event) => {        
        // SEARCHFIELD listener
        
        // const metaKeys = ['Shift', 'Control', 'Alt', 'Meta']

        const searchValue = getSearchFieldValue();

        if (event.key === 'Escape') {
            //RESET SEARCHFIELD
            elements.searchField.value = ''
            render.renderContainer('')
            render.renderSearchResults(searchMe(getSearchFieldValue()))
        } else if (searchValue.startsWith(':')) {
            //KEYMAPPING COMMANDS
            keymap.matchString(searchValue)            
        } else {
            //DO REGULAR SEARCH
            render.renderSearchResults(searchMe(searchValue))
        }
    })
}