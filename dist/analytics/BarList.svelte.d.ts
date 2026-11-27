export interface BarListItem {
    id: string;
    label: string;
    value: number;
    display?: string;
    sub?: string;
    color?: string;
}
import type { Snippet } from 'svelte';
declare function $$render<T extends BarListItem>(): {
    props: {
        items: T[];
        color?: string;
        leading?: Snippet<[T]>;
        trailing?: Snippet<[T]>;
        onselect?: (item: T) => void;
        empty?: string;
        max?: number;
    };
    exports: {};
    bindings: "";
    slots: {};
    events: {};
};
declare class __sveltets_Render<T extends BarListItem> {
    props(): ReturnType<typeof $$render<T>>['props'];
    events(): ReturnType<typeof $$render<T>>['events'];
    slots(): ReturnType<typeof $$render<T>>['slots'];
    bindings(): "";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <T extends BarListItem>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<T>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<T>['props']>, ReturnType<__sveltets_Render<T>['events']>, ReturnType<__sveltets_Render<T>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<T>['bindings']>;
    } & ReturnType<__sveltets_Render<T>['exports']>;
    <T extends BarListItem>(internal: unknown, props: ReturnType<__sveltets_Render<T>['props']> & {}): ReturnType<__sveltets_Render<T>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const BarList: $$IsomorphicComponent;
type BarList<T extends BarListItem> = InstanceType<typeof BarList<T>>;
export default BarList;
