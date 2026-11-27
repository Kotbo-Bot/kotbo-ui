export interface KotboUiMessages {
  // Commun & modales
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

  // Toasts
  toast_undo: () => string;
  toast_undoable_failed: () => string;

  // Sélecteurs & formulaires
  select_search_placeholder: () => string;
  select_no_results: () => string;
  select_no_result_for: (p: { query: string }) => string;
  select_all_selected: () => string;
  select_remove_item: (p: { name: string }) => string;
  select_create: (p: { name: string }) => string;
  color_none: () => string;
  color_title: () => string;
  color_preview: () => string;
  color_hex: () => string;
  color_presets: () => string;

  // Barre modifications non enregistrées
  unsaved_title: () => string;
  unsaved_reset: () => string;
  unsaved_save: () => string;
  unsaved_saving: () => string;

  // Calendrier
  cal_today: () => string;
  cal_prev: () => string;
  cal_next: () => string;
  cal_all_day: () => string;
  cal_agenda_empty: () => string;
  cal_agenda_add: () => string;
  cal_more: (p: { n: number }) => string;

  // DashboardShell
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
  shell_account_menu: (p: { name: string }) => string;
  shell_account_options: () => string;
  shell_logout: () => string;

  // Analytics v3
  anx_unit_minutes: (p: { count: string }) => string;
  anx_unit_hours: (p: { count: string }) => string;
  anx_unit_seconds: (p: { count: string }) => string;
  anx_unit_hours_minutes: (p: { hours: string; minutes: string }) => string;
  anx_unit_points: (p: { value: string }) => string;
  anx_delta_new: () => string;
  anx_delta_vs_previous: () => string;
  anx_delta_title: () => string;
  anx_previous_period: (p: { value: string }) => string;
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
  anx_top_total: (p: { value: string }) => string;
  anx_top_see_all: () => string;
  anx_top_search: () => string;
  anx_top_export: () => string;
  anx_top_prev_page: () => string;
  anx_top_next_page: () => string;
  anx_cohort_week: () => string;
  anx_cohort_size: () => string;
  anx_cohort_average: () => string;
}

export const DEFAULT_MESSAGES: KotboUiMessages = {
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

export interface KotboUiConfig {
  locale: string | (() => string);
  messages: Partial<KotboUiMessages>;
  onNotify?: (message: string) => void;
}

const state: KotboUiConfig = {
  locale: 'fr-FR',
  messages: {},
  onNotify: undefined,
};

let notifySubscribers: (() => void) | undefined;
const subscribe = createSubscriber((update) => {
  notifySubscribers = update;
  return () => {
    notifySubscribers = undefined;
  };
});

export function configureKotboUi(config: Partial<KotboUiConfig>): void {
  if (config.locale !== undefined) state.locale = config.locale;
  if (config.messages !== undefined) state.messages = { ...state.messages, ...config.messages };
  if (config.onNotify !== undefined) state.onNotify = config.onNotify;
  notifySubscribers?.();
}

export function resetKotboUiConfig(): void {
  state.locale = 'fr-FR';
  state.messages = {};
  state.onNotify = undefined;
  notifySubscribers?.();
}

export function getKotboUiConfig() {
  subscribe();
  return state;
}

export function getLocale(): string {
  subscribe();
  return typeof state.locale === 'function' ? state.locale() : state.locale;
}

export function getMessages(overrides?: Partial<KotboUiMessages>): KotboUiMessages {
  subscribe();
  if (!overrides) {
    return { ...DEFAULT_MESSAGES, ...state.messages };
  }
  return { ...DEFAULT_MESSAGES, ...state.messages, ...overrides };
}

export function notifyUi(message: string, fallback?: (msg: string) => void): void {
  if (state.onNotify) {
    state.onNotify(message);
  } else {
    fallback?.(message);
  }
}
