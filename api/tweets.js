const fetch = require('node-fetch');

let cachedTweets = null;
let lastFetch = 0;
const cacheDuration = 15 * 60 * 1000; // 15 minutes in ms

module.exports = async (req, res) => {
    const now = Date.now();
    if (cachedTweets && (now - lastFetch < cacheDuration)) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.json(cachedTweets);
    }

    const userResponse = await fetch('https://api.twitter.com/2/users/by/username/MSFT365Status', {
        headers: { 'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAACcQzwEAAAAAGgX8SZrFM5S2CkNNAqZPRMhgndw%3D2D0jK1bqS8SAuru2WNWBNx5f23tQAQBtDe94lBFnYgHGEKGbZu' }
    });
    const userData = await userResponse.json();
    if (!userData.data || !userData.data.id) {
        return res.status(500).json({ error: 'Failed to fetch user ID', details: userData });
    }
    const userId = userData.data.id;

    const url = `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=created_at`;
    const tweetResponse = await fetch(url, {
        headers: { 'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAACcQzwEAAAAAGgX8SZrFM5S2CkNNAqZPRMhgndw%3D2D0jK1bqS8SAuru2WNWBNx5f23tQAQBtDe94lBFnYgHGEKGbZu' }
    });
    const tweetData = await tweetResponse.json();

    if (tweetResponse.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded', details: tweetData });
    }

    cachedTweets = tweetData;
    lastFetch = now;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(tweetData);
};
