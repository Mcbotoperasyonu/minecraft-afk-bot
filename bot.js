const mineflayer = require('mineflayer')
const express = require('express')

const app = express()
const PORT = process.env.PORT || 10000

const SERVER_IP = "oyna.blokya.com"
const SERVER_PORT = 25565
const USERNAME = "supraegzozuafk1"
const PASSWORD = "123kara123"

let kristal = 0
let bot = null

function startBot() {

  console.log("Bot başlatılıyor...")

  bot = mineflayer.createBot({
    host: SERVER_IP,
    port: SERVER_PORT,
    username: USERNAME
  })

  bot.once("spawn", () => {
    console.log("Bot spawn oldu. 7 saniye bekleniyor...")

    setTimeout(() => {
      bot.chat("/login " + PASSWORD)
      console.log("/login gönderildi")
    }, 7000)

    setTimeout(() => {
      bot.chat("/afk")
      console.log("/afk gönderildi")
    }, 10000)
  })

  // Kristal okuma
  setInterval(() => {
    if (!bot || !bot.scoreboard) return

    const sidebar = bot.scoreboard.sidebar
    if (!sidebar) return

    for (const item of sidebar.items) {
      const text = item.displayName?.getText?.()

      if (text && text.toLowerCase().includes("kristal")) {
        const match = text.match(/\d+/)

        if (match) {
          const yeni = parseInt(match[0])

          if (yeni !== kristal) {
            kristal = yeni
            console.log("Kristal:", kristal)
          }
        }
      }
    }
  }, 5000)

  bot.on("kicked", (reason) => {
    console.log("Sunucudan atıldı:", reason)
  })

  bot.on("error", (err) => {
    console.log("Hata:", err.message)
  })

  bot.on("end", () => {
    console.log("Bağlantı kesildi. 30 saniye sonra yeniden bağlanıyor...")
    setTimeout(startBot, 30000)
  })
}

startBot()

// Web servis
app.get("/", (req, res) => {
  res.send("Bot çalışıyor")
})

app.get("/kristal", (req, res) => {
  res.json({ kristal })
})

app.listen(PORT, () => {
  console.log("Web servis çalışıyor, port:", PORT)
})
