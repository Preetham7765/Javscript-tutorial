import  uniqid  from 'uniqid';

export default class List {
    constructor(){
        this.items = new Array();
    }

    addItem(item) {
        const newItem = Object.assign({id: uniqid()}, item);
        this.items.push(newItem);
        return newItem;
    }

    updateCount(id, newCount){
        const item = this.items.find( el => el.id === id);
        item.count = newCount;
    }

    deleteItem(id) {
        const index = this.items.findIndex( el => el.id === id);
        this.items.splice(index,1);         
    }
    
}