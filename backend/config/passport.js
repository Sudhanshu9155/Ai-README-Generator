import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';


if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/auth/google/callback',
                proxy: true, // Add proxy support just in case
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user already exists
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        return done(null, user);
                    }

                    // Check if user exists with same email
                    user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                        // Update user with googleId
                        user.googleId = profile.id;
                        await user.save();
                        return done(null, user);
                    }

                    // Create new user
                    const newUser = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        avatar: profile.photos[0].value,
                    });

                    await newUser.save();
                    done(null, newUser);
                } catch (error) {
                    done(error, null);
                }
            }
        )
    );
} else {
    console.warn("GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET missing. Google OAuth disabled.");
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: '/api/auth/github/callback',
                scope: ['user:email', 'repo'],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // ✅ First check by GitHub ID (correct way)
                    let user = await User.findOne({ githubId: profile.id });

                    if (!user) {
                        user = new User({
                            name: profile.displayName || profile.username,
                            email: profile.emails?.[0]?.value || null,
                            githubId: profile.id,
                            githubUsername: profile.username,
                            avatar: profile.photos?.[0]?.value,
                            githubAccessToken: accessToken,
                        });
                    } else {
                        // Always update token + username
                        user.githubAccessToken = accessToken;
                        user.githubUsername = profile.username;
                    }

                    await user.save();
                    done(null, user);

                } catch (err) {
                    done(err, null);
                }
            }
        )
    );
} else {
    console.warn("GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET missing. GitHub OAuth disabled.");
}

export default passport;
