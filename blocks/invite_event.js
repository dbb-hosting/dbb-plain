module.exports = {
    name: "Invite [Event]",

    description: "Get Invite data of Guild-Join",

    category: "Invite Stuff",

    auto_execute: true,

	init(DBB){
		DBB.invites = {
			addInvite: (serverid, invite) => {
				DBB.invites.list[serverid][invite.code] = invite.uses
			},
			list: {}
		};
		const guilds = DBB.DiscordJS.client.guilds;
        guilds.cache.forEach(async unguild => {
            const guild = await unguild.fetch()
            DBB.invites.list[guild.id] = {}
            const invites = await guild.fetchInvites()
            invites.each(invite => DBB.invites.list[guild.id][invite.code] = invite.uses)
        });
    },
	
    inputs: [],

    options: [],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "invite",
            "name": "Invite",
            "description": "Type: Object, Undefined\n\nDescription: The Invite.",
            "types": ["object", "undefined"]
        }
    ],

    async code(cache) {
        this.events.on("guildMemberAdd", async (member) => {
            const guild = member.guild
            const invites = await guild.fetchInvites()
            const inviteCache = this.getDBB().invites.list[guild.id]
            const diff = invites.filter((invite) => inviteCache[invite.code] !== invite.uses)
            
            diff.each((invite) => this.getDBB().invites.addInvite(guild.id, invite))

            if(diff.size !== 1){
                this.RunNextBlock("action", cache);
                return;
            }
            const invite = diff.first();
            
            this.StoreOutputValue(invite, "invite", cache);
            this.RunNextBlock("action", cache);            
        })
    }
}