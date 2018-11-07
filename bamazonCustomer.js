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
    console.log('\nid || Product Name                                                                   || Department           || Price    || Quantity       ');
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
      if (Number.isNaN(input) || input > products.length || input < 1) return 'Enter a valid product id #';
      if (products[input-1].stock_quantity == 0) return 'Sorry, none in stock!';
      return true;
    }
  }).then((res) => {
    console.log('You chose ' + products[res.choice-1].product_name + "\n");
    
    promptCustomerForQuantity(products[res.choice-1]);
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
  var tax = (subtotal * 0.055).toFixed(2);
  var total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);
  var dots = "................................................................................";

  console.log(`
    You just purchased (${quantity}):
    ${product.product_name} ($${(product.price / 100).toFixed(2)})

    x${quantity} ${dots.slice(quantity.toString().concat(subtotal).length)} ($${subtotal})
    Sales tax: ${dots.slice(9+tax.length)} ($${tax})
    Total: ${dots.slice(5+total.length)} ($${total})

    We've just charged $${total} to your credit card. You will receive no email confirmation. Thanks!
  `);

  // prompt customer for continue
  inquirer.prompt({
    type: 'input',
    name: 'choice',
    message: 'Would you like to make another purchase? (Y/N):'
  }).then((res) => {
    if (res.choice.toLowerCase() == 'y') makeTable();
    else process.exit();
  });

}