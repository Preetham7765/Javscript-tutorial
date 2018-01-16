var budgetController = (function(){


    var expense = function (Id,content,value){
        
            this.Id = Id;
            this.content = content;
            this.value = value;
            this.percentage = -1;
        
    };
        
    var income = function (Id,content,value){
        
        this.Id = Id;
        this.content = content;
        this.value = value;
    
    };
    
    expense.prototype.calculatePercentage = function(totalIncome){
    
        
        if(totalIncome > 0)
            this.percentage = Math.round((this.value / totalIncome) * 100);
        else
            this.percentage = -1;
        
    
    };
    
    expense.prototype.getPercentage = function(){
    
        return this.percentage;
    
    };
    
    
    var data = {
        
                items:{
                
                    exp:[],
                    inc:[]
         
                },
                
                totals:{
                    exp:0,
                    inc:0
                
                },
                
                budget : 0,
                percentage : -1
            
            };
            
      var calculateSum = function(type){
      
            var sum=0;
            
            typeArr = data.items[type];
            typeArr.forEach(function(curVal){
                sum += curVal.value; 
            });
            
            data.totals[type] = sum;
      
      };      
    
    return{ 
    
        addItem: function(type,content,value){
        
        
            if(data.items[type].length > 0)
                Id = data.items[type].length +1;
            else
                Id = 1;
            
            if(type === 'exp')
                var newItem = new  expense(Id,content,value);
            else if(type === 'inc'){
            
                var newItem = new income(Id,content,value);
            }
            
            data.items[type].push(newItem);
    
            return newItem;
        },
        
        deleteItem : function(type,id){
                
            var index,ids;
        
            // find the id of the item to be deleted
            ids = data.items[type].map(function(cur){
                return cur.Id;               
            }); 

            index = ids.indexOf(id);

            if(index !== -1)
                data.items[type].splice(index,1);
            
            
        
        },
        
        calBudget : function(){
        
            calculateSum('exp');
            calculateSum('inc');
            
            data.budget = data.totals.inc - data.totals.exp;
            
            if(data.totals.inc > 0)
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            else
                data.percentage = -1;
                
        
        },
        
        calPercent : function(){
        
            data.items.exp.forEach(function(cur){
                
                cur.calculatePercentage(data.totals.inc); 
            
            });
        
        
        },
        
        
        getBudget : function(){
        
            return{
            
                budget : data.budget,
                incSum : data.totals.inc,
                expSum : data.totals.exp,
                percentage : data.percentage
            
            }; 
        
        },
        
        getPercentages : function(){
            
            var perArr;
            
            perArr = data.items.exp.map(function(cur){
                return cur.getPercentage();
            
            });
            
            
            return perArr;
            
        },
        
        testing: function() {
            console.log(data);
        }
        
    };

})();


var UIController = (function(){
        
        var DOMStrings = {
        
            inputType :".add__type",
            inputDescription : ".add__description",
            inputValue : ".add__value",
            inputBtn : ".add__btn",
            incomeLabel : ".income__list",
            expensesLabel : ".expenses__list",
            budgetValue : ".budget__value",
            incomeValue : ".budget__income--value",
            expensesValue : ".budget__expenses--value",
            perValue : ".budget__expenses--percentage",
            descriptionLabel : ".add__description",
            valueLabel : ".add__value",
            container : ".container",
            perExpenses : ".item__percentage",
            monthLabel : ".budget__title--month"        
            
        };
        
        var formatNumber = function(num,type){
            
                var numSplit,int,dec;
            
                num = Math.abs(num);            
                num = num.toFixed(2);
                
                numSplit = num.split('.');
                int = numSplit[0];
                dec = numSplit[1];
                
                if(int.length > 3)
                    int = int.substr(0,int.length - 3) + ',' + int.substr(int.length-3,3);
                
                return (type === 'exp'? '-' :'+') + ' ' + int + '.' + dec;                
        };
        
        var nodeListForEach = function(nodeList,callback){
                
                    for(var i = 0; i<nodeList.length;i++)
                        callback(nodeList[i],i);
                
        };
       
        return {
        
            getInput : function(){
            
                return {
                    type : document.querySelector(DOMStrings.inputType).value,
                    content : document.querySelector(DOMStrings.inputDescription).value,
                    value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
                };      
            },
         
               
            getDOMStrings: function(){
            
                    return DOMStrings;
            },
            
            addItems: function(obj,type){
                
                var html,element;

                if(type === 'inc'){
                    element = DOMStrings.incomeLabel;
                    html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div      class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }
                else if (type === 'exp'){
                    element = DOMStrings.expensesLabel;
                    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';                
                }
                
                
                
                newHtml = html.replace('%id',obj.Id);
                newHtml = newHtml.replace('%description%',obj.content);
                newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));
                
                document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
                           
            },
            
            showBudget : function(obj){
            
                var type;
                
                type = obj.budget > 0 ? 'inc' : 'exp'; 
                
                document.querySelector(DOMStrings.budgetValue).textContent = formatNumber(obj.budget,type);
                document.querySelector(DOMStrings.incomeValue).textContent = formatNumber(obj.incSum,'inc');
                document.querySelector(DOMStrings.expensesValue).textContent = formatNumber(obj.expSum,'exp');
                
                if(obj.percentage > 0){
                    document.querySelector(DOMStrings.perValue).textContent = obj.percentage + '%';
                
                }
                else{
                
                    document.querySelector(DOMStrings.perValue).textContent = "---";
                }
                
            
            },
            
            showPercentages : function(perArr){
            
                var nodeList = document.querySelectorAll(DOMStrings.perExpenses);
                
                console.log(nodeList);
                                
                
                nodeListForEach(nodeList,function(cur,index){
                                
                    if(perArr[index] >0)            
                        cur.textContent = perArr[index] + "%";
                    else
                        cur.textContent = "---";
                
                });
                
            
            
            },
            
            clearFields : function(){
                
                var fieldList,fieldARR;
            
                fieldList = document.querySelectorAll(DOMStrings.descriptionLabel + ',' + DOMStrings.valueLabel);
                fieldArr = Array.prototype.slice.call(fieldList);
                fieldArr.forEach(function(cur,idx,array){
                    cur.value = "";
                });
                
                fieldArr[0].focus();
            
            
            },
            
            removeItem : function(selectorId){
                var el;
                el = document.getElementById(selectorId);
                el.parentNode.removeChild(el);
            
            },
            
            showDate : function(){
            
                var now,month,months,year;
                
                now = new Date();
                months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                month = now.getMonth();
                year = now.getFullYear();
                
                document.querySelector(DOMStrings.monthLabel).textContent = months[month] + ', ' + year;
            },
            
            changedType : function(){
            
                nodeList = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputValue + ',' + DOMStrings.inputDescription); 
                nodeListForEach(nodeList,function(cur){
                   cur.classList.toggle('red-focus');        
                });
                 
                document.querySelector(DOMStrings.inputBtn).classList.toggle('red'); 
                
            }
            
            
        
        };
     
})(); 
                   


var mainAppController = (function(UIctrl,budgetctrl){

    
     var updateBudget = function(){
  
           var budget,percentage;
           
        //Calculate the Budget
          budgetctrl.calBudget();
          budget = budgetctrl.getBudget();
          
        
        //Update budget and percentage on UI
            
          UIctrl.showBudget(budget);
        
             
     
     };
     
     var updatePercentages = function(){
        
            var PerArr ;
     
            //calculate the new percentages
            budgetctrl.calPercent();
            
            //get the new percentages
            perArr = budgetctrl.getPercentages();

            //updateUI
            console.log(perArr)
            UIctrl.showPercentages(perArr);
     
     
     }


    var  setUpEventListners = function(){
        
        var nodeList;
        var DOM = UIctrl.getDOMStrings();
        
        document.addEventListener('keypress',function(event){
    
            if(event.keyCode === 13 || event.which === 13){
                cntrlAddItem();
            
            }
    
        });
    
        document.querySelector(DOM.inputBtn).addEventListener('click',cntrlAddItem); 
        document.querySelector(DOM.container).addEventListener('click',cntrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change',UIctrl.changedType);
        

        
    };

    
    var cntrlAddItem = function () {
    
        // Take Input from User
        var input = UIctrl.getInput();
     
        if (input.description != "" && input.value != 0 && !isNaN(input.value)){
        //Add it to the BudgetController datastructure
            newItem = budgetctrl.addItem(input.type,input.content,input.value);
           
            //Update the new Item to the UI
            UIctrl.addItems(newItem,input.type);
            
            //Clear all Fields
            UIctrl.clearFields();
            
            //Calculate and update the budget
            updateBudget();
            
            //update Percentage
            updatePercentages();
            
            
         }         
    
    }
    
    var cntrlDeleteItem = function(event){
        
        var itemID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(itemID);
        
        if(itemID){
            splitID = itemID.split("-");
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
        
            //delete the item from the data structure
            budgetctrl.deleteItem(type,ID);
            
            //Remove the item from the UI
            UIctrl.removeItem(itemID);
            

            //Update the budget
            updateBudget();
            
            
            //Update Percentages
            updatePercentages();
        }    
        
    
    
    }
    
    
    return {
    
        init : function(){
            console.log("Application Started");
            UIctrl.showDate();
            UIctrl.showBudget({
                budget : 0,
                incSum : 0,
                expSum : 0,
                percentage : 0                            
            });   
            setUpEventListners();
            
        }    
    }    
    
    
})(UIController,budgetController);

mainAppController.init();

