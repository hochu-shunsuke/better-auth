import { betterAuth } from "better-auth";
import {
	bearer,
	admin,
	multiSession,
	oAuthProxy,
	openAPI,
	customSession,
} from "better-auth/plugins";
import { reactResetPasswordEmail } from "./email/reset-password";
import { resend } from "./email/resend";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";


const from = process.env.BETTER_AUTH_EMAIL || "";
const to = process.env.TEST_EMAIL || "";

const baseURL: string | undefined =
	process.env.VERCEL === "1"
		? process.env.VERCEL_ENV === "production"
			? process.env.BETTER_AUTH_URL
			: process.env.VERCEL_ENV === "preview"
				? `https://${process.env.VERCEL_URL}`
				: undefined
		: undefined;

const cookieDomain: string | undefined =
	process.env.VERCEL === "1"
		? process.env.VERCEL_ENV === "production"
			? ".better-auth.com"
			: process.env.VERCEL_ENV === "preview"
				? `.${process.env.VERCEL_URL}`
				: undefined
		: undefined;

export const auth = betterAuth({
	appName: "Better Auth Demo",
	baseURL,
	secret: process.env.BETTER_AUTH_SECRET,
	database: new Pool({
		connectionString: process.env.DATABASE_URL
	}),
	emailVerification: {
		async sendVerificationEmail({ user, url }) {
			const res = await resend.emails.send({
				from,
				to: to || user.email,
				subject: "Verify your email address",
				html: `<a href="${url}">Verify your email address</a>`,
			});
			console.log(res, user.email);
		},
	},
	account: {
			accountLinking: {
				trustedProviders: ["google", "github", "demo-app"],
			},
	},
	emailAndPassword: {
		enabled: true,
		async sendResetPassword({ user, url }) {
			await resend.emails.send({
				from,
				to: user.email,
				subject: "Reset your password",
				react: reactResetPasswordEmail({
					username: user.email,
					resetLink: url,
				}),
			});
		},
	},
	socialProviders: {
		/*
		facebook: {
			clientId: process.env.FACEBOOK_CLIENT_ID || "",
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
		},
		*/
		github: {
			clientId: process.env.GITHUB_CLIENT_ID || "",
			clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
		},
		google: {
			clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		},
		/*
		discord: {
			clientId: process.env.DISCORD_CLIENT_ID || "",
			clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
		},
		microsoft: {
			clientId: process.env.MICROSOFT_CLIENT_ID || "",
			clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
		},
		twitch: {
			clientId: process.env.TWITCH_CLIENT_ID || "",
			clientSecret: process.env.TWITCH_CLIENT_SECRET || "",
		},
		twitter: {
			clientId: process.env.TWITTER_CLIENT_ID || "",
			clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
		},
		paypal: {
			clientId: process.env.PAYPAL_CLIENT_ID || "",
			clientSecret: process.env.PAYPAL_CLIENT_SECRET || "",
		},
		*/
	},
	plugins: [
		openAPI(),
		bearer(),
		admin({
			adminUserIds: ["EXD5zjob2SD6CBWcEQ6OpLRHcyoUbnaB"],
		}),
		multiSession(),
		oAuthProxy(),
		nextCookies(),
		customSession(async (session) => {
			return {
				...session,
				user: {
					...session.user,
					dd: "test",
				},
			};
		}),
	],
	trustedOrigins: ["exp://"],
	advanced: {
		crossSubDomainCookies: {
			enabled: process.env.NODE_ENV === "production" && !!baseURL,
			domain: cookieDomain,
		},
	},
});
