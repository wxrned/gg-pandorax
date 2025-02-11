require("dotenv").config();
const config = require(`./data/config.js`);
const { Client, Collection } = require("discord.js");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const client = new Client();

const dataStructure = {
  "data": {
    "errors": [],
    "usage": ["commands.txt"]
  }
};
ensureStructure("logs", dataStructure.data);

client.config = config;
client.snipes = new Map();
client.editsnipes = new Map();

client.commands = new Collection();
client.cooldowns = new Collection();
client.categories = fs.readdirSync(`./commands`);

client.once("ready", async () => {
  console.log(`[+] BOT : ${client.user.username}`);
  // await connectDB(`bot_${client.user.id}`);
  
  ["eventHandler", "commandHandler", "errorHandler"].forEach((handler) => {
    require(`./handlers/${handler}`)(client);
  });
});
async function connectDB(databaseName) {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(config.mongo, { dbName: databaseName });
      console.log(`[+] Connected to MongoDB database: ${databaseName}`);
    } catch (err) {
      console.error(`[*] MongoDB connection error`);
      throw err;
    }
  } else {
    console.log(`[*] Already connected to MongoDB database: ${databaseName}`);
  }
}

function ensureStructure(basePath, obj) {
  for (const [folder, files] of Object.entries(obj)) {
    const folderPath = `${basePath}/${folder}`;
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
    
    files.forEach(file => {
      const filePath = `${folderPath}/${file}`;
      if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "", { encoding: "utf-8" });
    });
  }
}

client.login(config.token);
