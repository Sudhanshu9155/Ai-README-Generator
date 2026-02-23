import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";

const normalizeBaseUrl = (url) => (url || "").replace(/\/+$/, "");

const BASE_URL =
  normalizeBaseUrl(process.env.BACKEND_URL || process.env.RENDER_EXTERNAL_URL) ||
  (process.env.NODE_ENV === "production"
    ? "https://ai-readme-generator-backend.onrender.com"
    : "http://localhost:5000");

const GOOGLE_CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL || `${BASE_URL}/api/auth/google/callback`;

const GITHUB_CALLBACK_URL =
  process.env.GITHUB_CALLBACK_URL || `${BASE_URL}/api/auth/github/callback`;

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) return done(null, user);

          const email = profile.emails?.[0]?.value;

          if (email) {
            user = await User.findOne({ email });

            if (user) {
              user.googleId = profile.id;
              if (!user.avatar)
                user.avatar = profile.photos?.[0]?.value;
              await user.save();
              return done(null, user);
            }
          }

          const newUser = await User.create({
            name: profile.displayName,
            email: email,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value,
          });

          done(null, newUser);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
} else {
  console.warn("Google OAuth disabled. Missing credentials.");
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL,
        scope: ["user:email", "repo"],
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ githubId: profile.id });

          if (user) {
            user.githubAccessToken = accessToken;
            user.githubUsername = profile.username;
            await user.save();
            return done(null, user);
          }

          const email = profile.emails?.[0]?.value;

          if (email) {
            user = await User.findOne({ email });

            if (user) {
              user.githubId = profile.id;
              user.githubUsername = profile.username;
              user.githubAccessToken = accessToken;
              if (!user.avatar)
                user.avatar = profile.photos?.[0]?.value;
              await user.save();
              return done(null, user);
            }
          }

          const newUser = await User.create({
            name: profile.displayName || profile.username,
            email,
            githubId: profile.id,
            githubUsername: profile.username,
            avatar: profile.photos?.[0]?.value,
            githubAccessToken: accessToken,
          });

          done(null, newUser);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
} else {
  console.warn("GitHub OAuth disabled. Missing credentials.");
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
