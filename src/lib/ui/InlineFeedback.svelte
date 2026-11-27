<script lang="ts">
  interface Props {
    message?: string;
    error?: string;
    idleText?: string;
    state?: {
      state: {
        message: string;
        error: string;
      };
    };
  }

  const {
    message = '',
    error = '',
    idleText = '',
    state = undefined,
  }: Props = $props();

  const displayMessage = $derived(state ? state.state.message : message);
  const displayError = $derived(state ? state.state.error : error);
  const hasError = $derived(!!displayError);
  const hasMessage = $derived(!!displayMessage);
</script>

{#if hasError || hasMessage || idleText}
  <div class="kotbo-inline-feedback {hasError ? 'kotbo-inline-feedback--error' : hasMessage ? 'kotbo-inline-feedback--success' : ''}">
    {#if hasError}
      <span>{displayError}</span>
    {:else if hasMessage}
      <span>{displayMessage}</span>
    {:else}
      <span>{idleText}</span>
    {/if}
  </div>
{/if}

<style>
  .kotbo-inline-feedback {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .kotbo-inline-feedback--error {
    color: var(--color-error, var(--error-color));
  }

  .kotbo-inline-feedback--success {
    color: var(--color-success, var(--success-color));
  }
</style>
