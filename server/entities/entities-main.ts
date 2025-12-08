import { CourseraCertificate } from "./coursera_certificates.entity";
import { Skill } from "./skills.entity";
import { Repo } from "./repos.entity";
import { Admin } from "./admin.entity";
import { OtpCode } from "./otp_codes.entity";
import { RefreshToken } from "./refresh_tokens.entity";
import { TrustedDevice } from "./trusted_devices.entity";

export const ENTITIES = [
  CourseraCertificate,
  Skill,
  Repo,
  Admin,
  OtpCode,
  RefreshToken,
  TrustedDevice,
];
