
//Budget Controller
var budgetController = (function () {

    function Expense(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calculatePercentage = function (totalIncome) {
        this.percentage = totalIncome > 0 ?
            Math.round((this.value / totalIncome) * 100)
            : -1;
    }

    Expense.prototype.getPercentege = function () {
        return this.percentage;
    }

    function Income(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(element => {
            sum += element.value;
        });
        /**
         * 0
         * [200,400,100]
         * sum = 0 + 200
         * sum = 200 + 400
         * sum = 600 + 100
         * sum = 700
         */
        data.totals[type] = sum;

    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            //ID = last ID + 1

            // Create new ID
            ID = data.allItems[type].length > 0
                ? data.allItems[type][data.allItems[type].length - 1].id + 1 :
                0;

            //Create new item based on 'inc' or 'exp' type
            newItem = type === 'exp' || val < 0 ?
                new Expense(ID, des, val) :
                new Income(ID, des, val);

            // push into our data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        deleteItem: function (type, id) {
            var ids, index;
            //id = 6
            // ids = [1 2 4 6 8]
            //index = 3

            ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function () {
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calulate the percentage of income that we spent
            data.percentage = data.totals.inc > 0 ?
                Math.round((data.totals.exp / data.totals.inc) * 100)
                : -1;

            // Expense = 100 and income 200, spent 50% = 100/200 = 0.5 * 100
        },

        calculatePercentages: function () {

            /**
             * a=20
             * b=10
             * c=40
             * income = 100
             * a= 20/100 =20%
             * b=10/100 =10%
             * c=40/100=40%*/

            data.allItems.exp.forEach(currenteElement => {
                currenteElement.calculatePercentage(data.totals.inc);
            });

        },

        getPercenteges: function () {
            var allPercentages = data.allItems.exp.map(function (currentElemente) {
                return currentElemente.getPercentege();
            });

            return allPercentages;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function () {
            return data;
        }
    };

})();

// UI Controller
var UIController = (function () {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    var formatNumber = function (number, type) {
        var numberSplit, integerPart, decimalPart;
        /**
         * + or - before a number
         * exactly 2 decimal points
         * coma separating the thousands
         * 
         * 2310.4567 -> 2,310.46
         * 2000 -> 2,000.00
         */

        number = Math.abs(number);
        number = number.toFixed(2);


        numberSplit = number.split('.');

        integerPart = numberSplit[0];

        decimalPart = numberSplit[1];

        integerPart = integerPart.length > 3 ?
            `${integerPart.substr(0, integerPart.length - 3)},${integerPart.substr(integerPart.length - 3, 3)}`
            : integerPart;

        numberSplit[0] = integerPart;

        return `${(type === 'exp') ? '-' : '+'} ${numberSplit.join('.')} `;

    };

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: Number(document.querySelector(DOMstrings.inputValue).value),
            }
        },

        addListItems: function (obj, type) {
            var html, newHtml, element;

            // create HTML string with placeholder text
            /// Income
            html = type === 'inc' ? `<div class="item clearfix" id="inc-%id%">
                <div class="item__description">%description%</div>
                <div class="right clearfix">
                    <div class="item__value">%value%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
            </div>` :

                //Expense
                `<div class="item clearfix" id="exp-%id%">
                <div class="item__description">%description%</div>
                <div class="right clearfix">
                    <div class="item__value">%value%</div>
                    <div class="item__percentage">10%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
            </div>`;

            element = type === 'inc' ? DOMstrings.incomeContainer : DOMstrings.expensesContainer;

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


            // Insert data into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);



        },

        deleteListItem: function (selectorID) {

            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },

        clearFields: function () {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(element => {
                element.value = "";
            });

            fieldsArray[0].focus();
        },

        displayBudget: function (obj) {
            var type;

            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage > 0 ?
                `${obj.percentage} %`
                : '-----';
        },

        displayPercentages: function (percentages) {
            var fields;

            fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);


            nodeListForEach(fields, function (current, index) {
                current.textContent = percentages[index] > 0 ?
                    `${percentages[index]}%`
                    : '----';
            });

        },

        displayMonth: function () {
            var now, year, month, months, element;

            now = new Date();

            year = now.getFullYear();
            month = now.getMonth();
            element = document.querySelector(DOMstrings.dateLabel);

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Agust',
                'September', 'October', 'November', 'December'];

            element.textContent = `${months[month]}, ${year}`;
        },

        changeType: function () {
            var fields = document.querySelectorAll(`${DOMstrings.inputType},
           ${DOMstrings.inputDescription},
           ${DOMstrings.inputValue}`);

           nodeListForEach(fields,function(currentElement){
               currentElement.classList.toggle('red-focus');
           });

           document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        getDOMsrings: function () {
            return DOMstrings;
        }
    };
})();


// Global App Controller
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMsrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || event.wich === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.budgetLabel).textContent = Number(0).toFixed(2);

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);


        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType)
    }

    var updateBudget = function () {

        // 1. calculate de budget
        budgetCtrl.calculateBudget();

        // 2 Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the buget on th UI
        UICtrl.displayBudget(budget);

    };

    var updatePercentages = function () {
        // 1. calculate the percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercenteges();

        //3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function () {
        var input, newItem;
        // 1. Get the filed input data
        input = UICtrl.getInput();

        if (input.description != "" && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);


            // 3. Add the item to the UI
            UICtrl.addListItems(newItem, input.type);


            // 4. Clear the fields
            UICtrl.clearFields();

            // 5 calculate and update the budget
            updateBudget();

            //6. Calculate and update percentages
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = Number(splitID[1]);



            //1. delete the item from data structure
            budgetCtrl.deleteItem(type, ID);

            //2. delete the item for the UI
            UIController.deleteListItem(itemID);

            //3. Update and show the new buget
            updateBudget();

            //4. Calculate and update percentages
            updatePercentages();


        }
    };

    return {
        init: function () {
            console.log('Application has started.');
            UICtrl.displayMonth();
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();