import { getSearchFieldValue, searchMe } from "./search"
import * as elements from "./elements"
import * as render from "./render"
import * as keymap from "./keymap"


export function initEventListeners(): void {
    addCategoryListeners()
    addKeyUpListeners()
    addKeyDownListeners()
    addThresholdSliderListener()

}

export function addCategoryListeners(): void {
    const categoryElements = document.querySelectorAll('#categories li')
    categoryElements.forEach(element => {
        element.addEventListener('click', render.toggleCategory)
    })
}

function addKeyDownListeners(): void {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
        // set focus on every keystroke
        elements.searchField.focus()
        // stop reloading the page wenn input field is active.
        // #TODO CHANGE TO HTML DIV VERSION
        if (event.key === 'Enter') {
            event.preventDefault();
            elements.searchField.value = ''
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
        
        const metaKeys = ['Shift', 'Control', 'Alt', 'Meta']

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