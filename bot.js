const mineflayer = require('mineflayer')
const express = require('express')

const app = express()
const PORT = process.env.PORT || 10000

const SERVER_IP = "oyna.blokya.com"
const PASSWORD = "123kara123"

let kristal = 0

function createBot(){

  const bot = mineflayer.createBot({
    host: SERVER_IP,
    port: 25565,
    username: "supraegzozuafk1"
  })

  bot.on("spawn", ()=>{
    console.log("Bot oyuna girdi, 7 saniye bekliyor...")
    
    setTimeout(()=>{
      bot.chat("/login " + PASSWORD)
      console.log("/login gönderildi")
    }, 7000)

    setTimeout(()=>{
      bot.chat("/afk")
      console.log("/afk gönderildi")
    }, 10000)

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
            if(kristal !== yeni){
              kristal = yeni
              console.log("Kristal:", kristal)
            }
          }
        }
      }

    },5000)
  })

  bot.on("kicked",(reason)=>{
    console.log("Sunucudan atıldı:", reason)
  })

  bot.on("end",()=>{
    console.log("Bağlantı kesildi, 20 saniye sonra yeniden bağlanıyor...")
    setTimeout(createBot,20000)
  })

  bot.on("error",(err)=>{
    console.log("Hata:", err.message)
  })

}

/* Tek bot başlat */
createBot()

/* Web servis */
app.get("/",(req,res)=>{
  res.send("Bot çalışıyor")
})

app.get("/kristal",(req,res)=>{
  res.send({kristal})
})

app.listen(PORT, ()=>{
  console.log("Web servis çalışıyor, port:",PORT)
})
