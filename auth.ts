import NextAuth from 'next-auth';
import 'next-auth/jwt';
import Google from 'next-auth/providers/google';
import { checkUserExist } from './app/actions/user';

declare module 'next-auth' {
	interface Session {
		error?: 'RefreshTokenError';
		provider?: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		access_token: string;
		expires_at: number;
		refresh_token?: string;
		error?: 'RefreshTokenError';
		provider?: string;
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Google({
			authorization: { params: { access_type: 'offline', prompt: 'consent' } },
		}),
	],

	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, account }) {
			// Initialize token with required fields if they don't exist yet
			if (!token.access_token) token.access_token = '';

			if (!token.expires_at) token.expires_at = 0;

			if (account) {
				// First-time login, save the `access_token`, its expiry and the `refresh_token`

				return {
					...token,
					provider: account.provider,
					access_token: account.access_token as string,
					expires_at: account.expires_at as number,
					refresh_token: account.refresh_token,
				};
			} else if (Date.now() < token.expires_at * 1000) {
				// Subsequent logins, but the `access_token` is still valid
				return token;
			} else {
				// Subsequent logins, but the `access_token` has expired, try to refresh it
				if (!token.refresh_token) throw new TypeError('Missing refresh_token');

				try {
					// The `token_endpoint` can be found in the provider's documentation. Or if they support OIDC,
					// at their `/.well-known/openid-configuration` endpoint.
					// i.e. https://accounts.google.com/.well-known/openid-configuration
					const response = await fetch('https://oauth2.googleapis.com/token', {
						method: 'POST',
						body: new URLSearchParams({
							client_id: process.env.AUTH_GOOGLE_ID!,
							client_secret: process.env.AUTH_GOOGLE_SECRET!,
							grant_type: 'refresh_token',
							refresh_token: token.refresh_token!,
						}),
					});

					const tokensOrError = await response.json();

					if (!response.ok) throw tokensOrError;

					const newTokens = tokensOrError as {
						access_token: string;
						expires_in: number;
						refresh_token?: string;
					};

					return {
						...token,
						access_token: newTokens.access_token,
						expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
						// Some providers only issue refresh tokens once, so preserve if we did not get a new one
						refresh_token: newTokens.refresh_token ? newTokens.refresh_token : token.refresh_token,
					};
				} catch (error) {
					console.error('Error refreshing access_token', error);
					// If we fail to refresh the token, return an error so we can handle it on the page
					token.error = 'RefreshTokenError';
					return token;
				}
			}
		},
		async session({ session, token }) {
			session.error = token.error;
			session.provider = token.provider;
			return session;
		},
		async signIn({ user, account }) {
			if (!account || !user.email) return false;
			// 檢查合法的 user 是否存在於資料庫中
			const userExist = await checkUserExist({
				provider: account.provider,
				email: user.email,
			});
			return Boolean(userExist);
		},
	},
	secret: process.env.AUTH_SECRET,
});
