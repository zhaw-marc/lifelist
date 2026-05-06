<script lang="ts">
	import { page } from '$app/stores';
</script>

<header class="header">
	<div class="logo">
		<img src="/src/lib/assets/favicon.svg" alt="LifeList Logo" />
		<span class="logo-text">LifeList</span>
	</div>
	<div class="help-icon">
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
	</div>
</header>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		background-color: var(--bg-color);
	}

	.logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.logo img {
		width: 48px;
		height: 48px;
		background: white;
		border-radius: 50%;
		padding: 8px;
		box-shadow: var(--shadow);
	}

	.logo-text {
		font-weight: bold;
		font-size: 0.875rem;
		color: #1e3a8a;
	}

	.help-icon {
		color: #1f2937;
	}
</style>
