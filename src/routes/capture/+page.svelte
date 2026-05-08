<script lang="ts">
	import { tick } from 'svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { captureState, resetCapture } from '$lib/state.svelte';
	import { enhance } from '$app/forms';

	let { data } = $props();

	type SpeciesItem = (typeof data.speciesList)[0];

	let step = $state(1);
	let searchTerm = $state('');
	let mapElement = $state<HTMLElement | undefined>(undefined);
	let map = $state<any>(null);
	let marker = $state<any>(null);
	let leafletLib = $state<any>(null);
	let errorMessage = $state('');

	// Track birds added during this session so badges update immediately after saving
	let locallyAdded = $state<string[]>([]);
	const observedSet = $derived(new Set([...data.observedCodes, ...locallyAdded]));

	let savedBird = $state<SpeciesItem | null>(null);
	let isNewLifer = $state(false);

	const filteredSpecies = $derived(
		searchTerm.length === 0
			? []
			: data.speciesList.filter(
					(s) =>
						s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
						s.latinName.toLowerCase().includes(searchTerm.toLowerCase())
				)
	);

	const selectedBird = $derived(
		data.speciesList.find((s) => s.speciesCode === captureState.selectedBirdId) ?? null
	);

	async function selectBird(speciesCode: string) {
		captureState.selectedBirdId = speciesCode;
		step = 2;
		// Wait for the map element to appear in the DOM, then init Leaflet
		await tick();
		if (leafletLib && mapElement && captureState.location && !map) {
			const { lat, lng } = captureState.location;
			initMap(leafletLib, lat, lng);
		}
	}

	function goBack() {
		if (step > 1) {
			if (map) {
				map.remove();
				map = null;
			}
			step--;
		}
	}

	onMount(async () => {
		if (!browser) return;
		const L = await import('leaflet');
		await import('leaflet/dist/leaflet.css');
		leafletLib = L;

		// Use saved home location if available, otherwise fall back to Zurich
		const savedSettings = JSON.parse(localStorage.getItem('lifelist_settings') || '{}');
		const defaultLat = savedSettings.homeLocation?.lat ?? 47.3769;
		const defaultLng = savedSettings.homeLocation?.lng ?? 8.5417;
		captureState.location = { lat: defaultLat, lng: defaultLng };

		navigator.geolocation.getCurrentPosition(
			(pos) => {
				captureState.location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
				// If the user is already on step 2, pan the map to the real location
				if (map && marker) {
					const { lat, lng } = captureState.location;
					map.setView([lat, lng], 14);
					marker.setLatLng([lat, lng]);
				}
			},
			() => {
				// Keep the Zurich default already set above
			}
		);
	});

	function initMap(L: any, lat: number, lng: number) {
		if (!mapElement) return;
		map = L.map(mapElement).setView([lat, lng], 14);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap'
		}).addTo(map);
		marker = L.marker([lat, lng], { draggable: true }).addTo(map);
		marker.on('dragend', () => {
			const pos = marker.getLatLng();
			captureState.location = { lat: pos.lat, lng: pos.lng };
		});
		map.on('click', (e: any) => {
			marker.setLatLng(e.latlng);
			captureState.location = { lat: e.latlng.lat, lng: e.latlng.lng };
		});
	}

	function handleSubmit() {
		return async ({ result }: { result: any }) => {
			if (result.type === 'success') {
				savedBird = selectedBird;
				isNewLifer = result.data?.isNewLifer ?? false;
				if (captureState.selectedBirdId) {
					locallyAdded = [...locallyAdded, captureState.selectedBirdId];
				}
				if (map) {
					map.remove();
					map = null;
				}
				resetCapture();
				step = 3;
			} else if (result.type === 'failure') {
				errorMessage = result.data?.message ?? 'Fehler beim Speichern.';
			}
		};
	}
</script>

<div class="capture">
	{#if step === 1}
		<div class="step">
			<h1 class="page-title">Neue Beobachtung</h1>

			<div class="search-bar">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
				</svg>
				<input
					type="search"
					bind:value={searchTerm}
					placeholder="Vogelname oder Artname suchen…"
					class="search-input"
					autocomplete="off"
				/>
				{#if searchTerm.length > 0}
					<button class="clear-btn" onclick={() => (searchTerm = '')} aria-label="Suche leeren">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
							<path d="M18 6 6 18M6 6l12 12" />
						</svg>
					</button>
				{/if}
			</div>

			{#if searchTerm.length === 0}
				<div class="search-hint">
					<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
					</svg>
					<p>Tippe den deutschen oder wissenschaftlichen Namen ein</p>
					<span class="hint-sub">{data.speciesList.length} Schweizer Vogelarten verfügbar</span>
				</div>
			{:else if filteredSpecies.length === 0}
				<div class="search-hint">
					<p class="no-results">Keine Treffer für „{searchTerm}"</p>
				</div>
			{:else}
				<div class="result-count">{filteredSpecies.length} Treffer</div>
				<div class="bird-list">
					{#each filteredSpecies as bird (bird.speciesCode)}
						<button class="bird-row" onclick={() => selectBird(bird.speciesCode)}>
							{#if bird.image}
								<img src={bird.image} alt={bird.name} class="bird-thumb" />
							{:else}
								<div class="bird-thumb bird-thumb-placeholder">
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
								</div>
							{/if}
							<div class="bird-info">
								<span class="bird-latin">{bird.latinName}</span>
								<span class="bird-name">{bird.name}</span>
							</div>
							{#if observedSet.has(bird.speciesCode)}
								<span class="lifer-tag">
									<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
										<path d="M20 6 9 17l-5-5" />
									</svg>
									Gesehen
								</span>
							{/if}
							<svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<path d="m9 18 6-6-6-6" />
							</svg>
						</button>
					{/each}
				</div>
			{/if}
		</div>

	{:else if step === 2}
		<div class="step">
			<div class="step-header">
				<button class="back-btn" onclick={goBack} aria-label="Zurück">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="m15 18-6-6 6-6" />
					</svg>
				</button>
				<h1 class="page-title">Details</h1>
			</div>

			{#if selectedBird}
				<div class="selected-bird">
					{#if selectedBird.image}
						<img src={selectedBird.image} alt={selectedBird.name} />
					{:else}
						<div class="selected-bird-placeholder">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
						</div>
					{/if}
					<div>
						<span class="bird-latin">{selectedBird.latinName}</span>
						<span class="bird-name-lg">{selectedBird.name}</span>
					</div>
					{#if observedSet.has(selectedBird.speciesCode)}
						<span class="lifer-tag lifer-tag-lg">
							<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
								<path d="M20 6 9 17l-5-5" />
							</svg>
							Bereits gesehen
						</span>
					{/if}
				</div>
			{/if}

			<div class="map-label">
				<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
					<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
				</svg>
				Ort der Sichtung
				<span class="optional">(auf Karte verschieben oder tippen)</span>
			</div>
			<div class="map-wrap" bind:this={mapElement}></div>

			<form method="POST" action="?/save" use:enhance={handleSubmit}>
				<input type="hidden" name="birdId" value={captureState.selectedBirdId} />
				<input type="hidden" name="lat" value={captureState.location?.lat} />
				<input type="hidden" name="lng" value={captureState.location?.lng} />

				<div class="datetime-row">
					<div class="field">
						<label for="date">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
								<rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
							</svg>
							Datum
						</label>
						<input type="date" id="date" name="date" bind:value={captureState.date} />
					</div>
					<div class="field">
						<label for="time">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
								<circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
							</svg>
							Zeit
						</label>
						<input type="time" id="time" name="time" bind:value={captureState.time} />
					</div>
				</div>

				<div class="field full-width">
					<label for="notes">Notizen <span class="optional">(optional)</span></label>
					<textarea id="notes" name="notes" placeholder="Besonderheiten, Verhalten…"></textarea>
				</div>

				{#if errorMessage}
					<div class="error-message">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
							<circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
						</svg>
						{errorMessage}
					</div>
				{/if}

				<button type="submit" class="submit-btn">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
						<path d="M8 5v14l11-7z" />
					</svg>
					Beobachtung speichern
				</button>
			</form>
		</div>

	{:else if step === 3}
		<div class="step success-step">
			{#if isNewLifer}
				<div class="confetti-area">
					{#each Array(12) as _, i}
						<div class="confetti-dot" style="--i: {i}"></div>
					{/each}
					<div class="lifer-badge">Neuer Lifer! 🎉</div>
				</div>
			{:else}
				<div class="repeat-badge">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M20 6 9 17l-5-5" />
					</svg>
					Sichtung gespeichert
				</div>
			{/if}

			{#if savedBird}
				<div class="success-card">
					{#if savedBird.image}
						<img src={savedBird.image} alt={savedBird.name} />
					{:else}
						<div class="success-card-placeholder">
							<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
						</div>
					{/if}
					<div class="success-info">
						<span class="bird-latin">{savedBird.latinName}</span>
						<span class="bird-name-lg">{savedBird.name}</span>
					</div>
				</div>
			{/if}

			<div class="success-actions">
				<a href="/lifelist" class="submit-btn">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
						<path d="M8 5v14l11-7z" />
					</svg>
					Zur Lifelist
				</a>
				<button
					class="secondary-btn"
					onclick={() => {
						searchTerm = '';
						step = 1;
					}}
				>
					Weitere Sichtung erfassen
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.capture {
		min-height: 100%;
	}

	.step {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.page-title {
		font-size: 1.5rem;
		font-weight: 800;
		letter-spacing: -0.03em;
		color: var(--text-primary);
	}

	.step-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.back-btn {
		background: var(--card-bg);
		border: 1px solid var(--border);
		border-radius: 50%;
		width: 38px;
		height: 38px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-primary);
		flex-shrink: 0;
		box-shadow: var(--shadow-sm);
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
		min-width: 0;
	}

	.search-input::placeholder {
		color: var(--text-secondary);
	}

	.clear-btn {
		background: none;
		border: none;
		color: var(--text-secondary);
		display: flex;
		align-items: center;
		padding: 0;
		cursor: pointer;
		flex-shrink: 0;
	}

	.clear-btn:hover {
		color: var(--text-primary);
	}

	/* Search empty state */
	.search-hint {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 3rem 1rem;
		text-align: center;
		color: var(--text-secondary);
	}

	.search-hint p {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.hint-sub {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		opacity: 0.7;
	}

	.no-results {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.result-count {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding-left: 0.25rem;
	}

	/* Bird list */
	.bird-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.bird-row {
		display: flex;
		align-items: center;
		gap: 0.875rem;
		padding: 0.625rem 0.75rem 0.625rem 0.625rem;
		background: var(--card-bg);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-lg);
		text-align: left;
		width: 100%;
		transition: border-color 0.15s, box-shadow 0.15s;
		box-shadow: var(--shadow-sm);
	}

	.bird-row:hover {
		border-color: var(--primary);
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
	}

	.bird-thumb {
		width: 56px;
		height: 56px;
		border-radius: var(--radius);
		object-fit: cover;
		flex-shrink: 0;
	}

	.bird-thumb-placeholder {
		background: var(--bg);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--border);
	}

	.bird-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		min-width: 0;
	}

	.bird-latin {
		font-size: 0.72rem;
		color: var(--text-secondary);
		font-style: italic;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.bird-name {
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.chevron {
		color: var(--text-secondary);
		flex-shrink: 0;
	}

	/* Lifer / "gesehen" tag */
	.lifer-tag {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		background: #dcfce7;
		color: #16a34a;
		font-size: 0.6875rem;
		font-weight: 700;
		padding: 0.2rem 0.5rem;
		border-radius: 999px;
		flex-shrink: 0;
		white-space: nowrap;
	}

	.lifer-tag-lg {
		font-size: 0.75rem;
		padding: 0.25rem 0.625rem;
		margin-left: auto;
	}

	/* Step 2 - Details */
	.selected-bird {
		display: flex;
		align-items: center;
		gap: 0.875rem;
		padding: 0.75rem;
		background: var(--primary-light);
		border-radius: var(--radius-lg);
		border: 1.5px solid rgba(37, 99, 235, 0.15);
	}

	.selected-bird img {
		width: 48px;
		height: 48px;
		border-radius: var(--radius-sm);
		object-fit: cover;
		flex-shrink: 0;
	}

	.selected-bird-placeholder {
		width: 48px;
		height: 48px;
		border-radius: var(--radius-sm);
		background: var(--bg);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--border);
		flex-shrink: 0;
	}

	.selected-bird > div:not(.selected-bird-placeholder) {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		flex: 1;
		min-width: 0;
	}

	.bird-name-lg {
		font-size: 1.05rem;
		font-weight: 800;
		color: var(--text-primary);
	}

	.map-label {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		display: flex;
		align-items: center;
		gap: 0.375rem;
		margin-bottom: -0.5rem;
	}

	.map-label .optional {
		text-transform: none;
		letter-spacing: 0;
		font-weight: 500;
		opacity: 0.7;
	}

	.map-wrap {
		height: 200px;
		width: 100%;
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 1.5px solid var(--border);
		box-shadow: var(--shadow-sm);
	}

	/* Form fields */
	.datetime-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.full-width {
		grid-column: 1 / -1;
	}

	.field label {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}

	.optional {
		font-weight: 500;
		text-transform: none;
		letter-spacing: 0;
		opacity: 0.7;
	}

	.field input,
	.field textarea {
		background: var(--card-bg);
		border: 1.5px solid var(--border);
		border-radius: var(--radius);
		padding: 0.75rem 0.875rem;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary);
		outline: none;
		transition: border-color 0.15s, box-shadow 0.15s;
		font-family: var(--font);
	}

	.field input:focus,
	.field textarea:focus {
		border-color: var(--primary);
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}

	.field textarea {
		height: 80px;
		resize: none;
		font-weight: 500;
	}

	/* Error */
	.error-message {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #fef2f2;
		color: #dc2626;
		border: 1px solid #fecaca;
		border-radius: var(--radius);
		padding: 0.75rem 1rem;
		font-size: 0.875rem;
		font-weight: 600;
	}

	/* Buttons */
	.submit-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 1rem;
		background: var(--primary);
		color: white;
		border: none;
		border-radius: 999px;
		font-size: 1rem;
		font-weight: 700;
		font-family: var(--font);
		box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4);
		transition: transform 0.15s, box-shadow 0.15s;
		text-align: center;
		text-decoration: none;
		cursor: pointer;
	}

	.submit-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
	}

	.secondary-btn {
		width: 100%;
		padding: 0.875rem;
		background: var(--card-bg);
		border: 1.5px solid var(--border);
		border-radius: 999px;
		font-size: 0.9375rem;
		font-weight: 700;
		font-family: var(--font);
		color: var(--text-secondary);
		transition: border-color 0.15s, color 0.15s;
		cursor: pointer;
	}

	.secondary-btn:hover {
		border-color: var(--text-primary);
		color: var(--text-primary);
	}

	/* Step 3 - Success */
	.success-step {
		align-items: center;
		text-align: center;
		padding-top: 1rem;
	}

	.confetti-area {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80px;
		width: 100%;
		margin-bottom: 0.5rem;
	}

	.lifer-badge {
		background: linear-gradient(135deg, #fbbf24, #f59e0b);
		color: white;
		font-size: 1.25rem;
		font-weight: 900;
		padding: 0.5rem 1.5rem;
		border-radius: 999px;
		box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
		letter-spacing: -0.02em;
		position: relative;
		z-index: 1;
	}

	.repeat-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: #dcfce7;
		color: #16a34a;
		font-size: 1rem;
		font-weight: 800;
		padding: 0.625rem 1.5rem;
		border-radius: 999px;
		margin-bottom: 1rem;
	}

	.confetti-dot {
		position: absolute;
		width: 8px;
		height: 8px;
		border-radius: 2px;
		animation: confetti-fall 1.2s ease-out forwards;
		animation-delay: calc(var(--i) * 0.06s);
		opacity: 0;
		background: hsl(calc(var(--i) * 30deg), 80%, 55%);
		left: calc(50% + sin(calc(var(--i) * 1rad)) * 120px);
		top: 50%;
	}

	@keyframes confetti-fall {
		0% { transform: translateY(0) rotate(0deg); opacity: 1; }
		100% { transform: translateY(-60px) rotate(180deg) translateX(calc(var(--i) * 8px - 40px)); opacity: 0; }
	}

	.success-card {
		width: 100%;
		border-radius: var(--radius-xl);
		overflow: hidden;
		box-shadow: var(--shadow-lg);
		position: relative;
	}

	.success-card img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		display: block;
	}

	.success-card-placeholder {
		width: 100%;
		aspect-ratio: 4 / 3;
		background: var(--bg);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--border);
	}

	.success-info {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 1.25rem;
		background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%);
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		text-align: left;
	}

	.success-info .bird-latin {
		color: rgba(255,255,255,0.7);
	}

	.success-info .bird-name-lg {
		color: white;
		font-size: 1.5rem;
	}

	.success-actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
		margin-top: 0.5rem;
	}
</style>
