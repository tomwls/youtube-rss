<script lang="ts">
	let input = '';
	let rssUrl = '';
	let channelId = '';
	let error = '';
	let isLoading = false;
	let didCopy = false;
	let didCopyChannelId = false;

	async function resolveChannel() {
		error = '';
		isLoading = true;

		try {
			const res = await fetch(`/api/youtube-rss?input=${encodeURIComponent(input.trim())}`);
			const body = (await res.json()) as { rssUrl?: string; channelId?: string; error?: string };

			if (!res.ok || !body.rssUrl) {
				error = body.error || 'No match found';
				return;
			}

			rssUrl = body.rssUrl ?? '';
			channelId = body.channelId ?? '';
		} catch (e) {
			error = e instanceof Error ? e.message : 'No match found';
		} finally {
			isLoading = false;
		}
	}

	async function copyRssUrl() {
		if (!rssUrl) return;
		await navigator.clipboard.writeText(rssUrl);
		didCopy = true;
		setTimeout(() => (didCopy = false), 2000);
	}

	async function copyChannelId() {
		if (!channelId) return;
		await navigator.clipboard.writeText(channelId);
		didCopyChannelId = true;
		setTimeout(() => (didCopyChannelId = false), 2000);
	}
</script>

<main class="min-h-dvh">
	<div class="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-14">
		<div
			class="relative overflow-hidden rounded-sm border border-slate-200/10 bg-slate-400/5 p-6 text-center shadow-sm backdrop-blur sm:p-8"
		>
			<header class="relative mt-1 mb-6 space-y-2">
				<h1 class="text-med mb-6 font-bold text-balance">YouTube RSS / Channel ID Lookup</h1>
				<p class="text-sm text-slate-300/70">Enter a channel URL or handle.</p>
			</header>

			<form class="relative space-y-3" on:submit|preventDefault={resolveChannel}>
				<label class="block">
					<input
						class="block w-full rounded-sm border border-slate-200/10 bg-slate-400/5 px-3 py-2 text-center text-sm text-slate-100 shadow-sm outline-none placeholder:text-slate-400/70 focus:border-sky-300/25 focus:ring-4 focus:ring-sky-500/15"
						type="text"
						bind:value={input}
						placeholder="https://www.youtube.com/@ThePrimeagen"
						autocomplete="off"
						autocapitalize="off"
						spellcheck="false"
					/>
				</label>

				<div class="flex justify-center gap-2">
					<button
						type="submit"
						class="mt-3 inline-flex items-center justify-center rounded-sm border border-sky-300/30 bg-sky-400/55 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-500/10 transition hover:bg-sky-400/65 hover:shadow-sky-500/20 focus-visible:ring-4 focus-visible:ring-sky-400/30 focus-visible:outline-none active:bg-sky-400/50"
						disabled={isLoading || !input.trim()}
					>
						{isLoading ? 'Loading…' : 'Search'}
					</button>
				</div>
			</form>

			{#if error}
				<p
					class="mt-4 rounded-sm border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200"
				>
					{error}
				</p>
			{/if}

			{#if rssUrl}
				<div class="mt-6 rounded-sm border border-slate-200/10 bg-slate-400/5 p-4">
					<div class="mb-4 flex items-center justify-between gap-3">
						<p
							class="flex items-center gap-2 text-xs leading-none font-medium tracking-wide text-slate-300/70 uppercase"
						>
							<span class="text-sm font-semibold tracking-wide text-orange-400 uppercase"
								>RSS Feed</span
							>
						</p>
						<button
							type="button"
							class="inline-flex items-center justify-center gap-2 rounded-sm border border-slate-200/10 bg-slate-400/5 px-2.5 py-1.5 leading-none text-slate-100 shadow-sm transition hover:bg-slate-400/10 focus-visible:ring-4 focus-visible:ring-sky-500/15 focus-visible:outline-none"
							on:click={copyRssUrl}
							aria-label={didCopy ? 'Copied' : 'Copy'}
							title={didCopy ? 'Copied' : 'Copy'}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								class="bi bi-clipboard block pb-0.5"
								viewBox="0 0 16 16"
							>
								<path
									d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"
								/>
								<path
									d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"
								/>
							</svg>
							{#if didCopy}
								<span class="text-xs font-medium text-sky-400">Copied</span>
							{/if}
						</button>
					</div>
					<a
						class="block rounded-sm border border-orange-300/25 bg-orange-400/20 p-3 text-sm break-all text-orange-50 no-underline shadow-sm transition hover:bg-orange-400/25 focus-visible:ring-4 focus-visible:ring-orange-400/25 focus-visible:outline-none"
						href={rssUrl}
						target="_blank"
						rel="noreferrer"
					>
						{rssUrl}
					</a>
				</div>

				{#if channelId}
					<div class="mt-6 rounded-sm border border-slate-200/10 bg-slate-400/5 p-4">
						<div class="mb-4 flex items-center justify-between gap-3">
							<p
								class="flex items-center gap-2 text-xs leading-none font-medium tracking-wide text-slate-300/70 uppercase"
							>
								<span class="text-sm font-semibold tracking-wide text-green-400 uppercase">
									Channel ID
								</span>
							</p>
							<button
								type="button"
								class="inline-flex items-center justify-center gap-2 rounded-sm border border-slate-200/10 bg-slate-400/5 px-2.5 py-1.5 leading-none text-slate-100 shadow-sm transition hover:bg-slate-400/10 focus-visible:ring-4 focus-visible:ring-sky-500/15 focus-visible:outline-none"
								on:click={copyChannelId}
								aria-label={didCopyChannelId ? 'Copied' : 'Copy'}
								title={didCopyChannelId ? 'Copied' : 'Copy'}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									class="bi bi-clipboard block pb-0.5"
									viewBox="0 0 16 16"
								>
									<path
										d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"
									/>
									<path
										d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"
									/>
								</svg>
								{#if didCopyChannelId}
									<span class="text-xs font-medium text-sky-400">Copied</span>
								{/if}
							</button>
						</div>

						<div
							class="block rounded-sm border border-emerald-300/25 bg-emerald-400/15 p-3 text-sm break-all text-emerald-50 shadow-sm"
						>
							{channelId}
						</div>
					</div>
				{/if}
			{/if}
		</div>
		<div
			class="mt-6 rounded-sm border border-slate-200/10 bg-slate-400/5 p-8 text-left text-sm text-slate-200"
		>
			<div class="space-y-5 leading-relaxed">
				<p>
					YouTube does not directly expose the channel ID but this is required if you want to
					subscribe to a channel via your preferred RSS reader.
				</p>
				<p>This tool scans the channel page HTML and extracts the channel ID using regex.</p>
				<p>All channel IDs are 22 characters long and start with UC:</p>
				<pre
					class="mt-2 flex min-h-12 max-w-full items-center justify-center overflow-x-auto rounded-sm border border-slate-200/10 bg-slate-950/60 px-4 py-3 text-center font-mono text-sm whitespace-nowrap text-slate-100 shadow-sm ring-1 ring-white/5 selection:bg-sky-500/30"><span
						class="text-emerald-200">UC</span
					><span class="text-slate-100">[0-9A-Za-z_-]</span><span class="text-sky-200">{22}</span>
				</pre>
				<p>
					Once a match is found, the channel ID is appended to the standard YouTube RSS feed URL.
				</p>
			</div>
		</div>
	</div>
</main>
