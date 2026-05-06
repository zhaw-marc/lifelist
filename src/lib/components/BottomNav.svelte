<script lang="ts">
	import { page } from '$app/stores';
</script>

<nav class="bottom-nav">
	<div class="nav-container">
		<a href="/capture" class="nav-item" class:active={$page.url.pathname.startsWith('/capture') || $page.url.pathname === '/'}>
			<div class="icon diamond"></div>
			<span class="label">Erfassen</span>
		</a>
		<a href="/lifelist" class="nav-item" class:active={$page.url.pathname.startsWith('/lifelist')}>
			<div class="icon circle"></div>
			<span class="label">Lifelist</span>
		</a>
		<a href="/settings" class="nav-item" class:active={$page.url.pathname === '/settings'}>
			<div class="icon triangle"></div>
			<span class="label">Einstellungen</span>
		</a>
	</div>
</nav>

<style>
	.bottom-nav {
		position: fixed;
		bottom: 1.5rem;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		pointer-events: none;
	}

	.nav-container {
		background: white;
		border-radius: 999px;
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem;
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
		pointer-events: auto;
		border: 1px solid var(--border-color);
	}

	.nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.5rem 1rem;
		border-radius: 999px;
		color: var(--text-primary);
		min-width: 80px;
	}

	.nav-item.active {
		background-color: #e5e7eb;
	}

	.icon {
		width: 24px;
		height: 24px;
		margin-bottom: 4px;
	}

	.diamond {
		background-color: #3b82f6;
		transform: rotate(45deg);
		width: 16px;
		height: 16px;
		margin: 4px;
	}

	.circle {
		background-color: #000;
		border-radius: 50%;
	}

	.triangle {
		width: 0;
		height: 0;
		border-left: 12px solid transparent;
		border-right: 12px solid transparent;
		border-bottom: 20px solid black;
	}

	.label {
		font-size: 0.75rem;
		font-weight: 500;
	}
</style>
