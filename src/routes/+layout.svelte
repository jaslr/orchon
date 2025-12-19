<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>CI Monitor</title>
</svelte:head>

{@render children()}
