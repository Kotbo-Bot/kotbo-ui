<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import Papicon from '../icons/Papicon.svelte';

  type InputValue = string | number;

  let {
    id = '',
    type = 'text',
    value = $bindable<InputValue>(''),
    placeholder = '',
    disabled = false,
    readonly = false,
    autocomplete,
    className = '',
    label = '',
    ariaLabel,
    describedBy = undefined,
    'aria-describedby': ariaDescribedBy = undefined,
    icon = '',
    required = false,
    oninput,
    onchange,
  }: {
    id?: string;
    type?: string;
    value?: InputValue;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    autocomplete?: HTMLInputAttributes['autocomplete'];
    className?: string;
    label?: string;
    ariaLabel?: string;
    describedBy?: string | undefined;
    'aria-describedby'?: string | undefined;
    icon?: string;
    required?: boolean;
    oninput?: (event: Event) => void;
    onchange?: (event: Event) => void;
  } = $props();

  const resolvedDescribedBy = $derived(ariaDescribedBy ?? describedBy);
</script>

{#if label}
  <label for={id} class="kotbo-form-field">
    <span class="kotbo-form-field__label">
      {#if icon}<Papicon {icon} size={13} />{/if}
      {label}{#if required}<span aria-hidden="true">*</span>{/if}
    </span>
    <input
      {id}
      aria-describedby={resolvedDescribedBy}
      {type}
      bind:value
      {placeholder}
      {disabled}
      {readonly}
      {required}
      {autocomplete}
      {oninput}
      {onchange}
      class="input {className}"
    />
  </label>
{:else}
  <input
    {id}
    aria-label={ariaLabel}
    aria-describedby={resolvedDescribedBy}
    {type}
    bind:value
    {placeholder}
    {disabled}
    {readonly}
    {required}
    {autocomplete}
    {oninput}
    {onchange}
    class="input {className}"
  />
{/if}

<style>
  .kotbo-form-field {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 0.375rem;
  }

  .kotbo-form-field__label {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }
</style>
