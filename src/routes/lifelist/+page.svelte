<script lang="ts">
	let { data } = $props();

	let searchTerm = $state('');

	const filtered = $derived(
		data.entries.filter(
			(e) =>
				!searchTerm ||
				e.species?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				e.species?.latinName.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	function formatDate(dateStr: string) {
		const [year, month, day] = dateStr.split('-');
		return `${day}.${month}.${year.slice(2)}`;
	}
</script>

<div class="lifelist">
	<div class="list-header">
		<h1 class="page-title">Deine LifeList</h1>
		{#if data.entries.length > 0}
			<span class="count-badge">{data.entries.length}</span>
		{/if}
	</div>

	<div class="search-bar">
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
		</svg>
		<input
			type="search"
			bind:value={searchTerm}
			placeholder="Lifers durchsuchen..."
			class="search-input"
		/>
	</div>

	{#if data.entries.length === 0}
		<div class="empty-state">
			<div class="empty-icon">
				<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
				</svg>
			</div>
			<p class="empty-title">Noch keine Sichtungen</p>
			<p class="empty-sub">Erfasse deine erste Vogelbeobachtung!</p>
			<a href="/" class="cta-link">Jetzt erfassen</a>
		</div>

	{:else if filtered.length === 0}
		<div class="empty-state">
			<p class="empty-title">Keine Treffer für „{searchTerm}"</p>
		</div>

	{:else}
		<div class="entries">
			{#each filtered as entry (entry.id)}
				<a href="/lifelist/{entry.id}" class="entry-row">
					<div class="entry-thumb">
						{#if entry.species?.image}
							<img src={entry.species.image} alt={entry.species.name} />
						{:else}
							<div class="thumb-placeholder">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
									<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
								</svg>
							</div>
						{/if}
					</div>

					<div class="entry-info">
						{#if entry.species}
							<span class="entry-latin">{entry.species.latinName}</span>
							<span class="entry-name">{entry.species.name}</span>
						{:else}
							<span class="entry-name entry-unknown">{entry.birdId}</span>
						{/if}
					</div>

					<div class="entry-right">
						<span class="entry-date">{formatDate(entry.date)}</span>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
							<path d="m9 18 6-6-6-6" />
						</svg>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.lifelist {
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

	/* Search */
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

	/* Empty state */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 4rem 1rem;
		text-align: center;
	}

	.empty-icon {
		color: var(--border);
		margin-bottom: 0.75rem;
	}

	.empty-title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.empty-sub {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.cta-link {
		display: inline-block;
		margin-top: 1rem;
		background: var(--primary);
		color: white;
		padding: 0.625rem 1.5rem;
		border-radius: 999px;
		font-weight: 700;
		font-size: 0.875rem;
		box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
	}

	/* Entry list */
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

	.entry-unknown {
		color: var(--text-secondary);
		font-style: italic;
	}

	.entry-right {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		flex-shrink: 0;
		color: var(--text-secondary);
	}

	.entry-date {
		font-size: 0.8125rem;
		font-weight: 700;
		color: var(--text-secondary);
	}
</style>
