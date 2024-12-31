
export class ConfirmMailDto {
  first_name: string;
  last_name: string;
  user_email: string;
  verify_link: string;
  unsubscribe_link: string;
  bcc?: string;
}
