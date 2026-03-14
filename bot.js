const mineflayer = require('mineflayer')
const express = require('express')

const app = express()
const PORT = process.env.PORT || 10000

// Sunucu ayarları
const SERVER_IP = "oyna.blokya.com"
const SERVER_PORT = 25565
const USERNAME = "supraegzozuafk1"
const PASSWORD = "123kara123"

let bot = null

function startBot() {
  console.log("Bot başlatılıyor...")

  bot = mineflayer.createBot({
    host: SERVER_IP,
    port: SERVER_PORT,
    username: USERNAME
  })

  bot.once("spawn", () => {
    console.log("Spawn oldu, 7 sn sonra login...")

    setTimeout(() => {
      bot.chat("/login " + PASSWORD)
      console.log("/login gönderildi")
    }, 7000)
  })

  bot.on("chat", (username, message) => {
    console.log(`<${username}> ${message}`)
  })

  bot.on("kicked", (reason) => {
    console.log("Sunucudan atıldı:", reason)
  })

  bot.on("end", () => {
    console.log("Bağlantı kesildi, 30 sn sonra yeniden bağlanıyor...")
    setTimeout(startBot, 30000)
  })

  bot.on("error", (err) => {
    console.log("Hata:", err.message)
  })
}

startBot()

/* ---------- WEB PANEL ---------- */

app.use(express.json())

// Ana panel
app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
  <title>Minecraft Bot Panel</title>
  <style>
  body{background:#111;color:white;font-family:Arial;text-align:center}
  input{padding:10px;margin:5px}
  button{padding:10px;margin:5px}
  </style>
  </head>
  <body>
  <h2>Bot Kontrol Paneli</h2>

  <h3>Chat Gönder</h3>
  <input id="msg" placeholder="Mesaj">
  <button onclick="send()">Gönder</button>

  <h3>Komut Gönder</h3>
  <input id="cmd" placeholder="/spawn">
  <button onclick="cmd()">Komut</button>

  <h3>Hareket</h3>
  <button onclick="move('forward')">İleri</button>
  <button onclick="move('back')">Geri</button>
  <button onclick="move('left')">Sol</button>
  <button onclick="move('right')">Sağ</button>
  <button onclick="move('jump')">Zıpla</button>

<script>
function send(){
 fetch("/chat?msg="+encodeURIComponent(document.getElementById("msg").value))
}

function cmd(){
 fetch("/cmd?c="+encodeURIComponent(document.getElementById("cmd").value))
}

function move(m){
 fetch("/move?m="+m)
}
</script>

  </body>
  </html>
  `)
})

// chat gönder
app.get("/chat",(req,res)=>{
  const msg = req.query.msg
  if(bot && msg){
    bot.chat(msg)
  }
  res.send("ok")
})

// komut gönder
app.get("/cmd",(req,res)=>{
  const c = req.query.c
  if(bot && c){
    bot.chat(c)
  }
  res.send("ok")
})

// hareket
app.get("/move",(req,res)=>{
  const m = req.query.m

  if(!bot) return res.send("bot yok")

  if(m==="forward") bot.setControlState("forward",true)
  if(m==="back") bot.setControlState("back",true)
  if(m==="left") bot.setControlState("left",true)
  if(m==="right") bot.setControlState("right",true)
  if(m==="jump") bot.setControlState("jump",true)

  setTimeout(()=>{
    bot.clearControlStates()
  },1000)

  res.send("ok")
})

app.listen(PORT, () => {
  console.log("Web panel port:", PORT)
})
