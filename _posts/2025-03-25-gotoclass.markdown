---
layout: post
title:  "Average bored coder"
date:   2025-03-20 10:33:41
categories: python coding school
---


I've been late to/missed a bunch of classes already this semester, so I wasted several minutes of my life putting together a Python script that automatically opens the classroom link at 5 minutes before class time. Virtual school W I guess. Next on the list is building a bot that reads _Henry V_ for me and comes up with insightful things to say in English class.

{% highlight python %}

def open(url):
    webbrowser.get(chrome_path).open(url)


if weekday == 0 or weekday == 2: #monday or wednesday
    pause.until(datetime(year, month, day, 8, 55))
    open(hsc)
    if weekday == 0:
        pause.until(datetime(year, month, day, 10, 10))
        open(wellness)
    pause.until(datetime(year, month, day, 12, 40))
    open(english)

elif weekday == 1 or weekday == 3: #tuesday or thursday
    pause.until(datetime(year, month, day, 8, 55))
    open(svc)
    pause.until(datetime(year, month, day, 12, 40))
    open(physics)
    pause.until(datetime(year, month, day, 13, 55))
    open(chem)

{% endhighlight %}

There's the relevant bit of code, the full thing is in my github. 

I'm liking this automation thing. Maybe I'll build a thing that automatically opens all the stuff I need for the day when I turn the computer on. That gives me more time to ... sit in front of the computer at 8am with a blanket over my head, maybe. It's my favorite morning ritual. 
