const http = require("http")

http.createServer((req,res)=>{
res.end("bot calisiyor")
}).listen(3000)

const mineflayer = require('mineflayer')

const SERVER_IP = "oyna.blokya.com"
const BOT_COUNT = 6
const PASSWORD = "123kara123"

function createBot(i){

let kristal = 0

const bot = mineflayer.createBot({
  host: SERVER_IP,
  port: 25565,
  username: "supraegzozuafk" + i
})

bot.on("spawn", () => {

console.log("Bot girdi:", bot.username)

setTimeout(()=>{
bot.chat("/login " + PASSWORD)
},5000)

setTimeout(()=>{
bot.chat("/afk")
},8000)

setInterval(()=>{
bot.setControlState("jump", true)
setTimeout(()=>bot.setControlState("jump", false),500)
},30000)

/* kristal sayacı */
setInterval(()=>{

const sidebar = bot.scoreboard?.sidebar
if(!sidebar) return

for(const item of sidebar.items){

const text = item.displayName?.getText?.()

if(text && text.toLowerCase().includes("kristal")){

const match = text.match(/\d+/)

if(match){

let yeni = parseInt(match[0])

if(yeni != kristal){
kristal = yeni
console.log(bot.username + " kristal:", kristal)
}

}

}

}

},5000)

})

bot.on("end", ()=>{
console.log("Reconnect:", bot.username)
setTimeout(()=>{
createBot(i)
},10000)
})

bot.on("error", ()=>{})

}

for(let i=1;i<=BOT_COUNT;i++){
setTimeout(()=>{
createBot(i)
},i*5000)
}
