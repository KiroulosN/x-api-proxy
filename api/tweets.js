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
        // Adjust selectors based on xcancel.com's structure (inspected manually)
        $('div.tweet').each((i, element) => {
            const text = $(element).find('div.tweet-text').text().trim();
            const time = $(element).find('time').attr('datetime') || $(element).find('span.timestamp').text().trim();
            if (text && time) {
                tweets.push({ text, created_at: time });
            }
        });

        // Sort by date (assuming 'created_at' is a valid date string)
        tweets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const limitedTweets = tweets.slice(0, 10);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ data: limitedTweets });
    } catch (error) {
        res.status(500).json({ error: 'Failed to scrape tweets', details: error.message });
    }
};
