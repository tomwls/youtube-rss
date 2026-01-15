## YouTube RSS / Channel ID Lookup

<p>
    <img src="https://img.shields.io/badge/Svelte-FF3E00?logo=svelte&logoColor=white" alt="Svelte">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</p>

YouTube does not directly expose the channel ID but this is required if you want to subscribe to a channel via your preferred RSS reader.

This tool scans the channel page HTML and extracts the channel ID using regex.

All channel IDs are 22 characters long and start with UC:

```text
UC[0-9A-Za-z_-]{22}
```

Once a match is found, the channel ID is appended to the standard YouTube RSS feed URL.
