<script lang="ts">
	import { birds } from '$lib/data/birds';

	const birdOfTheDay = birds[Math.floor((Date.now() / 86400000)) % birds.length];
</script>

<div class="home">
	<h2 class="section-title">Vogel des Tages</h2>

	<div class="bird-card">
		<img src={birdOfTheDay.image} alt={birdOfTheDay.name} class="bird-img" />
		<div class="card-gradient">
			<div class="card-meta">
				<span class="bird-latin">{birdOfTheDay.latinName}</span>
				<span class="bird-name">{birdOfTheDay.name}</span>
			</div>
			<a href="/birds/{birdOfTheDay.id}" class="discover-btn">Entdecken</a>
		</div>
	</div>

	<a href="/capture" class="cta-btn">
		<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
			<path d="M8 5v14l11-7z" />
		</svg>
		Beobachtung erfassen
	</a>
</div>

<style>
	.home {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding-top: 0.5rem;
	}

	.section-title {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--text-secondary);
		letter-spacing: 0.02em;
		text-transform: uppercase;
		font-size: 0.8rem;
	}

	.bird-card {
		width: 100%;
		aspect-ratio: 4 / 3;
		border-radius: var(--radius-xl);
		overflow: hidden;
		position: relative;
		box-shadow: var(--shadow-lg);
	}

	.bird-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.card-gradient {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%);
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-start;
		padding: 1.25rem;
		gap: 0.875rem;
	}

	.card-meta {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.bird-latin {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.7);
		font-style: italic;
		font-weight: 500;
	}

	.bird-name {
		font-size: 1.6rem;
		font-weight: 800;
		color: white;
		line-height: 1.1;
		letter-spacing: -0.02em;
	}

	.discover-btn {
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		color: var(--text-primary);
		border: none;
		padding: 0.5rem 1.25rem;
		border-radius: 999px;
		font-weight: 700;
		font-size: 0.875rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		transition: background 0.15s, transform 0.15s;
	}

	.discover-btn:hover {
		background: white;
		transform: scale(1.02);
	}

	.cta-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--primary);
		color: white;
		padding: 1rem 2rem;
		border-radius: 999px;
		font-size: 1rem;
		font-weight: 700;
		box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4);
		transition: transform 0.15s, box-shadow 0.15s;
		margin-top: 0.5rem;
	}

	.cta-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
	}

	.cta-btn:active {
		transform: translateY(0);
	}
</style>
