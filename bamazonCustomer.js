var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bamazon'
});

connection.connect(function(error,results){
	connection.query("SELECT item_id, product_name, price FROM products" , function(error, results){
		if (error) throw error;

		
		var table = new Table({
			head: ["item id", "product name", "listed price"],

		});

		for (var i = 0; i<results.length; i++){
			table.push(
				[results[i].item_id, results[i].product_name, results[i].price]
				);
		}
		console.log(table.toString());
		itemSearch();
		
	})

	function itemSearch() {
	  inquirer
	    .prompt({
	      name: "item_id",
	      type: "input",
	      message: "What is the Item ID that you are looking for?"
	    })
	    .then(function(answer){
	    	console.log(answer.item_id);
	    	connection.query("SELECT * FROM products WHERE ?",{item_id: answer.item_id},
	    		function(error, results) {
	    			console.log(results);
	    		})
	    	quantity();
	    })
	 }
	 function quantity() {
	 	inquirer
	 	  .prompt({
	 	  	name: "stock_quantity",
	 	  	type: "input",
	 	  	message: "How many would you Like?"
	 	})
	 	.then(function(answer){
	 		console.log(answer.stock_quantity);
	 		connection.query("SELECT * FROM products WHERE id_input ? ",{stock_quantity: answer.stock_quantity},
	 			function(error, results) {
	 				if (stock_quantity<answer.stock_quantity){
	 					console.log("insufficient Inventory!");
	 				}else{
	 					console.log("");
	 					console.log(answer.stock_quantity + "Purchased");
	 					console.log(results[0].product_name + "" + resluts[0].price);
	 				}
	 			})
	 		})
	 	}
});