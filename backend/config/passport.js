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
                    // 1. Check if user already exists with this Google ID
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        return done(null, user);
                    }

                    // 2. If not found, check if user exists with the same email
                    const email = profile.emails?.[0]?.value;
                    if (email) {
                        user = await User.findOne({ email });
                        if (user) {
                            // Link Google to this existing user
                            user.googleId = profile.id;
                            if (!user.avatar) user.avatar = profile.photos?.[0]?.value;
                            await user.save();
                            return done(null, user);
                        }
                    }

                    // 3. Create new user if no match found
                    const newUser = new User({
                        name: profile.displayName,
                        email: email,
                        googleId: profile.id,
                        avatar: profile.photos?.[0]?.value,
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
                callbackURL: "http://localhost:5000/api/auth/github/callback",
                scope: ['user:email', 'repo'],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // 1. Check if user already exists with this GitHub ID
                    let user = await User.findOne({ githubId: profile.id });

                    if (user) {
                        // Update existing user with latest info
                        user.githubAccessToken = accessToken;
                        user.githubUsername = profile.username;
                        await user.save();
                        return done(null, user);
                    }

                    // 2. If not found, check if user exists with the same email
                    const email = profile.emails?.[0]?.value;
                    if (email) {
                        user = await User.findOne({ email });
                        if (user) {
                            // Link GitHub to this existing user
                            user.githubId = profile.id;
                            user.githubUsername = profile.username;
                            user.githubAccessToken = accessToken;
                            if (!user.avatar) user.avatar = profile.photos?.[0]?.value;
                            await user.save();
                            return done(null, user);
                        }
                    }

                    // 3. Create new user if no match found
                    const newUser = new User({
                        name: profile.displayName || profile.username,
                        email: email,
                        githubId: profile.id,
                        githubUsername: profile.username,
                        avatar: profile.photos?.[0]?.value,
                        githubAccessToken: accessToken,
                    });

                    await newUser.save();
                    done(null, newUser);

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
