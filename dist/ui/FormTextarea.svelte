<script lang="ts">
  let {
    id = '',
    ariaLabel,
    describedBy = undefined,
    'aria-describedby': ariaDescribedBy = undefined,
    value = $bindable(''),
    rows = 3,
    placeholder = '',
    disabled = false,
    readonly = false,
    className = '',
    oninput,
    onchange,
  }: {
    id?: string;
    ariaLabel?: string;
    describedBy?: string | undefined;
    'aria-describedby'?: string | undefined;
    value?: string;
    rows?: number;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    className?: string;
    oninput?: (event: Event) => void;
    onchange?: (event: Event) => void;
  } = $props();

  const resolvedDescribedBy = $derived(ariaDescribedBy ?? describedBy);
</script>

<textarea
  {id}
  aria-label={ariaLabel}
  aria-describedby={resolvedDescribedBy}
  bind:value
  {rows}
  {placeholder}
  {disabled}
  {readonly}
  {oninput}
  {onchange}
  class="input {className}"
></textarea>
