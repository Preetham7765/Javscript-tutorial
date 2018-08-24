import {elements} from './base';


const trimTitle = (title, limit = 20) => {
    if(title.length > limit ) {
        const trimmedTitle = [];
        const words = title.split(" ");
        words.reduce( (acc, cur) => {
            if(acc + cur.length < limit) {
                trimmedTitle.push(cur);
            }
            return acc + cur.length;

        }, 0);

        return `${trimmedTitle.join(' ')} ...`;
    }

    return title;
} 

const displayRecipe = (recipe) => {


    const markup = `
        <li>
            <a class="results__link results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${trimTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>`;

    elements.searchRecipeList.insertAdjacentHTML('beforeend', markup);

}

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto= "${ type === 'prev' ? page - 1 : page + 1}">
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${ type === 'prev' ? "left" : "right"}"></use>
    </svg>
    <span>Page ${ type === 'prev' ? page - 1 : page + 1}</span>
    </button>
`;

const displayButtons = (page, numResults, resPerPage) => {

    const pages = Math.ceil(numResults/resPerPage);
    let button;

    if(page === 1){
        // Display only next button
        button = createButton(page, 'next');
    }else if(pages > page) {
        // Display both prev and next buttons
        button = `${createButton(page, 'prev')}
                  ${createButton(page, 'next')}`;
    }else if(pages === page){
        // display prev button
        button = createButton(page, 'prev');        
    }

    elements.searchResPage.insertAdjacentHTML('afterbegin', button);

};

export const highlightSelected = (id) => {  
    if(document.querySelector(`.results__link--active`)) 
        document.querySelector(`.results__link--active`).classList.remove('results__link--active');

    document.querySelector(`a[href ="#${id}"]`).classList.add(`results__link--active`);

}


export const getInput = () => {
    return elements.searchInput.value;
};



export const displayRecips = (recipes, page=1, numsperpage = 10) => {

    const start = (page - 1) * numsperpage;
    const end = (page) * numsperpage;

    recipes.slice(start, end).forEach(displayRecipe);
    displayButtons(page,recipes.length, numsperpage);

};

export const clearQuery = () => {
    elements.searchInput.value = '';
};

export const clearPrevResult = () => {
    elements.searchRecipeList.innerHTML = '';
    elements.searchResPage.innerHTML = '';
};
 