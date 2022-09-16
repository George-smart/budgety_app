const budgetController = (()=>{
    class Expense{
        constructor(id, desc, value){
            this.id = id;
            this.desc = desc;
            this.value = value;
            this.percentage = -1
        }
        
        calculatePercentage(totalIncome){
            if(totalIncome > 0){
                this.percentage = Math.round((this.value / totalIncome) * 100)
            } else {
                this.percentage = -1
            }       
        }
        
        getPercentage(){
            return this.percentage
        }
    }

    class Income{
        constructor(id, desc, value){
            this.id = id;
            this.desc = desc;
            this.value = value;
        }      
        
    }

    let calculateTotal = (type) =>{
        let sum = 0
        data.allItems[type].forEach(cur =>{
            sum += cur.value
        })
        data.totals[type] = sum
    }

    let data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1,
        incCount: 0,
        expCount: 0
    }
    
    // const ADDED_ITEM_KEY = 'item.List'
    // const ADDED_ITEM_ID = 'selected_id'
    
    // function saveToLocalStorage(type){

    //     let data.allItems[type] = JSON.parse(localStorage.getItem(ADDED_ITEM_KEY)) || [];
    //     let selectedId = JSON.parse(localStorage.getItem(ADDED_ITEM_ID))
    // }
   

    return {
        addItem: (type, description, value)=>{
            let ID, newItem;

            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            } else {
                ID = 0
            }

            if(type === 'inc'){
                newItem = new Income(ID, description, value)
            } else if(type === 'exp'){
                newItem = new Expense(ID, description, value)
            }
            data.allItems[type].push(newItem)

            return newItem
        },

        calculateBudget: ()=>{
            calculateTotal('exp')
            calculateTotal('inc')

            // budget
            data.budget =  data.totals.inc - data.totals.exp

            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100) 
            } else {
                data.percentage = -1
            }
        },
        
        getBudget: ()=>{
            return {
                budget: data.budget,
                incomeTotal: data.totals.inc,
                expenseTotal: data.totals.exp,
                percentage: data.percentage
            }
        },
        
        calculatePercentages: ()=>{
            data.allItems.exp.forEach(cur =>{
                cur.calculatePercentage(data.totals.inc)
            })
        },

        getPercentages: ()=>{
            let allPer = data.allItems.exp.map(cur =>{
                return cur.getPercentage()
            })
            return allPer
        },

        deleteItem: (type, id)=>{
           let ids, index;

           ids = data.allItems[type].map(cur =>{
               return cur.id
           })

           index = ids.indexOf(id)

           if(index !== -1){
               data.allItems[type].splice(index, 1)
           }
           
        },

        calculateCount: (type, id)=>{
            let ids;

            ids = data.allItems[type].map(cur =>{
               return cur.id
           })
           
           if(type === 'inc'){
                if(ids.length >= data.incCount){
                    data.incCount += 1
                }
           } else if(type === 'exp'){
               if(ids.length >= data.expCount){
                   data.expCount += 1
               }
           }
           
        },

        deleteCount: (type, id)=>{
            let ids;

            ids = data.allItems[type].map(cur =>{
               return cur.id
           })
           
           if(type === 'inc'){
                if(ids.length < data.incCount){
                    data.incCount -= 1
                }
           } else if(type === 'exp'){
                if(ids.length < data.expCount){
                    data.expCount -= 1
                }
            }
        
        },

        getCount: ()=>{
            return {
                incomeCount: data.incCount,
                expenseCount: data.expCount
            }
        },

        testing: ()=>{
            console.log(data)
        }
    }

})();

const UIController = (() =>{
    const DOM = {
        addBtn: '.add__btn',
        addType: '.add__type',
        addDesc: '.add__description',
        addValue: '.add__value',
        incomeList: '.income__list',
        expenseList: '.expenses__list',
        incCount: '.income_record',
        expCount: '.expenses_record',
        budgetLabel: '.budget__value',
        IncLabel: '.budget__income--value',
        expLabel: '.budget__expenses--value',
        perctLabel: '.budget__expenses--percentage',
        container:  '.container',
        percentageLabel: '.item__percentage',
        timeLabel: '.budget__title--month'
    }
    

    const nodeListForEach = (list, callback)=>{
        for(let i = 0; i < list.length; i++){
            callback(list[i], i)
        }
    }

    const formatNumber = (num, type) =>{
        let numSplit, integ, dec

        num = Math.abs(num);
        num = num.toFixed(2)

        numSplit = num.split('.')
        integ = numSplit[0]
        dec = numSplit[1]

        if( integ.length > 3){
            integ = `${integ.substr(0, integ.length - 3)},${integ.substr(integ.length - 3, 3)}`
        }

        return `${(type === 'exp' ? '-' : '+')} ${integ}.${dec}` 
    } 

    return {
        getInput: ()=>{
            return {
                inputType: document.querySelector(DOM.addType).value,
                inputDesc: document.querySelector(DOM.addDesc).value,
                inputValue: parseInt(document.querySelector(DOM.addValue).value)
            }
        },

        addListItem: (obj, type)=>{
            let newItem, element, countItems;

            if(type === 'inc'){
                element = DOM.incomeList
                newItem = `<div class="item clearfix" id="inc-${obj.id}">
                <div class="item__description">${obj.desc}</div>
                <div class="right clearfix">
                    <div class="item__value">${formatNumber(obj.value, 'inc')}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline">d</i></button>
                    </div>
                </div>
                </div>`

            } else if(type === 'exp'){
                element = DOM.expenseList;
                newItem = `<div class="item clearfix" id="exp-${obj.id}">
                <div class="item__description">${obj.desc}</div>
                <div class="right clearfix">
                    <div class="item__value">${formatNumber(obj.value, 'exp')}</div>
                    <div class="item__percentage">21%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline">d</i></button>
                    </div>
                </div>
            </div>`
            
            }
            document.querySelector(element).insertAdjacentHTML('beforeend', newItem)
            

        },

        deleteListItem: (selectedID)=>{    
            let el = document.getElementById(selectedID);
            el.parentNode.removeChild(el)
        },

        addCounter: (type, obj)=>{
            let countItems;
            
            if(type === 'inc'){
                countItems = document.querySelector(DOM.incCount);
                countItems.classList.remove('hide') 
                countItems.innerText = obj.incomeCount == 1 ? `${obj.incomeCount} income added` : `${obj.incomeCount} incomes added`  
                if(obj.incomeCount === 0){
                    countItems.classList.add('hide')
                }
            } else if(type === 'exp'){
                countItems = document.querySelector(DOM.expCount);
                countItems.classList.remove('hide')
                countItems.innerText = obj.expenseCount == 1 ? `${obj.expenseCount} expense added` : `${obj.expenseCount} expenses added` 
                if(obj.expenseCount === 0){
                    countItems.classList.add('hide')
                }
            }

        },

        displayBudget: (obj)=>{
            let type;
            obj.budget > 0 ? type = 'inc' : type = 'exp'

            document.querySelector(DOM.budgetLabel).textContent = formatNumber(obj.budget, type) 
            document.querySelector(DOM.IncLabel).textContent = formatNumber(obj.incomeTotal, 'inc')
            document.querySelector(DOM.expLabel).textContent = formatNumber(obj.expenseTotal, 'exp')
            if(obj.percentage > 0){
                document.querySelector(DOM.perctLabel).textContent = `${obj.percentage} %`
            } else {
                document.querySelector(DOM.perctLabel).textContent = '---'
            }       
        },  

        clearField: ()=>{
            let field, fieldArr;

            field = document.querySelectorAll(`${DOM.addDesc}, ${DOM.addValue}`)

            fieldArr = Array.from(field)

            fieldArr.forEach(cur =>{
                cur.value = ""
            })

            fieldArr[0].focus()
        },

        displayPercentages: percentage =>{
            let field, newField;

            field = document.querySelectorAll(DOM.percentageLabel);

            // newField = Array.from(field)
            // newField.forEach((current, index) =>{
        
            // })  
            nodeListForEach(field, (current, index)=>{
                if(percentage[index] > 0){
                    current.textContent = `${percentage[index]} %`
                } else {
                    current.textContent = '---'
                }
            })
                
        },

        displayDate: ()=>{
            let timeContainer, now, month, months, year;
            timeContainer = document.querySelector(DOM.timeLabel);
            now = new Date()

            month = now.getMonth()
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            year = now.getFullYear();
            
            timeContainer.textContent = `${months[month]} ${year}`      
        },

        changedType: function() {
            
            const fields = document.querySelectorAll(`${DOM.addType},${DOM.addDesc},${DOM.addValue}`);
            
            nodeListForEach(fields, cur =>{
               cur.classList.toggle('red-focus'); 
            });
            
            document.querySelector(DOM.addBtn).classList.toggle('red');
            
        },

        getDomString: ()=>{
            return DOM
        }
    }

})();


const AppController = ((budgetCtrl, UICtrl) => {

    const setUpEventListner = ()=>{
        const DOMString = UICtrl.getDomString()

        document.querySelector(DOMString.addBtn).addEventListener('click', ctrlAddItem)

        document.querySelector(DOMString.container).addEventListener('click', ctrlDelItem)

        document.querySelector(DOMString.addType).addEventListener('change', ()=>{
            UICtrl.changedType()
        })

        document.addEventListener('keypress', (e)=>{
            if(e.keyCode === 13 || e.which === 13){
                ctrlAddItem()
            }
        })
    }
    
    function ctrlAddItem(){
        let input, newItem, counter, percentages;

        // get input 
        input = UICtrl.getInput();
        if(!isNaN(input.inputValue) && input.inputValue !== 0 && input.inputDesc !== ''){
            // get item from budget 
            newItem = budgetCtrl.addItem(input.inputType, input.inputDesc, input.inputValue)   
            // display to UI
            UICtrl.addListItem(newItem, input.inputType)
            //Clear input Field
            UICtrl.clearField()
            // calculate and Update budget
            updateBudget()
             //calculate Count
            budgetCtrl.calculateCount(input.inputType, newItem.id)
            // Add count
            counter = budgetCtrl.getCount()
            // display Count
            UICtrl.addCounter(input.inputType, counter)

            // calculate percentages
            budgetCtrl.calculatePercentages();
            // get Percentages
            percentages = budgetCtrl.getPercentages()
            // Display Percentages
            UICtrl.displayPercentages(percentages)
            
        }
    }

    function updateBudget(){
        let budget;
        // calculate Budget
        budgetCtrl.calculateBudget();
         //get Budget
        budget = budgetCtrl.getBudget()
        // Display Budget
        UICtrl.displayBudget(budget)
    
    }

    function ctrlDelItem(e){
        let itemID, type, splitId, id, counter;
        // get the id and the type
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id

        if(itemID){
             splitId = itemID.split('-')
            type = splitId[0];
            id = parseInt(splitId[1])
            // Delete from the budget
            budgetCtrl.deleteItem(type, id)
            // Update budget
            updateBudget()
            // Update UI
            UICtrl.deleteListItem(itemID)
            // delete Count
            budgetCtrl.deleteCount(type, id)
            counter = budgetCtrl.getCount()
            // update UI count
            UICtrl.addCounter(type, counter)
            
        }
       
    }

    return {
        init: ()=>{
            
            UICtrl.displayDate()
            UICtrl.displayBudget({
                budget: 0,
                incomeTotal: 0,
                expenseTotal: 0,
                percentage: -1
            });
            setUpEventListner()
            console.log('Application has started')
        }
    }
    
})(budgetController, UIController);



AppController.init()

