import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const inputRaw = url.searchParams.get('input') ?? '';
	const input = inputRaw.trim();

	if (!input) {
		return json({ error: 'No input provided' }, { status: 400 });
	}

	try {
		const channelId = await resolveYouTubeChannelId(input, fetch);
		const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
		return json({ rssUrl, channelId });
	} catch (error) {
		return json({ error: (error as Error).message }, { status: 400 });
	}
};

async function resolveYouTubeChannelId(
	channelInput: string,
	fetchFn: typeof fetch
): Promise<string> {
	if (channelInput.startsWith('UC')) return channelInput;

	const normalized = channelInput.startsWith('http')
		? channelInput
		: `https://www.youtube.com/${channelInput.replace(/^\/+/, '')}`;

	const res = await fetchFn(normalized, {
		headers: {
			// Spoof a user-agent
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
		}
	});

	if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText}`);
	}

	const html = await res.text();

	// Attempt to extract channel ID from the HTML using regex
	const channelIdMatch = html.match(/"channelId":"(UC[0-9A-Za-z_-]{22})"/);
	if (!channelIdMatch) {
		throw new Error('No match found');
	}

	return channelIdMatch[1];
}
