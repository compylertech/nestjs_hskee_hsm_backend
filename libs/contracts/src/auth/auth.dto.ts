export interface AuthDto {
    email: string;
    password: string;
}

export interface AuthSignInDto {
    userId: string;
    email: string;
}

export interface AuthResultDto {
    accessToken: string;
    userId: string;
    email: string;
}

export interface ResetPasswordDto {
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
  