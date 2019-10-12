class Profile{
	constructor(obj) {
		this.source = obj;
		this.username = obj.username;
		this.firstname = obj.name.firstName;
		this.lastname = obj.name.lastName;
		this.password = obj.password;
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
}


function main() {
	const Ivan = new Profile({
                    username: 'ivan',
                    name: { firstName: 'Ivan', lastName: 'Chernyshev' },
                    password: 'ivanspass',
                });


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
					console.log('Уже почти..');
					Ivan.addMoney({ currency: 'RUB', amount: 100 }, (err, data) => {
				        if (err) {
				                console.error('Error during adding money to Ivan');
				        } else {
				                console.log(`Added 500000 euros to Ivan`);
				    	}
				    });
				}
			});
		}
	});



}

main();