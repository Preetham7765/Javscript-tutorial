import axios from 'axios';
import {proxy, key} from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe(){
        try {
           const res  = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
           this.title = res.data.recipe.title;
           this.author = res.data.recipe.publisher;           
           this.img = res.data.recipe.image_url; 
           this.source = res.data.recipe.source_url;
           this.ingredients = res.data.recipe.ingredients;
           
        } catch (error) {
            console.log(error);
        }
    }

    calcTime() {
        const numIngredients = this.ingredients.length;
        const periods = Math.ceil(numIngredients / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }


    parseIngredients(){

        // have a common ingredients.
        const unitMap = new Map();
        unitMap.set('tablespoos','tbsp');
        unitMap.set('tablespoon','tbsp');
        unitMap.set('teaspoons','tsp');
        unitMap.set('teaspoon','tsp');
        unitMap.set('ounces','oz');
        unitMap.set('ounce','oz');
        unitMap.set('cups','cup');
        unitMap.set('pounds','pounds');
        const  unitSet = new Set([...Array.from(unitMap.values()), 'kg', 'g']);
        const newIngredients = this.ingredients.map( item =>{


            let ingredient = item.toLowerCase();
            unitMap.forEach((value, key) => {
                ingredient = ingredient.replace(key, value);
            });


            //remove paranthesis.

            ingredient = ingredient.replace(/ *\([^)]*\) */g," ");

            // parse ingredients.
            const ingArr = ingredient.split(' ');
            const unitIdx = ingArr.findIndex(el => unitSet.has(el));
            let count;
            let objIng;
            if(unitIdx != -1) {
                const amount = ingArr.slice(0,unitIdx);
                if(amount.length == 1){
                    count = Number.parseFloat(eval(ingArr[0].replace('-','+'))).toFixed(1);
                }
                else{
                    count =  Number.parseFloat(eval(ingArr.slice(0,unitIdx).join('+'))).toFixed(1);
                }
                objIng = {
                    count,
                    unit: ingArr[unitIdx],
                    ingredient: ingArr.slice(unitIdx+1).join(' ')
                }

            }
            else if(parseInt(ingArr[0],10)) {
                // there are no units but has amount in the begining
                objIng = {
                    count: parseInt(ingArr[0],10),
                    unit:'',
                    ingredient: ingArr.slice(1).join(' ')
                }
                
            }else if(unitIdx === -1) {

                objIng = {
                    count: 1,
                    unit:'',
                    ingredient                
                }
            }

            
            return objIng;
        });
            

        this.ingredients = newIngredients;
    }

    updateServings(type){
        const newServings = type === 'inc' ? this.servings + 1 : this.servings - 1;

        this.ingredients.forEach( el => {
            el.count *= (newServings/this.servings);
        });
        
        this.servings = newServings;
    }
}

