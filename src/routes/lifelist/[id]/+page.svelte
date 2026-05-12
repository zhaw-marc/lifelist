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
	let lightboxOpen = $state(false);

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
	<!-- Hero image -->
	<div class="hero" style="margin: -1rem -1rem 0">
		{#if entry.species?.image}
			<button class="hero-img-btn" onclick={() => (lightboxOpen = true)} aria-label="Bild vergrössern">
				<img src={entry.species.image} alt={entry.species.name} class="hero-img" />
			</button>
		{:else}
			<div class="hero-placeholder"></div>
		{/if}
		<div class="hero-gradient">
			<a href="/lifelist" class="back-btn" aria-label="Zurück">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="m15 18-6-6 6-6" />
				</svg>
			</a>
			<div class="hero-names">
				{#if data.wiki?.description}
					<span class="hero-description">{data.wiki.description}</span>
				{/if}
				<h1 class="hero-name">{entry.species?.name ?? entry.birdId}</h1>
				<span class="hero-latin">{entry.species?.latinName ?? ''}</span>
			</div>
		</div>
	</div>

	<!-- Sighting summary chips -->
	<div class="chips-row">
		<div class="chip">
			<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
				<rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
			</svg>
			<span class="chip-label">Gesehen am</span>
			<span class="chip-value">{formatDateLong(entry.date)}</span>
		</div>
		<div class="chip">
			<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
				<circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
			</svg>
			<span class="chip-label">Uhrzeit</span>
			<span class="chip-value">{entry.time} Uhr</span>
		</div>
		{#if entry.species?.familyComName}
			<div class="chip chip-wide">
				<span class="chip-label">Familie</span>
				<span class="chip-value">{entry.species.familyComName}</span>
				{#if entry.species.familySciName}
					<span class="chip-sci">{entry.species.familySciName}</span>
				{/if}
			</div>
		{/if}
		{#if entry.species?.order}
			<div class="chip chip-wide">
				<span class="chip-label">Ordnung</span>
				<span class="chip-value">{entry.species.order}</span>
			</div>
		{/if}
	</div>

	<!-- Wikipedia extract -->
	{#if data.wiki?.extract}
		<div class="section">
			<h2 class="section-title">Über diese Art</h2>
			<p class="extract">{data.wiki.extract}</p>
		</div>
	{/if}

	<!-- Edit form -->
	<div class="section-divider">
		<span>Beobachtung bearbeiten</span>
	</div>

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

{#if lightboxOpen && entry.species?.image}
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
			src={entry.species.image}
			alt={entry.species.name}
			class="lightbox-img"
			onclick={(e) => e.stopPropagation()}
		/>
	</div>
{/if}

<style>
	.detail {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* Hero — same style as uebersicht */
	.hero {
		position: relative;
		width: calc(100% + 2rem);
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

	/* Chips row */
	.chips-row {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.chip {
		flex: 1;
		min-width: 100px;
		background: var(--card-bg);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 0.75rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		box-shadow: var(--shadow-sm);
	}

	.chip svg {
		color: var(--primary);
		margin-bottom: 0.15rem;
	}

	.chip-wide {
		min-width: 140px;
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

	/* Section */
	.section {
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

	/* Divider */
	.section-divider {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--text-secondary);
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.section-divider::before,
	.section-divider::after {
		content: '';
		flex: 1;
		height: 1.5px;
		background: var(--border);
	}

	/* Edit form */
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
