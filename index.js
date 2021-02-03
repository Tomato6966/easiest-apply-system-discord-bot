const Discord = require("discord.js");

const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});

const config = {
    "token": "NzQ4MDk2MTcwNjk3NTU1OTY5.X0Yc2g.ce7L1wHmF8nI_88B2UOf1xpS9r0",
    "prefix": "!",
   
   
    "apply_channel_id": "806076986430193685",
    "finished_applies_channel_id": "806077012493729813",
    
    
    "QUESTIONS": [
        "Question 1",
        "Question 2",
        "Question 3",
        "Question 4",
        "Question 5",
        "Question 6",
        "Question 7",
        "Question 8",
        "Question 9"
    ]
}

client.on("ready", () => {
    console.log("BOT IS READY" + client.user.tag)
    client.user.setActivity("APPLY NOW IN | APPLY HERE", {type: "WATCHING"})
})

client.on("message", (message)=>{
    if(message.author.bot || !message.guild) return;
    if(!message.content.startsWith(config.prefix)) return;
    let args = message.content.slice(config.prefix.length).split(" ");
    let cmd = args.shift();

    if(cmd === "embed"){
        console.log(args)
        let newargs = args.join(" ").split("+")
        console.log(newargs)
        message.channel.send(
            new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(newargs[0] ? newargs[0] : "")
            .setDescription(newargs.slice(1).join(" ") ? newargs.slice(1).join(" ") : "")
            .setFooter("React with the granted emoji!")
        )
    }
    else if (cmd === "react"){
        message.channel.messages.fetch(args[0]).then(msg => msg.react(args[1]));
    }
});

client.on("messageReactionAdd", async (reaction, user) => {
    const { message } = reaction;
    if(user.bot || !message.guild) return;
    if(message.partial) await message.fetch();
    if(reaction.partial) await reaction.fetch();
    
    if(message.guild.id === "789064772712792086" && message.channel.id === config.apply_channel_id && (reaction.emoji.name === "✅" || reaction.emoji.id === "653206656179503104")){
        let guild = await message.guild.fetch();
        let channel_tosend = guild.channels.cache.get(config.finished_applies_channel_id);
        if(!channel_tosend) return console.log("RETURN FROM !CHANNEL_TOSEND");
        const answers = [];
        let counter = 0;

        ask_question(config.QUESTIONS[counter]);

        function ask_question(qu){
            if(counter === config.QUESTIONS.length) return send_finished();
            user.send(qu).then(msg => {
                msg.channel.awaitMessages(m=>m.author.id === user.id, {max: 1, time: 60000, errors: ["time"]}).then(collected => {
                    answers.push(collected.first().content);
                    ask_question(config.QUESTIONS[++counter]);
                })
            })
        }
        function send_finished(){
            let embed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("A new application from: " + user.tag) //Tomato#6966
            .setDescription(`${user}  |  ${new Date()}`)
            .setFooter(user.id, user.displayAvatarURL({dynamic:true}))
            .setTimestamp()
            for(let i = 0; i < config.QUESTIONS.length; i++){
                try{
                    embed.addField(config.QUESTIONS[i], String(answers[i]).substr(0, 1024))
                }catch{
                }
            }
            channel_tosend.send(embed);
            user.send("Thanks for applying to: " + message.guild.name)
        }
        

    }

})



client.login(config.token);
