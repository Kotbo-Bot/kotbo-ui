<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import Papicon from '../icons/Papicon.svelte';
  import { notifyUi } from '../config.svelte.js';
  import { toast } from '../stores/toast.svelte.js';

  type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

  const {
    variant = 'secondary',
    size = 'md',
    icon = '',
    iconRight = '',
    loading = false,
    fullWidth = false,
    href = undefined,
    target = undefined,
    type = 'button',
    disabled = false,
    disabledReason = '',
    class: className = '',
    children,
    onclick,
    ...rest
  }: {
    variant?: Variant;
    size?: 'sm' | 'md';
    icon?: string;
    iconRight?: string;
    loading?: boolean;
    fullWidth?: boolean;
    href?: string;
    target?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    disabledReason?: string;
    class?: string;
    children?: Snippet;
  } & Omit<HTMLButtonAttributes, 'type' | 'disabled' | 'class'> = $props();

  const VARIANT_CLASS: Record<Variant, string> = {
    primary: 'btn-primary',
    secondary: 'btn-tonal',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  };

  const iconSize = $derived(size === 'sm' ? 13 : 15);
  const explained = $derived(disabled && !loading && !!disabledReason);

  function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
    if (explained) {
      event.preventDefault();
      notifyUi(disabledReason, (msg) => toast.info(msg));
      return;
    }
    onclick?.(event);
  }

  const iconOnly = $derived(!children && !!icon);
  const classes = $derived(
    [
      'btn',
      VARIANT_CLASS[variant],
      size === 'sm' ? 'btn-sm' : '',
      iconOnly ? 'btn-icon' : '',
      fullWidth ? 'btn-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' '),
  );
</script>

{#snippet content()}
  {#if loading}
    <span class="btn-spinner" aria-hidden="true"></span>
  {:else if icon}
    <Papicon {icon} size={iconSize} />
  {/if}
  {@render children?.()}
  {#if iconRight}
    <Papicon icon={iconRight} size={iconSize} />
  {/if}
{/snippet}

{#if href && !disabled}
  <a
    {href}
    {target}
    rel={target === '_blank' ? 'noopener noreferrer' : undefined}
    class={classes}
    {...rest as Record<string, unknown>}
    onclick={onclick as unknown as (event: MouseEvent) => void}
  >
    {@render content()}
  </a>
{:else}
  <button
    type={explained ? 'button' : type}
    class={classes}
    disabled={(disabled && !explained) || loading}
    aria-disabled={explained || undefined}
    aria-busy={loading || undefined}
    {...rest}
    title={explained ? disabledReason : rest.title}
    onclick={handleClick}
  >
    {@render content()}
  </button>
{/if}
