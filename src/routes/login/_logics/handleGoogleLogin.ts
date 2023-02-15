import { PUBLIC_APP_URL } from '$env/static/public';
import supabase from '$lib/supabaseClient';

export default async function handleGoogleLogin() {
	const { error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo: PUBLIC_APP_URL
		}
	});

	if (error) {
		console.error(error);
		alert(error.message);
	}
}
