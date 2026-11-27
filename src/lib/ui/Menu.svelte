<script lang="ts" module>
  export type MenuItem = {
    label: string;
    description?: string;
    icon?: string;
    onselect: () => void;
  };
</script>

<script lang="ts">
  import { tick } from 'svelte';
  import { portal } from '../actions/portal.js';
  import Papicon from '../icons/Papicon.svelte';

  const {
    items,
    label,
    icon = 'more-horizontal',
    text = '',
  }: { items: MenuItem[]; label: string; icon?: string; text?: string } = $props();

  const MENU_WIDTH = 256;
  const GUTTER = 8;

  let open = $state(false);
  let trigger = $state<HTMLButtonElement | null>(null);
  let menu = $state<HTMLDivElement | null>(null);
  let position = $state({ top: 0, left: 0, above: false });

  function place() {
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const height = menu?.offsetHeight ?? 0;
    const above = rect.bottom + GUTTER + height > window.innerHeight && rect.top - GUTTER - height > 0;
    const left = Math.min(Math.max(GUTTER, rect.right - MENU_WIDTH), window.innerWidth - MENU_WIDTH - GUTTER);
    position = { top: above ? rect.top - GUTTER - height : rect.bottom + GUTTER, left: Math.max(GUTTER, left), above };
  }

  function menuItems(): HTMLElement[] {
    return menu ? Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]')) : [];
  }

  async function show(focus: 'first' | 'last' | null = 'first') {
    open = true;
    place();
    await tick();
    place();
    const list = menuItems();
    if (focus === 'first') list[0]?.focus();
    if (focus === 'last') list.at(-1)?.focus();
  }

  function close(restoreFocus = true) {
    if (!open) return;
    open = false;
    if (restoreFocus) trigger?.focus();
  }

  function select(item: MenuItem) {
    close();
    item.onselect();
  }

  function onTriggerKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      void show('first');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      void show('last');
    }
  }

  function onMenuKeydown(event: KeyboardEvent) {
    const list = menuItems();
    const index = list.indexOf(document.activeElement as HTMLElement);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      list[(index + 1) % list.length]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      list[(index - 1 + list.length) % list.length]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      list[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      list.at(-1)?.focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'Tab') {
      close(false);
    }
  }

  function onWindowPointerDown(event: PointerEvent) {
    if (!open) return;
    const target = event.target as Node;
    if (menu?.contains(target) || trigger?.contains(target)) return;
    close(false);
  }
</script>

<svelte:window
  onpointerdown={onWindowPointerDown}
  onresize={() => close(false)}
  onscrollcapture={() => open && place()}
/>

<button
  bind:this={trigger}
  type="button"
  class="btn btn-sm {text ? 'btn-tonal' : 'btn-ghost btn-icon'}"
  aria-label={label}
  aria-haspopup="menu"
  aria-expanded={open}
  onclick={() => (open ? close() : show(null))}
  onkeydown={onTriggerKeydown}
>
  <Papicon {icon} size={15} />
  {text}
</button>

{#if open}
  <div
    use:portal
    bind:this={menu}
    role="menu"
    tabindex="-1"
    aria-label={label}
    class="kotbo-menu"
    style="top: {position.top}px; left: {position.left}px; width: {MENU_WIDTH}px;"
    onkeydown={onMenuKeydown}
  >
    {#each items as item (item.label)}
      <button
        type="button"
        role="menuitem"
        tabindex="-1"
        class="kotbo-menu__item"
        onclick={() => select(item)}
      >
        {#if item.icon}
          <span class="kotbo-menu__icon"><Papicon icon={item.icon} size={15} /></span>
        {/if}
        <span class="kotbo-menu__text">
          <span class="kotbo-menu__label">{item.label}</span>
          {#if item.description}
            <span class="kotbo-menu__desc">{item.description}</span>
          {/if}
        </span>
      </button>
    {/each}
  </div>
{/if}

<style>
  .kotbo-menu {
    position: fixed;
    z-index: var(--layer-popover, 15000);
    padding: 0.25rem 0;
    border-radius: 0.625rem;
    border: 1px solid var(--color-outline-variant, var(--outline-variant));
    background: var(--color-surface-container-lowest, var(--surface-container-lowest));
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.16), 0 4px 10px -4px rgba(0, 0, 0, 0.08);
  }

  .kotbo-menu__item {
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    padding: 0.5rem 0.75rem;
    border: 0;
    background: transparent;
    text-align: left;
    cursor: pointer;
    transition: background-color 120ms ease;
  }

  .kotbo-menu__item:hover,
  .kotbo-menu__item:focus {
    background: var(--color-surface-container-high, var(--surface-container-high));
    outline: none;
  }

  .kotbo-menu__icon {
    margin-top: 0.125rem;
    flex-shrink: 0;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
    display: inline-flex;
  }

  .kotbo-menu__text {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .kotbo-menu__label {
    display: block;
    font-size: 0.875rem;
    color: var(--color-on-surface, var(--on-surface));
  }

  .kotbo-menu__desc {
    display: block;
    font-size: 0.75rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }
</style>
