export class UnsavedChangesStore {
    isDirty = $state(false);
    pageLabel = $state('');
    ownerId = $state('');
    saving = $state(false);
    _onSave = null;
    _onReset = null;
    _onTrack;
    constructor(onTrack) {
        this._onTrack = onTrack;
    }
    setTracker(onTrack) {
        this._onTrack = onTrack;
    }
    register(opts) {
        this.ownerId = opts.id ?? opts.label;
        this.pageLabel = opts.label;
        this._onSave = opts.onSave;
        this._onReset = opts.onReset;
        this.isDirty = true;
    }
    release(id) {
        if (this.ownerId === id)
            this.clear();
    }
    clear() {
        this.isDirty = false;
        this.saving = false;
        this.pageLabel = '';
        this.ownerId = '';
        this._onSave = null;
        this._onReset = null;
    }
    async save() {
        if (!this._onSave)
            return false;
        this.saving = true;
        try {
            const result = await this._onSave();
            if (result === false) {
                this.saving = false;
                this._onTrack?.('unsaved_prompt', 'save_failed');
                return false;
            }
            this.clear();
            this._onTrack?.('unsaved_prompt', 'save');
            return true;
        }
        catch {
            this.saving = false;
            this._onTrack?.('unsaved_prompt', 'save_failed');
            return false;
        }
    }
    reset() {
        if (this.isDirty)
            this._onTrack?.('unsaved_prompt', 'discard');
        this._onReset?.();
        this.clear();
    }
    canNavigate() {
        return !this.isDirty;
    }
}
export function createUnsavedChangesStore(onTrack) {
    return new UnsavedChangesStore(onTrack);
}
export const unsavedChanges = new UnsavedChangesStore();
