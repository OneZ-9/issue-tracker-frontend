import { post } from "../axiosClient";
import type { OtpPayload } from "@/validators/otp-validators";

class OTPService {
  static async requestOTP({ reqBody }: { reqBody: OtpPayload }) {
    const response = await post({ path: "/otp/send-otp", reqBody });
    return response;
  }
}

export default OTPService;
