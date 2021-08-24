module.exports = {
    name: "Make Discord Button",

    description: "Make a Discord Button",

    category: "Buttons",

	async init(DBB){
        const disbutton = await DBB.Core.require('discord-buttons');
        disbutton(DBB.DiscordJS.client);
    },
	
    inputs: [
		{
			"id": "action",
            "name": "Actiom",
            "description": "Type: Action\n\nDescription: Executes this block.",
            "types": ["action"]
		},
        {
            "id": "setStyle",
            "name": "Style",
            "description": "Type: Text\n\nDescription: The Style to use.",
            "types": ["text"],
            "required": true
        },
		{
            "id": "setLabel",
            "name": "Label",
            "description": "Type: Text\n\nDescription: The Lable of the Button.",
            "types": ["text"],
            "required": true
        },
		{
		
            "id": "setEmoji",
            "name": "Emoji",
            "description": "Type: Text\n\nDescription: The Emoji of the Button.",
            "types": ["text"]
        },
		{
            "id": "setURL",
            "name": "URL",
            "description": "Type: Text\n\nDescription: The URL of the Button.",
            "types": ["text"]
        },
		{
            "id": "setID",
            "name": "Event-ID",
            "description": "Type: Text\n\nDescription: The ID of the Button (for the Events).",
            "types": ["text"]
        },
		{
            "id": "setDisabled",
            "name": "Disabled",
            "description": "Type: Boolean\n\nDescription: Wheater the Button is disabled (Leave Blank for Enabled).",
            "types": ["boolean"]
        }
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
            "id": "button",
            "name": "Button",
            "description": "Type: Text\n\nDescription: The Button.",
            "types": ["object"]
        }
    ],

    async code(cache) {
		const { MessageButton } = await this.require('discord-buttons');
        let button = new MessageButton();
        ["setStyle", "setLabel", "setEmoji", "setURL", "setID", "setDisabled"].forEach(setting => {
            let toSET = this.GetInputValue(setting, cache);
            if(setting === "setStyle" && typeof toSET === "undefined") toSET = "gray"
            if(typeof toSET === "undefined") return
			
            button[setting](toSET);
        });

        this.StoreOutputValue(button, "button", cache)
        this.RunNextBlock("action", cache);       
    }
}