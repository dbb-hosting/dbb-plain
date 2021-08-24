module.exports = {
    name: "Advanced Querry DB",

    description: "Send SQL query to the Server",

    category: "DB",

    inputs: [
		{
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "query",
            "name": "SQL query",
            "description": "Type: text\n\nDescription: The Query to exec.",
            "types": ["text"]
        },  
    ],

    options: [],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "response",
            "name": "Server-response",
            "description": "Type: Object\n\nDescription: The Server Response Object needed to Respond to the Webclient.",
            "types": ["object", "unknown"]
        }
    ],

    async code(cache) {
		const dbcon = this.getDBB().database
		if(typeof dbcon === "undefined") return new Error("Database is not Initilized");

		const query = this.GetInputValue("query", cache);
		const [rows, fields] = await dbcon.con.execute(query);
		
		this.StoreOutputValue(rows, "response", cache);
        this.RunNextBlock("action", cache);      
    }
}