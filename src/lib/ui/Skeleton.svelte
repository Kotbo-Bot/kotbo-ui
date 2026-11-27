<script lang="ts">
  const {
    class: className = '',
    width = '100%',
    height = '1rem',
    rounded = '0.5rem',
    circle = false,
    radius = '',
    style = '',
    ...rest
  }: {
    class?: string;
    width?: string;
    height?: string;
    rounded?: string;
    circle?: boolean;
    radius?: string;
    style?: string;
    [key: string]: unknown;
  } = $props();

  const isTailwindWidth = $derived(width.startsWith('w-') || width.startsWith('max-w-') || width.startsWith('min-w-'));
  const isTailwindHeight = $derived(height.startsWith('h-') || height.startsWith('max-h-') || height.startsWith('min-h-'));
  const isTailwindRounded = $derived(rounded.startsWith('rounded'));

  const computedStyle = $derived(
    [
      circle ? 'border-radius: 9999px' : radius ? `border-radius: ${radius}` : !isTailwindRounded ? `border-radius: ${rounded}` : '',
      !isTailwindWidth ? `width: ${width}` : '',
      !isTailwindHeight ? `height: ${height}` : '',
      style,
    ]
      .filter(Boolean)
      .join('; '),
  );
</script>

<div
  class="kotbo-skeleton {circle ? 'rounded-full' : isTailwindRounded ? rounded : ''} {isTailwindWidth ? width : ''} {isTailwindHeight ? height : ''} {className}"
  style={computedStyle}
  aria-hidden="true"
  {...rest}
></div>

<style>
  .kotbo-skeleton {
    background: color-mix(in srgb, var(--color-surface-container-highest, var(--surface-container-highest)) 60%, transparent);
    animation: kotbo-pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes kotbo-pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.45;
    }
  }
</style>
