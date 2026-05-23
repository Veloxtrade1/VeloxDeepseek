const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        email: profile.emails[0].value,
        fullName: profile.displayName,
        googleId: profile.id,
        password: 'oauth_' + Math.random(),
        demoMode: true,
        demoBalance: parseFloat(process.env.DEMO_BALANCE)
      });
      await user.save();
    }
    done(null, user);
  }));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};