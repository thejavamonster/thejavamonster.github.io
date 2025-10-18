// Shared news ticker functionality
// Populate the ticker with headlines from NYTimes US RSS using multiple CORS proxy fallbacks
(function () {
    const FEED_URL = 'https://rss.nytimes.com/services/xml/rss/nyt/US.xml';
    const ticker = document.getElementById('news-ticker');
    if (!ticker) return;

    // Multiple CORS proxies to try in order
    const PROXIES = [
        'https://corsproxy.io/?' + encodeURIComponent(FEED_URL),
        'https://api.allorigins.win/raw?url=' + encodeURIComponent(FEED_URL),
        'https://cors-anywhere.herokuapp.com/' + FEED_URL
    ];

    function setFallback(msg) {
        ticker.textContent = msg || 'Loading news headlines...';
    }

    async function fetchWithProxy(proxyUrl, timeout = 3000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const res = await fetch(proxyUrl, { 
                signal: controller.signal,
                cache: 'default'
            });
            clearTimeout(timeoutId);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return await res.text();
        } catch (err) {
            clearTimeout(timeoutId);
            throw err;
        }
    }

    async function tryProxies() {
        for (let i = 0; i < PROXIES.length; i++) {
            try {
                console.log(`Trying proxy ${i + 1}/${PROXIES.length}...`);
                const xmlText = await fetchWithProxy(PROXIES[i]);
                return xmlText;
            } catch (err) {
                console.warn(`Proxy ${i + 1} failed:`, err.message);
                if (i === PROXIES.length - 1) throw err;
            }
        }
    }

    tryProxies()
        .then(xmlText => {
            const doc = new DOMParser().parseFromString(xmlText, 'application/xml');
            const items = Array.from(doc.querySelectorAll('item'));
            if (!items.length) throw new Error('No items in feed');

            const headlines = items.slice(0, 20).map(item => {
                const title = item.querySelector('title')?.textContent?.trim() || '';
                const link = item.querySelector('link')?.textContent?.trim() || '';
                return { title, link };
            }).filter(h => h.title && h.link);

            if (!headlines.length) throw new Error('No valid headlines');

            // Build ticker links with separators - duplicate for seamless loop
            ticker.innerHTML = '';
            const content = document.createDocumentFragment();
            
            // Create content twice for seamless looping
            for (let repeat = 0; repeat < 2; repeat++) {
                headlines.forEach((h, i) => {
                    const a = document.createElement('a');
                    a.href = h.link;
                    a.textContent = h.title;
                    a.target = '_blank';
                    a.rel = 'noopener';
                    content.appendChild(a);
                    
                    const sep = document.createElement('span');
                    sep.textContent = '  •  ';
                    content.appendChild(sep);
                });
            }
            
            ticker.appendChild(content);
        })
        .catch(err => {
                console.error('News ticker: All proxies failed', err);
                setFallback('Unable to load headlines');
        });
})();
