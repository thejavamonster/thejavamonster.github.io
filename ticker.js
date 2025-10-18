// Shared news ticker functionality
// Populate the ticker with headlines from NYTimes US RSS using a CORS-friendly proxy
(function () {
    const FEED_URL = 'https://rss.nytimes.com/services/xml/rss/nyt/US.xml';
    const PROXY = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(FEED_URL);
    const ticker = document.getElementById('news-ticker');
    if (!ticker) return;

    function setFallback(msg) {
        ticker.textContent = msg || 'NYT US headlines unavailable.';
    }

    // Add timeout to fail fast if proxy is slow
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    fetch(PROXY, { 
        signal: controller.signal,
        cache: 'default' // Allow caching to speed up subsequent loads
    })
        .then(res => {
            clearTimeout(timeoutId); // Clear timeout on success
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.text();
        })
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
            clearTimeout(timeoutId); // Clear timeout on error
            if (err.name === 'AbortError') {
                console.warn('News ticker: Request timed out after 5 seconds');
                setFallback('Headlines loading timed out');
            } else {
                console.error('News ticker error:', err);
                setFallback();
            }
        });
})();
