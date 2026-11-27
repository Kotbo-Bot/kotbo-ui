<script lang="ts">
  import '../lib/styles/index.css';
  import { ToastContainer } from '#lib';

  const { children } = $props();
</script>

{@render children()}
<ToastContainer />

<style>
  :global(body) {
    margin: 0;
    background: var(--background);
    color: var(--on-surface);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
  }
</style>
