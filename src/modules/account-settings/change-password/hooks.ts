import { toast } from "sonner";

import { useChangePassword } from "@/services/account-settings";

import type { ChangePasswordDTO } from "../types";
import type { FormikHelpers } from "formik";

const useChangeUserPassword = () => {
  const { mutate, isPending } = useChangePassword();

  const handleChangePassword = (
    values: ChangePasswordDTO,
    formik: FormikHelpers<ChangePasswordDTO>
  ) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Password has been successfully updated.");
        formik.resetForm();
      },
    });
  };

  return { handleChangePassword, isPending };
};

export { useChangeUserPassword };
