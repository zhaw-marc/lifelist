<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let { data } = $props();
	const stats = $derived(data.stats);

	let displayName = $state('');
	let homeLocation = $state<{ lat: number; lng: number } | null>(null);
	let nameSaved = $state(false);
	let locationSaved = $state(false);
	let locating = $state(false);
	let locError = $state('');

	onMount(() => {
		if (!browser) return;
		const saved = JSON.parse(localStorage.getItem('lifelist_settings') || '{}');
		displayName = saved.displayName ?? '';
		homeLocation = saved.homeLocation ?? null;
	});

	function patchSettings(patch: Record<string, unknown>) {
		if (!browser) return;
		const current = JSON.parse(localStorage.getItem('lifelist_settings') || '{}');
		localStorage.setItem('lifelist_settings', JSON.stringify({ ...current, ...patch }));
	}

	function saveName() {
		patchSettings({ displayName: displayName.trim() });
		nameSaved = true;
		setTimeout(() => (nameSaved = false), 2000);
	}

	function saveCurrentLocation() {
		locating = true;
		locError = '';
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				homeLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
				patchSettings({ homeLocation });
				locating = false;
				locationSaved = true;
				setTimeout(() => (locationSaved = false), 2500);
			},
			() => {
				locating = false;
				locError = 'Standort konnte nicht ermittelt werden.';
			}
		);
	}

	function clearHomeLocation() {
		homeLocation = null;
		patchSettings({ homeLocation: null });
	}

	function formatCoord(n: number, type: 'lat' | 'lng') {
		const dir = type === 'lat' ? (n >= 0 ? 'N' : 'S') : n >= 0 ? 'O' : 'W';
		return `${Math.abs(n).toFixed(4)}° ${dir}`;
	}

	function formatDate(dateStr: string | null) {
		if (!dateStr) return '—';
		const [y, m, d] = dateStr.split('-');
		return `${d}.${m}.${y}`;
	}
</script>

<div class="settings">
	<h1 class="page-title">Einstellungen</h1>

	<!-- Stats -->
	<section class="section">
		<h2 class="section-label">Übersicht</h2>
		<div class="stats-grid">
			<div class="stat-card">
				<span class="stat-value">{stats.totalObservations}</span>
				<span class="stat-label">Beobachtungen</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{stats.totalSpecies}</span>
				<span class="stat-label">Arten (Lifer)</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{formatDate(stats.firstSighting)}</span>
				<span class="stat-label">Erste Sichtung</span>
			</div>
		</div>
	</section>

	<!-- Profile -->
	<section class="section">
		<h2 class="section-label">Profil</h2>
		<div class="card">
			<div class="row">
				<label for="display-name" class="row-label">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
						<circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
					</svg>
					Name
				</label>
				<div class="row-control">
					<input
						id="display-name"
						type="text"
						bind:value={displayName}
						placeholder="Dein Name"
						onkeydown={(e) => e.key === 'Enter' && saveName()}
					/>
					<button
						class="save-btn"
						class:saved={nameSaved}
						onclick={saveName}
						disabled={nameSaved}
					>
						{#if nameSaved}
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
								<path d="M20 6 9 17l-5-5" />
							</svg>
						{:else}
							Speichern
						{/if}
					</button>
				</div>
			</div>
		</div>
	</section>

	<!-- Home location -->
	<section class="section">
		<h2 class="section-label">Standardstandort</h2>
		<p class="section-hint">Wird als Startpunkt der Karte beim Erfassen verwendet.</p>
		<div class="card">
			{#if homeLocation}
				<div class="location-display">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
						<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
					</svg>
					<span class="coord">{formatCoord(homeLocation.lat, 'lat')}</span>
					<span class="coord-sep">/</span>
					<span class="coord">{formatCoord(homeLocation.lng, 'lng')}</span>
				</div>
			{/if}

			<div class="location-actions">
				<button
					class="action-btn"
					class:saved={locationSaved}
					onclick={saveCurrentLocation}
					disabled={locating || locationSaved}
				>
					{#if locating}
						<svg class="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
							<path d="M21 12a9 9 0 1 1-6.219-8.56" />
						</svg>
						Wird ermittelt…
					{:else if locationSaved}
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
							<path d="M20 6 9 17l-5-5" />
						</svg>
						Gespeichert
					{:else}
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
							<path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" /><circle cx="12" cy="9" r="2.5" />
						</svg>
						Aktuellen Standort speichern
					{/if}
				</button>

				{#if homeLocation}
					<button class="clear-btn" onclick={clearHomeLocation}>Zurücksetzen</button>
				{/if}
			</div>

			{#if locError}
				<p class="loc-error">{locError}</p>
			{/if}
		</div>
	</section>

	<!-- Data -->
	<section class="section">
		<h2 class="section-label">Daten</h2>
		<div class="card">
			<a href="/api/export" download="lifelist.csv" class="export-row">
				<div class="export-info">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
						<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><polyline points="9 15 12 18 15 15" />
					</svg>
					<div>
						<span class="export-title">Beobachtungen exportieren</span>
						<span class="export-sub">CSV-Datei mit allen {stats.totalObservations} Einträgen</span>
					</div>
				</div>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="m9 18 6-6-6-6" />
				</svg>
			</a>
		</div>
	</section>
</div>

<style>
	.settings {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.page-title {
		font-size: 1.5rem;
		font-weight: 800;
		letter-spacing: -0.03em;
		color: var(--text-primary);
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.section-label {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-secondary);
		padding-left: 0.25rem;
	}

	.section-hint {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		padding-left: 0.25rem;
		margin-top: -0.25rem;
	}

	/* Stats */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.625rem;
	}

	.stat-card {
		background: var(--card-bg);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 1rem 0.75rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		box-shadow: var(--shadow-sm);
		text-align: center;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 900;
		color: var(--primary);
		letter-spacing: -0.04em;
		line-height: 1;
	}

	.stat-label {
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		line-height: 1.2;
	}

	/* Card */
	.card {
		background: var(--card-bg);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-sm);
	}

	/* Profile row */
	.row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
	}

	.row-label {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-primary);
		white-space: nowrap;
		flex-shrink: 0;
	}

	.row-control {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		min-width: 0;
	}

	.row-control input {
		flex: 1;
		min-width: 0;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 0.5rem 0.75rem;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-primary);
		background: var(--bg);
		outline: none;
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.row-control input:focus {
		border-color: var(--primary);
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}

	.save-btn {
		flex-shrink: 0;
		background: var(--primary);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		padding: 0.5rem 0.875rem;
		font-size: 0.8125rem;
		font-weight: 700;
		transition: background 0.15s, transform 0.1s;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		min-width: 82px;
		justify-content: center;
	}

	.save-btn:hover:not(:disabled) {
		background: var(--primary-dark);
	}

	.save-btn.saved {
		background: var(--accent-green);
	}

	/* Location */
	.location-display {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.875rem 1rem 0.5rem;
		color: var(--text-secondary);
		font-size: 0.8125rem;
	}

	.coord {
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: var(--text-primary);
	}

	.coord-sep {
		color: var(--border);
	}

	.location-actions {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.625rem 1rem 0.875rem;
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		background: var(--primary);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		padding: 0.5rem 0.875rem;
		font-size: 0.8125rem;
		font-weight: 700;
		transition: background 0.15s;
	}

	.action-btn:hover:not(:disabled) {
		background: var(--primary-dark);
	}

	.action-btn.saved {
		background: var(--accent-green);
	}

	.action-btn:disabled {
		opacity: 0.75;
		cursor: default;
	}

	.clear-btn {
		background: none;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 0.5rem 0.75rem;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--text-secondary);
		transition: border-color 0.15s, color 0.15s;
	}

	.clear-btn:hover {
		border-color: var(--accent-red);
		color: var(--accent-red);
	}

	.loc-error {
		font-size: 0.8125rem;
		color: var(--accent-red);
		padding: 0 1rem 0.75rem;
	}

	/* Export */
	.export-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		color: var(--text-primary);
		transition: background 0.1s;
	}

	.export-row:hover {
		background: var(--bg);
	}

	.export-info {
		display: flex;
		align-items: center;
		gap: 0.875rem;
		color: var(--primary);
	}

	.export-info > div {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.export-title {
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.export-sub {
		font-size: 0.75rem;
		color: var(--text-secondary);
		font-weight: 500;
	}

	/* Spinner */
	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.spin {
		animation: spin 0.8s linear infinite;
	}
</style>
