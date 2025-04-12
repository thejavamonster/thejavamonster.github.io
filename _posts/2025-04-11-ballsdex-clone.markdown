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

Open that folder in VSCode. It should look something like this:

![image](https://github.com/user-attachments/assets/251bd387-27be-4fac-be85-fd3d0c874dc4)

Set up a virtual enviroment with ```py -m venv venv```. Open up a new terminal (making sure that you're in the venv), ```cd``` into ```/BallsDex-DiscordBot``` and ```pip install poetry```. 

Now, run ```poetry install``` to install all the dependencies for the bot. It might take a few minutes.

Run ```poetry shell``` to make sure your venv is activated correctly, then run ```python -m ballsdex --version``` to check that everything got installed right.

If everything looks good, run ```python -m ballsdex --reset-settings``` to create a configuration file. It should be called ```config.yml```. Open that up and enter this into it:

{% highlight yaml %}
# yaml-language-server: $schema=json-config-ref.json

# paste the access token you generated earlier here
discord-token: INSERT_TOKEN_HERE

text-prefix: b.
about:

  # replace this with any information you want to include on the bot's about me page
  description: >
    Collect countryballs on Discord, exchange them and battle with friends!

  github-link: https://github.com/laggron42/BallsDex-DiscordBot

  discord-invite: https://discord.gg/ballsdex  # BallsDex official server

  # these are just the default TOS pages
  terms-of-service: https://gist.github.com/laggron42/52ae099c55c6ee1320a260b0a3ecac4e
  privacy-policy: https://gist.github.com/laggron42/1eaa122013120cdfcc6d27f9485fe0bf

# this is what will show up in your server when a ball spawns, you can change it if you want
collectible-name: countryball

# self-explanatory
bot-name: BallsDex

# players group cog command name
# this is /balls by default, but you can change it for /animals or /rocks for example
players-group-cog-name: balls

# enables the /admin command
admin-command:

  # all items here are list of IDs. example on how to write IDs in a list:
  # guild-ids:
  #   - 1049118743101452329
  #   - 1078701108500897923

  # list of guild IDs where /admin should be registered
  guild-ids:
    - 1049118743101452329

  # list of role IDs having full access to /admin
  root-role-ids:
    - 1049119446372986921
    - 1049119786988212296
    - 1095015474846248970

  # list of role IDs having partial access to /admin
  admin-role-ids:
    - 1073775485840003102
    - 1073776116898218036

packages:
  - ballsdex.packages.admin
  - ballsdex.packages.balls
  - ballsdex.packages.config
  - ballsdex.packages.countryballs
  - ballsdex.packages.info
  - ballsdex.packages.players
  - ballsdex.packages.trade

# prometheus metrics collection, leave disabled if you don't know what this is
prometheus:
  enabled: true
  host: "0.0.0.0"
  port: 15260


# manage bot ownership
owners:
  # if enabled and the application is under a team, all team members will be considered as owners
  team-members-are-owners: true

  # a list of IDs that must be considered owners in addition to the application/team owner
  co-owners:

{% endhighlight %}
