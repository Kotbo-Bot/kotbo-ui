import { getMessages } from '../config.svelte.js';
import { PausableTimers } from '../utils/pausableTimers.js';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void | Promise<void>;
  };
  undoable?: boolean;
}

export interface UndoableOptions {
  commit: () => void | Promise<void>;
  onUndo?: () => void;
  onError?: (error: unknown) => void;
  quietError?: boolean;
  duration?: number;
}

interface PendingUndo extends UndoableOptions {
  resolve: (committed: boolean) => void;
}

const MAX_VISIBLE = 4;
const UNDO_DURATION = 6000;

class ToastStore {
  toasts = $state<Toast[]>([]);
  private timers = new PausableTimers();
  private pending = new Map<string, PendingUndo>();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('pagehide', () => {
        for (const id of [...this.pending.keys()]) this.remove(id);
      });
    }
  }

  undoable(message: string, options: UndoableOptions): Promise<boolean> {
    const id = crypto.randomUUID();
    const duration = options.duration ?? UNDO_DURATION;
    const msgs = getMessages();

    return new Promise<boolean>((resolve) => {
      this.pending.set(id, { ...options, resolve });
      this.toasts.push({
        id,
        message,
        type: 'success',
        duration,
        undoable: true,
        action: {
          label: msgs.toast_undo(),
          onClick: () => {
            const entry = this.pending.get(id);
            if (!entry) return;
            this.pending.delete(id);
            entry.onUndo?.();
            entry.resolve(false);
          },
        },
      });
      while (this.toasts.length > MAX_VISIBLE) {
        this.remove(this.toasts[0].id);
      }
      this.scheduleRemoval(id, duration);
    });
  }

  private async commitPending(id: string) {
    const entry = this.pending.get(id);
    if (!entry) return;
    this.pending.delete(id);
    try {
      await entry.commit();
      entry.resolve(true);
    } catch (error) {
      console.error('Undoable action failed:', error);
      entry.onError?.(error);
      if (!entry.quietError) this.error(getMessages().toast_undoable_failed());
      entry.resolve(false);
    }
  }

  add(
    message: string,
    type: ToastType = 'info',
    duration = 5000,
    action?: { label: string; onClick: () => void | Promise<void> },
  ) {
    const existing = this.toasts.find((entry) => entry.message === message && entry.type === type);
    if (existing) {
      this.scheduleRemoval(existing.id, duration);
      return;
    }

    const id = crypto.randomUUID();
    this.toasts.push({ id, message, type, duration, action });

    while (this.toasts.length > MAX_VISIBLE) {
      this.remove(this.toasts[0].id);
    }

    this.scheduleRemoval(id, duration);
  }

  private scheduleRemoval(id: string, duration: number) {
    this.timers.start(id, duration, () => this.remove(id));
  }

  pause(id: string) {
    this.timers.pause(id);
  }

  resume(id: string) {
    this.timers.resume(id);
  }

  success(message: string, duration?: number, action?: { label: string; onClick: () => void | Promise<void> }) {
    this.add(message, 'success', duration, action);
  }

  error(message: string, duration?: number, action?: { label: string; onClick: () => void | Promise<void> }) {
    this.add(message, 'error', duration, action);
  }

  info(message: string, duration?: number, action?: { label: string; onClick: () => void | Promise<void> }) {
    this.add(message, 'info', duration, action);
  }

  warning(message: string, duration?: number, action?: { label: string; onClick: () => void | Promise<void> }) {
    this.add(message, 'warning', duration, action);
  }

  remove(id: string) {
    this.timers.clear(id);
    this.toasts = this.toasts.filter((t) => t.id !== id);
    void this.commitPending(id);
  }
}

export const toast = new ToastStore();
