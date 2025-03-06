const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // Step 1: Get user ID
    const userResponse = await fetch('https://api.twitter.com/2/users/by/username/MSFT365Status', {
        headers: { 'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAHYNzwEAAAAAqcwRaGj%2FDgSwbprJBroQg0b1Ekk%3DYhPzuaAnKtIbXxJEcUK6lysXHIVmpECPfEKRJlHVyeV7ZbJcbq' }
    });
    const userData = await userResponse.json();
    if (!userData.data || !userData.data.id) {
        return res.status(500).json({ error: 'Failed to fetch user ID', details: userData });
    }
    const userId = userData.data.id;

    // Step 2: Get tweets
    const url = `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=created_at`;
    const tweetResponse = await fetch(url, {
        headers: { 'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAHYNzwEAAAAAuHl5%2FkPiKqjoegpSGwXDoDELl%2BA%3Dd5aZi2coU3koSxCq6DUo30CmhvVxanR6tZTyNxefbEpguBM9ZK' }
    });
    const tweetData = await tweetResponse.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(tweetData);
};
