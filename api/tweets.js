const fetch = require('node-fetch');

module.exports = async (req, res) => {
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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(tweetData);
};
