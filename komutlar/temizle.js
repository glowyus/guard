const Discord = require('discord.js')
const ayarlar = require("../ayarlar.json")
const db = require('quick.db')

exports.run = async(client, message, args) => {

    let prefix = "" || ayarlar.prefix || db.fetch(`prefix_${message.guild.id}`)

    if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send(new Discord.MessageEmbed().setDescription("**Bu Komutu Kullanabilmek İçin \`Mesajları Yönet\` Yetkisine Sahip Olmalısın !**").setColor("RANDOM"))

    let sa = args[0]

    if(!sa) {
        const muckmuck = new Discord.MessageEmbed()
        .setDescription(`**1 - 100 Arasında Bir Sayı Girmelisin \nÖrnek Kullanım : ${ayarlar.prefix}sil 60**`)
        .setColor("RANDOM")
        message.channel.send(muckmuck)
    }

    message.channel.bulkDelete(sa).then(() => {
        const sj = new Discord.MessageEmbed()
        .setDescription(`**Başarıyla ${sa} Mesaj ${message.author}Tarafından Silindi**`)
        .setColor("RANDOM")
        message.channel.send(sj)
    })
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['temizle'],
    permlvl: 0
}

exports.help = {
    name: "sil"
}