# Femboy Discord bot
I LOVE FEMOBYS
This project is a small AI companion bot created as a fun side project. I am not responsible for how this application or its features are used. HOWEVER my dm's are open for any femboys, and i am also affiliated with the femboys working at Second Sun. 
I LOVE FEMOBYS


The program automatically fetches a reply from OpenAI's CHATGPT and sends that through to the user. It also uses CHATGPT to fetch a random status everytime it is restarted.

## Prerequisites
- Node.js version 20 or higher
- npm (comes with Node.js)
- A Discord Bot Token
- OpenAI API Key
- MySQL database (optional, if using database features)

## Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/Turtlezztz/femboy-discord-bot.git](https://github.com/Turtlezztz/femboy-discord-bot.git)
   cd femboy-discord-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following environment variables:
   ```
   DISCORD_TOKEN=your_discord_bot_token
   OPENAI_API_KEY=your_openai_api_key
   CLIENT_ID=your_discord_client_id
   # Add MySQL credentials if needed
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   ```

4. Deploy slash commands (first time setup):
   ```bash
   node deploy-commands.js
   ```

## Running the Project

Start the bot with:
```bash
npm start
```

Or for testing:
```bash
npm test
```

The bot will start and connect to Discord. You should see it come online in your server.

