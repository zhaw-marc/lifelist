<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>LifeList</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-container">
	<Header />
	<main class="main-content">
		{@render children()}
	</main>
	<BottomNav />
</div>

<style>
	.app-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		max-width: 500px;
		margin: 0 auto;
		background-color: var(--bg-color);
		position: relative;
	}

	.main-content {
		flex: 1;
		padding: 1rem;
		padding-bottom: 7rem; /* Space for bottom nav */
	}
</style>
