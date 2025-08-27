export interface Credentials {
  email: string;
  confirmEmail?: string;
  password: string;
  confirmPassword?: string;
}

export interface CredentialsValidity {
  email: boolean;
  confirmEmail: boolean;
  password: boolean;
  confirmPassword: boolean;
}