
export class OnboardingMailDto {
  first_name: string;
  last_name: string;
  user_email: string;
  phone_number: string;
  qr_code: string;
  unsubscribe_link: string;
  bcc?: string;
}
