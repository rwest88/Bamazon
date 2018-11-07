var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'bamazon'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('\nConnection successful at port 8889!\n');
  makeTable();
});

function makeTable() {

  connection.query('SELECT * FROM products', (err, res) => {
    console.log('id || Product Name                                                                   || Department           || Price    || Quantity       ');
    console.log('===========================================================================================================================================');
    for (i in res) {
      if (res[i].item_id < 10) res[i].item_id = " " + res[i].item_id;
      for (var j = res[i].product_name.length; j < 78; j++) res[i].product_name += " ";
      for (var j = res[i].department_name.length; j < 20; j++) res[i].department_name += " ";
      var price = '$' + (res[i].price / 100).toFixed(2);
      for (var j = price.length; j < 8; j++) price = " " + price;
      console.log(res[i].item_id + ' || ' + res[i].product_name + ' || ' + res[i].department_name + ' || ' + price + ' || ' + res[i].stock_quantity + ' in stock');
    }
    console.log('===========================================================================================================================================\n');
    promptCustomerForItem(res);
  });
}

function promptCustomerForItem(products) {

  inquirer.prompt({
    type: 'input',
    name: 'choice',
    message: 'What would you like to purchase? ',
    filter: (input) => parseInt(input, 10),
    validate: (input) => {
      if (Number.isNaN(input)) return 'Enter a valid product id #';
      return true;
    }
  }).then((res) => {
    res.choice -= 1;
    if (products[res.choice].stock_quantity == 0) {
      console.log("Sorry, none in stock!");
      return promptCustomer(products);
    }
    console.log('You chose ' + products[res.choice].product_name + ".\n");

    promptCustomerForQuantity(products[res.choice]);
  });
}

function promptCustomerForQuantity(product) {

  inquirer.prompt({
    type: 'input',
    name: 'quantity',
    message: "How many?",
    filter: (input) => parseInt(input, 10),
    validate: (input) => {
      if (Number.isNaN(input)) return 'Enter a number!';
      else if (input > product.stock_quantity) return 'There\'s not enough in stock!';
      return true;
    }
  }).then((userInput) => updateProductsSetQuantity(product, userInput));
}

function updateProductsSetQuantity(product, userInput) {

  connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', 
    [product.stock_quantity - userInput.quantity, product.item_id],
    (err, res) => {

      if (err) return console.log(err);

      chargeCustomer(product, userInput.quantity);
    });
}

function chargeCustomer(product, quantity) {

  var subtotal = (product.price / 100 * quantity).toFixed(2);
  var tax = (product.price * quantity * 0.05 / 100).toFixed(2);
  var total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);
  console.log('\nYou just purchased (' + quantity + '):');
  console.log(product.product_name + " ($" + (product.price / 100).toFixed(2) + ")");
  console.log('x ' + quantity 
    + "............................................................................($" 
    + subtotal + ")");
  console.log("Sales tax:......................................................................($" 
    + tax + ")");
  console.log("Total:.........................................................................($" 
    + total + ")\n");
  console.log("We've just charged $" 
    + total + " to your credit card. You will receive no email confirmation. Thanks!\n");

  // prompt customer for continue
  inquirer.prompt({
    type: 'input',
    name: 'choice',
    message: 'Would you like to make another purchase? (Y/N):'
  }).then((res) => {
    if (res.choice.toLowerCase() == 'y') makeTable();
    process.exit();
  });
}