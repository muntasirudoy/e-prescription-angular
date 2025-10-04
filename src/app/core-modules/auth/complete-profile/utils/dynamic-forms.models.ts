export interface DynamicOptions {
  label: string;
  value: string | number;
}
export interface DynamicControl<T = string> {
  controlType: 'input' | 'select' | 'radio' | 'checkbox' | 'date';
  type?: string;
  label: string;
  value: T | null;
  options?: DynamicOptions[];
}
export interface DynamicFormConfig {
  description: string;
  controls: {
    [key: string]: DynamicControl;
  };
}
