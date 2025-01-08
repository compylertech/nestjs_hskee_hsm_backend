
export class WelcomeMailDto {
  first_name: string;
  last_name: string;
  email: string;
  user_id?: string;
  unsubscribe_link?: string;
  bcc?: string;
}
