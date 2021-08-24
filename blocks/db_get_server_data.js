module.exports = {
    name: "Get/Set Server Data (DB)",

    description: "Used to save and get Serverrelated Data from the Database (simple).",

    category: "DB",

    inputs: [
		{
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "server",
            "name": "Server",
            "description": "Type: object, text\n\nDescription: The Server the data belongs to.\nCan be the ID as Text input.",
            "required" : true,
            "types": ["object", "text"]
        },
        {
            "id": "query",
            "name": "The Search Query",
            "description": "Type: text, number, unknown\n\nDescription: The Relation to search for.",
            "types": ["text", "number", "unknown"]
        },
        {
            "id": "data",
            "name": "Data",
            "description": "Type: text, number, unknown\n\nDescription: The Data to do stuff with.",
            "types": ["text", "number", "unknown"]
        }
    ],

    options: [
        {
            "id": "var_type",
            "name": "The Var Type (USER, SETTINGS)",
            "description": "Description: The TYPE of information you want to get or edit.\nUser = Get USER Data related to the Server. (SerachQuery = UserID)\nSettings = Saved Settings for a Server.",
            "type": "SELECT",
            "options": {
                1: "USER",
                2: "SETTINGS"
            },
            "id": "use_type",
            "name": "Usage Type (GET, SET, ADD)",
            "description": "Description: What do you want to do with the Data?.\nGET = Get the Information of the search query\nSET = set the Data as Value\nADD = Add the Data to the existing Value (Usefull for Numbers)",
            "type": "SELECT",
            "options": {
                1: "GET",
                2: "SET",
                3: "ADD"
            }

        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "response",
            "name": "Data",
            "description": "Type: Object\n\nDescription: The Server Response Object of requested Data.",
            "types": ["object"]
        }
    ],

    async code(cache) {
		const dbcon = this.getDBB().database
		if(typeof dbcon === "undefined") return new Error("Database is not Initilized");
        const search = this.GetInputValue("search", cache);
        const data = this.GetInputValue("data", cache);
        
        const varspace = parseInt(this.GetOptionValue("var_type", cache));
        const usage = parseInt(this.GetOptionValue("use_type", cache));

        const tables = await dbcon.con.execute("show tables;");



		const [rows,fields] = await dbcon.con.execute(query);
		
		this.StoreOutputValue(rows, "response", cache);
        this.RunNextBlock("action", cache);      
    }
}