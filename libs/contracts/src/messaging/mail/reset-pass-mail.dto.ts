
export class ResetPasswordMailDto {
  first_name: string;
  last_name: string;
  user_email: string;
  reset_link: string;
  unsubscribe_link: string;
  bcc?: string;
}