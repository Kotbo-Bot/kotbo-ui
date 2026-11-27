export type SaveCallback = () => Promise<boolean | void>;
export type ResetCallback = () => void;
export type UnsavedTrackFn = (category: string, action: string) => void;

export class UnsavedChangesStore {
  isDirty = $state(false);
  pageLabel = $state('');
  ownerId = $state('');
  saving = $state(false);

  private _onSave: SaveCallback | null = null;
  private _onReset: ResetCallback | null = null;
  private _onTrack: UnsavedTrackFn | undefined;

  constructor(onTrack?: UnsavedTrackFn) {
    this._onTrack = onTrack;
  }

  setTracker(onTrack?: UnsavedTrackFn) {
    this._onTrack = onTrack;
  }

  register(opts: {
    id?: string;
    label: string;
    onSave: SaveCallback;
    onReset: ResetCallback;
  }) {
    this.ownerId = opts.id ?? opts.label;
    this.pageLabel = opts.label;
    this._onSave = opts.onSave;
    this._onReset = opts.onReset;
    this.isDirty = true;
  }

  release(id: string) {
    if (this.ownerId === id) this.clear();
  }

  clear() {
    this.isDirty = false;
    this.saving = false;
    this.pageLabel = '';
    this.ownerId = '';
    this._onSave = null;
    this._onReset = null;
  }

  async save(): Promise<boolean> {
    if (!this._onSave) return false;
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
    } catch {
      this.saving = false;
      this._onTrack?.('unsaved_prompt', 'save_failed');
      return false;
    }
  }

  reset() {
    if (this.isDirty) this._onTrack?.('unsaved_prompt', 'discard');
    this._onReset?.();
    this.clear();
  }

  canNavigate(): boolean {
    return !this.isDirty;
  }
}

export function createUnsavedChangesStore(onTrack?: UnsavedTrackFn): UnsavedChangesStore {
  return new UnsavedChangesStore(onTrack);
}

export const unsavedChanges = new UnsavedChangesStore();
