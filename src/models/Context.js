const Message = require("./Message");
const Member = require("./Member");
const Channel = require("./Channel");
const Guild = require("./Guild");
const Embed = require("../util/Message/Embed");

module.exports = class Context{
    constructor (message, client) {
        this.message = message;
        /**
         * The {@link Message} that the {@link Member} sent.
         */
        
        this.client = client;
        /**
         * The client or bot whatever you call it.
         */

        this.author = message.author;
        /**
         * The {@link Member} that sent the message.
         */

        this.channel = message.channel;
        /**
         * The {@link Channel} the message was sent in.
         */

        if (message.guild){
            this.guild = message.guild;
            /**
             * The {@link Guild} the message was sent in.
             */
        }
    }
    
    /**
     * Sends a message to the channel of this context.
     * @param {string|Embed} content The message or embed to send.
     * @param {Object} extra Extra options.
     * @returns {Message} The message that was sent.
     */
    async send(content, extra){
        const payload = {
            content: null,
            tts: false,
            embed: null
        };

        let options = {};

        if (typeof (content) == 'object') {
            options.embed = content;
        } else {
            payload.content = `${content}`;
            options = extra || null;
        }

        if (options) {
            if (options.tts && typeof (options.tts) == 'boolean') payload.tts = options.tts || false;
            if (options.embed && typeof (options.embed) == 'object') payload.embed = options.embed || null;
        }

        if (payload.content && payload.content == '') throw new TypeError(`Message content cannot be empty`);
        if (payload.content && payload.content.split('').length > 2000) throw new TypeError(`Message content cannot be over 2000 characters`);

        return await this.client.sendMessage(this.channel.id, payload, this);
    }

    /**
     * Searches the guild members with the name.
     * @param {string} name The name to search with.
     * @returns {Member} The member that was found.
     */
    getMember(name) {
        let match; 
        this.guild.members.forEach(member => {
            if (member.name == name || member.username == name || member.name.toLowerCase() == name || member.username.toLowerCase() == name){
                match = member;
            }
        });
        if(match){
            return match;
        } else {
            return this.message.mentions[0];
        }
    }
}