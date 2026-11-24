

export interface FormatMessages {
  anx_unit_minutes: (params: { count: string }) => string;
  anx_unit_hours: (params: { count: string }) => string;
  anx_unit_seconds: (params: { count: string }) => string;
  anx_unit_hours_minutes: (params: { hours: string; minutes: string }) => string;
  anx_delta_new: () => string;
  anx_unit_points: (params: { value: string }) => string;
  anx_previous_period: (params: { value: string }) => string;
  anx_delta_vs_previous: () => string;
}