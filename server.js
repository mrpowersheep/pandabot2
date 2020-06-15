const Discord = require("discord.js");
const client = new Discord.Client;
const botconfig = require("./botconfig.json");
const tokenfile = require("./token.json");
const bot = new Discord.Client({disableEveryone: true});
const fs = require('fs');

bot.on('ready', () => {
bot.user.setActivity("!help for help")
  
})

bot.on('guildCreate', guild => {
let defaultChannel = "";
guild.channels.forEach((channel) => {
  if(channel.type == "text" && defaultChannel == "") {
    if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
      defaultChannel = channel;
    }
  }
})

defaultChannel.send(`Hi, thanks for inviting me to ${guild}! To see the commands use !help`)


})

bot.on("guildMemberAdd", member => { 
member.send(`Whats up! ${member} Welcome to ${member.guild}! 😃`)
  
})

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  
  
if(cmd === `${prefix}kick`){

let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
if(!kUser) return message.channel.send("Can't find user!")
let kReason = args.join(" ").slice(22);
if(kReason.length < 1) return message.channel.send("Please supply a reason!")
if(!message.member.hasPermission("KICK_MEMBERS")) return message.channelsend("No can do pal!")
if(kUser.hasPermission("KICK_MEMBERS")) return message.channel.send("That person can't be kicked!")
  
let log = message.guild.channels.find(`name`, "logs")
if(!log) return message.channel.send("Can't find logs channel.")
  
log.send(`${kUser} has been kicked for ${kReason}`)
  
kUser.send(`${kUser} you have been kicked from ${kUser.guild.name} for: ${kReason}`)

message.guild.member(kUser).kick(kReason);
  
console.log(`${kUser} was kicked from ${message.guild}.`)

}

if(cmd === `${prefix}ban`){

let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
if(!bUser) return message.channel.send("Can't find user!")
let bReason = args.join(" ").slice(22);
if(bReason.length < 1) return message.channel.send("Please supply a reason!")
if(!message.member.hasPermission("BAN_MEMBERS")) return message.channelsend("No can do pal!")
if(bUser.hasPermission("BAN_MEMBERS")) return message.channel.send("That person can't be banned!")
  
let log = message.guild.channels.find(`name`, "logs")
if(!log) return message.channel.send("Can't find logs channel. Create one and call it logs!")
  
log.send(`${bUser} has been kicked for ${bReason}`)
  
bUser.send(`${bUser} you have been banned from ${bUser.guild.name} for: ${bReason}`)

message.guild.member(bUser).ban(bReason);
  
}
  
if(cmd === `${prefix}clear`){

  let deleteCount = parseInt(args[0], 10);
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You can't use this command!");
    if (!args[0] || args[0 == "help"]) return message.reply("Please supply the amount of messages to delete!");
    
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("The max amount of messages you can send is 100");
   
    const msg = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(msg)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));

  }
  
  const ms = require("ms");
  
if(cmd === `${prefix}tempmute`){

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Sorry, but you do not have valid permissions! If you beleive this is a error, contact an owner.");
    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!tomute) return message.reply("Couldn't find user.");
    if (tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("The user you are trying to mute is either the same, or higher role than you.");
    let muterole = message.guild.roles.find(`name`, "Muted");

    if (!muterole) {
        try {
            muterole = await message.guild.createRole({
                name: "Muted",
                color: "#000000",
                permissions: []
            })
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
        } catch (e) {
            console.log(e.stack);
        }
    }

    let mutetime = args[1];
    if (!mutetime) return message.reply("You didn't specify a time!");

    await (tomute.addRole(muterole.id));
    message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);
    setTimeout(function() {
        tomute.removeRole(muterole.id);
        message.channel.guild.channels.find(`name`, "logs").send(`<@${tomute.id}> has been unmuted!`);
    }, ms(mutetime));

}
})

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if(cmd === `${prefix}mute`){

  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Sorry pal, you can't do that.");
  if(args[0] == "help"){
    message.reply("Usage: !addrole <user> ");
    return;
  }
  let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if(!rMember) return message.reply("Couldn't find that user, yo.");
  let Muted = message.guild.roles.find(`name`, "Muted");
  let rReason = args.join(" ").slice(22);
  if(rReason.length < 1) return message.reply('You must supply a reason!');

 

  if(rMember.roles.has(Muted.id)) return message.reply("They are already muted!");
  await(rMember.addRole(Muted.id));

  try{
    await rMember.send(`${rMember} You have been muted for: ${rReason}`)
  }catch(e){
    console.log(e.stack);
    message.channel.send(`<@${rMember.id}>, has been muted!`)
  }
}



if(cmd === `${prefix}unmute`){
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Sorry pal, you can't do that.");
  if(args[0] == "help"){
    message.reply("Usage: !removerole <user>");
    return;
  }
  let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if(!rMember) return message.reply("Couldn't find that user, yo.");
  let Muted = message.guild.roles.find(`name`, "Muted");
 

  if(!rMember.roles.has(Muted.id)) return message.reply("They are not muted!")
  await(rMember.removeRole(Muted.id));

  try{
    await rMember.send(`${rMember} You have been unmuted!`)
  }catch(e){
    message.channel.send(`<@${rMember.id}>, has been unmuted!`)
  }
}
       
if(cmd === `${prefix}report`){
  
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Couldn't find user.");
    if (rUser.hasPermission("MANAGE_MESSAGES")) return message.reply("You can't report a moderator!");
    let rreason = args.join(" ").slice(22);
  
    message.author.send(`${message.author} You have reported ${rUser}`) 

    let reportEmbed = new Discord.RichEmbed()
    .setDescription("Reports")
    .setColor("#15f153")
    .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
    .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
    .addField("Channel", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", rreason);

    let reportschannel = message.guild.channels.find(`name`, "logs");
    if(!reportschannel) return message.channel.send("Couldn't find reports channel.");


    reportschannel.send(reportEmbed);
 
}

  
  
if(cmd === `${prefix}warn`){
  
let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
if(!wUser) return message.channel.send("Couldn't find user!")
if(wUser.hasPermission("MANAGE_MESSAGES")) return message.reply("You can't warn a moderator");
if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("Sorry pal, you can't do that.");
let wReason = args.join(" ").slice(22);
if(wReason.length < 1) return message.reply('You must supply a reason for the warning.');

message.channel.send(`${wUser} has been warned for: **${wReason}**`)
  


}
        
if(cmd === `${prefix}dm`){
  
let dUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
if (!dUser) return message.channel.send("Can't find user!")
if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You can't use that command!")
let dMessage = args.join(" ").slice(22);
if(dMessage.length < 1) return message.reply('You must supply a message!')
  
dUser.send(`${dUser} A moderator from ${message.guild} sent you: **${dMessage}**`)
  
message.author.send(`${message.author} You have sent your message to ${dUser}`)
  
}

if(cmd === `${prefix}invitebot`){
  
message.channel.send("Invite PandaBot with this link: https://discordapp.com/api/oauth2/authorize?client_id=494692771291201546&permissions=8&scope=bot")

}

if(cmd === `${prefix}help`){
  
message.reply("Check your DM's")
.then(msg => {
msg.delete(5000)
})
.catch

message.author.send("**These are the commands for the bot!** ```!help, !report, !invitebot, !unmute, !tempmute, !invitebot, !help, !command, !dm, !report, !warn, !addrole, !removerole, !serverinfo, !clear, !support and !premium``` **THERE WILL BE MORE COMMANDS ADDED SOON!**")
  
}
  
if(cmd === `${prefix}command`){
  
message.reply("Check your DM's")
.then(msg => {
msg.delete(5000)
})
.catch
  
message.author.send("This is what each command does: `!kick: Kicks a user` `!ban: Bans a user` `!mute: Mutes a user` `!unmute: Unmute a user` `!tempmute: Temporarily mutes a user for a certain amount of time` `!warn: Warns a user for a specific reason` `!report: Reports a user` `!dm: DM's a user` `!addrole: Gives a user a role!` `!removerole: Removes a role off a user!` `!invitebot: Sends link to invite PandaBot to server` `!help: Tells you every command that the bot has` `!serverinfo: Sends info about server` `!clear: Clears an amount of messages between 2 and 100` `!support: Sends invite to the bot support server!` `!premium: Sends link to get PandaBot Premium")

}
  
if(cmd === `${prefix}addrole`){
  
if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("You can't use that command!")
let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
if (!rMember) return message.reply("Can't find user!")
let role = args.join(" ").slice(22);
if (!role) return message.reply("Specify a role!");
let gRole = message.guild.roles.find(`name`, role);
if (!gRole) return message.reply("Can't find that role!");

if (rMember.roles.has(gRole.id)) return message.reply("They already have that role.");
await (rMember.addRole(gRole.id));
  
  message.channel.send(`${rMember} has been given ${role}`)

}

if(cmd === `${prefix}removerole`){
  
if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("You can't use that command!")
let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
if (!rMember) return message.reply("Can't find user!")
let role = args.join(" ").slice(22);
if (!role) return message.reply("Specify a role!");
let gRole = message.guild.roles.find(`name`, role);
if (!gRole) return message.reply("Can't find that role!");
  
if(!rMember.roles.has(gRole.id)) return message.reply("They don't have that role!");
await (rMember.removeRole(gRole.id));
  
 message.channel.send(`${rMember} has been removed the role ${role}`)

}

if(cmd === `${prefix}serverinfo`){

let sicon = message.guild.iconURL;
let serverembed = new Discord.RichEmbed()
.setDescription("Server Information")
.setColor("#15f153")
.setThumbnail(sicon)
.addField("Server Name", message.guild.name)
.addField("Created On", message.guild.createdAt)
.addField("Total Members", message.guild.memberCount);

message.channel.send(serverembed);

}

if(cmd === `${prefix}support`){

message.reply("If you need help with this bot join the support server: https://discord.gg/6cEYyqK")

}

  
if(cmd === `${prefix}maintenance`){

if (message.author.id !== '420431836523528194') return message.reply("You can't use that command!")
bot.guilds.forEach(guild => {
    let biggest;
    const channels = guild.channels.filter((c) => c.permissionsFor(guild.me).has('SEND_MESSAGES') && c.type === 'text');
    channels.forEach(channel => {
        if (!biggest) return biggest = channel;
        if (biggest.messages.size < channel.messages.size) biggest = channel;
    });
    setTimeout(()=>{biggest.send('**MESSAGE FROM PANDABOT DEVELOPER:** PANDABOT IS GOING UNDER MAINTENANCE AND WILL BE BACK ONLINE AFTER');}, Math.random()*20000);
});

}
  
if(cmd === `${prefix}announcement`){
  
if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channelsend("No can do pal!")
let channel = message.mentions.channels.first()
if(!channel) return message.reply("Please mention a channel")
let msg = args.join(" ").slice(22)
if(msg.length < 1) message.reply("Supply a message")
  
channel.send(msg)

}
  
if(cmd === `${prefix}welcome`){

message.channel.send("**Welcome To The Official PandaBot Support Server. Head Over To The #rules Channel To Find Out All The Server Rules.**")

}
  
if(cmd === `${prefix}premium`){

message.reply("We have now removed premium from PandaBot")

}
  
})

       
bot.login(tokenfile.token)

{
 
bot.login(tokenfile.token)
  
}
