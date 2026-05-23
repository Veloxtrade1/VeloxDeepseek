module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('chatMessage', async (msg) => {
      // forward to OpenAI and reply
      const reply = "AI response here";
      socket.emit('chatReply', reply);
    });
  });
};