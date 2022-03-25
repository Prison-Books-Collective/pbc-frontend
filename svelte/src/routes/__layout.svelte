<script>
	import logo from '$assets/pbc-logo-small.png';
	import logoText from '$assets/pbc-text.svg';
	import search from '$assets/icons/search.png';
	import settings from '$assets/icons/gear.png';
</script>

<nav id="nav-primary">
	<div id="navigation-buttons">
		<a href="/">
			<img src={search} alt="Magnifying Glass Search Icon" class="icon" />
		</a>
		<a href="/admin">
			<img src={settings} alt="Gear Settings Icon" class="icon" />
		</a>
	</div>

	<img id="logo-text" src={logoText} alt="Logo text for Prison Books Collective" />
	<img id="logo" src={logo} alt="Logo for Prison Books Collective" />
</nav>

<div id="nav-spacer" />

<slot />

<style lang="scss">
	* {
		--color-inactive: #eaeaea;
		--color-active: #333;
	}

	#logo {
		opacity: 0.5;
		transition-duration: 0.3s;
		margin-right: 2em;

		&:hover {
			opacity: 1;
		}
	}

	#logo-text {
		opacity: 0.5;
		transition-duration: 0.3s;

		&:hover {
			opacity: 1;
		}
	}

	#navigation-buttons {
		width: 4rem;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		align-items: center;
	}

	nav {
		position: fixed;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		align-items: center;
		background-color: #e8e7e2;
		z-index: 100;

		height: 3rem;
		width: 100vw;

		padding: 1rem;

		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);

		img {
			max-height: 3rem;
		}
	}

	#nav-spacer {
		height: 3rem;
		padding: 1rem;
	}

	.icon {
		max-height: 1.5rem;

		opacity: 0.5;
		transition-duration: 0.3s;

		&:hover {
			opacity: 1;
		}
	}
</style>
