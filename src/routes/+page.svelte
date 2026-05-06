<script lang="ts">
	import { birds } from '$lib/data/birds';
	const birdOfTheDay = birds[1]; // Blaumeise for now
</script>

<div class="home-screen">
	<h2 class="title">Vogel des Tages</h2>

	<div class="card-container">
		<div class="bird-card">
			<img src={birdOfTheDay.image} alt={birdOfTheDay.name} />
			<div class="card-overlay">
				<button class="btn-secondary">Entdecken</button>
			</div>
		</div>
	</div>

	<div class="cta-container">
		<a href="/capture" class="btn-primary">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
			Beobachtung erfassen
		</a>
	</div>
</div>

<style>
	.home-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding-top: 1rem;
	}

	.title {
		font-size: 1.25rem;
		font-weight: 600;
	}

	.card-container {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.bird-card {
		position: relative;
		width: 90%;
		aspect-ratio: 4/3;
		border-radius: 2rem;
		overflow: hidden;
		box-shadow: var(--shadow);
	}

	.bird-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		padding-bottom: 1.5rem;
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.9);
		border: none;
		padding: 0.75rem 2rem;
		border-radius: 999px;
		font-weight: 600;
		color: var(--text-primary);
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		cursor: pointer;
	}

	.cta-container {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 2rem;
	}

	.btn-primary {
		background-color: #3b82f6;
		color: white;
		border: none;
		padding: 1rem 2rem;
		border-radius: 999px;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		box-shadow: 0 4px 10px rgba(59, 130, 246, 0.5);
		text-decoration: none;
	}
</style>
