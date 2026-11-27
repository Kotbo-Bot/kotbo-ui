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
declare class ToastStore {
    toasts: Toast[];
    private timers;
    private pending;
    constructor();
    undoable(message: string, options: UndoableOptions): Promise<boolean>;
    private commitPending;
    add(message: string, type?: ToastType, duration?: number, action?: {
        label: string;
        onClick: () => void | Promise<void>;
    }): void;
    private scheduleRemoval;
    pause(id: string): void;
    resume(id: string): void;
    success(message: string, duration?: number, action?: {
        label: string;
        onClick: () => void | Promise<void>;
    }): void;
    error(message: string, duration?: number, action?: {
        label: string;
        onClick: () => void | Promise<void>;
    }): void;
    info(message: string, duration?: number, action?: {
        label: string;
        onClick: () => void | Promise<void>;
    }): void;
    warning(message: string, duration?: number, action?: {
        label: string;
        onClick: () => void | Promise<void>;
    }): void;
    remove(id: string): void;
}
export declare const toast: ToastStore;
export {};
