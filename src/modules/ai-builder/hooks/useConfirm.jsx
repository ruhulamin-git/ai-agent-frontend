import { useContext } from "react";

import { HIDE_CONFIRM, SHOW_CONFIRM } from "@/modules/ai-builder/store/actions";
import ConfirmContext from "@/modules/ai-builder/store/context/ConfirmContext";

let resolveCallback;
const useConfirm = () => {
  const [confirmState, dispatch] = useContext(ConfirmContext);

  const closeConfirm = () => {
    dispatch({
      type: HIDE_CONFIRM,
    });
  };

  const onConfirm = () => {
    closeConfirm();
    resolveCallback(true);
  };

  const onCancel = () => {
    closeConfirm();
    resolveCallback(false);
  };
  const confirm = (confirmPayload) => {
    dispatch({
      type: SHOW_CONFIRM,
      payload: confirmPayload,
    });
    return new Promise((res) => {
      resolveCallback = res;
    });
  };

  return { confirm, onConfirm, onCancel, confirmState };
};

export default useConfirm;
