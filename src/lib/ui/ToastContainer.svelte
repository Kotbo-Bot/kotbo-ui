<script lang="ts">
  import { toast } from '../stores/toast.svelte.js';
  import Toast from './Toast.svelte';
</script>

<div class="kotbo-toast-container" aria-live="polite" aria-relevant="additions">
  {#each toast.toasts as item (item.id)}
    <Toast {item} />
  {/each}
</div>

<style>
  .kotbo-toast-container {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: var(--layer-modal, 9999);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: calc(100% - 3rem);
    max-width: 24rem;
  }
</style>
