import { PUBLIC_APP_URL } from '$env/static/public';
import supabase from '$lib/supabaseClient';

export default async function handleAppLogin(email: string) {
	const { error } = await supabase.auth.signInWithOtp({
		email,
		options: {
			emailRedirectTo: PUBLIC_APP_URL
		}
	});

	if (error) {
		console.error(error);
		alert(error.message);
	} else {
		alert('Check your email for the login link!');
	}
}
