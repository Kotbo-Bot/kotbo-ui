<script lang="ts">
  import { getMessages } from '../config.svelte.js';
  import Papicon from '../icons/Papicon.svelte';
  import { normalizeSearch } from '../utils/searchableSelectModel.js';

  let {
    values = $bindable<string[]>([]),
    options = [],
    placeholder = undefined,
    disabled = false,
    accentClass = '',
    id = '',
    describedBy = undefined,
    onchange,
  }: {
    values?: string[];
    options?: Array<{ id: string; name: string }>;
    placeholder?: string | undefined;
    disabled?: boolean;
    accentClass?: string;
    id?: string;
    describedBy?: string | undefined;
    onchange?: (values: string[]) => void;
  } = $props();

  const msgs = $derived(getMessages());

  let query = $state('');
  let open = $state(false);
  let inputEl: HTMLInputElement;
  let active = $state(-1);

  const fallbackId = `multiselect-${Math.random().toString(36).slice(2, 10)}`;
  const inputId = $derived(id || fallbackId);

  const uniqueOptions = $derived([...new Map(options.map((o) => [o.id, o])).values()]);
  const filtered = $derived(
    uniqueOptions.filter(
      (o) => !values.includes(o.id) && normalizeSearch(o.name).includes(normalizeSearch(query)),
    ),
  );
  const selectedOptions = $derived(uniqueOptions.filter((o) => values.includes(o.id)));

  $effect(() => {
    if (active >= filtered.length) active = filtered.length - 1;
  });

  const activeOption = $derived(open && !disabled && active >= 0 ? filtered[active] : undefined);

  function toggle(optId: string) {
    if (disabled) return;
    values = values.includes(optId) ? values.filter((v) => v !== optId) : [...values, optId];
    query = '';
    onchange?.(values);
    inputEl?.focus();
  }

  function remove(optId: string) {
    if (disabled) return;
    values = values.filter((v) => v !== optId);
    onchange?.(values);
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Backspace' && !query && values.length > 0) {
      values = values.slice(0, -1);
      onchange?.(values);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      open = true;
      active = Math.min(active + 1, filtered.length - 1);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      active = Math.max(active - 1, 0);
    }
    if (e.key === 'Enter' && activeOption) {
      e.preventDefault();
      toggle(activeOption.id);
    }
    if (e.key === 'Escape') {
      open = false;
      active = -1;
    }
  }
</script>

<div class="kotbo-mselect">
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="kotbo-mselect__box {open ? 'kotbo-mselect__box--open' : ''} {disabled ? 'kotbo-mselect__box--disabled' : ''}"
    onclick={() => {
      if (!disabled) {
        open = true;
        inputEl?.focus();
      }
    }}
  >
    {#each selectedOptions as opt (opt.id)}
      <span class="kotbo-mselect__pill {accentClass}">
        {opt.name}
        {#if !disabled}
          <button
            type="button"
            onclick={(e) => {
              e.stopPropagation();
              remove(opt.id);
            }}
            class="kotbo-mselect__pill-remove"
            aria-label={msgs.select_remove_item({ name: opt.name })}
          >
            <Papicon icon="x" size={12} />
          </button>
        {/if}
      </span>
    {/each}

    <input
      bind:this={inputEl}
      id={inputId}
      aria-describedby={describedBy}
      type="text"
      role="combobox"
      aria-expanded={open && !disabled && filtered.length > 0}
      aria-controls={open && !disabled && filtered.length > 0 ? `${inputId}-listbox` : undefined}
      aria-autocomplete="list"
      aria-activedescendant={activeOption ? `${inputId}-opt-${activeOption.id}` : undefined}
      {disabled}
      bind:value={query}
      placeholder={placeholder ?? msgs.select_search_placeholder()}
      class="kotbo-mselect__input"
      oninput={() => {
        open = true;
      }}
      onfocus={() => {
        open = true;
      }}
      onblur={() => setTimeout(() => (open = false), 180)}
      onkeydown={onKeydown}
      autocomplete="off"
    />
  </div>

  {#if open && !disabled}
    {#if filtered.length === 0}
      <div role="status" class="kotbo-mselect__empty">
        {query ? msgs.select_no_result_for({ query }) : msgs.select_all_selected()}
      </div>
    {:else}
      <div id="{inputId}-listbox" role="listbox" class="kotbo-mselect__listbox">
        <div class="kotbo-mselect__options">
          {#each filtered as opt, i (opt.id)}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <div
              id="{inputId}-opt-{opt.id}"
              role="option"
              aria-selected={i === active}
              tabindex="-1"
              onmousedown={(e) => e.preventDefault()}
              onclick={() => toggle(opt.id)}
              class="kotbo-mselect__option {i === active ? 'kotbo-mselect__option--active' : ''}"
            >
              <span>{opt.name}</span>
              <span class="kotbo-mselect__option-id">{opt.id.slice(0, 8)}…</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .kotbo-mselect {
    position: relative;
  }

  .kotbo-mselect__box {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    min-height: 2.75rem;
    width: 100%;
    box-sizing: border-box;
    background: color-mix(in srgb, var(--color-surface-container-high, var(--surface-container-high)) 40%, transparent);
    border: 1px solid var(--color-field-border, var(--field-border-color));
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    cursor: text;
    transition: box-shadow 150ms ease;
  }

  .kotbo-mselect__box--open,
  .kotbo-mselect__box:focus-within {
    box-shadow: 0 0 0 2px var(--color-primary, var(--primary-color));
  }

  .kotbo-mselect__box--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .kotbo-mselect__pill {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.125rem 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid color-mix(in srgb, var(--color-primary, var(--primary-color)) 40%, transparent);
    background: color-mix(in srgb, var(--color-primary, var(--primary-color)) 20%, transparent);
    color: var(--color-primary, var(--primary-color));
  }

  .kotbo-mselect__pill-remove {
    margin: -0.25rem -0.375rem -0.25rem 0;
    display: inline-flex;
    width: 1.5rem;
    height: 1.5rem;
    border: 0;
    border-radius: 0.25rem;
    background: transparent;
    color: inherit;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    cursor: pointer;
  }

  .kotbo-mselect__pill-remove:hover {
    opacity: 1;
  }

  .kotbo-mselect__input {
    flex: 1;
    min-width: 120px;
    border: 0;
    background: transparent;
    font-family: inherit;
    font-size: 0.875rem;
    color: var(--color-on-surface, var(--on-surface));
    outline: none;
  }

  .kotbo-mselect__input:focus-visible {
    box-shadow: 0 0 0 2px var(--color-primary, var(--primary-color));
    border-radius: 0.25rem;
  }

  .kotbo-mselect__input::placeholder {
    color: color-mix(in srgb, var(--color-on-surface-variant, var(--on-surface-variant)) 55%, transparent);
  }

  .kotbo-mselect__input:disabled {
    cursor: not-allowed;
  }

  .kotbo-mselect__empty,
  .kotbo-mselect__listbox {
    position: absolute;
    left: 0;
    right: 0;
    margin-top: 0.5rem;
    z-index: 30;
    border-radius: 0.5rem;
    border: 1px solid var(--color-outline-variant, var(--outline-variant));
    background: var(--color-surface-container-high, var(--surface-container-high));
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    max-height: 13rem;
    overflow-y: auto;
  }

  .kotbo-mselect__empty {
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-style: italic;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .kotbo-mselect__options {
    padding: 0.375rem;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .kotbo-mselect__option {
    width: 100%;
    text-align: left;
    padding: 0.5rem 0.75rem;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-on-surface, var(--on-surface));
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    cursor: pointer;
    transition: background-color 120ms ease;
  }

  .kotbo-mselect__option:hover,
  .kotbo-mselect__option--active {
    background: color-mix(in srgb, var(--color-surface-container-low, var(--surface-container-low)) 75%, transparent);
  }

  .kotbo-mselect__option--active {
    outline: 2px solid var(--color-primary, var(--primary-color));
  }

  .kotbo-mselect__option-id {
    font-size: 0.6875rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }
</style>
