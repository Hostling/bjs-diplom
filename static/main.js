class Profile{
	constructor({
    	username,
    	name: { firstName, lastName },
   		password,
  	}) {
		this.source = {
	    	username,
	    	name: { firstName, lastName },
	   		password,
  		};
		this.username = username;
		this.password = password;
	}

	addUser(callback) {
		return ApiConnector.createUser(this.source, (error, data) => {
			console.log(`Creating user ${this.username}`);
			callback(error, data);
		});
	}

	auth(callback) {
		let credentials = {username: this.username,	password: this.password};
		//Решил в отдельную переменную выделить логин/пароль, так как строчка с вызовом функции и так громоздкая получилась
		return ApiConnector.performLogin(credentials, (error, data) => {
			console.log(`Authorizing user ${this.username}`);
			callback(error, data);
		});
	}

	addMoney({ currency, amount }, callback) {
        return ApiConnector.addMoney({ currency, amount }, (err, data) => {
            console.log(`Adding ${amount} of ${currency} to ${this.username}`);
            callback(err, data);
        });
    }

    convertMoney({fromCurrency, targetCurrency, targetAmount}, callback) {
    	return ApiConnector.convertMoney({fromCurrency, targetCurrency, targetAmount}, (err, data) => {
            console.log(`Converting ${fromCurrency} to ${targetAmount} ${targetCurrency}`);
            callback(err, data);
        });
    }

    transferMoney({to, amount}, callback) {
    	return ApiConnector.transferMoney({to, amount}, (err, data) => {
    		console.log(`Transfering ${amount} of Netcoins to ${to}`);
    		callback(err, data);
    	})
    }
}

function getStocks(callback) {
	return ApiConnector.getStocks(callback);
}

function main() {
	const Ivan = new Profile({
                    username: 'ivan',
                    name: { firstName: 'Ivan', lastName: 'Chernyshev' },
                    password: 'ivanspass',
                });

	const Petr = new Profile({
                    username: 'petr',
                    name: { firstName: 'Petr', lastName: 'Petrov' },
                    password: 'strongPassword',
                });

	let stocks;
	setTimeout(getStocks((err, data) => stocks = data[0]));

	Ivan.addUser((error, data) => {
		if(error) {
			console.error(`Error creating user ivan`);
		} else {
			console.log(`User ivan created!`);
			Ivan.auth((error, data) => {
				if(error) {
					console.error(`Error during authorization ivan`);
				} else {
					console.log(`User ivan authorized!`)
					Ivan.addMoney({ currency: 'EUR', amount: 50000 }, (err, data) => {
				        if (err) {
				                console.error('Error during adding money to Ivan');
				        } else {
				                console.log(`Added 50000 euros to Ivan`);
				            	//Конвертируем 500 Евро в неткоины
				            	let amountForConvertation = 500 * Number(stocks.EUR_NETCOIN);
				                Ivan.convertMoney({ fromCurrency: 'EUR', targetCurrency: 'NETCOIN', targetAmount: amountForConvertation}, (err, data) => {
				                	if(err) {
				                		console.error(`Error converting money`);
				                	} else {
				                		console.log('Converted to coins:', data);
				                		Petr.addUser((error, data) => {
				                			if(error) {
				                				console.error('Error creating user Petr');
				                			} else {
				                				Ivan.transferMoney({ to: 'petr', amount: amountForConvertation}, (err, data) => {
				                					if(err) {
				                						console.error('Error transfering money');
				                					} else {
				                						console.log(`Petr has got ${amountForConvertation} NETCOINS`);
				                					}
				                				});
				                			}
				                		});
				                	}
				                });
				    	}
				    });
				}
			});
		}
	});



}

main();