export interface BreadcrumbItem {
    label: string;
    href?: string;
    onClick?: (event: MouseEvent) => void;
}
type $$ComponentProps = {
    back?: {
        label: string;
        href: string;
        onClick?: (event: MouseEvent) => void;
    };
    items?: BreadcrumbItem[];
    ariaLabel?: string;
};
declare const Breadcrumbs: import("svelte").Component<$$ComponentProps, {}, "">;
type Breadcrumbs = ReturnType<typeof Breadcrumbs>;
export default Breadcrumbs;
