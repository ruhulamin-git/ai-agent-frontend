import { useEffect, useState } from "react";
import { toast } from "sonner";

const useResendMail = <T>(
  email: string,
  mutateFn: (data: T, options?: { onSuccess?: () => void; onError?: () => void }) => void,
  valuesFormatter: (email: string) => T
) => {
  const [isCoolDownActive, setIsCoolDownActive] = useState(false);
  const [coolDown, setCoolDown] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const SECONDS_PER_MINUTE = 60;
  const PAD_LENGTH = 2;
  const COOLDOWN_TIME_SECONDS = 120;
  const MILLISECONDS_PER_SECOND = 1000;

  const formatTime: (seconds: number) => string = (seconds) => {
    const mins = Math.floor(seconds / SECONDS_PER_MINUTE);
    const secs = seconds % SECONDS_PER_MINUTE;
    return `${mins}:${secs.toString().padStart(PAD_LENGTH, "0")}`;
  };

  const handleResendEmail = () => {
    const values = valuesFormatter(email);

    setIsPending(true);
    mutateFn(values, {
      onSuccess: () => {
        const coolDownEnd = Date.now() + COOLDOWN_TIME_SECONDS * MILLISECONDS_PER_SECOND;

        toast.success("Password reset instructions has been resent to your email.");
        setCoolDown(COOLDOWN_TIME_SECONDS);
        setIsCoolDownActive(true);
        localStorage.setItem("resetEmailCoolDownEnd", coolDownEnd.toString());
        setIsPending(false);
      },
      onError: () => {
        setIsPending(false);
      },
    });
  };

  useEffect(() => {
    const storedCoolDownEnd = localStorage.getItem("resetEmailCoolDownEnd");

    if (storedCoolDownEnd) {
      const remainingTime = Math.max(
        0,
        Math.floor((parseInt(storedCoolDownEnd) - Date.now()) / MILLISECONDS_PER_SECOND)
      );

      if (remainingTime > 0) {
        setCoolDown(remainingTime);
        setIsCoolDownActive(true);
      } else {
        localStorage.removeItem("resetEmailCoolDownEnd");
      }
    }
  }, [email]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isCoolDownActive && coolDown > 0) {
      timer = setInterval(() => {
        setCoolDown((prevCoolDown) => {
          const newCoolDown = prevCoolDown - 1;
          if (newCoolDown <= 0) {
            clearInterval(timer);
            setIsCoolDownActive(false);
            localStorage.removeItem("resetEmailCoolDownEnd");
            return 0;
          }
          return newCoolDown;
        });
      }, MILLISECONDS_PER_SECOND);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCoolDownActive, coolDown]);

  return {
    coolDown,
    handleResendEmail,
    isLoading: isPending,
    isCoolDownActive,
    formatTime,
  };
};

export { useResendMail };
