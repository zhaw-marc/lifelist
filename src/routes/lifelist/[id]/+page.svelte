<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount, untrack } from 'svelte';
	import { browser } from '$app/environment';
	import { tick } from 'svelte';

	let { data, form } = $props();
	const entry = $derived(data.entry);

	let date = $state(untrack(() => data.entry.date));
	let time = $state(untrack(() => data.entry.time));
	let notes = $state(untrack(() => data.entry.notes));
	let location = $state(untrack(() => data.entry.location ? { ...data.entry.location } : null));

	let mapElement = $state<HTMLElement | undefined>(undefined);
	let map = $state<any>(null);
	let marker = $state<any>(null);

	let saved = $state(false);
	let confirmDelete = $state(false);

	onMount(async () => {
		if (!browser || !location) return;
		const L = await import('leaflet');
		await import('leaflet/dist/leaflet.css');
		await tick();
		if (!mapElement) return;

		map = L.map(mapElement).setView([location.lat, location.lng], 13);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap'
		}).addTo(map);
		marker = L.marker([location.lat, location.lng], { draggable: true }).addTo(map);
		marker.on('dragend', () => {
			const pos = marker.getLatLng();
			location = { lat: pos.lat, lng: pos.lng };
		});
		map.on('click', (e: any) => {
			marker.setLatLng(e.latlng);
			location = { lat: e.latlng.lat, lng: e.latlng.lng };
		});
	});

	function handleSave() {
		return async ({ result, update }: { result: any; update: () => void }) => {
			await update();
			if (result.type === 'success') {
				saved = true;
				setTimeout(() => (saved = false), 2500);
			}
		};
	}

	function formatDateLong(dateStr: string) {
		const [y, m, d] = dateStr.split('-');
		const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
		return `${parseInt(d)}. ${months[parseInt(m) - 1]} ${y}`;
	}
</script>

<div class="detail">
	<!-- Back header -->
	<div class="top-bar">
		<a href="/lifelist" class="back-btn" aria-label="Zurück">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="m15 18-6-6 6-6" />
			</svg>
		</a>
		<h1 class="page-title">{entry.species?.name ?? entry.birdId}</h1>
	</div>

	<!-- Hero image -->
	{#if entry.species?.image}
		<div class="hero">
			<img src={entry.species.image} alt={entry.species.name} class="hero-img" />
			<div class="hero-gradient">
				<span class="hero-latin">{entry.species?.latinName}</span>
				<span class="hero-date">{formatDateLong(entry.date)} · {entry.time} Uhr</span>
			</div>
		</div>
	{:else}
		<div class="hero hero-placeholder">
			<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
				<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
			</svg>
		</div>
	{/if}

	<!-- Edit form -->
	<form method="POST" action="?/update" use:enhance={handleSave} class="edit-form">
		{#if location}
			<input type="hidden" name="lat" value={location.lat} />
			<input type="hidden" name="lng" value={location.lng} />
		{/if}

		<div class="datetime-row">
			<div class="field">
				<label for="date">
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
						<rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
					</svg>
					Datum
				</label>
				<input type="date" id="date" name="date" bind:value={date} />
			</div>
			<div class="field">
				<label for="time">
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
						<circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
					</svg>
					Zeit
				</label>
				<input type="time" id="time" name="time" bind:value={time} />
			</div>
		</div>

		<div class="field full-width">
			<label for="notes">Notizen <span class="optional">(optional)</span></label>
			<textarea id="notes" name="notes" placeholder="Besonderheiten, Verhalten…" bind:value={notes}></textarea>
		</div>

		{#if location}
			<div class="map-label">
				<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
					<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
				</svg>
				Ort <span class="optional">(verschieben oder tippen)</span>
			</div>
			<div class="map-wrap" bind:this={mapElement}></div>
		{/if}

		{#if form?.error}
			<div class="error-msg">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
					<circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
				</svg>
				{form.error}
			</div>
		{/if}

		<button type="submit" class="save-btn" class:saved>
			{#if saved}
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
					<path d="M20 6 9 17l-5-5" />
				</svg>
				Gespeichert
			{:else}
				Änderungen speichern
			{/if}
		</button>
	</form>

	<!-- Delete -->
	<div class="delete-section">
		{#if confirmDelete}
			<p class="confirm-text">Beobachtung wirklich löschen?</p>
			<div class="confirm-row">
				<form method="POST" action="?/delete" use:enhance>
					<button type="submit" class="confirm-delete-btn">Ja, löschen</button>
				</form>
				<button class="cancel-btn" onclick={() => (confirmDelete = false)}>Abbrechen</button>
			</div>
		{:else}
			<button class="delete-btn" onclick={() => (confirmDelete = true)}>
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
					<polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
				</svg>
				Beobachtung löschen
			</button>
		{/if}
	</div>
</div>

<style>
	.detail {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* Top bar */
	.top-bar {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.back-btn {
		background: var(--card-bg);
		border: 1.5px solid var(--border);
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

	.page-title {
		font-size: 1.25rem;
		font-weight: 800;
		letter-spacing: -0.03em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Hero */
	.hero {
		width: 100%;
		aspect-ratio: 4 / 3;
		border-radius: var(--radius-xl);
		overflow: hidden;
		position: relative;
		box-shadow: var(--shadow-lg);
		flex-shrink: 0;
	}

	.hero-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.hero-placeholder {
		background: var(--card-bg);
		border: 1.5px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--border);
	}

	.hero-gradient {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.05) 50%, transparent 100%);
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 1.25rem;
		gap: 0.2rem;
	}

	.hero-latin {
		font-size: 0.75rem;
		color: rgba(255,255,255,0.7);
		font-style: italic;
		font-weight: 500;
	}

	.hero-date {
		font-size: 0.875rem;
		color: rgba(255,255,255,0.85);
		font-weight: 600;
	}

	/* Form */
	.edit-form {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
	}

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

	/* Map */
	.map-label {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		display: flex;
		align-items: center;
		gap: 0.375rem;
		margin-bottom: -0.375rem;
	}

	.map-label .optional {
		text-transform: none;
		letter-spacing: 0;
	}

	.map-wrap {
		height: 180px;
		width: 100%;
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 1.5px solid var(--border);
		box-shadow: var(--shadow-sm);
	}

	/* Error */
	.error-msg {
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

	/* Save button */
	.save-btn {
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
		transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
	}

	.save-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
	}

	.save-btn.saved {
		background: var(--accent-green);
		box-shadow: 0 4px 16px rgba(22, 163, 74, 0.35);
	}

	/* Delete section */
	.delete-section {
		padding-top: 0.5rem;
		border-top: 1.5px solid var(--border);
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.delete-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: none;
		border: none;
		color: var(--text-secondary);
		font-size: 0.875rem;
		font-weight: 600;
		padding: 0.5rem 0;
		transition: color 0.15s;
	}

	.delete-btn:hover {
		color: var(--accent-red);
	}

	.confirm-text {
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.confirm-row {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.confirm-delete-btn {
		background: var(--accent-red);
		color: white;
		border: none;
		border-radius: 999px;
		padding: 0.625rem 1.25rem;
		font-size: 0.875rem;
		font-weight: 700;
		font-family: var(--font);
		transition: opacity 0.15s;
	}

	.confirm-delete-btn:hover {
		opacity: 0.9;
	}

	.cancel-btn {
		background: none;
		border: 1.5px solid var(--border);
		border-radius: 999px;
		padding: 0.625rem 1.25rem;
		font-size: 0.875rem;
		font-weight: 700;
		font-family: var(--font);
		color: var(--text-secondary);
		transition: border-color 0.15s, color 0.15s;
	}

	.cancel-btn:hover {
		border-color: var(--text-secondary);
		color: var(--text-primary);
	}
</style>
