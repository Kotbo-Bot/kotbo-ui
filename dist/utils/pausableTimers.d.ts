/**
 * Minuteries par identifiant qu'on peut suspendre (RGAA 13.1).
 */
export declare class PausableTimers {
    private now;
    private entries;
    constructor(now?: () => number);
    start(id: string, duration: number, callback: () => void): void;
    pause(id: string): void;
    resume(id: string): void;
    remaining(id: string): number | undefined;
    clear(id: string): void;
    private run;
}
