export interface TabItem {
    id: string;
    label: string;
    icon?: string;
    badge?: string | number;
    disabled?: boolean;
}
type $$ComponentProps = {
    tabs: TabItem[];
    active: string;
    onchange: (id: string) => void;
    label: string;
    class?: string;
};
declare const Tabs: import("svelte").Component<$$ComponentProps, {}, "">;
type Tabs = ReturnType<typeof Tabs>;
export default Tabs;
