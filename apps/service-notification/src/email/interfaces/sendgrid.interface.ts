export interface SendGridConfirmPasswordLink {
  app_link: string;
}

export interface SendGridResetPassword {
  reset_link: string;
}

export interface SendGridTrialExpired {
  first_name: string;
  product_name: string;
  upgrade_link: string;
  features: string[];
}

export interface SendGridTrialExpiring {
  upgrade_link: string;
  features: string[];
}

export interface SendGridTrialStarted {
  trial_duration: string;
  premium_features_link: string;
  features: string[];
}

export interface SendGridInvitation {
  first_name: string;
  tenant_name: string;
  invitation_link: string;
  inviter_name: string;
}

export interface SendGridLaunch {
  first_name: string;
  product_name: string;
}

export interface SendGridWelcome {
  first_name: string;
  product_name: string;
  getstarted_link: string;
}

export interface SendGridActivation {
  name: string;
  code: string | number;
  link: string;
}
