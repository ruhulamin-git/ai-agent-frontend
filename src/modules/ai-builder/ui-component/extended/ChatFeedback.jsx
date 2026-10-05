// material-ui
import { Box, Button, Stack } from "@mui/material";
import { IconX } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// API
import chatflowsApi from "@/modules/ai-builder/api/chatflows";
// store
import {
  closeSnackbar as closeSnackbarAction,
  enqueueSnackbar as enqueueSnackbarAction,
  SET_CHATFLOW,
} from "@/modules/ai-builder/store/actions";
// Project import
import { StyledButton } from "@/modules/ai-builder/ui-component/button/StyledButton";
import { SwitchInput } from "@/modules/ai-builder/ui-component/switch/Switch";
import useNotifier from "@/modules/ai-builder/utils/useNotifier";

const ChatFeedback = ({ dialogProps, onConfirm }) => {
  const dispatch = useDispatch();

  useNotifier();

  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
  const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args));

  const [chatFeedbackStatus, setChatFeedbackStatus] = useState(false);
  const [chatbotConfig, setChatbotConfig] = useState({});

  const handleChange = (value) => {
    setChatFeedbackStatus(value);
  };

  const onSave = async () => {
    try {
      const value = {
        chatFeedback: {
          status: chatFeedbackStatus,
        },
      };
      chatbotConfig.chatFeedback = value.chatFeedback;
      const saveResp = await chatflowsApi.updateChatflow(dialogProps.chatflow.id, {
        chatbotConfig: JSON.stringify(chatbotConfig),
      });
      if (saveResp.data) {
        enqueueSnackbar({
          message: "Chat Feedback Settings Saved",
          options: {
            key: new Date().getTime() + Math.random(),
            variant: "success",
            action: (key) => (
              <Button style={{ color: "white" }} onClick={() => closeSnackbar(key)}>
                <IconX />
              </Button>
            ),
          },
        });
        dispatch({ type: SET_CHATFLOW, chatflow: saveResp.data });
        onConfirm?.();
      }
    } catch (error) {
      enqueueSnackbar({
        message: `Failed to save Chat Feedback Settings: ${
          typeof error.response.data === "object"
            ? error.response.data.message
            : error.response.data
        }`,
        options: {
          key: new Date().getTime() + Math.random(),
          variant: "error",
          persist: true,
          action: (key) => (
            <Button style={{ color: "white" }} onClick={() => closeSnackbar(key)}>
              <IconX />
            </Button>
          ),
        },
      });
    }
  };

  useEffect(() => {
    if (dialogProps.chatflow?.chatbotConfig) {
      const chatbotConfig = JSON.parse(dialogProps.chatflow.chatbotConfig);
      setChatbotConfig(chatbotConfig || {});
      if (chatbotConfig.chatFeedback) {
        setChatFeedbackStatus(chatbotConfig.chatFeedback.status);
      }
    }

    return () => {};
  }, [dialogProps]);

  return (
    <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
      <SwitchInput
        label="Enable chat feedback"
        onChange={handleChange}
        value={chatFeedbackStatus}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mt: 2 }}>
        <StyledButton variant="contained" onClick={onSave} sx={{ minWidth: 100 }}>
          Save
        </StyledButton>
      </Box>
    </Stack>
  );
};

ChatFeedback.propTypes = {
  dialogProps: PropTypes.object,
  onConfirm: PropTypes.func,
};

export default ChatFeedback;
