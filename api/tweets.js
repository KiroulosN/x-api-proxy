const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    try {
        const response = await fetch('https://xcancel.com/MSFT365Status', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = await response.text();
        const $ = cheerio.load(html);

        const tweets = [];
        $('article.timeline-item').each((i, element) => {
            const text = $(element).find('div.tweet-body').text().trim();
            const time = $(element).find('time').attr('datetime');
            if (text && time) {
                tweets.push({ text, created_at: time });
            }
        });

        // Debug: Return HTML if no tweets found
        if (tweets.length === 0) {
            return res.json({ 
                data: [], 
                debug: html.substring(0, 500) // First 500 chars of HTML
            });
        }

        tweets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const limitedTweets = tweets.slice(0, 10);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ data: limitedTweets });
    } catch (error) {
        res.status(500).json({ error: 'Failed to scrape tweets', details: error.message });
    }
};
