export interface KotboUiMessages {
    common_close: () => string;
    common_cancel: () => string;
    common_confirm: () => string;
    common_apply: () => string;
    common_clear: () => string;
    common_refresh: () => string;
    common_error_generic: () => string;
    confirm_required: () => string;
    confirm_impacts_title: () => string;
    confirm_type_pre: () => string;
    confirm_type_post: () => string;
    toggle_aria_label: () => string;
    empty_default_title: () => string;
    toast_undo: () => string;
    toast_undoable_failed: () => string;
    select_search_placeholder: () => string;
    select_no_results: () => string;
    select_no_result_for: (p: {
        query: string;
    }) => string;
    select_all_selected: () => string;
    select_remove_item: (p: {
        name: string;
    }) => string;
    select_create: (p: {
        name: string;
    }) => string;
    color_none: () => string;
    color_title: () => string;
    color_preview: () => string;
    color_hex: () => string;
    color_presets: () => string;
    unsaved_title: () => string;
    unsaved_reset: () => string;
    unsaved_save: () => string;
    unsaved_saving: () => string;
    cal_today: () => string;
    cal_prev: () => string;
    cal_next: () => string;
    cal_all_day: () => string;
    cal_agenda_empty: () => string;
    cal_agenda_add: () => string;
    cal_more: (p: {
        n: number;
    }) => string;
    shell_skip_to_content: () => string;
    shell_main_nav: () => string;
    shell_mobile_nav: () => string;
    shell_breadcrumb: () => string;
    shell_collapse_sidebar: () => string;
    shell_expand_sidebar: () => string;
    shell_close_menu: () => string;
    shell_collapse_menu: () => string;
    shell_expand_menu: () => string;
    shell_open_menu: () => string;
    shell_resources: () => string;
    shell_theme: () => string;
    shell_theme_group: () => string;
    shell_theme_auto: () => string;
    shell_theme_light: () => string;
    shell_theme_dark: () => string;
    shell_account_menu: (p: {
        name: string;
    }) => string;
    shell_account_options: () => string;
    shell_logout: () => string;
    anx_unit_minutes: (p: {
        count: string;
    }) => string;
    anx_unit_hours: (p: {
        count: string;
    }) => string;
    anx_unit_seconds: (p: {
        count: string;
    }) => string;
    anx_unit_hours_minutes: (p: {
        hours: string;
        minutes: string;
    }) => string;
    anx_unit_points: (p: {
        value: string;
    }) => string;
    anx_delta_new: () => string;
    anx_delta_vs_previous: () => string;
    anx_delta_title: () => string;
    anx_previous_period: (p: {
        value: string;
    }) => string;
    anx_metrics_label: () => string;
    anx_view_label: () => string;
    anx_view_line: () => string;
    anx_view_bar: () => string;
    anx_view_table: () => string;
    anx_opt_smooth: () => string;
    anx_opt_previous: () => string;
    anx_opt_forecast: () => string;
    anx_forecast_unavailable: () => string;
    anx_table_period: () => string;
    anx_table_previous: () => string;
    anx_fact_total: () => string;
    anx_fact_average: () => string;
    anx_fact_peak: () => string;
    anx_fact_min: () => string;
    anx_fact_trend: () => string;
    anx_trend_vs_start: () => string;
    anx_trend_previous: () => string;
    anx_series_smoothed: () => string;
    anx_series_forecast: () => string;
    anx_chart_caption: () => string;
    anx_chart_label_col: () => string;
    anx_top_rank: () => string;
    anx_top_name: () => string;
    anx_top_value: () => string;
    anx_top_share: () => string;
    anx_top_empty: () => string;
    anx_top_unavailable: () => string;
    anx_top_total: (p: {
        value: string;
    }) => string;
    anx_top_see_all: () => string;
    anx_top_search: () => string;
    anx_top_export: () => string;
    anx_top_prev_page: () => string;
    anx_top_next_page: () => string;
    anx_cohort_week: () => string;
    anx_cohort_size: () => string;
    anx_cohort_average: () => string;
}
export declare const DEFAULT_MESSAGES: KotboUiMessages;
export interface KotboUiConfig {
    locale: string | (() => string);
    messages: Partial<KotboUiMessages>;
    onNotify?: (message: string) => void;
}
export declare function configureKotboUi(config: Partial<KotboUiConfig>): void;
export declare function resetKotboUiConfig(): void;
export declare function getKotboUiConfig(): KotboUiConfig;
export declare function getLocale(): string;
export declare function getMessages(overrides?: Partial<KotboUiMessages>): KotboUiMessages;
export declare function notifyUi(message: string, fallback?: (msg: string) => void): void;
