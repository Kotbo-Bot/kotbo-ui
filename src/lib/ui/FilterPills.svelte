<script lang="ts" module>
  export interface FilterOption<T extends string = string> {
    value: T;
    label: string;
    count?: number;
  }
</script>

<script lang="ts" generics="T extends string">
  const {
    options,
    value,
    onchange,
    label,
    describedBy = undefined,
    disabled = false,
    class: className = '',
  }: {
    options: FilterOption<T>[];
    value: T;
    onchange: (value: T) => void;
    label: string;
    describedBy?: string;
    disabled?: boolean;
    class?: string;
  } = $props();
</script>

<div role="group" aria-label={label} aria-describedby={describedBy} class="filter-pills {className}">
  {#each options as option (option.value)}
    <button
      type="button"
      class="filter-pill"
      aria-pressed={option.value === value}
      {disabled}
      onclick={() => onchange(option.value)}
    >
      {option.label}
      {#if option.count !== undefined}
        <span class="filter-pill__count">{option.count}</span>
      {/if}
    </button>
  {/each}
</div>
