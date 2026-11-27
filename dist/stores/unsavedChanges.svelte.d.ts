export type SaveCallback = () => Promise<boolean | void>;
export type ResetCallback = () => void;
export type UnsavedTrackFn = (category: string, action: string) => void;
export declare class UnsavedChangesStore {
    isDirty: boolean;
    pageLabel: string;
    ownerId: string;
    saving: boolean;
    private _onSave;
    private _onReset;
    private _onTrack;
    constructor(onTrack?: UnsavedTrackFn);
    setTracker(onTrack?: UnsavedTrackFn): void;
    register(opts: {
        id?: string;
        label: string;
        onSave: SaveCallback;
        onReset: ResetCallback;
    }): void;
    release(id: string): void;
    clear(): void;
    save(): Promise<boolean>;
    reset(): void;
    canNavigate(): boolean;
}
export declare function createUnsavedChangesStore(onTrack?: UnsavedTrackFn): UnsavedChangesStore;
export declare const unsavedChanges: UnsavedChangesStore;
