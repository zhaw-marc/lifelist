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
	let formElement = $state<HTMLFormElement>();

	const filteredBirds = $derived(
		birds.filter((b) => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
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

			// Try to get user location
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					const { latitude, longitude } = pos.coords;
					captureState.location = { lat: latitude, lng: longitude };
					initMap(L, latitude, longitude);
				},
				() => {
					// Default to Zurich if location fails
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
		map = L.map(mapElement).setView([lat, lng], 13);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors'
		}).addTo(map);

		marker = L.marker([lat, lng], { draggable: true }).addTo(map);

		marker.on('dragend', () => {
			const pos = marker.getLatLng();
			captureState.location = { lat: pos.lat, lng: pos.lng };
		});

		map.on('click', (e: any) => {
			const pos = e.latlng;
			marker.setLatLng(pos);
			captureState.location = { lat: pos.lat, lng: pos.lng };
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

<div class="capture-container">
	{#if step === 1}
		<div class="step-content">
			<header class="step-header">
				<h1>Welcher Vogel?</h1>
				<input
					type="text"
					bind:value={searchTerm}
					placeholder="Suchen..."
					class="search-input"
				/>
			</header>

			<div class="bird-list">
				{#each filteredBirds as bird}
					<button class="bird-item" onclick={() => selectBird(bird.id)}>
						<img src={bird.image} alt={bird.name} />
						<div class="bird-info">
							<span class="bird-name">{bird.name}</span>
							<span class="bird-latin">{bird.latinName}</span>
						</div>
					</button>
				{/each}
			</div>
		</div>
	{:else if step === 2}
		<div class="step-content">
			<header class="step-header">
				<button class="back-btn" onclick={goBack} aria-label="Zurück">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
				</button>
				<h1>Details</h1>
			</header>

			<div class="details-form">
				<div class="selected-bird-summary">
					<img src={selectedBird?.image} alt={selectedBird?.name} />
					<span>{selectedBird?.name}</span>
				</div>

				<div class="map-container" bind:this={mapElement}></div>

				<form method="POST" action="?/save" use:enhance={handleSubmit} bind:this={formElement}>
					<input type="hidden" name="birdId" value={captureState.selectedBirdId} />
					<input type="hidden" name="lat" value={captureState.location?.lat} />
					<input type="hidden" name="lng" value={captureState.location?.lng} />

					<div class="input-group">
						<label for="date">Datum</label>
						<input type="date" id="date" name="date" bind:value={captureState.date} />
					</div>

					<div class="input-group">
						<label for="time">Zeit</label>
						<input type="time" id="time" name="time" bind:value={captureState.time} />
					</div>

					<div class="input-group">
						<label for="notes">Notizen (optional)</label>
						<textarea id="notes" name="notes" placeholder="Besonderheiten..."></textarea>
					</div>

					<button type="submit" class="submit-btn">Sichtung speichern</button>
				</form>
			</div>
		</div>
	{:else if step === 3}
		<div class="step-content success-screen">
			<div class="success-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" color="#10b981"><path d="M20 6 9 17l-5-5"/></svg>
			</div>
			<h1>Gespeichert!</h1>
			<p>Deine Sichtung wurde erfolgreich in deiner Life List abgelegt.</p>
			
			<div class="success-actions">
				<a href="/" class="btn-secondary">Zurück zum Home</a>
				<button class="btn-primary" onclick={() => (step = 1)}>Weitere Sichtung</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.capture-container {
		padding: 1rem;
		max-width: 500px;
		margin: 0 auto;
		height: calc(100vh - 120px); /* Adjust for header and nav */
		overflow-y: auto;
	}

	.step-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.step-header h1 {
		font-size: 1.5rem;
		font-weight: 700;
	}

	.search-input {
		flex: 1;
		padding: 0.75rem 1rem;
		border-radius: 999px;
		border: 1px solid var(--border-color);
		font-size: 1rem;
	}

	.bird-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.bird-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		background: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: 1rem;
		cursor: pointer;
		text-align: left;
		width: 100%;
	}

	.bird-item img {
		width: 60px;
		height: 60px;
		border-radius: 0.75rem;
		object-fit: cover;
	}

	.bird-info {
		display: flex;
		flex-direction: column;
	}

	.bird-name {
		font-weight: 600;
		color: var(--text-primary);
	}

	.bird-latin {
		font-size: 0.875rem;
		color: var(--text-secondary);
		font-style: italic;
	}

	.back-btn {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}

	.back-btn:hover {
		background-color: var(--border-color);
	}

	.details-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.selected-bird-summary {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		background: #eff6ff;
		border-radius: 1rem;
		font-weight: 600;
	}

	.selected-bird-summary img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
	}

	.map-container {
		height: 200px;
		width: 100%;
		border-radius: 1rem;
		border: 1px solid var(--border-color);
		z-index: 1;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.input-group label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.input-group input, .input-group textarea {
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		font-size: 1rem;
	}

	.input-group textarea {
		height: 80px;
		resize: none;
	}

	.submit-btn {
		width: 100%;
		padding: 1rem;
		background-color: var(--primary-color);
		color: white;
		border: none;
		border-radius: 999px;
		font-weight: 700;
		font-size: 1rem;
		cursor: pointer;
		margin-top: 1rem;
		box-shadow: 0 4px 10px rgba(59, 130, 246, 0.5);
	}

	.success-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		height: 100%;
		gap: 1rem;
	}

	.success-icon {
		background-color: #ecfdf5;
		padding: 2rem;
		border-radius: 50%;
		margin-bottom: 1rem;
	}

	.success-actions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		margin-top: 2rem;
	}

	.btn-primary, .btn-secondary {
		padding: 1rem;
		border-radius: 999px;
		font-weight: 600;
		text-align: center;
		cursor: pointer;
		border: none;
	}

	.btn-primary {
		background-color: var(--primary-color);
		color: white;
	}

	.btn-secondary {
		background-color: var(--border-color);
		color: var(--text-primary);
	}
</style>
