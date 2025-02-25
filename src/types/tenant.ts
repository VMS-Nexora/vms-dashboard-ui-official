export interface Tenant {
  tid: string;
  name: string;
  version: string;
}

export interface SubscriptionFeatures {
  face_recognition: boolean;
  real_time_alerts: boolean;
  multi_location_support: boolean;
  visitor_pre_registration: boolean;
  custom_branding: boolean;
}

export interface Subscription {
  plan: string;
  features: SubscriptionFeatures;
  valid_until: string;
}

export interface Settings {
  timezone: string;
  language: string;
  max_visitors_per_day: number;
  allow_guest_checkin: boolean;
  data_retention_days: number;
  // Extend settings as needed.
}

export interface TenantConfig {
  tenant: Tenant;
  subscription: Subscription;
  settings: Settings;
}
