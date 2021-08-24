module.exports = {
    name: "Add Slashcommand",

    description: "Adds a Slashcommand",

    category: "A Slash Stuff",

    inputs: [
        {
            "id": "name",
            "name": "Command Name",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The message to add the reaction.",
            "types": ["text"],
            "required": true
        },
        {
            "id": "desc",
            "name": "Description",
            "description": "Acceptable Types: Text, Object, Unspecified\n\nDescription: The emoji (😀, 😂, etc...) or server emoji to add to the message.",
            "types": ["text"],
            "required": true
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

    code(cache) {
        const message = this.GetInputValue("message", cache);
        const emoji = this.GetInputValue("emoji", cache);

        message.react(emoji).then(() => {
            this.RunNextBlock("action", cache);
        });
    }
}