<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();

	let mode = $state<'login' | 'register'>('login');
	$effect(() => {
		if (form?.mode === 'register') mode = 'register';
	});
</script>

<div class="auth-page">
	<div class="auth-card">
		<div class="brand">
			<div class="logo-mark">
				<svg width="28" height="24" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M1 17 C4 11 9 9 14 11 C16 6 20 3 25 3 C20 7 18 12 17 16 C14 13 11 12 8 13 C8 15 7 17 4 18 C5 16 5 14 4 14 C3 15 2 16 1 17Z" fill="#2563eb"/>
					<path d="M14 11 C15 13 16 14 17 16" stroke="#1d4ed8" stroke-width="1" fill="none" stroke-linecap="round"/>
				</svg>
			</div>
			<h1 class="brand-name"><strong>Life</strong>List</h1>
		</div>

		<div class="mode-toggle">
			<button
				class="toggle-btn"
				class:active={mode === 'login'}
				onclick={() => (mode = 'login')}
				type="button"
			>
				Anmelden
			</button>
			<button
				class="toggle-btn"
				class:active={mode === 'register'}
				onclick={() => (mode = 'register')}
				type="button"
			>
				Registrieren
			</button>
		</div>

		{#if form?.error}
			<div class="error-banner">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
					<circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
				</svg>
				{form.error}
			</div>
		{/if}

		{#if mode === 'login'}
			<form method="POST" action="?/login" use:enhance class="auth-form">
				<div class="field">
					<label for="login-username">Benutzername</label>
					<input
						id="login-username"
						name="username"
						type="text"
						autocomplete="username"
						placeholder="dein_name"
						required
					/>
				</div>
				<div class="field">
					<label for="login-password">Passwort</label>
					<input
						id="login-password"
						name="password"
						type="password"
						autocomplete="current-password"
						placeholder="••••••••"
						required
					/>
				</div>
				<button type="submit" class="submit-btn">Anmelden</button>
			</form>
		{:else}
			<form method="POST" action="?/register" use:enhance class="auth-form">
				<div class="field">
					<label for="reg-username">Benutzername</label>
					<input
						id="reg-username"
						name="username"
						type="text"
						autocomplete="username"
						placeholder="dein_name"
						required
					/>
				</div>
				<div class="field">
					<label for="reg-password">Passwort</label>
					<input
						id="reg-password"
						name="password"
						type="password"
						autocomplete="new-password"
						placeholder="min. 8 Zeichen"
						required
					/>
				</div>
				<div class="field">
					<label for="reg-confirm">Passwort bestätigen</label>
					<input
						id="reg-confirm"
						name="confirm"
						type="password"
						autocomplete="new-password"
						placeholder="••••••••"
						required
					/>
				</div>
				<button type="submit" class="submit-btn">Konto erstellen</button>
			</form>
		{/if}
	</div>
</div>

<style>
	.auth-page {
		min-height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		background:
			radial-gradient(ellipse at 20% 50%, rgba(34, 85, 54, 0.6) 0%, transparent 60%),
			radial-gradient(ellipse at 80% 20%, rgba(20, 60, 40, 0.4) 0%, transparent 50%),
			linear-gradient(145deg, #1a3428 0%, #243d2e 50%, #182a20 100%);
	}

	.auth-card {
		background: var(--card-bg);
		border-radius: var(--radius-xl);
		padding: 2rem 1.75rem;
		width: 100%;
		max-width: 380px;
		box-shadow: 0 60px 120px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08);
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		justify-content: center;
		margin-bottom: 0.25rem;
	}

	.logo-mark {
		width: 48px;
		height: 48px;
		background: var(--primary-light);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.brand-name {
		font-size: 1.5rem;
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	.brand-name strong {
		font-weight: 900;
		color: var(--primary);
	}

	/* Toggle */
	.mode-toggle {
		display: flex;
		background: var(--bg);
		border-radius: 999px;
		padding: 0.25rem;
		gap: 0.25rem;
	}

	.toggle-btn {
		flex: 1;
		padding: 0.5rem;
		border: none;
		border-radius: 999px;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-secondary);
		background: transparent;
		transition: background 0.15s, color 0.15s;
	}

	.toggle-btn.active {
		background: var(--card-bg);
		color: var(--text-primary);
		box-shadow: var(--shadow-sm);
	}

	/* Error */
	.error-banner {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #fef2f2;
		color: #dc2626;
		border: 1px solid #fecaca;
		border-radius: var(--radius-sm);
		padding: 0.75rem 1rem;
		font-size: 0.875rem;
		font-weight: 600;
	}

	/* Form */
	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.field label {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.field input {
		background: var(--bg);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 0.75rem 0.875rem;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary);
		outline: none;
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.field input:focus {
		border-color: var(--primary);
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}

	.submit-btn {
		margin-top: 0.25rem;
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
	}

	.submit-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
	}

	.submit-btn:active {
		transform: translateY(0);
	}
</style>
