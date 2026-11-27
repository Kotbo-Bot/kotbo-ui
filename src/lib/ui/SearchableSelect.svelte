<script lang="ts">
  import { getMessages } from '../config.svelte.js';
  import Papicon from '../icons/Papicon.svelte';
  import { displayedText, filterOptions } from '../utils/searchableSelectModel.js';

  export interface SearchableOption {
    id: string;
    name: string;
    color?: string | null;
    icon?: string;
  }

  let {
    id = '',
    describedBy = undefined,
    value = $bindable<string | null>(null),
    options = [],
    placeholder = '',
    className = '',
    clearable = true,
    disabled = false,
    showId = true,
    onCreate = null,
    onchange,
    oninput,
  }: {
    id?: string;
    describedBy?: string | undefined;
    value?: string | null;
    options?: SearchableOption[];
    placeholder?: string;
    className?: string;
    clearable?: boolean;
    disabled?: boolean;
    showId?: boolean;
    onCreate?: ((name: string) => Promise<{ id: string; name: string } | null>) | null;
    onchange?: (value: string | null) => void;
    oninput?: (value: string | null) => void;
  } = $props();

  const msgs = $derived(getMessages());

  let creating = $state(false);
  let open = $state(false);
  let query = $state('');
  let highlighted = $state(0);
  let wrapper: HTMLDivElement;

  const MENU_MAX_HEIGHT = 224;
  const MENU_GAP = 8;

  function placeMenu(node: HTMLElement) {
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom - MENU_GAP;
    const above = rect.top - MENU_GAP;
    const up = below < Math.min(MENU_MAX_HEIGHT, 180) && above > below;

    node.style.position = 'fixed';
    node.style.left = `${rect.left}px`;
    node.style.width = `${rect.width}px`;
    node.style.maxHeight = `${Math.max(120, Math.min(MENU_MAX_HEIGHT, up ? above : below))}px`;
    node.style.top = up ? 'auto' : `${rect.bottom + MENU_GAP}px`;
    node.style.bottom = up ? `${window.innerHeight - rect.top + MENU_GAP}px` : 'auto';
  }

  function dropdown(node: HTMLElement) {
    document.body.appendChild(node);
    const reposition = () => placeMenu(node);
    reposition();
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);

    return {
      destroy() {
        window.removeEventListener('scroll', reposition, true);
        window.removeEventListener('resize', reposition);
        node.remove();
      },
    };
  }

  const selected = $derived(options.find((o) => o.id === value) ?? null);
  const adorned = $derived(Boolean(selected && (selected.color || selected.icon)));
  const filtered = $derived(filterOptions(options, query, selected?.name ?? null));
  const canCreate = $derived(Boolean(onCreate) && query.trim().length > 0 && filtered.length === 0);

  $effect(() => {
    void filtered;
    highlighted = 0;
  });

  function syncQuery(current: string | null, opts: typeof options) {
    if (open) return;
    const text = displayedText(current, opts);
    if (text !== null && query !== text) query = text;
  }

  $effect(() => {
    syncQuery(value, options);
  });

  function select(opt: { id: string; name: string }) {
    if (disabled) return;
    value = opt.id;
    query = opt.name;
    open = false;
    onchange?.(value);
    oninput?.(value);
  }

  async function create() {
    if (!onCreate || creating || disabled) return;
    creating = true;
    try {
      const created = await onCreate(query.trim());
      if (created) select(created);
    } finally {
      creating = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (disabled) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      open = true;
      highlighted = Math.min(highlighted + 1, Math.max(0, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlighted = Math.max(highlighted - 1, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (open && filtered[highlighted]) {
        select(filtered[highlighted]);
      } else if (open && canCreate) {
        void create();
      }
    } else if (e.key === 'Escape') {
      close();
    }
  }

  function clear(e: MouseEvent) {
    e.preventDefault();
    if (disabled) return;
    value = null;
    query = '';
    onchange?.(value);
    oninput?.(value);
  }

  function close() {
    open = false;
    syncQuery(value, options);
  }
</script>

<div class="kotbo-sselect {className}" bind:this={wrapper}>
  <div class="kotbo-sselect__field">
    {#if adorned}
      <span class="kotbo-sselect__adorn">
        {#if selected?.icon}
          <Papicon icon={selected.icon} size={14} />
        {:else}
          <span class="kotbo-sselect__dot" style="background-color:{selected?.color}"></span>
        {/if}
      </span>
    {/if}

    <input
      {id}
      aria-describedby={describedBy}
      type="text"
      {placeholder}
      bind:value={query}
      oninput={() => {
        if (!disabled) {
          open = true;
          highlighted = 0;
        }
      }}
      onfocus={() => !disabled && (open = true)}
      onblur={() => setTimeout(close, 150)}
      onkeydown={handleKeydown}
      class="kotbo-sselect__input {adorned ? 'kotbo-sselect__input--adorned' : ''} {clearable && query && !disabled ? 'kotbo-sselect__input--clearable' : ''}"
      autocomplete="off"
      {disabled}
    />

    {#if clearable && query && !disabled}
      <button
        type="button"
        class="kotbo-sselect__clear"
        aria-label={msgs.common_clear()}
        title={msgs.common_clear()}
        onclick={clear}
      >
        <Papicon icon="Cross" size={12} />
      </button>
    {/if}
  </div>

  {#if open}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      use:dropdown
      onmousedown={(e) => e.preventDefault()}
      class="kotbo-sselect__menu"
    >
      {#if canCreate}
        <button
          type="button"
          class="kotbo-sselect__create"
          disabled={creating}
          onmousedown={(e) => {
            e.preventDefault();
            void create();
          }}
        >
          <span class="kotbo-sselect__create-icon"><Papicon icon="plus" size={14} /></span>
          <span class="kotbo-sselect__opt-name">{msgs.select_create({ name: query.trim() })}</span>
        </button>
      {:else if filtered.length === 0}
        <div class="kotbo-sselect__empty">{msgs.select_no_results()}</div>
      {/if}
      {#each filtered as opt, i (opt.id)}
        <button
          type="button"
          class="kotbo-sselect__option {i === highlighted ? 'kotbo-sselect__option--active' : ''}"
          onclick={() => select(opt)}
          onmouseenter={() => (highlighted = i)}
        >
          <span class="kotbo-sselect__opt-lead">
            {#if opt.icon}
              <span class="kotbo-sselect__opt-icon"><Papicon icon={opt.icon} size={14} /></span>
            {:else if opt.color}
              <span class="kotbo-sselect__dot" style="background-color:{opt.color}"></span>
            {/if}
            <span class="kotbo-sselect__opt-name">{opt.name}</span>
          </span>
          {#if showId}
            <span class="kotbo-sselect__opt-id">{opt.id}</span>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .kotbo-sselect {
    position: relative;
  }

  .kotbo-sselect__field {
    position: relative;
  }

  .kotbo-sselect__adorn {
    pointer-events: none;
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .kotbo-sselect__dot {
    width: 0.625rem;
    height: 0.625rem;
    flex-shrink: 0;
    border-radius: 9999px;
  }

  .kotbo-sselect__input {
    width: 100%;
    box-sizing: border-box;
    background: var(--color-surface-container-high, var(--surface-container-high));
    color: var(--color-on-surface, var(--on-surface));
    font-family: inherit;
    font-size: 0.875rem;
    padding: 0.625rem 1rem;
    border-radius: 0.75rem;
    border: 1px solid var(--color-field-border, var(--field-border-color));
    outline: none;
  }

  .kotbo-sselect__input:focus-visible {
    box-shadow: 0 0 0 2px var(--color-primary, var(--primary-color));
  }

  .kotbo-sselect__input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .kotbo-sselect__input--adorned {
    padding-left: 2.25rem;
  }

  .kotbo-sselect__input--clearable {
    padding-right: 2.25rem;
  }

  .kotbo-sselect__clear {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    width: 1.25rem;
    height: 1.25rem;
    border: 0;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    background: transparent;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
    cursor: pointer;
    transition: background-color 120ms ease, color 120ms ease;
  }

  .kotbo-sselect__clear:hover {
    color: var(--color-on-surface, var(--on-surface));
    background: var(--color-surface-container-highest, var(--surface-container-highest));
  }

  .kotbo-sselect__menu {
    z-index: var(--layer-popover, 15000);
    border-radius: 1rem;
    border: 1px solid var(--color-outline-variant, var(--outline-variant));
    background: var(--color-surface-container-high, var(--surface-container-high));
    color: var(--color-on-surface, var(--on-surface));
    padding: 0.5rem;
    box-shadow: 0 12px 28px -6px rgba(0, 0, 0, 0.2);
    overflow: auto;
  }

  .kotbo-sselect__create,
  .kotbo-sselect__option {
    width: 100%;
    border: 0;
    background: transparent;
    text-align: left;
    color: var(--color-on-surface, var(--on-surface));
    padding: 0.5rem 1rem;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    font-family: inherit;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 120ms ease;
  }

  .kotbo-sselect__create {
    justify-content: flex-start;
    background: var(--color-surface-container-low, var(--surface-container-low));
    box-shadow: inset 0 0 0 1px var(--color-primary, var(--primary-color));
  }

  .kotbo-sselect__create-icon {
    color: var(--color-primary, var(--primary-color));
    display: inline-flex;
    flex-shrink: 0;
  }

  .kotbo-sselect__option:hover,
  .kotbo-sselect__option--active {
    background: var(--color-surface-container-low, var(--surface-container-low));
  }

  .kotbo-sselect__option--active {
    box-shadow: inset 0 0 0 1px var(--color-primary, var(--primary-color));
  }

  .kotbo-sselect__opt-lead {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
  }

  .kotbo-sselect__opt-icon {
    display: inline-flex;
    flex-shrink: 0;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .kotbo-sselect__opt-name {
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .kotbo-sselect__opt-id {
    margin-left: 0.5rem;
    flex-shrink: 0;
    max-width: 40%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.75rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .kotbo-sselect__empty {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }
</style>
