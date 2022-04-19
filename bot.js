const discord = require('discord.js');
const Discord = require('discord.js');
const client = new discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const moment = require('moment');
const { Client, Util } = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const express = require('express');
require('./util/eventLoader.js')(client);
const path = require('path');
const snekfetch = require('snekfetch');
const ms = require('ms');


var prefix = ayarlar.prefix;


const log = message => {
    console.log(`${message}`);
};

client.commands = new discord.Collection();
client.aliases = new discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};



client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }

    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });
client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});
client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(process.env.token);

const invites = {};
const wait = require("util").promisify(setTimeout);
client.on("ready", () => {
  wait(1000);
  client.guilds.cache.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
});

client.login(process.env.token)



//capsengel
client.on("message", async message => {//alıntıdır!
    if (message.channel.type === "dm") return;
      if(message.author.bot) return;  
        if (message.content.length > 4) {
         if (db.fetch(`guardcl_${message.guild.id}`)) {
           let caps = message.content.toUpperCase()
           if (message.content == caps) {
             if (!message.member.hasPermission("ADMINISTRATOR")) {
               if (!message.mentions.users.first()) {
                 message.delete()
                 return message.channel.send(`${message.author} Büyük Harfle Yazmamalısın!`).then(m => m.delete(5000))
     }
       }
     }
   }
  }
});

//everhereengel
client.on("message", async msg => {
  let hereengelle = await db.fetch(`guardeh_${msg.guild.id}`);
  if (hereengelle == "acik") {
    const here = ["@here", "@everyone"];
    if (here.some(word => msg.content.toLowerCase().includes(word))) {
      if (!msg.member.permissions.has("ADMINISTRATOR")) {
        msg.delete();
        return msg.hannel.send("`@everyone` **ve ya** `@here` **Kullanmak Yasak!**").then(luffyy => luffyy.delete({ timeout: 5000 }));
      }
    }
  } else if (hereengelle == "kapali") {
  }
});



client.on("message", async msg => {
  
  
  let a = await db.fetch(`kufur_${msg.guild.id}`)
    if (a == 'acik') {
      const küfür = [
        "yarak","mk", "amk", "aq", "orospu", "Oruspu", "oç", "sikerim", "yarrak", "piç", "amq", "sik", "amcık", "çocu", "sex", "seks", "amına", "orospu çocuğu", "sg", "siktir git","ebenin","sikerim","sik","sikiyim","Amk","Mq","SİKTİR","OROSPU","SİKİK","YARRAM","YARRAK","PİÇ","SİK","SİKERİM","AMK","AM","SG","MQ","MAL","Amq","siq","s2iş","s2ik","Phiç","phiç","Piç","fuck"
                  ]
            if (küfür.some(word => msg.content.includes(word))) {
          try {
            if (!msg.member.hasPermission("ADMINISTRATOR")) {
                  msg.delete();
                          
                    return msg.channel.send(`**Küfür Etmek Yasak !!!**`).then(msg => msg.delete({ timeout: 5000}));
            }          
                } catch(err) {
                  console.log(err);
                }
              }
          }
          if (!a) return;
          })

//rolkoruma//
client.on("roleDelete", async role => {
  let rolkoruma = await db.fetch(`rolk_${role.guild.id}`);
  if (rolkoruma) { 
         const entry = await role.guild.fetchAuditLogs({ type: "ROLE_DELETE" }).then(audit => audit.entries.first());
    if (entry.executor.id == client.user.id) return;
  role.guild.roles.create({ data: {
          name: role.name,
          color: role.color,
          hoist: role.hoist,
          permissions: role.permissions,
          mentionable: role.mentionable,
          position: role.position
}, reason: 'Silinen Roller Tekrar Açıldı.'})
  }
})

//

client.on("roleCreate", async role => {
  let rolkorumaa = await db.fetch(`rolk_${role.guild.id}`);
  if (rolkorumaa) { 
       const entry = await role.guild.fetchAuditLogs({ type: "ROLE_CREATE" }).then(audit => audit.entries.first());
    if (entry.executor.id == client.user.id) return;
  role.delete()
  }
})


//kanalkoruma//
client.on("channelDelete", async function(channel) {//alıntı
  let rol = await db.fetch(`kanalk_${channel.guild.id}`);

  if (rol) {
    const guild = channel.guild.cache;
    let channelp = channel.parentID;

    channel.clone().then(z => {
      let kanal = z.guild.channels.find(c => c.name === z.name);
      kanal.setParent(
        kanal.guild.channels.find(channel => channel.id === channelp)
      );
    });
  }
});



client.on("messageUpdate", msg => {
 
 
 const i = db.fetch(`${msg.guild.id}.kufur`)
    if (i) {
        const kufur = ["oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "mal", "sik", "yarrak", "am", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "ak", "amq","31"];
        if (kufur.some(word => msg.content.includes(word))) {
          try {
            if (!msg.member.hasPermission("BAN_MEMBERS")) {
                  msg.delete();
                         
                      return msg.reply('**Bu Sunucuda Küfür Edemezsin!**').then(msg => msg.delete(3000));
            }              
          } catch(err) {
            console.log(err);
          }
        }
    }
    if (!i) return;
});

//fakehesapkoruma | müq komut haaa
client.on('guildMemberAdd',async member => {
  let kisi = client.users.cache.get(member.id);
    const zaman = new Date().getTime() - kisi.createdAt.getTime();
    if (zaman < 2592000000)
  member.roles.set([ayarlar.fakerol])
});


const disbut = require('discord-buttons')
disbut(client);
client.on('message', async (message) => {
    if (message.content.startsWith(`${prefix}yardım`)) {
            
        let gif = new disbut.MessageButton()
        .setStyle('grey')
        .setEmoji('<:guard1:962320443115700224>')
        .setID('gif') 
        
        let eğlence = new disbut.MessageButton()
        .setStyle('grey')
        .setEmoji('<:guard2:962320673643048990>')
        .setID('eğlence') 

        let yetkili = new disbut.MessageButton()
        .setStyle('grey')
        .setEmoji('<:ayar:962321517289541762>') 
        .setID('yetkili') 
                
        let button3 = new disbut.MessageButton()
        .setStyle('grey')
        .setEmoji('<:onay:962322070983819284>') 
        .setID('genel') 
        
        let button4 = new disbut.MessageButton()
        .setStyle('green')
        .setEmoji('<:anamenu:962319052963983390>') 
        .setID('anamenü') 
                

        message.channel.send('', {
            embed: new Discord.MessageEmbed()
          .setAuthor(ayarlar.botisim, client.user.avatarURL())
          .setColor(`random`)  
          .setDescription(`**Jail Komutları : <:guard1:962320443115700224> Butonuna Tıklayınız\nBan Komutları : <:guard2:962320673643048990> Butonuna Tıklayınız\nKick Komutları : <:ayar:962321517289541762> Butonuna Tıklayınız\nGenel Komutlar : <:onay:962322070983819284> Butonuna Tklayınız\nAna Menü : <:anamenu:962319052963983390> Butonuna Tıklayınız**\n\n**${message.author.tag} - Tarafından İstendi**`),
            buttons:[
                button4,gif,eğlence,yetkili,button3
            ]
        });
    };
});

client.on('clickButton', async (button) => {

  
  if (button.id === 'gif') {
    const embed = new Discord.MessageEmbed()
.setDescription(`***Jail Komutları***\n\n${prefix}jailrol @rol : **Jail Rolünü Ayarlarsınız**\n${prefix}jailyetkili @rol : **Jail Yetkilisi Ayarlarsınız**\n${prefix}jaillog #log : **Jail Logunu Ayarlarsınız**\n${prefix}jail @kişi : **Birisini Jaile Atarsınız**`)
.setFooter(`${ayarlar.botisim}`, client.user.avatarURL())
    button.message.edit(embed)
  
  
 } 
  
  if (button.id === 'eğlence') {
      const embed = new Discord.MessageEmbed()
.setDescription(`***Ban Komutları***\n\n${prefix}ban @kişi : **Belirtilen Kişiyi Banlar**\n${prefix}unban ıd : **Idsi Girilen Kişinin Banını Açar**\n${prefix}banlist : **Banlanan Kişi Sayısını Gösterir**\n${prefix}banyetkilirol @rol : **Ban Yetkilisi Ayarlarsınız**\n${prefix}banlog #log : **Ban Logunu Ayarlarsınız**`)
 .setFooter(`${ayarlar.botisim}`, client.user.avatarURL())
      button.message.edit(embed)
  }
    if (button.id === 'yetkili') {
    const embed = new Discord.MessageEmbed()
.setDescription(`***Kick Komutları***\n\n${prefix}kick @kişi : **Etiketlediğiniz Kişiyi Sunucudan Atarsınız**\n${prefix}kickyetkili @rol : **Yetkili Rolünü Ayarlarsınız**\n${prefix}kicklog #log : **Kick Logunu Ayarlarsınız**`)
.setFooter(`${ayarlar.botisim}`, client.user.avatarURL())
    button.message.edit(embed)

      
  }
    if (button.id === 'genel') {
    const embed = new Discord.MessageEmbed()
.setDescription(`***Genel Komutlar***\n\n${prefix}sil sayı : **İstediğiniz Kadar Mesaj Silebilirsiniz**\n${prefix}kanalkoruma aç : **Kanal Koruma Açabilirsiniz**\n${prefix}küfürengel aç : **Küfür Engel Açabilirsiniz**\n${prefix}rolkoruma aç : **Rol Koruma Açabilirsiniz**\n${prefix}everhere aç : **Everyone & Here Engel Açabilirsiniz**\n${prefix}reklamengel aç : **Reklam Engel Açabilirsiniz**\n${prefix}nuke : **Kanalı Kapatıp Yeniden Açabilirsiniz**\n${prefix}banlist : **Sunucudaki Banlanmış Üye Sayısını Görüntüleyebilirsiniz**\n${prefix}istatistik : **Bot İstatistiklerine Bakabilirsiniz**`)
.setFooter(`${ayarlar.botisim}`, client.user.avatarURL())
    button.message.edit(embed)
  }
  
      if (button.id === 'anamenü') {
    const embed = new Discord.MessageEmbed()
.setDescription(`***Ana Menü***\n\n**Jail Komutları : <:guard1:962320443115700224> Butonuna Tıklayınız\nBan Komutları : <:guard2:962320673643048990> Butonuna Tıklayınız\nKick Komutları : <:ayar:962321517289541762> Butonuna Tıklayınız\nGenel Komutlar : <:onay:962322070983819284> Butonuna Tklayınız\nAna Menü : <:anamenu:962319052963983390> Butonuna Tıklayınız**`)
.setFooter(`${ayarlar.botisim}`, client.user.avatarURL())
    button.message.edit(embed)
  }
  
});


client.on("guildCreate", async guild => {
  const katılma = [
    "Bot sunucuna eklendi.Tebrikler dostum.",
    "Bu bot Murat Eren Youtube Tarafından Kodlanmıştır.",
    'İyi Günlerde Kullanman Dileğiyle..'
  ];
  guild.owner.send(katılma);
  console.log(`LOG: ${guild.name}. sunucuya katıldım!`);
});

client.on("message", async message => {
  
  const lus = await db.fetch(`reklamengel_${message.guild.id}`)
  if (lus) {
    const reklamengel = ["discord.app", "discord.gg", ".party", ".com", ".az", ".net", ".io", ".gg", ".me", "https", "http", ".com.tr", ".org", ".tr", ".gl", "glicht.me/", ".rf.gd", ".biz", "www.", "www"];
    if (reklamengel.some(word => message.content.toLowerCase().includes(word))) {
      try {
        if (!message.member.permissions.has('KICK_MEMBERS')) {
          message.delete();
          
          return message.reply('**Reklam Yasak!**').then(message => message.delete(6000));
          
        }
      } catch(err) {
        console.log(err);
    }
  }
}
if (!lus) return;
});
client.on("messageUpdate", async message => {
  
  const lus = await db.fetch(`reklamengel_${message.guild.id}`)
  if (lus) {
    const reklamengel = ["discord.app", "discord.gg", ".party", ".com", ".az", ".net", ".io", ".gg", ".me", "https", "http", ".com.tr", ".org", ".tr", ".gl", "glicht.me/", ".rf.gd", ".biz", "www.", "www"];
    if (reklamengel.some(word => message.content.toLowerCase().includes(word))) {
      try {
        if (!message.member.permissions.has('KICK_MEMBERS')) {
          message.delete();
          
          return message.reply('**Reklam Yasak!**').then(message => message.delete(6000));
          
        }
      } catch(err) {
        console.log(err);
    }
  }
}
if (!lus) return;
});
