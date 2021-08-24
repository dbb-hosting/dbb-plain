module.exports = {
    name: "Init DB",

    description: "Init the Database connection.",

    category: "DB",

	init(DBB){
		DBB.database = {
			initdb: (con) => {
				DBB.database.con = con
			},
			con: undefined
		}
	},
	
    inputs: [
		{
			"id": "action",
            "name": "Actiom",
            "description": "Type: Action\n\nDescription: Executes this block.",
            "types": ["action"]
		},
        {
            "id": "host",
            "name": "Host",
            "description": "Type: text\n\nDescription: The Database Server to connect to.",
            "types": ["text"]
        },
		{
            "id": "port",
            "name": "Port",
            "description": "Type: Number\n\nDescription: The Port of the DB Server.",
            "types": ["number"]
        },  
		{
            "id": "user",
            "name": "User",
            "description": "Type: text\n\nDescription: The user to connet to the DB,",
            "types": ["text"]
        },  
		{
            "id": "password",
            "name": "Password",
            "description": "Type: text\n\nDescription: The Password to connect with.",
            "types": ["text"]
        },  
		{
            "id": "database",
            "name": "Database",
            "description": "Type: text\n\nDescription: The database to Work in.",
            "types": ["text"]
        }		
    ],

    options: [],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        }
    ],

    async code(cache) {
		await this.require('mysql2');
		const mysql = require('mysql2/promise');
		const con = await mysql.createConnection({
				host: this.GetInputValue("host", cache),
				port: this.GetInputValue("port", cache),
				user: this.GetInputValue("user", cache),
				password: this.GetInputValue("password", cache),
				database: this.GetInputValue("database", cache)
		});
		
		this.getDBB().database.initdb(con)
		
        this.RunNextBlock("action", cache);       
    }
}