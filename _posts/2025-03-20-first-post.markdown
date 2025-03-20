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
