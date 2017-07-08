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
			head: ["itemId", "product name", "listed Price"],

		});

		for (var i = 0; i<results.length; i++){
			table.push(
				[results[i].item_id, results[i].product_name, results[i].price]
				);
		}
		console.log(table.toString());
		promptQuestions(results);
		
	})

	function promptQuestions(results) {
	  inquirer
	    .prompt([{
	      name: "itemId",
	      type: "input",
	      message: "What is the Item ID that you are looking for?",
	    }, {
	    	name: "quantityInput",
	 	  	type: "input",
	 	  	message: "How many would you Like?"
	    }])
	    .then(function(customerInput){
	    	console.log(customerInput.itemId);
	    	
	    	connection.query("SELECT * FROM products WHERE item_id =?",[customerInput.itemId],
	    		
	    		function(error, results) {
	    			
	    			if (error){
	    				console.log("item does not exist");
	    			} 
	    			console.log(results);
	    			
	    			
	    			var totalPrice = results[0].price;
	    			if (customerInput.quantityInput < results[0].stock_quantity){
	    				connection.query("UPDATE products SET stock_quantity= stock_quantity - ? WHERE item_id = ?", [customerInput.quantityInput, customerInput.itemId], function(error, results) {
	    					// if (error) throw error;
	    					console.log("Order Competed. Your total is", totalPrice * customerInput.quantityInput);
	    				})
	    			} 
	    			else {
	    					console.log("Not enough in stock");

	    					promptQuestions();

	    				}
	    			})
	    		})
	    	}

});	
	 
