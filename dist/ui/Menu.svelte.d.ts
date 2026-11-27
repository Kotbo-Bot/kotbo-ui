export type MenuItem = {
    label: string;
    description?: string;
    icon?: string;
    onselect: () => void;
};
type $$ComponentProps = {
    items: MenuItem[];
    label: string;
    icon?: string;
    text?: string;
};
declare const Menu: import("svelte").Component<$$ComponentProps, {}, "">;
type Menu = ReturnType<typeof Menu>;
export default Menu;
