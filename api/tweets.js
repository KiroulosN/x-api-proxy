const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
    try {
        // Launch Puppeteer with Vercel-compatible settings
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: 'new',
            // Use bundled Chrome instead of expecting a local install
            executablePath: process.env.CHROME_EXECUTABLE_PATH || undefined
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.goto('https://x.com/MSFT365Status', { waitUntil: 'networkidle2' });

        const tweets = await page.evaluate(() => {
            const tweetList = [];
            document.querySelectorAll('article[data-testid="tweet"]').forEach(tweet => {
                const text = tweet.querySelector('div[lang]')?.innerText.trim();
                const time = tweet.querySelector('time')?.getAttribute('datetime');
                if (text && time) {
                    tweetList.push({ text, created_at: time });
                }
            });
            return tweetList;
        });

        await browser.close();

        tweets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const limitedTweets = tweets.slice(0, 10);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ data: limitedTweets });
    } catch (error) {
        res.status(500).json({ error: 'Failed to scrape tweets', details: error.message });
    }
};
