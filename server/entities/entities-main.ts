import { Certificate } from "./certificates.entity";
import { Skill } from "./skills.entity";
import { Projects } from "./projects.entity";
import { Admin } from "./admin.entity";
import { OtpCode } from "./otp_codes.entity";
import { RefreshToken } from "./refresh_tokens.entity";
import { TrustedDevice } from "./trusted_devices.entity";

export const ENTITIES = [
  Certificate,
  Skill,
  Projects,
  Admin,
  OtpCode,
  RefreshToken,
  TrustedDevice,
];
