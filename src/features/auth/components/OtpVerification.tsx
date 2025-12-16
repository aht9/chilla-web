import { useRef } from "react";
import { clsx } from "clsx";

interface OtpVerificationProps {
  otp: string[];
  setOtp: (otp: string[]) => void;
  isLoading: boolean;
  onVerify: () => void;
  onBack: () => void;
}

export const OtpVerification = ({
  otp,
  setOtp,
  isLoading,
  onVerify,
  onBack,
}: OtpVerificationProps) => {
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between gap-3 mb-8" dir="ltr">
        {otp.map((data, index) => (
          <input
            key={index}
            ref={(el) => {
              otpInputRefs.current[index] = el;
            }}
            type="text"
            maxLength={1}
            value={data}
            onChange={(e) => handleOtpChange(e.target, index)}
            onKeyDown={(e) => handleOtpKeyDown(e, index)}
            onFocus={(e) => e.target.select()}
            className={clsx(
              "w-14 h-14 border-2 rounded-xl text-center text-2xl font-bold outline-none transition-all",
              data
                ? "border-black bg-white"
                : "border-gray-200 bg-gray-50 focus:border-gray-400"
            )}
          />
        ))}
      </div>

      <div className="text-center space-y-4">
        {isLoading ? (
          <div className="flex justify-center text-black font-medium items-center gap-2">
            <span className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
            در حال بررسی کد...
          </div>
        ) : (
          <button
            onClick={onVerify}
            className="w-full h-12 bg-black text-white rounded-xl font-medium hover:bg-gray-800"
          >
            تایید کد
          </button>
        )}

        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-black"
        >
          اصلاح شماره موبایل
        </button>
      </div>
    </div>
  );
};
