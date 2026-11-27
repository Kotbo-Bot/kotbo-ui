export interface ShareSegment {
    id: string;
    label: string;
    value: number;
    color: string;
}
type $$ComponentProps = {
    segments: ShareSegment[];
    columns?: number;
    showCounts?: boolean;
};
declare const ShareBar: import("svelte").Component<$$ComponentProps, {}, "">;
type ShareBar = ReturnType<typeof ShareBar>;
export default ShareBar;
