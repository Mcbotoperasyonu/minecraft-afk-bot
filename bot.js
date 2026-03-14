const mineflayer = require('mineflayer')
const express = require('express')

const app = express()
const PORT = process.env.PORT || 10000

const SERVER_IP = "oyna.blokya.com"
const BOT_COUNT = 6
const PASSWORD = "123kara123"

let kristaller = {}

function createBot(i){

const username = "supraegzozuafk" + i
kristaller[username] = 0

const bot = mineflayer.createBot({
  host: SERVER_IP,
  port: 25565,
  username: username
})

/* BAĞLANTI LOGLARI */

bot.on("login", ()=>{
  console.log(username + " sunucuya bağlandı")
})

bot.on("spawn", ()=>{
  console.log(username + " oyuna girdi")

  setTimeout(()=>{
    bot.chat("/login " + PASSWORD)
  },5000)

  setTimeout(()=>{
    bot.chat("/afk")
  },9000)

  /* AFK hareket */
  setInterval(()=>{
    bot.setControlState("jump", true)
    setTimeout(()=>bot.setControlState("jump", false),500)
  },30000)

  /* kristal okuma */
  setInterval(()=>{

    const sidebar = bot.scoreboard?.sidebar
    if(!sidebar) return

    for(const item of sidebar.items){

      const text = item.displayName?.getText?.()

      if(text && text.toLowerCase().includes("kristal")){

        const match = text.match(/\d+/)

        if(match){

          const yeni = parseInt(match[0])

          if(kristaller[username] !== yeni){
            kristaller[username] = yeni
            console.log(username + " kristal:", yeni)
          }

        }

      }

    }

  },5000)

})

bot.on("end",(reason)=>{
  console.log(username + " bağlantı kesildi:", reason)
  setTimeout(()=>{
    createBot(i)
  },10000)
})

bot.on("kicked",(reason)=>{
  console.log(username + " sunucudan atıldı:", reason)
})

bot.on("error",(err)=>{
  console.log(username + " hata:", err.message)
})

}

/* BOTLARI BAŞLAT */

for(let i=1;i<=BOT_COUNT;i++){

setTimeout(()=>{
createBot(i)
}, i*10000)

}

/* WEB PANEL */

app.get('/kristal',(req,res)=>{

const toplam = Object.values(kristaller).reduce((a,b)=>a+b,0)

res.send({
toplam: toplam,
botlar: kristaller
})

})

app.listen(PORT, ()=>{
console.log("Web servis çalışıyor, port:", PORT)
})
