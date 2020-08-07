export class FeatureEmbed {
  name: string;

  normalizedName?: string;

  description?: string;

  unit?: string;

  min?: number;

  max?: number;

  active?: boolean;

  full?: boolean;
}

export enum ActionStatusType {
  SUCCESS,
  FAILED,
}
