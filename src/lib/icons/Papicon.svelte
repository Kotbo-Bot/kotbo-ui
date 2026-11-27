<script lang="ts">
  import type { Snippet } from 'svelte';
  import { toPapiconsName } from './papicons.js';
  import { getPapicon } from './papiconComponents.js';
  import { getLucideIcon } from './lucide.js';

  const {
    icon = '',
    name = '',
    size = 24,
    class: className = '',
    className: classNameAlias = '',
    class_: legacyClassName = '',
    style = '',
  }: {
    icon?: string;
    name?: string;
    size?: number;
    class?: string;
    className?: string;
    class_?: string;
    style?: string;
    children?: Snippet;
  } = $props();

  function unwrapReactComponent(node: any) {
    if (!node) return null;
    let current = node;
    let depth = 0;

    while (current && typeof current.type === 'function' && depth < 5) {
      current = current.type(current.props || {});
      depth += 1;
    }

    return current?.type === 'svg' ? current : null;
  }

  function flattenChildren(children: any) {
    if (children == null) return [];
    const stack = Array.isArray(children) ? [...children] : [children];
    const flattened: any[] = [];

    while (stack.length > 0) {
      const child = stack.shift();
      if (Array.isArray(child)) {
        stack.unshift(...child);
      } else if (child != null && typeof child === 'object' && typeof child.type === 'string') {
        flattened.push(child);
      }
    }

    return flattened;
  }

  const requestedIcon = $derived(icon || name);
  const mergedClassName = $derived(`${className} ${classNameAlias} ${legacyClassName}`.trim());
  const iconName = $derived(toPapiconsName(requestedIcon));
  const PapiconComponent = $derived(getPapicon(iconName));

  const reactIcon = $derived.by(() => {
    if (!PapiconComponent) return null;
    try {
      return unwrapReactComponent(PapiconComponent({ size, className: mergedClassName }));
    } catch {
      return null;
    }
  });
  const svgProps = $derived(reactIcon?.props ?? {});
  const svgChildren = $derived(flattenChildren(svgProps.children));

  const LucideComponent = $derived.by(() => {
    const component = getLucideIcon(requestedIcon);
    return typeof component === 'function' ? component : null;
  });

  const mergedStyle = $derived(`flex-shrink:0;${style}`);
</script>

{#key PapiconComponent ? iconName : requestedIcon}
  {#if reactIcon && svgChildren.length > 0}
    <svg
      width={size}
      height={size}
      viewBox={svgProps.viewBox ?? '0 0 24 24'}
      fill={svgProps.fill ?? 'none'}
      xmlns="http://www.w3.org/2000/svg"
      class={mergedClassName}
      style={mergedStyle}
      aria-hidden="true"
      focusable="false"
    >
      {#each svgChildren as child, i (i)}
        {#if child.type === 'path'}
          <path
            d={child.props?.d}
            fill={child.props?.fill ?? 'currentColor'}
            fill-rule={child.props?.fillRule}
            clip-rule={child.props?.clipRule}
          />
        {:else}
          {@const Tag = child.type}
          <Tag
            {...child.props}
            fill={child.props?.fill ?? (['line', 'polyline', 'polygon'].includes(child.type) ? 'none' : 'currentColor')}
          />
        {/if}
      {/each}
    </svg>
  {:else if LucideComponent}
    <LucideComponent size={size} class={mergedClassName} style={mergedStyle} stroke-width={2.25} aria-hidden="true" />
  {:else}
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      class={mergedClassName}
      style={mergedStyle}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" fill="currentColor" />
    </svg>
  {/if}
{/key}
