<script lang="ts">
  import { unsavedChanges as defaultStore, type UnsavedChangesStore } from '../stores/unsavedChanges.svelte.js';
  import { getMessages } from '../config.svelte.js';

  const {
    store = defaultStore,
    visible = undefined,
    title = undefined,
    subtitle = undefined,
    saving = undefined,
    onSave = undefined,
    onReset = undefined,
  }: {
    store?: UnsavedChangesStore;
    visible?: boolean;
    title?: string;
    subtitle?: string;
    saving?: boolean;
    onSave?: () => void | Promise<unknown>;
    onReset?: () => void;
  } = $props();

  const msgs = $derived(getMessages());
  const isVisible = $derived(visible ?? store.isDirty);
  const isSaving = $derived(saving ?? store.saving);
  const resolvedTitle = $derived(title ?? msgs.unsaved_title());
  const resolvedSubtitle = $derived(subtitle ?? store.pageLabel);

  function handleReset() {
    if (onReset) onReset();
    else store.reset();
  }

  function handleSave() {
    if (onSave) void onSave();
    else void store.save();
  }
</script>

{#if isVisible}
  <div class="unsaved-bar" role="alertdialog" aria-label={resolvedTitle} aria-live="polite">
    <div class="unsaved-bar__inner">
      <div class="unsaved-bar__message">
        <div class="unsaved-bar__icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div>
          <p class="unsaved-bar__title">{resolvedTitle}</p>
          {#if resolvedSubtitle}
            <p class="unsaved-bar__subtitle">{resolvedSubtitle}</p>
          {/if}
        </div>
      </div>

      <div class="unsaved-bar__actions">
        <button
          id="unsaved-reset-btn"
          type="button"
          onclick={handleReset}
          disabled={isSaving}
          class="unsaved-bar__btn unsaved-bar__btn--reset"
        >
          {msgs.unsaved_reset()}
        </button>
        <button
          id="unsaved-save-btn"
          type="button"
          onclick={handleSave}
          disabled={isSaving}
          class="unsaved-bar__btn unsaved-bar__btn--save"
        >
          {#if isSaving}
            <svg class="unsaved-bar__spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="40" stroke-dashoffset="10"/>
            </svg>
            {msgs.unsaved_saving()}
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {msgs.unsaved_save()}
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .unsaved-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 200;
    padding: 0 1rem 1rem;
    pointer-events: none;
    animation: kotbo-unsaved-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  @keyframes kotbo-unsaved-up {
    from { opacity: 0; transform: translateY(100%); }
    to { opacity: 1; transform: translateY(0); }
  }

  .unsaved-bar__inner {
    max-width: 860px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: var(--color-surface-container-highest, var(--surface-container-highest));
    border: 1px solid var(--color-outline-variant, var(--outline-variant));
    border-radius: 0.75rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    pointer-events: all;
  }

  .unsaved-bar__message {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
  }

  .unsaved-bar__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.625rem;
    background: color-mix(in srgb, var(--color-primary, var(--primary-color)) 12%, transparent);
    color: var(--color-primary, var(--primary-color));
    flex-shrink: 0;
  }

  .unsaved-bar__title {
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--color-on-surface, var(--on-surface));
    margin: 0;
    line-height: 1.2;
  }

  .unsaved-bar__subtitle {
    font-size: 0.6875rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
    margin: 0.125rem 0 0;
    line-height: 1.2;
  }

  .unsaved-bar__actions {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    flex-shrink: 0;
  }

  .unsaved-bar__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 1rem;
    border-radius: 0.75rem;
    font-family: inherit;
    font-size: 0.8125rem;
    font-weight: 700;
    cursor: pointer;
    border: none;
    transition: all 0.15s ease;
    letter-spacing: 0.01em;
  }

  .unsaved-bar__btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .unsaved-bar__btn--reset {
    background: color-mix(in srgb, var(--color-on-surface, var(--on-surface)) 8%, transparent);
    color: var(--color-on-surface-variant, var(--on-surface-variant));
    border: 1px solid color-mix(in srgb, var(--color-outline-variant, var(--outline-variant)) 40%, transparent);
  }

  .unsaved-bar__btn--reset:not(:disabled):hover {
    background: color-mix(in srgb, var(--color-on-surface, var(--on-surface)) 14%, transparent);
    color: var(--color-on-surface, var(--on-surface));
    transform: scale(1.02);
  }

  .unsaved-bar__btn--save {
    background: var(--color-primary, var(--primary-color));
    color: var(--color-on-primary, var(--on-primary-color));
  }

  .unsaved-bar__btn--save:not(:disabled):hover {
    opacity: 0.9;
  }

  .unsaved-bar__spinner {
    width: 14px;
    height: 14px;
    animation: kotbo-unsaved-spin 0.8s linear infinite;
  }

  @keyframes kotbo-unsaved-spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 600px) {
    .unsaved-bar {
      padding: 0 0.75rem max(0.5rem, env(safe-area-inset-bottom));
    }
    .unsaved-bar__inner {
      gap: 0.75rem;
      padding: 0.625rem;
      border-radius: 1rem;
    }
    .unsaved-bar__icon,
    .unsaved-bar__subtitle {
      display: none;
    }
    .unsaved-bar__actions {
      justify-content: flex-end;
      gap: 0.375rem;
    }
    .unsaved-bar__btn {
      min-height: 2.5rem;
      padding: 0.5rem 0.75rem;
    }
    .unsaved-bar__btn--save {
      flex: 1 1 auto;
    }
  }
</style>
