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
    "30 16 * * 0-4",
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
        "Reagera med en emoji:\n\n" +
        "✅ – Jag kommer att jobba i skolan\n" +
        "🏠 – Jag kommer att jobba på distans\n\n" +
        "Om du inte kan närvara: Skriv ett meddelande i tråden i god tid 😊"
    )
    .then(async (message) => {
      await message.react("✅");
      await message.react("🏠");

      // Skapa en tråd kopplad till omröstningen
      const thread = await message.startThread({
        name: "Frånvaroanmälan 📌",
        autoArchiveDuration: 1440, // 24 timmar (kan ändras)
        reason: "För användare att meddela om de inte kan närvara",
      });

      // Skicka ett välkomstmeddelande i tråden
      thread.send("📌 **Skriv här om du inte kan närvara imorgon.**");
    })
    .catch(console.error);
}

client.login(process.env.TOKEN);
