<script lang="ts" module>
  export const EVENT_TYPE_COLOR: Record<string, string> = {
    meeting: 'var(--color-primary)',
    call: 'var(--color-success)',
    absence: 'var(--color-warning)',
    task: 'var(--color-tertiary)',
    server_event: '#0891b2',
    giveaway: '#db2777',
    schedule: '#64748b',
    testing_end: '#ea580c',
    sanction_end: '#be123c',
    voice: '#0d9488',
    coverage: 'var(--color-error)',
  };

  export type CalendarView = 'day' | 'twodays' | 'week' | 'month' | 'agenda';

  export const CALENDAR_VIEWS: CalendarView[] = ['day', 'week', 'month', 'agenda'];
  export const PHONE_VIEWS: CalendarView[] = ['day', 'twodays', 'agenda'];

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
</script>

<script lang="ts">
  import { onMount, tick, untrack } from 'svelte';
  import { layoutDay } from '../utils/calendarLayout.js';
  import { getLocale, getMessages } from '../config.svelte.js';
  import Papicon from '../icons/Papicon.svelte';

  let {
    view = $bindable<CalendarView>('week'),
    currentDate = $bindable(new Date()),
    events = [] as CalendarEvent[],
    selectedKey = null as string | null,
    showWeekend = 'auto' as 'auto' | 'always',
    onRangeChange,
    onEventClick,
    onSlotSelect,
    onEventMove = undefined,
    canMove = () => false,
    canResize = () => false,
  }: {
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
  } = $props();

  const msgs = $derived(getMessages());
  const locale = $derived(getLocale());

  const HOUR = 48;
  const DAY_HEIGHT = HOUR * 24;
  const WORK_START = 8;
  const WORK_END = 18;
  const SLOT = 30;

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const colorOf = (e: CalendarEvent) => e.color ?? EVENT_TYPE_COLOR[e.type] ?? 'var(--color-outline)';
  const keyOf = (e: CalendarEvent) => `${e.type}:${e.id}`;

  let timeGridEl = $state<HTMLElement | undefined>(undefined);
  let now = $state(new Date());

  function startOfDay(d: Date) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  function addDays(d: Date, n: number) {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  }

  function getMonday(d: Date) {
    const x = startOfDay(d);
    return addDays(x, -((x.getDay() + 6) % 7));
  }

  function isSameDay(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  const isToday = (d: Date) => isSameDay(d, now);
  const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

  const rangeDays = $derived.by((): Date[] => {
    if (view === 'day') return [startOfDay(currentDate)];
    if (view === 'twodays') return [startOfDay(currentDate), addDays(startOfDay(currentDate), 1)];
    if (view === 'week') return Array.from({ length: 7 }, (_, i) => addDays(getMonday(currentDate), i));
    const first = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    if (view === 'agenda') {
      const count = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      return Array.from({ length: count }, (_, i) => addDays(first, i));
    }
    return Array.from({ length: 42 }, (_, i) => addDays(getMonday(first), i));
  });

  const days = $derived(
    view === 'week' && showWeekend === 'auto'
      ? rangeDays.filter((d) => !isWeekend(d) || eventsOn(d).length > 0)
      : rangeDays,
  );

  const isTimeView = $derived(view === 'day' || view === 'twodays' || view === 'week');

  $effect(() => {
    const first = rangeDays[0];
    const last = rangeDays[rangeDays.length - 1];
    if (!first || !last) return;
    const end = new Date(last);
    end.setHours(23, 59, 59, 999);
    untrack(() => onRangeChange(first, end));
  });

  const title = $derived.by(() => {
    const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString(locale, o);
    if (view === 'day') {
      return capitalize(fmt(currentDate, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    }
    if (view === 'month' || view === 'agenda') {
      return capitalize(fmt(currentDate, { month: 'long', year: 'numeric' }));
    }
    const first = days[0];
    const last = days[days.length - 1];
    if (!first || !last) return '';
    if (first.getMonth() === last.getMonth()) {
      return `${first.getDate()} – ${last.getDate()} ${fmt(last, { month: 'long', year: 'numeric' })}`;
    }
    return `${fmt(first, { day: 'numeric', month: 'short' })} – ${fmt(last, { day: 'numeric', month: 'short', year: 'numeric' })}`;
  });

  function shift(direction: 1 | -1) {
    if (view === 'day') currentDate = addDays(currentDate, direction);
    else if (view === 'twodays') currentDate = addDays(currentDate, 2 * direction);
    else if (view === 'week') currentDate = addDays(currentDate, 7 * direction);
    else currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1);
  }

  function goToday() {
    currentDate = new Date();
    void tick().then(scrollToMorning);
  }

  function eventEnd(e: CalendarEvent) {
    return e.end ?? new Date(e.start.getTime() + 3600000);
  }

  function eventsOn(day: Date) {
    const from = startOfDay(day).getTime();
    const to = from + 86400000;
    return events.filter((e) => {
      const s = e.start.getTime();
      const end = Math.max(eventEnd(e).getTime(), s + 1);
      return s < to && end > from;
    });
  }

  const allDayByDay = $derived(days.map((d) => eventsOn(d).filter((e) => e.isAllDay)));

  const timedByDay = $derived(
    days.map((day) => {
      const from = startOfDay(day).getTime();
      const items = eventsOn(day)
        .filter((e) => !e.isAllDay)
        .map((e) => {
          const startMin = Math.max(0, (e.start.getTime() - from) / 60000);
          const endMin = Math.min(1440, (eventEnd(e).getTime() - from) / 60000);
          return {
            event: e,
            key: keyOf(e),
            start: startMin,
            end: Math.max(endMin, startMin + 20),
          };
        });
      const layout = layoutDay(items);
      return items.map((item) => ({ ...item, ...layout.get(item.key)! }));
    }),
  );

  const agendaDays = $derived(
    view === 'agenda'
      ? days
          .map((date) => ({
            date,
            events: eventsOn(date).sort(
              (a, b) => Number(!a.isAllDay) - Number(!b.isAllDay) || a.start.getTime() - b.start.getTime(),
            ),
          }))
          .filter((d) => d.events.length > 0)
      : [],
  );

  const formatTime = (d: Date) => d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  const isPast = (e: CalendarEvent) => eventEnd(e).getTime() < now.getTime();

  function getEventIcon(type: string) {
    switch (type) {
      case 'meeting': return 'calendar';
      case 'call': return 'phone';
      case 'absence': return 'sun';
      case 'task': return 'check-square';
      case 'server_event': return 'megaphone';
      case 'giveaway': return 'gift';
      case 'schedule': return 'send';
      default: return 'circle';
    }
  }

  function openEvent(event: CalendarEvent, target: EventTarget | null) {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    onEventClick(event, (target as HTMLElement).getBoundingClientRect());
  }

  const SNAP = 15;
  let drag = $state<{ key: string; event: CalendarEvent; day: number; start: number; end: number } | null>(null);
  let suppressClick = false;

  function startDrag(
    item: { event: CalendarEvent; key: string; start: number; end: number },
    dayIndex: number,
    e: PointerEvent,
    mode: 'move' | 'resize',
  ) {
    e.stopPropagation();
    if (e.pointerType !== 'mouse' || e.button !== 0 || !onEventMove) return;
    if (mode === 'move' ? !canMove(item.event) : !canResize(item.event)) return;
    e.preventDefault();
    const x0 = e.clientX;
    const y0 = e.clientY;
    const duration = item.end - item.start;
    let moved = false;

    const move = (ev: PointerEvent) => {
      if (!moved && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 4) return;
      moved = true;
      const delta = Math.round((((ev.clientY - y0) / HOUR) * 60) / SNAP) * SNAP;
      if (mode === 'resize') {
        drag = {
          key: item.key,
          event: item.event,
          day: dayIndex,
          start: item.start,
          end: Math.max(item.start + SNAP, Math.min(1440, item.end + delta)),
        };
        return;
      }
      const column = (document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement | null)?.closest<HTMLElement>(
        '[data-day-index]',
      );
      const day = column ? Number(column.dataset.dayIndex) : dayIndex;
      const start = Math.max(0, Math.min(1440 - duration, item.start + delta));
      drag = { key: item.key, event: item.event, day, start, end: start + duration };
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      const done = drag;
      drag = null;
      if (!moved || !done) return;
      suppressClick = true;
      onEventMove?.(done.event, slotDate(days[done.day], done.start), slotDate(days[done.day], done.end));
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  function handleSwipeStart(e: PointerEvent) {
    if (e.pointerType === 'mouse') return;
    const x0 = e.clientX;
    const y0 = e.clientY;
    const t0 = Date.now();
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointerup', up);
      const dx = ev.clientX - x0;
      const dy = ev.clientY - y0;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && Date.now() - t0 < 800) {
        shift(dx < 0 ? 1 : -1);
      }
    };
    window.addEventListener('pointerup', up);
  }

  let selection = $state<{ day: number; from: number; to: number } | null>(null);

  function minutesAt(column: HTMLElement, clientY: number) {
    const rect = column.getBoundingClientRect();
    return Math.min(1440 - SLOT, Math.max(0, Math.floor((((clientY - rect.top) / HOUR) * 60) / SLOT) * SLOT));
  }

  function slotDate(day: Date, minutes: number) {
    const d = startOfDay(day);
    d.setMinutes(minutes);
    return d;
  }

  function finishSelection(column: HTMLElement) {
    if (!selection) return;
    const from = Math.min(selection.from, selection.to);
    const to = Math.max(selection.from, selection.to) + SLOT;
    const rect = column.getBoundingClientRect();
    const anchor = new DOMRect(rect.left, rect.top + (from / 60) * HOUR, rect.width, ((to - from) / 60) * HOUR);
    onSlotSelect(slotDate(days[selection.day], from), slotDate(days[selection.day], to), anchor);
  }

  function handleColumnPointerDown(dayIndex: number, event: PointerEvent) {
    if (event.button !== 0) return;
    const column = event.currentTarget as HTMLElement;
    const start = minutesAt(column, event.clientY);
    selection = { day: dayIndex, from: start, to: start };

    if (event.pointerType !== 'mouse') {
      const x = event.clientX;
      const y = event.clientY;
      const up = (e: PointerEvent) => {
        window.removeEventListener('pointerup', up);
        if (Math.hypot(e.clientX - x, e.clientY - y) <= 10) finishSelection(column);
        selection = null;
      };
      window.addEventListener('pointerup', up);
      return;
    }

    event.preventDefault();
    const move = (e: PointerEvent) => {
      if (selection) selection = { ...selection, to: minutesAt(column, e.clientY) };
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      finishSelection(column);
      selection = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  function handleColumnKeydown(day: Date, event: KeyboardEvent) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    const start = slotDate(day, 9 * 60);
    onSlotSelect(start, new Date(start.getTime() + 3600000), (event.currentTarget as HTMLElement).getBoundingClientRect());
  }

  function selectAllDay(day: Date, target: EventTarget | null) {
    const start = slotDate(day, 9 * 60);
    onSlotSelect(start, new Date(start.getTime() + 3600000), (target as HTMLElement).getBoundingClientRect());
  }

  function openDay(day: Date) {
    currentDate = new Date(day);
    view = 'day';
  }

  function scrollToMorning() {
    if (!timeGridEl) return;
    const hour = isToday(currentDate) || days.some(isToday) ? Math.max(0, Math.min(now.getHours() - 2, 17)) : WORK_START;
    timeGridEl.scrollTop = Math.max(hour, 0) * HOUR;
  }

  $effect(() => {
    if (isTimeView) void tick().then(scrollToMorning);
  });

  const VIEW_KEYS: Record<string, CalendarView> = { d: 'day', w: 'week', m: 'month', a: 'agenda' };

  function handleShortcut(e: KeyboardEvent) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]')) return;
    if (document.querySelector('[role="dialog"]')) return;
    const key = e.key.toLowerCase();
    if (e.key === 'ArrowLeft') shift(-1);
    else if (e.key === 'ArrowRight') shift(1);
    else if (key === 't') goToday();
    else if (VIEW_KEYS[key]) view = VIEW_KEYS[key];
    else return;
    e.preventDefault();
  }

  onMount(() => {
    if (window.matchMedia('(max-width: 640px)').matches && !PHONE_VIEWS.includes(view)) view = 'day';
    const clock = setInterval(() => (now = new Date()), 60000);
    window.addEventListener('keydown', handleShortcut);
    return () => {
      clearInterval(clock);
      window.removeEventListener('keydown', handleShortcut);
    };
  });
</script>

{#snippet eventChip(event: CalendarEvent, compact: boolean)}
  <button
    type="button"
    class="cal-chip {selectedKey === keyOf(event) ? 'cal-chip--selected' : ''} {isPast(event) ? 'cal-chip--past' : ''}"
    style="--evt: {colorOf(event)}"
    onclick={(e) => {
      e.stopPropagation();
      openEvent(event, e.currentTarget);
    }}
    onpointerdown={(e) => e.stopPropagation()}
  >
    {#if !compact && !event.isAllDay}
      <span class="cal-chip__time">{formatTime(event.start)}</span>
    {/if}
    <span class="cal-chip__title">{event.title}</span>
  </button>
{/snippet}

<section class="cal" aria-label={title}>
  <div class="cal-nav">
    <button type="button" class="cal-nav__today" onclick={goToday} title="{msgs.cal_today()} (T)">
      {msgs.cal_today()}
    </button>
    <button type="button" class="cal-nav__arrow" onclick={() => shift(-1)} aria-label={msgs.cal_prev()} title="{msgs.cal_prev()} (←)">
      <Papicon icon="chevron-left" size={16} />
    </button>
    <button type="button" class="cal-nav__arrow" onclick={() => shift(1)} aria-label={msgs.cal_next()} title="{msgs.cal_next()} (→)">
      <Papicon icon="chevron-right" size={16} />
    </button>
    <h2 class="cal-nav__title">{title}</h2>
  </div>

  <div class="cal-body" onpointerdown={handleSwipeStart} role="presentation">
    {#if view === 'agenda'}
      <div class="cal-agenda">
        {#each agendaDays as day (day.date.getTime())}
          <section>
            <h3 class="cal-agenda__day {isToday(day.date) ? 'cal-agenda__day--today' : ''}">
              {capitalize(day.date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' }))}
              {#if isToday(day.date)}<span class="cal-agenda__today-tag">· {msgs.cal_today()}</span>{/if}
            </h3>
            <ul class="cal-agenda__list">
              {#each day.events as event (keyOf(event))}
                <li>
                  <button
                    type="button"
                    onclick={(e) => openEvent(event, e.currentTarget)}
                    style="--evt: {colorOf(event)}"
                    class="cal-agenda__row {isPast(event) ? 'cal-agenda__row--past' : ''}"
                  >
                    <span class="cal-agenda__time">
                      {event.isAllDay ? msgs.cal_all_day() : `${formatTime(event.start)} – ${formatTime(eventEnd(event))}`}
                    </span>
                    <span class="cal-bar"></span>
                    <span class="cal-agenda__info">
                      <span class="cal-agenda__title">{event.title}</span>
                      {#if event.staffName}
                        <span class="cal-agenda__staff">{event.staffName}</span>
                      {/if}
                    </span>
                    <span class="cal-agenda__icon"><Papicon icon={getEventIcon(event.type)} size={14} /></span>
                  </button>
                </li>
              {/each}
            </ul>
          </section>
        {:else}
          <div class="cal-agenda__empty">
            <span class="cal-agenda__empty-icon"><Papicon icon="calendar" size={28} /></span>
            <p class="cal-agenda__empty-text">{msgs.cal_agenda_empty()}</p>
            <button
              type="button"
              class="btn btn-tonal btn-sm"
              onclick={(e) => {
                const s = new Date(Date.now() + 3600000);
                onSlotSelect(s, new Date(s.getTime() + 3600000), e.currentTarget.getBoundingClientRect());
              }}
            >
              {msgs.cal_agenda_add()}
            </button>
          </div>
        {/each}
      </div>
    {:else if view === 'month'}
      <div class="cal-month-head">
        {#each days.slice(0, 7) as d (d.getTime())}
          <div class="cal-month-head__cell">
            {capitalize(d.toLocaleDateString(locale, { weekday: 'long' }))}
          </div>
        {/each}
      </div>
      <div class="cal-month-grid">
        {#each days as day, i (day.getTime())}
          {@const dayEvents = eventsOn(day).sort((a, b) => Number(!a.isAllDay) - Number(!b.isAllDay) || a.start.getTime() - b.start.getTime())}
          <div
            class="cal-month-cell {day.getMonth() !== currentDate.getMonth() ? 'cal-month-cell--out' : ''} {isWeekend(day) ? 'cal-off' : ''}"
            role="button"
            tabindex="0"
            aria-label={day.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}
            onclick={(e) => selectAllDay(day, e.currentTarget)}
            onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), selectAllDay(day, e.currentTarget))}
          >
            <button
              type="button"
              class="cal-month-day {isToday(day) ? 'cal-month-day--today' : ''}"
              onclick={(e) => {
                e.stopPropagation();
                openDay(day);
              }}
            >
              {day.getDate() === 1 || i === 0 ? day.toLocaleDateString(locale, { day: 'numeric', month: 'short' }) : day.getDate()}
            </button>
            <div class="cal-month-events">
              {#each dayEvents.slice(0, 3) as event (keyOf(event))}
                {@render eventChip(event, false)}
              {/each}
              {#if dayEvents.length > 3}
                <button
                  type="button"
                  class="cal-more"
                  onclick={(e) => {
                    e.stopPropagation();
                    openDay(day);
                  }}
                >
                  {msgs.cal_more({ n: dayEvents.length - 3 })}
                </button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="cal-row cal-row--head" style="--cols: {days.length}">
        <div></div>
        {#each days as day (day.getTime())}
          <button type="button" class="cal-day-head {isToday(day) ? 'cal-day-head--today' : ''}" onclick={() => openDay(day)}>
            <span class="cal-day-head__num">{day.getDate()}</span>
            <span class="cal-day-head__name">{day.toLocaleDateString(locale, { weekday: view === 'day' ? 'long' : 'short' })}</span>
          </button>
        {/each}
      </div>

      <div class="cal-row cal-row--head" style="--cols: {days.length}">
        <div class="cal-gutter-label">{msgs.cal_all_day()}</div>
        {#each days as day, i (day.getTime())}
          <div class="cal-allday" role="button" tabindex="-1" onclick={(e) => selectAllDay(day, e.currentTarget)} onkeydown={() => {}}>
            {#each allDayByDay[i].slice(0, 3) as event (keyOf(event))}
              {@render eventChip(event, true)}
            {/each}
            {#if allDayByDay[i].length > 3}
              <button
                type="button"
                class="cal-more"
                onclick={(e) => {
                  e.stopPropagation();
                  openDay(day);
                }}
              >
                {msgs.cal_more({ n: allDayByDay[i].length - 3 })}
              </button>
            {/if}
          </div>
        {/each}
      </div>

      <div bind:this={timeGridEl} class="cal-time-scroll">
        <div class="cal-row cal-row--relative" style="--cols: {days.length}; height: {DAY_HEIGHT}px">
          <div class="cal-hours-gutter">
            {#each hours as hour (hour)}
              {#if hour > 0}
                <span class="cal-hour" style="top: {hour * HOUR}px">{String(hour).padStart(2, '0')}:00</span>
              {/if}
            {/each}
          </div>

          {#each days as day, i (day.getTime())}
            <div
              class="cal-col"
              data-day-index={i}
              role="button"
              tabindex="0"
              aria-label={day.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}
              onpointerdown={(e) => handleColumnPointerDown(i, e)}
              onkeydown={(e) => handleColumnKeydown(day, e)}
            >
              {#each hours as hour (hour)}
                <div class="cal-hour-cell {isWeekend(day) || hour < WORK_START || hour >= WORK_END ? 'cal-off' : ''}"></div>
              {/each}

              {#if selection && selection.day === i}
                {@const from = Math.min(selection.from, selection.to)}
                {@const to = Math.max(selection.from, selection.to) + SLOT}
                <div class="cal-selection" style="top: {(from / 60) * HOUR}px; height: {((to - from) / 60) * HOUR}px">
                  {formatTime(slotDate(day, from))} – {formatTime(slotDate(day, to))}
                </div>
              {/if}

              {#each timedByDay[i] as item (item.key)}
                {@const height = ((item.end - item.start) / 60) * HOUR}
                <button
                  type="button"
                  class="cal-event {selectedKey === item.key ? 'cal-event--selected' : ''} {isPast(item.event) ? 'cal-event--past' : ''} {drag?.key === item.key ? 'cal-event--dragging' : ''} {canMove(item.event) ? 'cal-event--movable' : ''}"
                  style="--evt: {colorOf(item.event)}; top: {(item.start / 60) * HOUR}px; height: {height - 2}px; left: calc({(item.col / item.cols) * 100}% + 1px); width: calc({100 / item.cols}% - 4px);"
                  onclick={(e) => {
                    e.stopPropagation();
                    openEvent(item.event, e.currentTarget);
                  }}
                  onpointerdown={(e) => startDrag(item, i, e, 'move')}
                >
                  <span class="cal-event__title">{item.event.title}</span>
                  {#if height >= 36}
                    <span class="cal-event__meta">{formatTime(item.event.start)} – {formatTime(eventEnd(item.event))}</span>
                  {/if}
                  {#if height >= 56 && item.event.staffName}
                    <span class="cal-event__meta">{item.event.staffName}</span>
                  {/if}
                  {#if canResize(item.event)}
                    <span class="cal-event__resize" aria-hidden="true" onpointerdown={(e) => startDrag(item, i, e, 'resize')}></span>
                  {/if}
                </button>
              {/each}

              {#if drag && drag.day === i}
                <div
                  class="cal-event cal-event--ghost"
                  style="--evt: {colorOf(drag.event)}; top: {(drag.start / 60) * HOUR}px; height: {((drag.end - drag.start) / 60) * HOUR - 2}px; left: 1px; width: calc(100% - 4px);"
                  aria-hidden="true"
                >
                  <span class="cal-event__title">{drag.event.title}</span>
                  <span class="cal-event__meta">{formatTime(slotDate(day, drag.start))} – {formatTime(slotDate(day, drag.end))}</span>
                </div>
              {/if}

              {#if isToday(day)}
                <div class="cal-now" style="top: {((now.getHours() * 60 + now.getMinutes()) / 60) * HOUR}px" aria-hidden="true"></div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  .cal {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  .cal-nav {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--color-outline-variant, var(--outline-variant));
    flex-shrink: 0;
  }

  .cal-nav__today {
    padding: 0.3125rem 0.875rem;
    border-radius: 999px;
    border: 1px solid var(--color-outline-variant, var(--outline-variant));
    background: var(--color-surface-container-low, var(--surface-container-low));
    font-family: inherit;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-on-surface, var(--on-surface));
    cursor: pointer;
    transition: background-color 150ms ease, border-color 150ms ease;
  }

  .cal-nav__today:hover,
  .cal-nav__arrow:hover {
    background: var(--color-surface-container, var(--surface-container));
  }

  .cal-nav__arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
    cursor: pointer;
    transition: background-color 150ms ease, color 150ms ease;
  }

  .cal-nav__title {
    margin: 0 0 0 0.5rem;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-on-surface, var(--on-surface));
  }

  .cal-body {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    touch-action: pan-y;
  }

  .cal-agenda {
    flex: 1;
    overflow-y: auto;
  }

  .cal-agenda__day {
    position: sticky;
    top: 0;
    z-index: 10;
    margin: 0;
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
    font-weight: 600;
    background: var(--color-surface-container-low, var(--surface-container-low));
    border-bottom: 1px solid var(--color-outline-variant, var(--outline-variant));
    color: var(--color-on-surface, var(--on-surface));
  }

  .cal-agenda__day--today {
    color: var(--color-primary, var(--primary-color));
  }

  .cal-agenda__today-tag {
    margin-left: 0.25rem;
    font-size: 0.6875rem;
    font-weight: 500;
  }

  .cal-agenda__list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .cal-agenda__row {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 1rem;
    border: 0;
    background: transparent;
    text-align: left;
    cursor: pointer;
    transition: background-color 120ms ease;
  }

  .cal-agenda__row:hover {
    background: var(--color-surface-container, var(--surface-container));
  }

  .cal-agenda__row--past {
    opacity: 0.6;
  }

  .cal-agenda__time {
    width: 7rem;
    flex-shrink: 0;
    font-size: 0.6875rem;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .cal-agenda__info {
    min-width: 0;
    flex: 1;
  }

  .cal-agenda__title {
    display: block;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-on-surface, var(--on-surface));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cal-agenda__staff {
    display: block;
    font-size: 0.6875rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cal-agenda__icon {
    display: inline-flex;
    flex-shrink: 0;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .cal-agenda__empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 2rem;
    text-align: center;
  }

  .cal-agenda__empty-icon {
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .cal-agenda__empty-text {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .cal-month-head {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    border-bottom: 1px solid var(--color-outline-variant, var(--outline-variant));
    flex-shrink: 0;
  }

  .cal-month-head__cell {
    padding: 0.375rem 0.5rem;
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .cal-month-grid {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    grid-template-rows: repeat(6, minmax(0, 1fr));
  }

  .cal-month-events {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }

  .cal-row {
    display: grid;
    grid-template-columns: 3.5rem repeat(var(--cols), minmax(0, 1fr));
  }

  .cal-row--head {
    border-bottom: 1px solid var(--color-outline-variant, var(--outline-variant));
    flex-shrink: 0;
  }

  .cal-row--relative {
    position: relative;
  }

  .cal-time-scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  .cal-hours-gutter {
    position: relative;
  }

  .cal-day-head {
    display: flex;
    align-items: baseline;
    gap: 0.375rem;
    padding: 0.5rem 0.625rem;
    border: 0;
    border-left: 1px solid var(--color-outline-variant, var(--outline-variant));
    background: transparent;
    text-align: left;
    color: var(--color-on-surface, var(--on-surface));
    position: relative;
    cursor: pointer;
  }

  .cal-day-head:hover {
    background: var(--color-surface-container, var(--surface-container));
  }

  .cal-day-head__num {
    font-size: 1.375rem;
    font-weight: 600;
    line-height: 1;
  }

  .cal-day-head__name {
    font-size: 0.8125rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .cal-day-head--today,
  .cal-day-head--today .cal-day-head__name {
    color: var(--color-primary, var(--primary-color));
  }

  .cal-day-head--today::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 3px;
    background: var(--color-primary, var(--primary-color));
  }

  .cal-gutter-label {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 0.375rem 0.5rem 0 0;
    font-size: 0.6875rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .cal-allday {
    min-height: 2rem;
    padding: 0.125rem;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    border-left: 1px solid var(--color-outline-variant, var(--outline-variant));
    min-width: 0;
    cursor: pointer;
  }

  .cal-hour {
    position: absolute;
    right: 0.5rem;
    transform: translateY(-50%);
    font-size: 0.6875rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
    font-variant-numeric: tabular-nums;
  }

  .cal-col {
    position: relative;
    border-left: 1px solid var(--color-outline-variant, var(--outline-variant));
    cursor: default;
    user-select: none;
    touch-action: pan-y;
  }

  .cal-hour-cell {
    height: 48px;
    border-bottom: 1px solid color-mix(in srgb, var(--color-outline-variant, var(--outline-variant)) 70%, transparent);
    background-image: linear-gradient(
      to bottom,
      transparent 23.5px,
      color-mix(in srgb, var(--color-outline-variant, var(--outline-variant)) 35%, transparent) 23.5px,
      transparent 24.5px
    );
  }

  .cal-off {
    background-color: color-mix(in srgb, var(--color-surface-container, var(--surface-container)) 55%, transparent);
  }

  .cal-selection {
    position: absolute;
    left: 2px;
    right: 2px;
    z-index: 2;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    background: color-mix(in srgb, var(--color-primary, var(--primary-color)) 18%, transparent);
    border: 1px solid var(--color-primary, var(--primary-color));
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--color-primary, var(--primary-color));
    pointer-events: none;
  }

  .cal-event {
    position: absolute;
    z-index: 3;
    display: flex;
    flex-direction: column;
    gap: 0.0625rem;
    overflow: hidden;
    padding: 0.1875rem 0.375rem 0.1875rem 0.5rem;
    border: 0;
    border-radius: 0.25rem;
    border-left: 3px solid var(--evt);
    background: color-mix(in srgb, var(--evt) 18%, var(--color-surface-container-lowest, var(--surface-container-lowest)));
    text-align: left;
    color: var(--color-on-surface, var(--on-surface));
    cursor: pointer;
    transition: background-color 0.12s ease, box-shadow 0.12s ease;
  }

  .cal-event:hover {
    background: color-mix(in srgb, var(--evt) 28%, var(--color-surface-container-lowest, var(--surface-container-lowest)));
    z-index: 4;
  }

  .cal-event--selected {
    background: var(--evt);
    color: var(--color-on-primary, var(--on-primary-color));
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.25);
    z-index: 5;
  }

  .cal-event--selected .cal-event__meta {
    color: inherit;
  }

  .cal-event--past { opacity: 0.6; }
  .cal-event--movable { cursor: grab; }
  .cal-event--dragging { opacity: 0.35; }
  .cal-event--ghost {
    z-index: 7;
    pointer-events: none;
    box-shadow: 0 6px 16px rgb(0 0 0 / 0.3);
    outline: 2px solid var(--evt);
  }

  .cal-event__resize {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 6px;
    cursor: ns-resize;
  }

  .cal-event__title {
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cal-event__meta {
    font-size: 0.6875rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cal-now {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 6;
    height: 2px;
    background: var(--color-error, var(--error-color));
    pointer-events: none;
  }

  .cal-now::before {
    content: '';
    position: absolute;
    left: -5px;
    top: -4px;
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: var(--color-error, var(--error-color));
  }

  .cal-chip {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    min-width: 0;
    padding: 0.0625rem 0.375rem;
    border: 0;
    border-radius: 0.25rem;
    border-left: 3px solid var(--evt);
    background: color-mix(in srgb, var(--evt) 16%, var(--color-surface-container-lowest, var(--surface-container-lowest)));
    font-size: 0.6875rem;
    text-align: left;
    color: var(--color-on-surface, var(--on-surface));
    cursor: pointer;
  }

  .cal-chip:hover {
    background: color-mix(in srgb, var(--evt) 26%, var(--color-surface-container-lowest, var(--surface-container-lowest)));
  }

  .cal-chip--selected {
    background: var(--evt);
    color: var(--color-on-primary, var(--on-primary-color));
  }

  .cal-chip--past { opacity: 0.6; }
  .cal-chip__time { flex-shrink: 0; font-variant-numeric: tabular-nums; opacity: 0.8; }
  .cal-chip__title {
    min-width: 0;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cal-more {
    padding: 0 0.375rem;
    border: 0;
    background: transparent;
    font-size: 0.6875rem;
    font-weight: 600;
    text-align: left;
    color: var(--color-primary, var(--primary-color));
    cursor: pointer;
  }

  .cal-more:hover { text-decoration: underline; }

  .cal-month-cell {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    padding: 0.25rem;
    border-left: 1px solid var(--color-outline-variant, var(--outline-variant));
    border-bottom: 1px solid var(--color-outline-variant, var(--outline-variant));
    cursor: pointer;
  }

  .cal-month-cell:hover {
    background-color: var(--color-surface-container, var(--surface-container));
  }

  .cal-month-cell--out .cal-month-day {
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .cal-month-day {
    align-self: flex-start;
    min-width: 1.5rem;
    height: 1.5rem;
    padding: 0 0.375rem;
    border: 0;
    border-radius: 999px;
    background: transparent;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-on-surface, var(--on-surface));
    cursor: pointer;
  }

  .cal-month-day:hover {
    background: var(--color-surface-container-high, var(--surface-container-high));
  }

  .cal-month-day--today {
    background: var(--color-primary, var(--primary-color));
    color: var(--color-on-primary, var(--on-primary-color));
  }

  .cal-month-day--today:hover {
    background: var(--color-primary, var(--primary-color));
  }

  .cal-bar {
    width: 3px;
    align-self: stretch;
    border-radius: 2px;
    background: var(--evt);
  }
</style>
