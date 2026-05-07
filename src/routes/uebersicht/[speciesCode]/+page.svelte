<script lang="ts">
	let { data } = $props();
	let lightboxOpen = $state(false);
</script>

<div class="detail">
	<div class="hero">
		{#if data.bird.image}
			<button class="hero-img-btn" onclick={() => (lightboxOpen = true)} aria-label="Bild vergrössern">
				<img src={data.bird.image} alt={data.bird.name} class="hero-img" />
			</button>
		{:else}
			<div class="hero-placeholder"></div>
		{/if}
		<div class="hero-gradient">
			<a href="/uebersicht" class="back-btn" aria-label="Zurück">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="m15 18-6-6 6-6" />
				</svg>
			</a>
			<div class="hero-names">
				{#if data.wiki?.description}
					<span class="hero-description">{data.wiki.description}</span>
				{/if}
				<h1 class="hero-name">{data.bird.name}</h1>
				<span class="hero-latin">{data.bird.latinName}</span>
			</div>
		</div>
	</div>

	{#if data.familyComName || data.order}
		<div class="info-chips">
			{#if data.familyComName}
				<div class="chip">
					<span class="chip-label">Familie</span>
					<span class="chip-value">{data.familyComName}</span>
					{#if data.familySciName}
						<span class="chip-sci">{data.familySciName}</span>
					{/if}
				</div>
			{/if}
			{#if data.order}
				<div class="chip">
					<span class="chip-label">Ordnung</span>
					<span class="chip-value">{data.order}</span>
				</div>
			{/if}
		</div>
	{/if}

	{#if data.wiki?.extract}
		<div class="section">
			<h2 class="section-title">Über diese Art</h2>
			<p class="extract">{data.wiki.extract}</p>
		</div>
	{/if}

	<a href="/capture" class="cta-btn">
		<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
			<path d="M8 5v14l11-7z" />
		</svg>
		Beobachtung erfassen
	</a>
</div>

{#if lightboxOpen && data.bird.image}
	<div
		class="lightbox"
		role="dialog"
		aria-modal="true"
		aria-label="Bildvorschau"
		onclick={() => (lightboxOpen = false)}
		onkeydown={(e) => e.key === 'Escape' && (lightboxOpen = false)}
		tabindex="-1"
	>
		<button class="lightbox-close" onclick={() => (lightboxOpen = false)} aria-label="Schliessen">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M18 6 6 18M6 6l12 12" />
			</svg>
		</button>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<img
			src={data.bird.image}
			alt={data.bird.name}
			class="lightbox-img"
			onclick={(e) => e.stopPropagation()}
		/>
	</div>
{/if}

<style>
	.detail {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		margin: -1rem -1rem 0;
	}

	.hero {
		position: relative;
		width: 100%;
		aspect-ratio: 4 / 3;
	}

	.hero-img-btn {
		display: block;
		width: 100%;
		height: 100%;
		padding: 0;
		border: none;
		background: none;
		cursor: zoom-in;
	}

	.hero-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.hero-placeholder {
		width: 100%;
		height: 100%;
		background: var(--border);
	}

	/* Lightbox */
	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 500;
		background: rgba(0, 0, 0, 0.92);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		cursor: zoom-out;
	}

	.lightbox-close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 40px;
		height: 40px;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.25);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		cursor: pointer;
	}

	.lightbox-img {
		max-width: 100%;
		max-height: 90dvh;
		border-radius: var(--radius-lg);
		object-fit: contain;
		box-shadow: var(--shadow-lg);
		cursor: default;
	}

	.hero-gradient {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0.35) 0%,
			transparent 35%,
			transparent 45%,
			rgba(0, 0, 0, 0.75) 100%
		);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 1rem 1.25rem 1.5rem;
	}

	.back-btn {
		align-self: flex-start;
		width: 38px;
		height: 38px;
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.hero-names {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.hero-description {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.75);
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.hero-name {
		font-size: 2rem;
		font-weight: 900;
		color: white;
		line-height: 1.05;
		letter-spacing: -0.03em;
	}

	.hero-latin {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.75);
		font-style: italic;
		font-weight: 500;
	}

	.info-chips {
		display: flex;
		gap: 0.75rem;
		padding: 0 1rem;
		flex-wrap: wrap;
	}

	.chip {
		flex: 1;
		min-width: 120px;
		background: var(--card-bg);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 0.75rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		box-shadow: var(--shadow-sm);
	}

	.chip-label {
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-secondary);
	}

	.chip-value {
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--text-primary);
		line-height: 1.2;
	}

	.chip-sci {
		font-size: 0.72rem;
		color: var(--text-secondary);
		font-style: italic;
	}

	.section {
		padding: 0 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.section-title {
		font-size: 1rem;
		font-weight: 800;
		color: var(--text-primary);
		letter-spacing: -0.01em;
	}

	.extract {
		font-size: 0.9375rem;
		line-height: 1.7;
		color: var(--text-primary);
		font-weight: 500;
	}

	.cta-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin: 0 1rem 1rem;
		padding: 1rem;
		background: var(--primary);
		color: white;
		border-radius: 999px;
		font-size: 1rem;
		font-weight: 700;
		box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4);
		transition: transform 0.15s, box-shadow 0.15s;
	}

	.cta-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
	}
</style>
