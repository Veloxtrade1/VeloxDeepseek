require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const rateLimiter = require('./middleware/rateLimiter');
const geoBlock = require('./middleware/geoBlock');
const connectDB = require('./config/db');
const logger = require('./config/logger');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const tradingRoutes = require('./routes/trading');
const adminRoutes = require('./routes/admin');
const kycRoutes = require('./routes/kyc');
const courseRoutes = require('./routes/courses');
const signalRoutes = require('./routes/signals');
const socialTradeRoutes = require('./routes/socialTrade');
const newsRoutes = require('./routes/news');
const chatbotRoutes = require('./routes/chatbot');
const orderRoutes = require('./routes/orders');
const alertRoutes = require('./routes/alerts');
const apiKeyRoutes = require('./routes/apiKeys');
const passwordResetRoutes = require('./routes/passwordReset');
//const twoFactorRoutes = require('./routes/twoFactor');
//const fiatPaymentRoutes = require('./routes/fiatPayment');
//const swapRoutes = require('./routes/swap');
//const leverageRoutes = require('./routes/leverage');
//const logRoutes = require('./routes/logs');
const { startWebSocketStream } = require('./services/marketData');
const marketFeed = require('./websocket/marketFeed');
const chatBotSocket = require('./websocket/chatBotSocket');
require('./config/passport')(passport);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || '*' },
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(rateLimiter);
app.use(geoBlock);
app.use((req, res, next) => { req.io = io; next(); });

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/signals', signalRoutes);
app.use('/api/social', socialTradeRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/api-keys', apiKeyRoutes);
app.use('/api/password-reset', passwordResetRoutes);
//app.use('/api/2fa', twoFactorRoutes);
//app.use('/api/fiat', fiatPaymentRoutes);
//app.use('/api/swap', swapRoutes);
//app.use('/api/leverage', leverageRoutes);
//app.use('/api/logs', logRoutes);

marketFeed(io);
startWebSocketStream(io);
chatBotSocket(io);

const dashboardPages = ['overview', 'trading', 'deposits', 'withdrawals', 'history', 'kyc', 'courses', 'signals', 'social-trading', 'settings', 'alerts', 'api-keys', 'swap'];
dashboardPages.forEach(page => {
  app.get(`/dashboard/${page}`, (req, res) => res.sendFile(path.join(__dirname, `public/dashboard/${page}.html`)));
});
const adminPages = ['index', 'users', 'deposits', 'kyc', 'employees', 'finance', 'crm', 'reports', 'settings', 'logs', 'swaps'];
adminPages.forEach(page => {
  app.get(`/admin/${page}`, (req, res) => res.sendFile(path.join(__dirname, `public/admin/${page}.html`)));
});
app.get('/courses', (req, res) => res.redirect('/dashboard/courses'));
app.get('/signals', (req, res) => res.redirect('/dashboard/signals'));
app.get('/social-trading', (req, res) => res.redirect('/dashboard/social-trading'));

app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => logger.info(`Velox running on port ${PORT}`));
