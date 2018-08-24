export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRecipes: document.querySelector('.results'),
    searchRecipeList: document.querySelector('.results__list'),
    searchResPage: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list')    
    
}

export const elementStrings = {
    spinner: 'loader',
}
export const displaySpinner = (parent) => {

    const markup = `
        <div class = "${elementStrings.spinner}">
            <svg>
                <use xlink:href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;

    parent.insertAdjacentHTML('afterbegin', markup);
}

export const removeSpinner = () => {

    const loader = document.querySelector(`.${elementStrings.spinner}`);
    if(loader) loader.parentElement.removeChild(loader);

}