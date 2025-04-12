---
layout: post
title:  "Making a ballsdex clone on Windows"
date:   2025-03-20 10:33:41
categories: python coding
---
I'm making a Lord of the Rings ballsdex clone, and I figured I'd write up my steps here on how I set it up (partially for my own benefit). Hopefully this actually helps someone, though. I found a few good tutorials for setting up a clone on Linux or Mac, but it's a bit more complicated on Windows because you can't really use Docker without setting up WSL and all that crap. I couldn't really find much for doing this on Windows so I figured I'd write up my process. 

Also, I'm writing this all assuming that you're using VSCode, but I'd bet it's pretty much the same on other IDEs.

**Start requirements:**
- Git
- Python >= 3.13


First, you need to set up a Discord bot account. Go to the [application page](https://discord.com/developers/applications) and start a new application. Go to the "Bot" tab, scroll down, and tick "Message content intent" under "Priveleged Gateway Intents."

![image](https://github.com/user-attachments/assets/79cbd380-83ba-482b-a00d-8c70da6e3469)

Scroll up and click "reset token" to generate an access token for your bot. Make sure to copy and paste it somewhere, since you won't be able to see it again. Save your changes.

Next, you need to install [PostgreSQL](https://www.postgresql.org/download/) and set it up. It should prompt you to create a password. Once you've done all that, open up the GUI (it should be called pgAdmin4 on your computer). We're going to create a new database where all the balls will be stored. Right click on "Databases" under "Servers" in the left sidebar and create a new database.
![image](https://github.com/user-attachments/assets/ee0790bb-5dd0-439f-951f-8b93f368d9c5)


Name it whatever you want. You don't have to fill in OID.

The link to connect to your database (you'll need this later) will be ```postgres://username:password@localhost:5432/database_name```. The default username is ```postgres```. The default port is ```5432```. If you set it to something else during the installation process, just replace ```5432``` with that port number.

Now we're going to clone the Ballsdex repo. Create a folder, ```cd``` to it in your Git Bash terminal, then run this command:

```git clone https://github.com/laggron42/BallsDex-DiscordBot.git```

You should now be able to open that folder in VSCode.
