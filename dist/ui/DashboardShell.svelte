<script lang="ts" module>
  export interface ShellNavItem {
    id: string;
    label: string;
    shortLabel?: string;
    icon: string;
    href?: string;
    active: boolean;
    badge?: number;
    badgeTone?: 'default' | 'accent' | 'warn';
    tag?: string;
    onSelect: () => void;
  }

  export interface ShellSecondaryItem {
    id: string;
    label: string;
    icon: string;
    href: string;
    active?: boolean;
    external?: boolean;
    onSelect?: () => void;
  }

  export interface ShellUserMenuLink {
    id: string;
    label: string;
    icon: string;
    href: string;
    external?: boolean;
    onSelect?: () => void;
  }

  export type ShellThemeMode = 'auto' | 'light' | 'dark';
</script>

<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import Papicon from '../icons/Papicon.svelte';
  import { getMessages } from '../config.svelte.js';

  let {
    brandName = 'Kotbo',
    brandLogo = '',
    brandTag = '',
    brandHref = '/',
    storageKey = 'kotbo_sidebar_collapsed',
    sectionLabel,
    secondarySectionLabel,
    activeTitle,
    primaryNav,
    secondaryNav = [],
    userMenuLinks = [],
    username,
    userRoleLabel = '',
    avatarUrl,
    themeMode,
    onThemeChange,
    onNavigate,
    onLogout,
    renderIcon,
    topbarLeft,
    topbarRight,
    userMenuExtra,
    children,
  }: {
    brandName?: string;
    brandLogo?: string;
    brandTag?: string;
    brandHref?: string;
    storageKey?: string;
    sectionLabel: string;
    secondarySectionLabel?: string;
    activeTitle: string;
    primaryNav: ShellNavItem[];
    secondaryNav?: ShellSecondaryItem[];
    userMenuLinks?: ShellUserMenuLink[];
    username: string;
    userRoleLabel?: string;
    avatarUrl?: string;
    themeMode?: ShellThemeMode;
    onThemeChange?: (mode: ShellThemeMode) => void;
    onNavigate?: (path: string) => void;
    onLogout?: () => void;
    renderIcon?: Snippet<[string]>;
    topbarLeft?: Snippet;
    topbarRight?: Snippet;
    userMenuExtra?: Snippet;
    children: Snippet;
  } = $props();

  const msgs = $derived(getMessages());

  let collapsed = $state(false);
  let drawerOpen = $state(false);
  let userMenuOpen = $state(false);
  let activeTooltip = $state<{ text: string; top: number } | null>(null);

  const userAvatar = $derived(avatarUrl || 'https://cdn.discordapp.com/embed/avatars/0.png');

  const THEME_OPTIONS = $derived<{ value: ShellThemeMode; label: string }[]>([
    { value: 'auto', label: msgs.shell_theme_auto() },
    { value: 'light', label: msgs.shell_theme_light() },
    { value: 'dark', label: msgs.shell_theme_dark() },
  ]);

  function toggleCollapsed() {
    collapsed = !collapsed;
    activeTooltip = null;
    try {
      localStorage.setItem(storageKey, collapsed ? '1' : '0');
    } catch {
      /* stockage indisponible */
    }
  }

  function showTooltip(e: MouseEvent, text: string) {
    if (!collapsed) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    activeTooltip = { text, top: rect.top + rect.height / 2 };
  }

  function hideTooltip() {
    activeTooltip = null;
  }

  function selectNavItem(onSelect: () => void) {
    drawerOpen = false;
    userMenuOpen = false;
    activeTooltip = null;
    onSelect();
  }

  onMount(() => {
    try {
      collapsed = localStorage.getItem(storageKey) === '1';
    } catch {
      collapsed = false;
    }

    const onWindowClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest('.dash-user-menu')) {
        userMenuOpen = false;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        drawerOpen = false;
        userMenuOpen = false;
      }
    };

    window.addEventListener('click', onWindowClick);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('click', onWindowClick);
      window.removeEventListener('keydown', onKeyDown);
    };
  });
</script>

{#snippet iconSlot(name: string)}
  {#if renderIcon}
    {@render renderIcon(name)}
  {:else}
    <Papicon icon={name} size={18} />
  {/if}
{/snippet}

<a class="skip-link" href="#main-content">{msgs.shell_skip_to_content()}</a>

<div class="dash-shell" class:dash-shell--collapsed={collapsed}>
  {#if drawerOpen}
    <div class="dash-backdrop" role="presentation" onclick={() => (drawerOpen = false)}></div>
  {/if}

  <aside
    id="dash-sidebar"
    class="dash-sidebar"
    class:dash-sidebar--open={drawerOpen}
    aria-label={msgs.shell_main_nav()}
  >
    <button
      type="button"
      class="dash-edge-toggle"
      onclick={toggleCollapsed}
      aria-label={collapsed ? msgs.shell_expand_sidebar() : msgs.shell_collapse_sidebar()}
      aria-expanded={!collapsed}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        {#if collapsed}
          <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
        {:else}
          <path d="M7.5 2.5L4 6L7.5 9.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
        {/if}
      </svg>
    </button>

    <div class="dash-sidebar-head">
      <a
        href={brandHref}
        class="dash-sidebar-brand"
        onclick={(e) => {
          if (onNavigate) {
            e.preventDefault();
            selectNavItem(() => onNavigate(brandHref));
          }
        }}
        onmouseenter={(e) => showTooltip(e, brandName)}
        onmouseleave={hideTooltip}
      >
        {#if brandLogo}
          <img src={brandLogo} alt="" width="28" height="28" />
        {/if}
        <span class="dash-nav-label">{brandName}</span>
      </a>
      {#if brandTag}
        <span class="dash-sidebar-tag">{brandTag}</span>
      {/if}
      <button
        type="button"
        class="dash-sidebar-close"
        onclick={() => (drawerOpen = false)}
        aria-label={msgs.shell_close_menu()}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <nav class="dash-sidebar-nav" aria-label={sectionLabel}>
      <span class="dash-nav-group-label">{sectionLabel}</span>
      {#each primaryNav as item (item.id)}
        {#if item.href}
          <a
            href={item.href}
            class="dash-nav-item"
            class:dash-nav-item--active={item.active}
            aria-current={item.active ? 'page' : undefined}
            aria-label={collapsed ? item.label : undefined}
            onclick={(e) => {
              e.preventDefault();
              selectNavItem(item.onSelect);
            }}
            onmouseenter={(e) => showTooltip(e, item.label)}
            onmouseleave={hideTooltip}
          >
            {@render iconSlot(item.icon)}
            <span class="dash-nav-label">{item.label}</span>
            {#if item.badge && item.badge > 0}
              <span
                class="dash-nav-badge {item.badgeTone === 'accent'
                  ? 'dash-nav-badge--accent'
                  : item.badgeTone === 'warn'
                    ? 'dash-nav-badge--warn'
                    : ''}"
              >
                {item.badge}
              </span>
              {#if collapsed}
                <span class="dash-nav-dot" aria-hidden="true"></span>
              {/if}
            {:else if item.tag}
              <span class="dash-nav-tag">{item.tag}</span>
            {/if}
          </a>
        {:else}
          <button
            type="button"
            class="dash-nav-item"
            class:dash-nav-item--active={item.active}
            aria-current={item.active ? 'page' : undefined}
            aria-label={collapsed ? item.label : undefined}
            onclick={() => selectNavItem(item.onSelect)}
            onmouseenter={(e) => showTooltip(e, item.label)}
            onmouseleave={hideTooltip}
          >
            {@render iconSlot(item.icon)}
            <span class="dash-nav-label">{item.label}</span>
            {#if item.badge && item.badge > 0}
              <span
                class="dash-nav-badge {item.badgeTone === 'accent'
                  ? 'dash-nav-badge--accent'
                  : item.badgeTone === 'warn'
                    ? 'dash-nav-badge--warn'
                    : ''}"
              >
                {item.badge}
              </span>
              {#if collapsed}
                <span class="dash-nav-dot" aria-hidden="true"></span>
              {/if}
            {:else if item.tag}
              <span class="dash-nav-tag">{item.tag}</span>
            {/if}
          </button>
        {/if}
      {/each}

      {#if secondaryNav.length > 0}
        <div class="dash-nav-sep" aria-hidden="true"></div>
        <span class="dash-nav-group-label">{secondarySectionLabel ?? msgs.shell_resources()}</span>
        {#each secondaryNav as item (item.id)}
          {@const isExternal = Boolean(item.external || item.href.startsWith('http'))}
          <a
            href={item.href}
            class="dash-nav-item"
            class:dash-nav-item--active={Boolean(item.active)}
            aria-current={item.active ? 'page' : undefined}
            aria-label={collapsed ? item.label : undefined}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            onclick={(e) => {
              if (isExternal) {
                drawerOpen = false;
                userMenuOpen = false;
                activeTooltip = null;
                return;
              }
              e.preventDefault();
              if (item.onSelect) selectNavItem(item.onSelect);
            }}
            onmouseenter={(e) => showTooltip(e, item.label)}
            onmouseleave={hideTooltip}
          >
            {@render iconSlot(item.icon)}
            <span class="dash-nav-label">{item.label}</span>
          </a>
        {/each}
      {/if}
    </nav>

    <div class="dash-sidebar-foot">
      <button
        type="button"
        class="dash-nav-item dash-collapse-foot-btn"
        onclick={toggleCollapsed}
        aria-label={collapsed ? msgs.shell_expand_menu() : msgs.shell_collapse_menu()}
        onmouseenter={(e) => showTooltip(e, collapsed ? msgs.shell_expand_menu() : msgs.shell_collapse_menu())}
        onmouseleave={hideTooltip}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style="flex: none;">
          {#if collapsed}
            <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          {:else}
            <path d="M10 3.5L5.5 8L10 12.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          {/if}
        </svg>
        <span class="dash-nav-label">{msgs.shell_collapse_menu()}</span>
      </button>
    </div>
  </aside>

  {#if activeTooltip && collapsed}
    <div class="dash-rail-tooltip" role="tooltip" style="top: {activeTooltip.top}px;">
      {activeTooltip.text}
    </div>
  {/if}

  <div class="dash-frame">
    <header class="dash-topbar">
      <div class="dash-topbar-left">
        <button
          type="button"
          class="dash-menu-btn"
          onclick={() => (drawerOpen = !drawerOpen)}
          aria-controls="dash-sidebar"
          aria-expanded={drawerOpen}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2.5 4.5H13.5M2.5 8H13.5M2.5 11.5H13.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
          <span>{msgs.shell_open_menu()}</span>
        </button>

        <nav class="dash-crumb" aria-label={msgs.shell_breadcrumb()}>
          <span>{sectionLabel}</span>
          <span class="dash-crumb-sep" aria-hidden="true">/</span>
          <span class="dash-crumb-current">{activeTitle}</span>
        </nav>

        {#if topbarLeft}
          {@render topbarLeft()}
        {/if}
      </div>

      <div class="dash-topbar-right">
        {#if topbarRight}
          {@render topbarRight()}
        {/if}

        <div class="dash-popover-wrap dash-user-menu">
          <button
            type="button"
            class="dash-profile-btn"
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
            aria-label={msgs.shell_account_menu({ name: username })}
            onclick={(e) => {
              e.stopPropagation();
              userMenuOpen = !userMenuOpen;
            }}
          >
            <img src={userAvatar} alt="" class="dash-avatar" />
            <span class="dash-profile-name">{username}</span>
            {@render iconSlot('chevron-down')}
          </button>

          {#if userMenuOpen}
            <div class="dash-popover" role="menu" aria-label={msgs.shell_account_options()}>
              <div class="dash-popover-head">
                <div class="dash-popover-identity">
                  <div class="dash-popover-name">{username}</div>
                  {#if userRoleLabel}
                    <div class="dash-popover-sub">{userRoleLabel}</div>
                  {/if}
                </div>
              </div>

              {#if userMenuExtra}
                <div class="dash-popover-section">
                  {@render userMenuExtra()}
                </div>
              {/if}

              {#if themeMode !== undefined && onThemeChange}
                <div class="dash-popover-section">
                  <div class="dash-theme-row">
                    <span class="dash-theme-label">{msgs.shell_theme()}</span>
                    <div class="dash-theme-seg" role="group" aria-label={msgs.shell_theme_group()}>
                      {#each THEME_OPTIONS as opt (opt.value)}
                        <button
                          type="button"
                          class="dash-theme-opt"
                          aria-pressed={themeMode === opt.value}
                          onclick={() => onThemeChange(opt.value)}
                        >
                          {opt.label}
                        </button>
                      {/each}
                    </div>
                  </div>
                </div>
              {/if}

              {#if userMenuLinks.length > 0 || onLogout}
                <div class="dash-popover-section">
                  {#each userMenuLinks as link (link.id)}
                    {@const isExt = Boolean(link.external || link.href.startsWith('http'))}
                    <a
                      href={link.href}
                      target={isExt ? '_blank' : undefined}
                      rel={isExt ? 'noopener noreferrer' : undefined}
                      class="dash-popover-item"
                      role="menuitem"
                      onclick={(e) => {
                        if (isExt) {
                          userMenuOpen = false;
                          return;
                        }
                        if (link.onSelect || onNavigate) {
                          e.preventDefault();
                          selectNavItem(() => (link.onSelect ? link.onSelect() : onNavigate?.(link.href)));
                        }
                      }}
                    >
                      {@render iconSlot(link.icon)}
                      <span>{link.label}</span>
                    </a>
                  {/each}
                  {#if onLogout}
                    <button
                      type="button"
                      class="dash-popover-item dash-popover-item--danger"
                      role="menuitem"
                      onclick={() => {
                        userMenuOpen = false;
                        onLogout();
                      }}
                    >
                      {@render iconSlot('lock')}
                      <span>{msgs.shell_logout()}</span>
                    </button>
                  {/if}
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    </header>

    <main id="main-content" tabindex="-1" class="dash-main">
      {@render children()}
    </main>
  </div>

  <nav class="dash-tabbar" aria-label={msgs.shell_mobile_nav()}>
    {#each primaryNav as item (item.id)}
      {#if item.href}
        <a
          href={item.href}
          class="dash-tabbar-item"
          class:dash-tabbar-item--active={item.active}
          aria-current={item.active ? 'page' : undefined}
          onclick={(e) => {
            e.preventDefault();
            selectNavItem(item.onSelect);
          }}
        >
          <span class="dash-tabbar-glyph">
            {@render iconSlot(item.icon)}
            {#if item.badge && item.badge > 0}
              <span class="dash-tabbar-badge">{item.badge > 9 ? '9+' : item.badge}</span>
            {/if}
          </span>
          <span class="dash-tabbar-label">{item.shortLabel ?? item.label}</span>
        </a>
      {:else}
        <button
          type="button"
          class="dash-tabbar-item"
          class:dash-tabbar-item--active={item.active}
          aria-current={item.active ? 'page' : undefined}
          onclick={() => selectNavItem(item.onSelect)}
        >
          <span class="dash-tabbar-glyph">
            {@render iconSlot(item.icon)}
            {#if item.badge && item.badge > 0}
              <span class="dash-tabbar-badge">{item.badge > 9 ? '9+' : item.badge}</span>
            {/if}
          </span>
          <span class="dash-tabbar-label">{item.shortLabel ?? item.label}</span>
        </button>
      {/if}
    {/each}
  </nav>
</div>

<style>
  .skip-link {
    position: fixed;
    top: -100px;
    left: 16px;
    z-index: 1000;
    padding: 8px 14px;
    border-radius: 8px;
    background: var(--accent, var(--color-primary));
    color: var(--accent-ink, var(--color-on-primary));
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    transition: top 120ms ease;
  }
  .skip-link:focus-visible {
    top: 12px;
  }

  .dash-shell {
    --dash-sidebar-w: 248px;
    min-height: 100dvh;
    display: flex;
    background: var(--bg, var(--color-background));
    color: var(--ink, var(--color-on-surface));
  }

  .dash-shell--collapsed {
    --dash-sidebar-w: 72px;
  }

  .dash-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 40;
    width: var(--dash-sidebar-w);
    display: flex;
    flex-direction: column;
    background: var(--surface, var(--color-surface-container-lowest));
    border-right: 1px solid var(--border, var(--color-outline-variant));
    transition: width 180ms ease, transform 200ms ease;
  }

  .dash-sidebar-head {
    height: 56px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid var(--border, var(--color-outline-variant));
    flex: none;
  }

  .dash-sidebar-brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
    color: inherit;
    font: 700 18px/1 var(--display, var(--font-headline));
    letter-spacing: -0.02em;
    text-decoration: none;
  }

  .dash-sidebar-brand img {
    width: 28px;
    height: 28px;
    flex: none;
  }

  .dash-sidebar-tag {
    flex: none;
    padding: 2px 8px;
    border-radius: 6px;
    background: var(--accent-soft, var(--color-primary-container));
    color: var(--accent, var(--color-on-primary-container));
    font-size: 11px;
    font-weight: 700;
    line-height: 1.4;
  }

  .dash-sidebar-close {
    display: none;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: var(--ink-muted, var(--color-on-surface-variant));
    cursor: pointer;
    flex: none;
  }

  .dash-sidebar-close:hover {
    background: var(--surface-muted, var(--color-surface-container));
    color: var(--ink, var(--color-on-surface));
  }

  .dash-edge-toggle {
    position: absolute;
    top: 44px;
    right: -12px;
    z-index: 45;
    width: 24px;
    height: 24px;
    display: grid;
    place-items: center;
    border: 1px solid var(--border, var(--color-outline-variant));
    border-radius: 999px;
    background: var(--surface, var(--color-surface-container-lowest));
    color: var(--ink-muted, var(--color-on-surface-variant));
    box-shadow: 0 1px 4px rgb(13 23 48 / 10%);
    opacity: 0;
    cursor: pointer;
    transition: opacity 150ms ease, background-color 150ms ease, color 150ms ease;
  }

  .dash-sidebar:hover .dash-edge-toggle,
  .dash-edge-toggle:focus-visible {
    opacity: 1;
  }

  .dash-edge-toggle:hover {
    background: var(--surface-muted, var(--color-surface-container));
    color: var(--ink, var(--color-on-surface));
  }

  .dash-sidebar-nav {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 12px 10px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .dash-nav-group-label {
    padding: 10px 10px 4px;
    font-size: 11px;
    font-weight: 600;
    color: var(--ink-muted, var(--color-on-surface-variant));
  }

  .dash-nav-sep {
    height: 1px;
    margin: 8px 6px;
    background: var(--border, var(--color-outline-variant));
  }

  .dash-nav-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 40px;
    padding: 0 10px;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: var(--ink-muted, var(--color-on-surface-variant));
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 140ms ease, color 140ms ease;
  }

  .dash-nav-item:hover {
    background: var(--surface-muted, var(--color-surface-container));
    color: var(--ink, var(--color-on-surface));
  }

  .dash-nav-item--active,
  .dash-nav-item[aria-current='page'] {
    background: var(--accent-soft, var(--color-primary-container));
    color: var(--accent, var(--color-on-primary-container));
    font-weight: 600;
  }

  .dash-nav-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dash-nav-badge {
    margin-left: auto;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-muted, var(--color-surface-container));
    color: var(--ink, var(--color-on-surface));
    font-size: 11px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    flex: none;
  }

  .dash-nav-badge--accent {
    background: var(--accent, var(--color-primary));
    color: var(--accent-ink, var(--color-on-primary));
  }

  .dash-nav-badge--warn {
    background: var(--warn-soft, color-mix(in srgb, var(--color-warning) 15%, transparent));
    color: var(--warn, var(--color-on-warning-container));
  }

  .dash-nav-tag {
    margin-left: auto;
    padding: 1px 6px;
    border-radius: 6px;
    background: var(--surface-muted, var(--color-surface-container));
    color: var(--ink-muted, var(--color-on-surface-variant));
    font-size: 11px;
    font-weight: 600;
    flex: none;
  }

  .dash-nav-dot {
    position: absolute;
    top: 8px;
    right: 14px;
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: var(--accent, var(--color-primary));
  }

  .dash-sidebar-foot {
    flex: none;
    padding: 10px;
    border-top: 1px solid var(--border, var(--color-outline-variant));
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .dash-collapse-foot-btn {
    color: var(--ink-muted, var(--color-on-surface-variant));
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    .dash-shell--collapsed .dash-sidebar-head {
      justify-content: center;
      padding: 0;
    }

    .dash-shell--collapsed .dash-sidebar-brand {
      flex: initial;
      justify-content: center;
    }

    .dash-shell--collapsed .dash-nav-item {
      justify-content: center;
      padding: 0;
    }

    .dash-shell--collapsed .dash-sidebar-tag,
    .dash-shell--collapsed .dash-nav-label,
    .dash-shell--collapsed .dash-nav-group-label,
    .dash-shell--collapsed .dash-nav-badge,
    .dash-shell--collapsed .dash-nav-tag {
      display: none;
    }
  }

  .dash-rail-tooltip {
    position: fixed;
    left: 80px;
    transform: translateY(-50%);
    z-index: 90;
    padding: 5px 10px;
    border: 1px solid var(--border, var(--color-outline-variant));
    border-radius: 8px;
    background: var(--ink, var(--color-on-surface));
    color: var(--bg, var(--color-background));
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    pointer-events: none;
    box-shadow: 0 4px 12px rgb(8 15 34 / 20%);
  }

  .dash-backdrop {
    display: none;
  }

  .dash-frame {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    margin-left: var(--dash-sidebar-w);
    transition: margin-left 180ms ease;
  }

  .dash-topbar {
    position: sticky;
    top: 0;
    z-index: 30;
    height: 56px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: var(--surface, var(--color-surface-container-lowest));
    border-bottom: 1px solid var(--border, var(--color-outline-variant));
  }

  .dash-topbar-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
  }

  .dash-topbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: none;
  }

  .dash-menu-btn {
    display: none;
    align-items: center;
    gap: 6px;
    min-height: 38px;
    padding: 0 12px;
    border: 1px solid var(--border, var(--color-outline-variant));
    border-radius: 10px;
    background: var(--surface-muted, var(--color-surface-container));
    color: var(--ink, var(--color-on-surface));
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    flex: none;
  }

  .dash-crumb {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    font-size: 14px;
    color: var(--ink-muted, var(--color-on-surface-variant));
  }

  .dash-crumb-sep {
    opacity: 0.5;
  }

  .dash-crumb-current {
    color: var(--ink, var(--color-on-surface));
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dash-popover-wrap {
    position: relative;
  }

  .dash-profile-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 38px;
    padding: 4px 10px 4px 5px;
    border: 1px solid transparent;
    border-radius: 10px;
    background: transparent;
    color: var(--ink, var(--color-on-surface));
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 140ms ease, border-color 140ms ease;
  }

  .dash-profile-btn:hover,
  .dash-profile-btn[aria-expanded='true'] {
    background: var(--surface-muted, var(--color-surface-container));
    border-color: var(--border, var(--color-outline-variant));
  }

  .dash-avatar {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .dash-profile-name {
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dash-popover {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 80;
    width: 248px;
    padding: 8px;
    border: 1px solid var(--border, var(--color-outline-variant));
    border-radius: 14px;
    background: var(--surface, var(--color-surface-container-lowest));
    box-shadow: 0 14px 34px rgb(8 15 34 / 18%);
  }

  .dash-popover-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 8px 10px;
    border-bottom: 1px solid var(--border, var(--color-outline-variant));
  }

  .dash-popover-identity {
    min-width: 0;
  }

  .dash-popover-name {
    font-size: 13px;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dash-popover-sub {
    font-size: 12px;
    color: var(--ink-muted, var(--color-on-surface-variant));
  }

  .dash-popover-section {
    padding: 6px 0;
    border-bottom: 1px solid var(--border, var(--color-outline-variant));
  }

  .dash-popover-section:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .dash-theme-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 4px 8px;
  }

  .dash-theme-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--ink-muted, var(--color-on-surface-variant));
  }

  .dash-theme-seg {
    display: inline-flex;
    padding: 2px;
    border-radius: 8px;
    background: var(--surface-muted, var(--color-surface-container));
    border: 1px solid var(--border, var(--color-outline-variant));
  }

  .dash-theme-opt {
    border: 0;
    border-radius: 6px;
    padding: 3px 8px;
    background: transparent;
    color: var(--ink-muted, var(--color-on-surface-variant));
    font-family: inherit;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
  }

  .dash-theme-opt[aria-pressed='true'] {
    background: var(--surface, var(--color-surface-container-lowest));
    color: var(--ink, var(--color-on-surface));
    box-shadow: 0 1px 2px rgb(0 0 0 / 8%);
  }

  .dash-popover-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 7px 8px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: var(--ink, var(--color-on-surface));
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
  }

  .dash-popover-item:hover {
    background: var(--surface-muted, var(--color-surface-container));
  }

  .dash-popover-item--danger {
    color: var(--danger, var(--color-error));
  }

  .dash-main {
    flex: 1;
    width: 100%;
    max-width: 1180px;
    margin: 0 auto;
    padding: 24px 28px 48px;
  }

  .dash-main:focus {
    outline: none;
  }

  .dash-tabbar {
    display: none;
  }

  @media (max-width: 1023px) {
    .dash-edge-toggle,
    .dash-collapse-foot-btn,
    .dash-rail-tooltip {
      display: none;
    }

    .dash-frame {
      margin-left: 0;
    }

    .dash-sidebar {
      width: 268px;
      transform: translateX(-100%);
      box-shadow: 0 18px 48px rgb(8 15 34 / 32%);
    }

    .dash-sidebar--open {
      transform: translateX(0);
    }

    .dash-sidebar-close {
      display: inline-flex;
    }

    .dash-backdrop {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 35;
      background: rgb(8 15 34 / 45%);
    }

    .dash-menu-btn {
      display: inline-flex;
    }

    .dash-topbar {
      padding: 0 16px;
    }

    .dash-main {
      padding: 18px 16px 40px;
    }
  }

  @media (max-width: 639px) {
    .dash-crumb,
    .dash-profile-name {
      display: none;
    }

    .dash-main {
      padding-bottom: 84px;
    }

    .dash-tabbar {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 30;
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
      gap: 2px;
      padding: 6px 8px calc(6px + env(safe-area-inset-bottom, 0px));
      background: var(--surface, var(--color-surface-container-lowest));
      border-top: 1px solid var(--border, var(--color-outline-variant));
    }

    .dash-tabbar-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      padding: 4px;
      border: 0;
      border-radius: 10px;
      background: transparent;
      color: var(--ink-muted, var(--color-on-surface-variant));
      font-family: inherit;
      font-size: 11px;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
    }

    .dash-tabbar-item--active {
      color: var(--accent, var(--color-primary));
      font-weight: 600;
    }

    .dash-tabbar-glyph {
      position: relative;
      display: inline-flex;
    }

    .dash-tabbar-badge {
      position: absolute;
      top: -4px;
      right: -8px;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      border-radius: 999px;
      background: var(--accent, var(--color-primary));
      color: var(--accent-ink, var(--color-on-primary));
      font-size: 10px;
      font-weight: 700;
      line-height: 16px;
      text-align: center;
    }

    .dash-tabbar-label {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
