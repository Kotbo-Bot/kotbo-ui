export declare const EVENT_TYPE_COLOR: Record<string, string>;
export type CalendarView = 'day' | 'twodays' | 'week' | 'month' | 'agenda';
export declare const CALENDAR_VIEWS: CalendarView[];
export declare const PHONE_VIEWS: CalendarView[];
export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end?: Date;
    type: string;
    color?: string;
    isAllDay?: boolean;
    staffName?: string;
    avatarUrl?: string;
    details?: string;
    raw?: unknown;
}
type $$ComponentProps = {
    view?: CalendarView;
    currentDate?: Date;
    events?: CalendarEvent[];
    selectedKey?: string | null;
    showWeekend?: 'auto' | 'always';
    onRangeChange: (start: Date, end: Date) => void;
    onEventClick: (event: CalendarEvent, anchor: DOMRect) => void;
    onSlotSelect: (start: Date, end: Date, anchor: DOMRect) => void;
    onEventMove?: (event: CalendarEvent, start: Date, end: Date) => void;
    canMove?: (event: CalendarEvent) => boolean;
    canResize?: (event: CalendarEvent) => boolean;
};
declare const Calendar: import("svelte").Component<$$ComponentProps, {}, "view" | "currentDate">;
type Calendar = ReturnType<typeof Calendar>;
export default Calendar;
