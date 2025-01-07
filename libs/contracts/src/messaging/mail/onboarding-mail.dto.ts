
export class OnboardingMailDto {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  qr_code: string;
  unsubscribe_link?: string;
  bcc?: string;
}
