const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const url = 'https://api.twitter.com/2/users/1087688319628972032/tweets?max_results=10&tweet.fields=created_at';
    const response = await fetch(url, {
        headers: { 'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAHYNzwEAAAAAuHl5%2FkPiKqjoegpSGwXDoDELl%2BA%3Dd5aZi2coU3koSxCq6DUo30CmhvVxanR6tZTyNxefbEpguBM9ZK' }
    });
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow your GitHub Pages site
    res.json(data);
};
