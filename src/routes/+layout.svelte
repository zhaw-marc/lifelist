<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>LifeList</title>
</svelte:head>

<div class="app-shell">
	<Header />
	<main class="main-content">
		{@render children()}
	</main>
	<BottomNav />
</div>

<style>
	.app-shell {
		display: flex;
		flex-direction: column;
		min-height: 100svh;
		max-width: 430px;
		width: 100%;
		margin: 0 auto;
		background-color: var(--bg);
		position: relative;
	}

	@media (min-width: 768px) {
		.app-shell {
			min-height: 0;
			height: min(92vh, 920px);
			border-radius: 2.5rem;
			box-shadow:
				0 60px 120px rgba(0, 0, 0, 0.5),
				0 0 0 1px rgba(255, 255, 255, 0.08);
			overflow: hidden;
		}
	}

	.main-content {
		flex: 1;
		overflow-y: auto;
		padding: 1rem 1rem 7rem;
		scrollbar-width: none;
	}

	.main-content::-webkit-scrollbar {
		display: none;
	}

	@media (min-width: 768px) {
		.main-content {
			padding-bottom: 1rem;
		}
	}
</style>
