import axios from 'axios';
import {proxy, key} from '../config';


export default class Search {
    constructor(query){
        this.query = query;
    }

    async getSearchResults() {

        // request the server with the query
        try {
            const results = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.results = results.data.recipes;
        }
        catch(error) {
            console.log(error);
        }

    }

}