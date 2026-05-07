<script lang="ts">
	let { data } = $props();

	let searchTerm = $state('');

	const filtered = $derived(
		searchTerm.trim().length === 0
			? data.species
			: data.species.filter(
					(s) =>
						s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
						s.latinName.toLowerCase().includes(searchTerm.toLowerCase()) ||
						(s.familyComName ?? '').toLowerCase().includes(searchTerm.toLowerCase())
				)
	);
</script>

<div class="uebersicht">
	<div class="list-header">
		<h1 class="page-title">Übersicht</h1>
		<span class="count-badge">{data.species.length}</span>
	</div>

	<div class="search-bar">
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
		</svg>
		<input
			type="search"
			bind:value={searchTerm}
			placeholder="Vogelarten suchen..."
			class="search-input"
		/>
	</div>

	{#if filtered.length === 0}
		<div class="empty-state">
			<p class="empty-title">Keine Treffer für „{searchTerm}"</p>
		</div>
	{:else}
		<div class="entries">
			{#each filtered as bird (bird.speciesCode)}
				<a href="/uebersicht/{bird.speciesCode}" class="entry-row">
					<div class="entry-thumb">
						{#if bird.image}
							<img src={bird.image} alt={bird.name} loading="lazy" />
						{:else}
							<div class="thumb-placeholder">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
									<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
								</svg>
							</div>
						{/if}
					</div>

					<div class="entry-info">
						<span class="entry-latin">{bird.latinName}</span>
						<span class="entry-name">{bird.name}</span>
						{#if bird.familyComName}
							<span class="entry-family">{bird.familyComName}</span>
						{/if}
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.uebersicht {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.list-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.page-title {
		font-size: 1.5rem;
		font-weight: 800;
		letter-spacing: -0.03em;
	}

	.count-badge {
		background: var(--primary);
		color: white;
		font-size: 0.75rem;
		font-weight: 800;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		letter-spacing: 0.01em;
	}

	.search-bar {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		background: var(--card-bg);
		border: 1.5px solid var(--border);
		border-radius: 999px;
		padding: 0.75rem 1.125rem;
		box-shadow: var(--shadow-sm);
		color: var(--text-secondary);
	}

	.search-bar:focus-within {
		border-color: var(--primary);
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}

	.search-input {
		border: none;
		outline: none;
		background: transparent;
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--text-primary);
		flex: 1;
	}

	.search-input::placeholder {
		color: var(--text-secondary);
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 4rem 1rem;
		text-align: center;
	}

	.empty-title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.entries {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.entry-row {
		display: flex;
		align-items: center;
		gap: 0.875rem;
		padding: 0.625rem 0.75rem 0.625rem 0.625rem;
		background: var(--card-bg);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.entry-row:hover {
		border-color: var(--primary);
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
	}

	.entry-thumb {
		width: 56px;
		height: 56px;
		border-radius: var(--radius);
		overflow: hidden;
		flex-shrink: 0;
		background: var(--bg);
	}

	.entry-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.thumb-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--border);
	}

	.entry-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		min-width: 0;
	}

	.entry-latin {
		font-size: 0.72rem;
		color: var(--text-secondary);
		font-style: italic;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.entry-name {
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.entry-family {
		font-size: 0.75rem;
		color: var(--text-secondary);
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
