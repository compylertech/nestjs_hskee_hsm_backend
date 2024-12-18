export interface AuthDto {
  email: string;
  password: string;
}

export interface AuthSignInDto {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResultDto {
  accessToken: string;
  userId: string;
  email: string
  firstName: string;
  lastName: string;
}

export interface ResetPasswordDto {
  email: string;
}

export interface ChangePasswordDto {
  email: string;
  token: string;
  newPassword: string;
}

export interface VerifyEmailDto {
  email: string;
  token: string;
}


export interface MailActionDto {
  email: string;
  token: string;
}
