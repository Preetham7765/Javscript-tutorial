// Global app controller

import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import {elements, displaySpinner, removeSpinner} from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';


// global state object

const state = {};

/*
* SEARCH CONTROLLER
*/

const handleSearch = async () => {

    // get the search query
    const query = searchView.getInput();
    // const query = "pizza";

    if(query){
        searchView.clearQuery();
        // prepare UI
        searchView.clearPrevResult();
        displaySpinner(elements.searchRecipes);
        
        // create search obj with query
        state.search = new Search(query);
        try {
            await state.search.getSearchResults();

        // render it to UI 
            removeSpinner();
            searchView.displayRecips(state.search.results);
            
        } catch (error) {
            console.log("Something went wrong");        
        }
        
    }


}

elements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSearch();
});




elements.searchResPage.addEventListener('click', (e) => {
    const btn =  e.target.closest('.btn-inline');
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearPrevResult();
    }
    searchView.displayRecips(state.search.results, goToPage);
});





/*
* RECIPE CONTROLLER
*/

const handleRecipe = async () => {
    
    const id = window.location.hash.replace('#','');
    if(id){
        // Prepare UI
        recipeView.clearRecipe();
        displaySpinner(elements.recipe);
        if(state.search) searchView.highlightSelected(id);

        // Create Recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data
            await state.recipe.getRecipe();

            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            state.recipe.parseIngredients();
            
            //  Render recipes
            removeSpinner();
            recipeView.recipeRender(state.recipe);
        }
        catch(error) {
            console.log(error);
            alert('Error while loading recipe..');
        }
    }
};

['hashchange','load'].forEach( event => window.addEventListener(event, handleRecipe));

elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){

        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsUI(state.recipe);
        }
    }
    else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsUI(state.recipe);
            
    }else if(e.target.matches('.recipe__btn, .recipe__btn *')){
        console.log('recipe button');
        handleList();

    }

});


/*
    SHOPPING LIST  CONTROLLER

*/

const handleList = () => {

    if(!state.list) state.list = new List();

    state.recipe.ingredients.forEach( el => {
        
        const item = state.list.addItem(el);
        listView.renderItem(item);
    
    });

};


elements.shopping.addEventListener('click', e  => {

    const id = e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete , .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    }else if(e.target.matches('.shopping__count')){
        const val = parseInt(e.target.value,10);
        state.list.updateCount(id, val);    
    }
});