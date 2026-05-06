<header class="header">
	<div class="logo">
		<div class="logo-mark">
			<svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M1 17 C4 11 9 9 14 11 C16 6 20 3 25 3 C20 7 18 12 17 16 C14 13 11 12 8 13 C8 15 7 17 4 18 C5 16 5 14 4 14 C3 15 2 16 1 17Z" fill="#2563eb"/>
				<path d="M14 11 C15 13 16 14 17 16" stroke="#1d4ed8" stroke-width="1" fill="none" stroke-linecap="round"/>
			</svg>
		</div>
		<span class="logo-text"><strong>Life</strong>List</span>
	</div>
	<button class="help-btn" aria-label="Hilfe">
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="12" cy="12" r="10" />
			<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
			<circle cx="12" cy="17" r="0.5" fill="currentColor" />
		</svg>
	</button>
</header>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.875rem 1.25rem;
		background: var(--card-bg);
		border-bottom: 1px solid var(--border);
		flex-shrink: 0;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.625rem;
	}

	.logo-mark {
		width: 42px;
		height: 42px;
		background: var(--primary-light);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.logo-text {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-primary);
		letter-spacing: -0.01em;
	}

	.logo-text strong {
		font-weight: 900;
		color: var(--primary);
	}

	.help-btn {
		background: none;
		border: none;
		color: var(--text-secondary);
		padding: 0.375rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: background 0.15s;
	}

	.help-btn:hover {
		background: var(--border);
	}
</style>
