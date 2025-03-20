---
layout: post
title:  "Making pronto bots"
date:   2013-06-05 17:06:25
categories: pronto python coding
---

I've made a few bots with pronto (modding bot, truth-or-dare bot, some reaction bots). Thought I would share the code framework here.

### Imports
{% highlight python %}
import requests
import uuid
from datetime import datetime, timezone
import time
import json
{% endhighlight %}

uuid is needed because Pronto requires a unique ID attached to each mesage.

## Headers

{% highlight python %}
accesstoken = "" 
api_base_url = "https://stanfordohs.pronto.io/"
user_id = "0000000"
bubbleID = "" 


headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {accesstoken}",
}

{% endhighlight %}

Just fill in your access token and the bubble id. The bubble id for a group chat/dm is just the identifier at the end of the URL, ie 4209040 for OOCC. It determines which chat your bot will run in. The access token is what allows the bot to send requests to the API. With your access token, the bot will send messages under your name. You can get your access token by opening up the "network" tab of the chrome console, sending a message in pronto, and copying the "Bearer" variable from the message.create request.


https://github.com/user-attachments/assets/15663c4f-3935-4a44-8e46-432e4b7374c2


One of these days I'm going to leak my actual access token by accident lmao.

## Chat monitoring code

{% highlight python %}
last_message_id = ""
        
def fetch_latest_message():
    url = f"{api_base_url}api/v1/bubble.history"
    data = {"bubble_id": bubbleID}
    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        messages = response.json().get("messages", [])
        return messages[0]  
    else:
        print(f"HTTP error occurred: {response.status_code} - {response.text}")

    return None  

def monitor_messages(trigger_word):
    global warning_message  
    global last_message_id
    while True:
        msg = fetch_latest_message()

        if msg and isinstance(msg, dict) and "message" in msg and "user_id" in msg and "id" in msg:
            msg_id = msg["id"]
            msg_text = msg["message"].lower()

            if msg_id != last_message_id:  #only process if it's a new message
                last_message_id = msg_id  #update last seen message

                words = msg_text.lower()
                if trigger_word in words:
                    send_message("Hello world") #sends a message in pronto
                    react_message(msg_id, 1) #reacts to the message that included the trigger_word with a 👍
                    
        time.sleep(1)  #can change if necessary

{% endhighlight %}

Pretty self-explanatory. For the ```monitor_messages()``` function, set ```trigger_word``` to whatever word you want your bot to respond to. For my truth or dare bot, that word was @tod. If the ```trigger_word``` is detected in the latest message sent, the bot does its bot duties. In this demo code, I've set it to just send "Hello world" and react to the message that pinged it with a 👍. 

## Utility functions

{% highlight python %}
def send_message(message):
    unique_uuid = str(uuid.uuid4())
    messageCreatedat = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")


    data = {
        "id": "Null",
        "uuid": unique_uuid,
        "bubble_id": bubbleID,
        "message": message,
        "created_at": messageCreatedat,
        "user_id": user_id,
        "messagemedia": []
    }


    url = f"{api_base_url}api/v1/message.create"
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()

def react_message(message_id, reaction):
    data = {
        "message_id": message_id,
        "reactiontype_id": reaction 
    }


    url = f"{api_base_url}api/v1/message.addreaction"
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()

{% endhighlight %}

This is the central part of the code: it's what allows your bot to actually communicate with Pronto. I only included a message-sending function and a reaction function here, but it's pretty easy to add new ones (like one for, say, message-deleting). You can figure out what the data you need to send to the API is by sending a test message on Pronto and checking the "Payload" bar on the network tab of the chrome console. 

Also, reactions are coded as integers for some ungodly reason: 1=👍, 2=👎, 3=😂, 4=❤️, 5=😢, 6=😮. 
