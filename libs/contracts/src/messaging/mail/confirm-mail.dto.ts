
export class ConfirmMailDto {
  first_name: string;
  last_name: string;
  email: string;
  verify_link: string;
  unsubscribe_link?: string;
  bcc?: string;
}
