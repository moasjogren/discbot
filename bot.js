require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const CHANNEL_ID = "1356225602436333669";

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  cron.schedule(
    "0 11 * * 0-4",
    () => {
      sendPoll();
    },
    {
      timezone: "Europe/Stockholm",
    }
  );
});

function sendPoll() {
  const channel = client.channels.cache.get(CHANNEL_ID);
  if (!channel) return console.error("Kanalen hittades inte!");

  channel
    .send(
      "📊 **Morgondagens arbetsstatus** 📊\n" +
        "Reagera med en emoji för att ange din status:\n\n" +
        "✅ – Jag kommer att jobba i skolan\n" +
        "🏠 – Jag kommer att jobba på distans\n" +
        "" +
        "Om du inte kan närvara, skriv ett meddelande i tråden i god tid 😊"
    )
    .then((message) => {
      message.react("✅");
      message.react("🏠");
    })
    .catch(console.error);
}

client.login(process.env.TOKEN);
