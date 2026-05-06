<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { birds } from '$lib/data/birds';
	import { captureState, resetCapture } from '$lib/state.svelte';
	import { enhance } from '$app/forms';

	let step = $state(1);
	let searchTerm = $state('');
	let mapElement = $state<HTMLElement>();
	let map = $state<any>();
	let marker = $state<any>();

	const filteredBirds = $derived(
		birds.filter(
			(b) =>
				b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				b.latinName.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	const selectedBird = $derived(birds.find((b) => b.id === captureState.selectedBirdId));

	function selectBird(id: string) {
		captureState.selectedBirdId = id;
		step = 2;
	}

	function goBack() {
		if (step > 1) step--;
	}

	onMount(async () => {
		if (browser) {
			const L = await import('leaflet');
			import('leaflet/dist/leaflet.css');

			navigator.geolocation.getCurrentPosition(
				(pos) => {
					const { latitude, longitude } = pos.coords;
					captureState.location = { lat: latitude, lng: longitude };
					initMap(L, latitude, longitude);
				},
				() => {
					const lat = 47.3769;
					const lng = 8.5417;
					captureState.location = { lat, lng };
					initMap(L, lat, lng);
				}
			);
		}
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
				step = 3;
				resetCapture();
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
					placeholder="Vögel durchsuchen..."
					class="search-input"
					/>
			</div>

			<div class="bird-list">
				{#each filteredBirds as bird (bird.id)}
					<button class="bird-row" onclick={() => selectBird(bird.id)}>
						<img src={bird.image} alt={bird.name} class="bird-thumb" />
						<div class="bird-info">
							<span class="bird-latin">{bird.latinName}</span>
							<span class="bird-name">{bird.name}</span>
						</div>
						<svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="m9 18 6-6-6-6" />
						</svg>
					</button>
				{/each}

				{#if filteredBirds.length === 0}
					<div class="empty-search">
						<p>Keine Vögel gefunden für „{searchTerm}"</p>
					</div>
				{/if}
			</div>
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
					<img src={selectedBird.image} alt={selectedBird.name} />
					<div>
						<span class="bird-latin">{selectedBird.latinName}</span>
						<span class="bird-name-lg">{selectedBird.name}</span>
					</div>
				</div>
			{/if}

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
					<textarea id="notes" name="notes" placeholder="Besonderheiten, Verhalten..."></textarea>
				</div>

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
			<div class="confetti-area">
				{#each Array(12) as _, i}
					<div class="confetti-dot" style="--i: {i}"></div>
				{/each}
				<div class="lifer-badge">Neuer Lifer!</div>
			</div>

			{#if selectedBird}
				<div class="success-card">
					<img src={selectedBird.image} alt={selectedBird.name} />
					<div class="success-info">
						<span class="bird-latin">{selectedBird.latinName}</span>
						<span class="bird-name-lg">{selectedBird.name}</span>
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
				<button class="secondary-btn" onclick={() => (step = 1)}>Weitere Sichtung</button>
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
	}

	.bird-name {
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.chevron {
		color: var(--text-secondary);
		flex-shrink: 0;
	}

	.empty-search {
		text-align: center;
		padding: 3rem 1rem;
		color: var(--text-secondary);
		font-weight: 600;
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
	}

	.selected-bird div {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.bird-name-lg {
		font-size: 1.05rem;
		font-weight: 800;
		color: var(--text-primary);
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
		box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4);
		transition: transform 0.15s, box-shadow 0.15s;
		text-align: center;
		text-decoration: none;
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
		color: var(--text-secondary);
		transition: border-color 0.15s, color 0.15s;
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
