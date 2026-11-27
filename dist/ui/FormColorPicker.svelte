<script lang="ts">
  import { getMessages } from '../config.svelte.js';
  import Papicon from '../icons/Papicon.svelte';
  import Modal from './Modal.svelte';
  import Button from './Button.svelte';

  let {
    value = $bindable('#5865F2'),
    presets = [
      '#5865F2',
      '#57F287',
      '#FEE75C',
      '#EB459E',
      '#ED4245',
      '#1ABC9C',
      '#3498DB',
      '#9B59B6',
      '#E67E22',
      '#95A5A6',
      '#2C3E50',
      '#FFFFFF',
    ],
    onchange,
  }: {
    value?: string;
    presets?: string[];
    onchange?: (color: string) => void;
  } = $props();

  const msgs = $derived(getMessages());

  let showModal = $state(false);
  let tempValue = $state('#5865F2');

  function openPicker() {
    tempValue = value || '#5865F2';
    showModal = true;
  }

  function saveColor() {
    if (tempValue && !tempValue.startsWith('#')) {
      tempValue = '#' + tempValue;
    }
    value = tempValue;
    onchange?.(value);
    showModal = false;
  }

  function getPreviewColor(color: string) {
    if (!color) return 'transparent';
    const c = color.startsWith('#') ? color : '#' + color;
    return /^#([0-9A-F]{3}){1,2}$/i.test(c) ? c : 'transparent';
  }
</script>

<button type="button" onclick={openPicker} class="kotbo-color-trigger">
  <span class="kotbo-color-trigger__left">
    <span class="kotbo-color-trigger__swatch" style="background-color: {getPreviewColor(value)};"></span>
    <span class="kotbo-color-trigger__val">{value || msgs.color_none()}</span>
  </span>
  <span class="kotbo-color-trigger__chev"><Papicon icon="chevron-down" size={16} /></span>
</button>

<Modal bind:open={showModal} title={msgs.color_title()} size="sm">
  <div class="kotbo-color-body">
    <div class="kotbo-color-preview" style="background-color: {getPreviewColor(tempValue)};">
      <div class="kotbo-color-preview__scrim"></div>
      <span class="kotbo-color-preview__hex">{tempValue}</span>
      <span class="kotbo-color-preview__label">{msgs.color_preview()}</span>
    </div>

    <label class="field">
      <span class="field-label">{msgs.color_hex()}</span>
      <input
        type="text"
        bind:value={tempValue}
        class="input kotbo-color-hex-input"
        placeholder="#FFFFFF"
      />
    </label>

    <div>
      <span class="field-label">{msgs.color_presets()}</span>
      <div class="kotbo-color-palette">
        {#each presets as pc (pc)}
          <button
            type="button"
            onclick={() => (tempValue = pc)}
            class="kotbo-color-swatch {tempValue?.toLowerCase() === pc.toLowerCase() ? 'kotbo-color-swatch--active' : ''}"
            style="background-color: {pc};"
            title={pc}
            aria-label={pc}
          ></button>
        {/each}
      </div>
    </div>
  </div>

  {#snippet footer()}
    <div class="kotbo-color-footer">
      <Button variant="ghost" onclick={() => (showModal = false)}>{msgs.common_cancel()}</Button>
      <Button variant="primary" onclick={saveColor}>{msgs.common_apply()}</Button>
    </div>
  {/snippet}
</Modal>

<style>
  .kotbo-color-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: color-mix(in srgb, var(--color-surface-container-high, var(--surface-container-high)) 45%, transparent);
    border: 1px solid var(--color-field-border, var(--field-border-color));
    border-radius: 0.5rem;
    padding: 0.625rem 0.875rem;
    font-family: inherit;
    font-size: 0.875rem;
    color: var(--color-on-surface, var(--on-surface));
    cursor: pointer;
    transition: background-color 150ms ease;
  }

  .kotbo-color-trigger:hover {
    background: color-mix(in srgb, var(--color-surface-container-high, var(--surface-container-high)) 70%, transparent);
  }

  .kotbo-color-trigger__left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .kotbo-color-trigger__swatch {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 9999px;
    border: 1px solid rgba(128, 128, 128, 0.35);
    flex-shrink: 0;
  }

  .kotbo-color-trigger__val {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-weight: 700;
  }

  .kotbo-color-trigger__chev {
    display: inline-flex;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .kotbo-color-body {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .kotbo-color-preview {
    width: 100%;
    height: 6rem;
    border-radius: 0.625rem;
    border: 1px solid var(--color-outline-variant, var(--outline-variant));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .kotbo-color-preview__scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
  }

  .kotbo-color-preview__hex,
  .kotbo-color-preview__label {
    position: relative;
    z-index: 1;
    color: #ffffff;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
  }

  .kotbo-color-preview__hex {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-weight: 600;
    font-size: 1.125rem;
  }

  .kotbo-color-preview__label {
    font-size: 0.75rem;
    font-weight: 600;
    opacity: 0.85;
  }

  .kotbo-color-hex-input {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    text-transform: uppercase;
  }

  .kotbo-color-palette {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 0.625rem;
  }

  .kotbo-color-swatch {
    width: 2.25rem;
    height: 2.25rem;
    justify-self: center;
    border-radius: 9999px;
    border: 2px solid var(--color-outline-variant, var(--outline-variant));
    cursor: pointer;
    transition: transform 120ms ease, box-shadow 120ms ease;
  }

  .kotbo-color-swatch:active {
    transform: scale(0.95);
  }

  .kotbo-color-swatch--active {
    border-color: var(--color-primary, var(--primary-color));
    box-shadow: 0 0 0 2px var(--color-surface-container-lowest, var(--surface-container-lowest)), 0 0 0 4px var(--color-primary, var(--primary-color));
  }

  .kotbo-color-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  @media (max-width: 767px) {
    .kotbo-color-palette {
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 0.5rem;
    }
  }
</style>
