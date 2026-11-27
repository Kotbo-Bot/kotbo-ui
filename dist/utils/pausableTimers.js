/**
 * Minuteries par identifiant qu'on peut suspendre (RGAA 13.1).
 */
export class PausableTimers {
    now;
    entries = new Map();
    constructor(now = Date.now) {
        this.now = now;
    }
    start(id, duration, callback) {
        this.clear(id);
        if (duration <= 0)
            return;
        const entry = { callback, remaining: duration, startedAt: 0, handle: null };
        this.entries.set(id, entry);
        this.run(id, entry);
    }
    pause(id) {
        const entry = this.entries.get(id);
        if (!entry?.handle)
            return;
        clearTimeout(entry.handle);
        entry.handle = null;
        entry.remaining = Math.max(0, entry.remaining - (this.now() - entry.startedAt));
    }
    resume(id) {
        const entry = this.entries.get(id);
        if (entry && !entry.handle)
            this.run(id, entry);
    }
    remaining(id) {
        return this.entries.get(id)?.remaining;
    }
    clear(id) {
        const entry = this.entries.get(id);
        if (entry?.handle)
            clearTimeout(entry.handle);
        this.entries.delete(id);
    }
    run(id, entry) {
        entry.startedAt = this.now();
        entry.handle = setTimeout(() => {
            this.entries.delete(id);
            entry.callback();
        }, entry.remaining);
    }
}
