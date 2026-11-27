import { type UnsavedChangesStore } from '../stores/unsavedChanges.svelte.js';
type $$ComponentProps = {
    store?: UnsavedChangesStore;
    visible?: boolean;
    title?: string;
    subtitle?: string;
    saving?: boolean;
    onSave?: () => void | Promise<unknown>;
    onReset?: () => void;
};
declare const UnsavedChangesBar: import("svelte").Component<$$ComponentProps, {}, "">;
type UnsavedChangesBar = ReturnType<typeof UnsavedChangesBar>;
export default UnsavedChangesBar;
