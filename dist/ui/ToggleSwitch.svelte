<script lang="ts">
  import { getMessages } from '../config.svelte.js';

  const {
    checked = false,
    disabled = false,
    onToggle = (_v: boolean) => {},
    size = 'md',
    activeClass = '',
    id = undefined,
    ariaLabel = undefined,
  }: {
    checked?: boolean;
    disabled?: boolean;
    onToggle?: (checked: boolean) => void;
    size?: 'sm' | 'md' | 'lg';
    activeClass?: string;
    id?: string | undefined;
    ariaLabel?: string | undefined;
  } = $props();

  const msgs = $derived(getMessages());
</script>

<button
  type="button"
  role="switch"
  aria-checked={checked}
  aria-label={ariaLabel ?? msgs.toggle_aria_label()}
  {id}
  {disabled}
  onclick={() => {
    if (!disabled) onToggle(!checked);
  }}
  class="kotbo-switch kotbo-switch--{size} {checked ? 'kotbo-switch--checked' : ''} {disabled ? 'kotbo-switch--disabled' : ''} {checked && activeClass ? activeClass : ''}"
>
  <span class="kotbo-switch__knob"></span>
</button>

<style>
  .kotbo-switch {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    border: 0;
    padding: 0;
    border-radius: 9999px;
    background: color-mix(in srgb, var(--color-on-surface-variant, var(--on-surface-variant)) 70%, transparent);
    cursor: pointer;
    transition: background-color 200ms ease;
  }

  .kotbo-switch--checked {
    background: var(--color-primary, var(--primary-color));
  }

  .kotbo-switch--disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .kotbo-switch--sm {
    width: 2rem;
    height: 1.125rem;
  }

  .kotbo-switch--md {
    width: 2.5rem;
    height: 1.375rem;
  }

  .kotbo-switch--lg {
    width: 3rem;
    height: 1.625rem;
  }

  .kotbo-switch__knob {
    pointer-events: none;
    position: absolute;
    border-radius: 9999px;
    background: #ffffff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    transition: transform 200ms ease;
  }

  .kotbo-switch--sm .kotbo-switch__knob {
    top: 2px;
    left: 2px;
    width: 0.875rem;
    height: 0.875rem;
  }

  .kotbo-switch--md .kotbo-switch__knob {
    top: 3px;
    left: 3px;
    width: 1rem;
    height: 1rem;
  }

  .kotbo-switch--lg .kotbo-switch__knob {
    top: 3px;
    left: 3px;
    width: 1.25rem;
    height: 1.25rem;
  }

  .kotbo-switch--sm.kotbo-switch--checked .kotbo-switch__knob {
    transform: translateX(14px);
  }

  .kotbo-switch--md.kotbo-switch--checked .kotbo-switch__knob {
    transform: translateX(18px);
  }

  .kotbo-switch--lg.kotbo-switch--checked .kotbo-switch__knob {
    transform: translateX(22px);
  }
</style>
