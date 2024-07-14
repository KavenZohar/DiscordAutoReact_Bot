import { createRequire } from 'module';
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { Word } from "./words/word.js";
import { Messages } from "./words/messages.js";

const require = createRequire(import.meta.url);
const config = require('./config.json');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel
    ]
});

const word = Word;
const messages = Messages;

client.on('ready', () => {
    console.log(`Đã đăng nhập vào ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    try {
        if (message.content.includes('discord.gg') || message.content.includes('discord.com/invite')) {
            const inviteCode = linkCheck(message.content);
            try {
                const invite = await client.fetchInvite(inviteCode);
                if (invite.guild.id === message.guild.id) {
                    return;
                } else {
                    message.delete();
                }
            } catch (error) {
                console.error(`Không thể kiểm tra liên kết mời: ${error}`);
            }
        }
    } catch (error) {
        console.error(`"${error}" đang bị lỗi, vui lòng fix.`);
    }
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    const randomNumber = Math.floor(Math.random() * messages.length);
    const content = message.content.toLowerCase();
    const check = messageCheck(content, word);
    const messageReply = messages[randomNumber];
    if (check){
        message.reply(messageReply);
        setTimeout(() => {
            message.delete();
        }, 1000);
    }
});

function linkCheck(message) {
    const regex1 = /https:\/\/discord\.gg\/(\w+)/;
    const regex2 = /https:\/\/discord\.com\/invite\/(\w+)/;

    let code = null;

    if (message.includes('discord.gg')) {
        const match = message.match(regex1);
        if (match) {
            code = match[1];
        }
    } else if (message.includes('discord.com/invite')) {
        const match = message.match(regex2);
        if (match) {
            code = match[1];
        }
    }
    return code;
}

function messageCheck (message, word) {
    for ( let words of word ) {
        if(message.includes(words)){
            return true;
        }
    }
    return false;
}

client.login(config.token);