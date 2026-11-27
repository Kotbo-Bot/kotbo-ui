export const DEFAULT_MESSAGES = {
    common_close: () => 'Fermer',
    common_cancel: () => 'Annuler',
    common_confirm: () => 'Confirmer',
    common_apply: () => 'Appliquer',
    common_clear: () => 'Effacer',
    common_refresh: () => 'Actualiser',
    common_error_generic: () => 'Une erreur est survenue.',
    confirm_required: () => 'Confirmation requise',
    confirm_impacts_title: () => 'Conséquences de cette action',
    confirm_type_pre: () => 'Saisis',
    confirm_type_post: () => 'pour confirmer',
    toggle_aria_label: () => 'Activer ou désactiver',
    empty_default_title: () => 'Aucun élément',
    toast_undo: () => 'Annuler',
    toast_undoable_failed: () => "L'action a échoué.",
    select_search_placeholder: () => 'Rechercher…',
    select_no_results: () => 'Aucun résultat',
    select_no_result_for: ({ query }) => `Aucun résultat pour « ${query} »`,
    select_all_selected: () => 'Tout est sélectionné',
    select_remove_item: ({ name }) => `Retirer ${name}`,
    select_create: ({ name }) => `Créer « ${name} »`,
    color_none: () => 'Aucune',
    color_title: () => 'Choisir une couleur',
    color_preview: () => 'Aperçu',
    color_hex: () => 'Code hexadécimal',
    color_presets: () => 'Palette rapide',
    unsaved_title: () => 'Modifications non enregistrées',
    unsaved_reset: () => 'Réinitialiser',
    unsaved_save: () => 'Enregistrer',
    unsaved_saving: () => 'Enregistrement…',
    cal_today: () => "Aujourd'hui",
    cal_prev: () => 'Période précédente',
    cal_next: () => 'Période suivante',
    cal_all_day: () => 'Journée',
    cal_agenda_empty: () => 'Aucun événement sur cette période.',
    cal_agenda_add: () => 'Ajouter un événement',
    cal_more: ({ n }) => `+ ${n} de plus`,
    shell_skip_to_content: () => 'Aller au contenu principal',
    shell_main_nav: () => 'Navigation principale',
    shell_mobile_nav: () => 'Navigation mobile',
    shell_breadcrumb: () => "Fil d'Ariane",
    shell_collapse_sidebar: () => 'Replier la barre latérale',
    shell_expand_sidebar: () => 'Déplier la barre latérale',
    shell_close_menu: () => 'Fermer le menu',
    shell_collapse_menu: () => 'Replier le menu',
    shell_expand_menu: () => 'Déplier le menu',
    shell_open_menu: () => 'Menu',
    shell_resources: () => 'Ressources',
    shell_theme: () => 'Thème',
    shell_theme_group: () => "Thème d'affichage",
    shell_theme_auto: () => 'Auto',
    shell_theme_light: () => 'Clair',
    shell_theme_dark: () => 'Sombre',
    shell_account_menu: ({ name }) => `Menu du compte ${name}`,
    shell_account_options: () => 'Options du compte',
    shell_logout: () => 'Déconnexion',
    anx_unit_minutes: ({ count }) => `${count} min`,
    anx_unit_hours: ({ count }) => `${count} h`,
    anx_unit_seconds: ({ count }) => `${count} s`,
    anx_unit_hours_minutes: ({ hours, minutes }) => `${hours} h ${minutes}`,
    anx_unit_points: ({ value }) => `${value} pts`,
    anx_delta_new: () => 'nouveau',
    anx_delta_vs_previous: () => "vs période d'avant",
    anx_delta_title: () => 'Écart avec la période précédente',
    anx_previous_period: ({ value }) => `Période précédente : ${value}`,
    anx_metrics_label: () => 'Mesures clés',
    anx_view_label: () => "Mode d'affichage",
    anx_view_line: () => 'Courbe',
    anx_view_bar: () => 'Barres',
    anx_view_table: () => 'Tableau',
    anx_opt_smooth: () => 'Lissage',
    anx_opt_previous: () => 'Période précédente',
    anx_opt_forecast: () => 'Prévision',
    anx_forecast_unavailable: () => 'Prévision indisponible sur cette période',
    anx_table_period: () => 'Période',
    anx_table_previous: () => 'Période préc.',
    anx_fact_total: () => 'Total',
    anx_fact_average: () => 'Moyenne',
    anx_fact_peak: () => 'Pic',
    anx_fact_min: () => 'Minimum',
    anx_fact_trend: () => 'Tendance',
    anx_trend_vs_start: () => 'vs début',
    anx_trend_previous: () => 'Période précédente',
    anx_series_smoothed: () => 'Moyenne mobile',
    anx_series_forecast: () => 'Prévision',
    anx_chart_caption: () => 'Données du graphique',
    anx_chart_label_col: () => 'Période',
    anx_top_rank: () => 'Rang',
    anx_top_name: () => 'Nom',
    anx_top_value: () => 'Valeur',
    anx_top_share: () => 'Part (%)',
    anx_top_empty: () => 'Aucune donnée pour cette période.',
    anx_top_unavailable: () => 'Classement indisponible sur ce filtre.',
    anx_top_total: ({ value }) => `Total : ${value}`,
    anx_top_see_all: () => 'Tout voir',
    anx_top_search: () => 'Rechercher…',
    anx_top_export: () => 'Exporter',
    anx_top_prev_page: () => 'Précédent',
    anx_top_next_page: () => 'Suivant',
    anx_cohort_week: () => 'Cohorte',
    anx_cohort_size: () => 'Effectif',
    anx_cohort_average: () => 'Moyenne',
};
import { createSubscriber } from 'svelte/reactivity';
const state = {
    locale: 'fr-FR',
    messages: {},
    onNotify: undefined,
};
let notifySubscribers;
const subscribe = createSubscriber((update) => {
    notifySubscribers = update;
    return () => {
        notifySubscribers = undefined;
    };
});
export function configureKotboUi(config) {
    if (config.locale !== undefined)
        state.locale = config.locale;
    if (config.messages !== undefined)
        state.messages = { ...state.messages, ...config.messages };
    if (config.onNotify !== undefined)
        state.onNotify = config.onNotify;
    notifySubscribers?.();
}
export function resetKotboUiConfig() {
    state.locale = 'fr-FR';
    state.messages = {};
    state.onNotify = undefined;
    notifySubscribers?.();
}
export function getKotboUiConfig() {
    subscribe();
    return state;
}
export function getLocale() {
    subscribe();
    return typeof state.locale === 'function' ? state.locale() : state.locale;
}
export function getMessages(overrides) {
    subscribe();
    if (!overrides) {
        return { ...DEFAULT_MESSAGES, ...state.messages };
    }
    return { ...DEFAULT_MESSAGES, ...state.messages, ...overrides };
}
export function notifyUi(message, fallback) {
    if (state.onNotify) {
        state.onNotify(message);
    }
    else {
        fallback?.(message);
    }
}
