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
    promptCustomer(res);
  });
}

function promptCustomer(products) {
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
    // if none in stock, exit, else: 
    console.log('You chose ' + products[res.choice].product_name);
    inquirer.prompt({
      type: 'input',
      name: 'quantity',
      message: "How many?",
      filter: (input) => parseInt(input, 10),
      validate: (input) => {
        if (Number.isNaN(input)) return 'Enter a number!';
        else if (input > products[res.choice].stock_quantity) return 'There\'s not enough in stock!';
        return true;
      }
    }).then((res2) => {
      console.log('You just purchased (' + res2.quantity + '):');
      console.log(products[res.choice].product_name);
    })
  });
}