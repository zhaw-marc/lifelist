<script lang="ts">
	import { page } from '$app/stores';

	const isCapture = $derived(
		$page.url.pathname === '/' || $page.url.pathname.startsWith('/capture')
	);
	const isLifelist = $derived($page.url.pathname.startsWith('/lifelist'));
	const isUebersicht = $derived($page.url.pathname.startsWith('/uebersicht'));
	const isSettings = $derived($page.url.pathname === '/settings');
</script>

<nav class="bottom-nav">
	<div class="nav-pill">
		<a href="/" class="nav-item" class:active={isCapture}>
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
				<circle cx="12" cy="13" r="4" />
			</svg>
			<span>Erfassen</span>
		</a>

		<a href="/lifelist" class="nav-item" class:active={isLifelist}>
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
			</svg>
			<span>Lifelist</span>
		</a>

		<a href="/uebersicht" class="nav-item" class:active={isUebersicht}>
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
				<circle cx="12" cy="12" r="3" />
			</svg>
			<span>Übersicht</span>
		</a>

		<a href="/settings" class="nav-item" class:active={isSettings}>
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="4" y1="21" x2="4" y2="14" />
				<line x1="4" y1="10" x2="4" y2="3" />
				<line x1="12" y1="21" x2="12" y2="12" />
				<line x1="12" y1="8" x2="12" y2="3" />
				<line x1="20" y1="21" x2="20" y2="16" />
				<line x1="20" y1="12" x2="20" y2="3" />
				<line x1="1" y1="14" x2="7" y2="14" />
				<line x1="9" y1="8" x2="15" y2="8" />
				<line x1="17" y1="16" x2="23" y2="16" />
			</svg>
			<span>Einstellungen</span>
		</a>
	</div>
</nav>

<style>
	.bottom-nav {
		position: fixed;
		bottom: 1.25rem;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		pointer-events: none;
		z-index: 100;
	}

	@media (min-width: 768px) {
		.bottom-nav {
			position: relative;
			bottom: auto;
			padding: 0 0 1.25rem;
			pointer-events: auto;
			flex-shrink: 0;
		}
	}

	.nav-pill {
		background: var(--card-bg);
		border-radius: 2rem;
		display: flex;
		gap: 0.25rem;
		padding: 0.375rem;
		box-shadow:
			var(--shadow),
			0 0 0 1px var(--border);
		pointer-events: auto;
	}

	.nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2rem;
		padding: 0.5rem 1.125rem;
		border-radius: 1.75rem;
		color: var(--text-secondary);
		transition:
			background 0.18s ease,
			color 0.18s ease;
		min-width: 84px;
	}

	.nav-item.active {
		background: var(--nav-active-bg);
		color: var(--primary);
	}

	.nav-item span {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.01em;
	}

	.nav-item svg {
		transition: transform 0.18s ease;
	}

	.nav-item.active svg {
		transform: scale(1.05);
	}
</style>
