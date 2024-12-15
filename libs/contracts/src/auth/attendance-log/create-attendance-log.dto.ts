import { AttendanceLogType } from "@app/contracts";

export class CreateAttendanceLogDto {
  answer_type: AttendanceLogType;
  content: string;
}
