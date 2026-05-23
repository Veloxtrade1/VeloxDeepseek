const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const router = express.Router();
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);
router.post('/ask', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message,
      max_tokens: 200,
      temperature: 0.7
    });
    res.json({ reply: response.data.choices[0].text });
  } catch (err) { res.status(500).json({ reply: "Sorry, I'm having trouble right now." }); }
});
module.exports = router;