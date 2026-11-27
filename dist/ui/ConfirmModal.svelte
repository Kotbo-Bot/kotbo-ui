<script lang="ts">
  import Papicon from '../icons/Papicon.svelte';
  import Button from './Button.svelte';
  import { getMessages } from '../config.svelte.js';
  import { portal } from '../actions/portal.js';
  import { dialogFocus } from '../actions/dialogFocus.js';
  import { scrollLock } from '../actions/scrollLock.js';

  interface Props {
    open?: boolean;
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'default';
    requireInput?: string;
    impacts?: string[];
    loading?: boolean;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
  }

  let {
    open = $bindable(false),
    title,
    description = '',
    confirmLabel,
    cancelLabel,
    variant = 'default',
    requireInput = '',
    impacts = [],
    loading = false,
    onConfirm,
    onCancel,
  }: Props = $props();

  const msgs = $derived(getMessages());
  let inputValue = $state('');
  let executing = $state(false);

  const VARIANTS = {
    danger: { icon: 'AlertTriangle', button: 'danger' },
    warning: { icon: 'AlertTriangle', button: 'primary' },
    default: { icon: 'Info', button: 'primary' },
  } as const;

  const config = $derived(VARIANTS[variant]);
  const canConfirm = $derived(requireInput ? inputValue === requireInput : true);

  function handleCancel() {
    inputValue = '';
    open = false;
    onCancel?.();
  }

  async function handleConfirm() {
    if (!canConfirm || executing) return;
    executing = true;
    try {
      await onConfirm?.();
      open = false;
      inputValue = '';
    } finally {
      executing = false;
    }
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    void handleConfirm();
  }

  const focusTarget = $derived(requireInput ? 'input' : variant === 'danger' ? 'cancel' : 'confirm');
  const titleId = $props.id();
  const descriptionId = `${titleId}-description`;
</script>

{#if open}
  <div use:portal use:scrollLock class="confirm-modal" role="presentation">
    <div class="confirm-modal__backdrop" onclick={handleCancel} aria-hidden="true"></div>

    <div
      use:dialogFocus={{ onEscape: handleCancel }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      tabindex="-1"
      class="confirm-modal__panel"
    >
      <form onsubmit={handleSubmit} class="confirm-modal__form">
        <div class="confirm-modal__head">
          <span class="confirm-modal__icon confirm-modal__icon--{variant}" aria-hidden="true">
            <Papicon icon={config.icon} size={17} />
          </span>
          <div class="confirm-modal__head-text">
            <h3 id={titleId} class="confirm-modal__title">{title ?? msgs.confirm_required()}</h3>
            {#if description}
              <p id={descriptionId} class="confirm-modal__desc">{description}</p>
            {/if}
          </div>
        </div>

        {#if impacts.length > 0}
          <div class="confirm-modal__impacts">
            <p class="confirm-modal__impacts-title">{msgs.confirm_impacts_title()}</p>
            <ul class="confirm-modal__impacts-list">
              {#each impacts as impact, i (i)}
                <li class="confirm-modal__impact">
                  <span class="confirm-modal__impact-arrow" aria-hidden="true">
                    <Papicon icon="ArrowRight" size={13} />
                  </span>
                  <span>{impact}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        {#if requireInput}
          <label class="field confirm-modal__require">
            <span class="confirm-modal__require-label">
              {msgs.confirm_type_pre()} <span class="confirm-modal__require-token">{requireInput}</span> {msgs.confirm_type_post()}
            </span>
            <input
              type="text"
              bind:value={inputValue}
              placeholder={requireInput}
              autocomplete="off"
              spellcheck="false"
              class="input confirm-modal__require-input"
              data-autofocus={focusTarget === 'input' || undefined}
            />
          </label>
        {/if}

        <div class="confirm-modal__actions">
          <Button variant="ghost" onclick={handleCancel} data-autofocus={focusTarget === 'cancel' || undefined}>
            {cancelLabel ?? msgs.common_cancel()}
          </Button>
          <Button
            type="submit"
            variant={config.button}
            data-autofocus={focusTarget === 'confirm' || undefined}
            disabled={!canConfirm}
            loading={executing || loading}
          >
            {confirmLabel ?? msgs.common_confirm()}
          </Button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .confirm-modal {
    position: fixed;
    inset: 0;
    z-index: var(--layer-confirm, 20000);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .confirm-modal__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
  }

  .confirm-modal__panel {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 28rem;
    padding: 1.25rem;
    border-radius: 0.75rem;
    border: 1px solid var(--color-outline-variant, var(--outline-variant));
    background: var(--color-surface-container-lowest, var(--surface-container-lowest));
    box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.25);
  }

  .confirm-modal__panel:focus {
    outline: none;
  }

  .confirm-modal__form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .confirm-modal__head {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .confirm-modal__icon {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .confirm-modal__icon--danger {
    background: color-mix(in srgb, var(--color-error, var(--error-color)) 12%, transparent);
    color: var(--color-on-error-container, var(--on-error-container-color));
  }

  .confirm-modal__icon--warning {
    background: color-mix(in srgb, var(--color-warning, var(--warning-color)) 12%, transparent);
    color: var(--color-on-warning-container, var(--on-warning-container-color));
  }

  .confirm-modal__icon--default {
    background: color-mix(in srgb, var(--color-primary, var(--primary-color)) 12%, transparent);
    color: var(--color-primary, var(--primary-color));
  }

  .confirm-modal__head-text {
    min-width: 0;
    padding-top: 0.25rem;
  }

  .confirm-modal__title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.35;
    color: var(--color-on-surface, var(--on-surface));
  }

  .confirm-modal__desc {
    margin: 0.375rem 0 0;
    font-size: 0.875rem;
    line-height: 1.55;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .confirm-modal__impacts {
    border-radius: 0.5rem;
    border: 1px solid var(--color-outline-variant, var(--outline-variant));
    background: var(--color-surface-container-low, var(--surface-container-low));
    padding: 0.75rem 0.875rem;
  }

  .confirm-modal__impacts-title {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-on-surface, var(--on-surface));
  }

  .confirm-modal__impacts-list {
    margin: 0.375rem 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .confirm-modal__impact {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .confirm-modal__impact-arrow {
    margin-top: 0.2rem;
    flex-shrink: 0;
    display: inline-flex;
  }

  .confirm-modal__require {
    gap: 0.375rem;
  }

  .confirm-modal__require-label {
    font-size: 0.875rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .confirm-modal__require-token {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-weight: 600;
    color: var(--color-on-surface, var(--on-surface));
  }

  .confirm-modal__require-input {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  .confirm-modal__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
  }
</style>
