const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    try {
        const response = await fetch('https://nitter.rawgit.net/MSFT365Status/rss', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const xml = await response.text();
        const $ = cheerio.load(xml, { xmlMode: true });

        const tweets = [];
        $('item').each((i, element) => {
            const text = $(element).find('title').text().trim();
            const created_at = $(element).find('pubDate').text().trim();
            if (text && created_at) {
                tweets.push({ text, created_at });
            }
        });

        tweets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const limitedTweets = tweets.slice(0, 10);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ data: limitedTweets });
    } catch (error) {
        res.status(500).json({ error: 'Failed to scrape tweets', details: error.message });
    }
};
