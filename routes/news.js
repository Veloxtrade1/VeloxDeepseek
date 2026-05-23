const express = require('express');
const NewsAPI = require('newsapi');
const News = require('../models/News');
const router = express.Router();
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
router.get('/latest', async (req, res) => {
  try {
    const response = await newsapi.v2.everything({ q: 'forex OR crypto OR trading', language: 'en', pageSize: 20 });
    const articles = response.articles.map(a => ({ title: a.title, description: a.description, url: a.url, publishedAt: a.publishedAt, source: a.source.name }));
    await News.insertMany(articles, { ordered: false });
    res.json(articles);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});
module.exports = router;