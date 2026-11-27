import { getMessages } from '../config.svelte.js';
import { PausableTimers } from '../utils/pausableTimers.js';
const MAX_VISIBLE = 4;
const UNDO_DURATION = 6000;
class ToastStore {
    toasts = $state([]);
    timers = new PausableTimers();
    pending = new Map();
    constructor() {
        if (typeof window !== 'undefined') {
            window.addEventListener('pagehide', () => {
                for (const id of [...this.pending.keys()])
                    this.remove(id);
            });
        }
    }
    undoable(message, options) {
        const id = crypto.randomUUID();
        const duration = options.duration ?? UNDO_DURATION;
        const msgs = getMessages();
        return new Promise((resolve) => {
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
                        if (!entry)
                            return;
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
    async commitPending(id) {
        const entry = this.pending.get(id);
        if (!entry)
            return;
        this.pending.delete(id);
        try {
            await entry.commit();
            entry.resolve(true);
        }
        catch (error) {
            console.error('Undoable action failed:', error);
            entry.onError?.(error);
            if (!entry.quietError)
                this.error(getMessages().toast_undoable_failed());
            entry.resolve(false);
        }
    }
    add(message, type = 'info', duration = 5000, action) {
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
    scheduleRemoval(id, duration) {
        this.timers.start(id, duration, () => this.remove(id));
    }
    pause(id) {
        this.timers.pause(id);
    }
    resume(id) {
        this.timers.resume(id);
    }
    success(message, duration, action) {
        this.add(message, 'success', duration, action);
    }
    error(message, duration, action) {
        this.add(message, 'error', duration, action);
    }
    info(message, duration, action) {
        this.add(message, 'info', duration, action);
    }
    warning(message, duration, action) {
        this.add(message, 'warning', duration, action);
    }
    remove(id) {
        this.timers.clear(id);
        this.toasts = this.toasts.filter((t) => t.id !== id);
        void this.commitPending(id);
    }
}
export const toast = new ToastStore();
