import { UserBaseDto } from "../users/user.dto";

export class AttendanceLogDto {
  attendance_log_id: string
  check_in_time: Date;
  check_out_time?: Date;
  user_id: UserBaseDto;
}
