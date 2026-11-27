export interface TopListItem {
    id: string;
    name: string | null;
    value: number;
    previous?: number;
    share?: number;
    spark?: number[];
    sub?: string;
    avatarUrl?: string | null;
    raw?: unknown;
}
import type { Snippet } from 'svelte';
declare function $$render<T extends TopListItem>(): {
    props: {
        title: string;
        description?: string;
        icon?: string;
        entityLabel?: string;
        items: T[];
        total?: number;
        prevTotal?: number;
        available?: boolean;
        loading?: boolean;
        error?: string;
        format?: (value: number) => string;
        compare?: boolean;
        color?: string;
        bare?: boolean;
        onselect?: (item: T) => void;
        onLoadFull?: () => Promise<T[] | null>;
        onExport?: (items: T[]) => void | Promise<void>;
        renderIdentity?: Snippet<[T]>;
        renderRowName?: Snippet<[T]>;
    };
    exports: {};
    bindings: "";
    slots: {};
    events: {};
};
declare class __sveltets_Render<T extends TopListItem> {
    props(): ReturnType<typeof $$render<T>>['props'];
    events(): ReturnType<typeof $$render<T>>['events'];
    slots(): ReturnType<typeof $$render<T>>['slots'];
    bindings(): "";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <T extends TopListItem>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<T>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<T>['props']>, ReturnType<__sveltets_Render<T>['events']>, ReturnType<__sveltets_Render<T>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<T>['bindings']>;
    } & ReturnType<__sveltets_Render<T>['exports']>;
    <T extends TopListItem>(internal: unknown, props: ReturnType<__sveltets_Render<T>['props']> & {}): ReturnType<__sveltets_Render<T>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const TopList: $$IsomorphicComponent;
type TopList<T extends TopListItem> = InstanceType<typeof TopList<T>>;
export default TopList;
