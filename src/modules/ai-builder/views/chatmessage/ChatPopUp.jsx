import { Button, ClickAwayListener, Paper, Popper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IconArrowsMaximize, IconEraser, IconMessage, IconX } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

// api
import chatmessageApi from "@/modules/ai-builder/api/chatmessage";
// Hooks
import useConfirm from "@/modules/ai-builder/hooks/useConfirm";
// Const
import {
  closeSnackbar as closeSnackbarAction,
  enqueueSnackbar as enqueueSnackbarAction,
} from "@/modules/ai-builder/store/actions";
import { flowContext } from "@/modules/ai-builder/store/context/ReactFlowContext";
// project import
import { StyledFab } from "@/modules/ai-builder/ui-component/button/StyledFab";
import MainCard from "@/modules/ai-builder/ui-component/cards/MainCard";
import Transitions from "@/modules/ai-builder/ui-component/extended/Transitions";
// Utils
import {
  getLocalStorageChatflow,
  removeLocalStorageChatHistory,
} from "@/modules/ai-builder/utils/genericHelper";
import useNotifier from "@/modules/ai-builder/utils/useNotifier";

import ChatExpandDialog from "./ChatExpandDialog";
import ChatMessage from "./ChatMessage";

const ChatPopUp = ({ chatflowid, isAgentCanvas, onOpenChange }) => {
  const theme = useTheme();
  const { confirm } = useConfirm();
  const dispatch = useDispatch();
  const { clearAgentflowNodeStatus } = useContext(flowContext);

  useNotifier();
  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
  const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args));

  const [open, setOpen] = useState(false);
  const [showExpandDialog, setShowExpandDialog] = useState(false);
  const [expandDialogProps, setExpandDialogProps] = useState({});
  const [previews, setPreviews] = useState([]);

  const anchorRef = useRef(null);
  const prevOpen = useRef(open);

  const handleClose = (event) => {
    if (anchorRef.current?.contains(event.target)) {
      return;
    }
    setOpen(false);
    if (onOpenChange) onOpenChange(false);
  };

  const handleToggle = () => {
    const newOpenState = !open;
    setOpen(newOpenState);
    if (onOpenChange) onOpenChange(newOpenState);
  };

  const expandChat = () => {
    const props = {
      open: true,
      chatflowid: chatflowid,
    };
    setExpandDialogProps(props);
    setShowExpandDialog(true);
  };

  const resetChatDialog = () => {
    const props = {
      ...expandDialogProps,
      open: false,
    };
    setExpandDialogProps(props);
    clearAgentflowNodeStatus();
    setTimeout(() => {
      const resetProps = {
        ...expandDialogProps,
        open: true,
      };
      setExpandDialogProps(resetProps);
    }, 500);
  };

  const clearChat = async () => {
    const confirmPayload = {
      title: `Clear Chat History`,
      description: `Are you sure you want to clear all chat history?`,
      confirmButtonName: "Clear",
      cancelButtonName: "Cancel",
    };
    const isConfirmed = await confirm(confirmPayload);

    if (isConfirmed) {
      try {
        const objChatDetails = getLocalStorageChatflow(chatflowid);
        if (!objChatDetails.chatId) return;
        await chatmessageApi.deleteChatmessage(chatflowid, {
          chatId: objChatDetails.chatId,
          chatType: "INTERNAL",
        });
        removeLocalStorageChatHistory(chatflowid);
        resetChatDialog();
        enqueueSnackbar({
          message: "Successfully cleared all chat history",
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
      } catch (error) {
        enqueueSnackbar({
          message:
            typeof error.response.data === "object"
              ? error.response.data.message
              : error.response.data,
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
    }
  };

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
      if (onOpenChange) onOpenChange(false);
    }
    prevOpen.current = open;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, chatflowid]);

  return (
    <>
      <StyledFab
        className="nopan nodrag"
        sx={{ position: "absolute", right: 20, top: 20 }}
        ref={anchorRef}
        size="small"
        color="secondary"
        aria-label="chat"
        title="Chat"
        onClick={handleToggle}
      >
        {open ? <IconX /> : <IconMessage />}
      </StyledFab>

      {open && (
        <StyledFab
          className="nopan nodrag"
          sx={{ position: "absolute", right: 80, top: 20 }}
          onClick={clearChat}
          size="small"
          color="error"
          aria-label="clear"
          title="Clear Chat History"
        >
          <IconEraser />
        </StyledFab>
      )}
      {open && (
        <StyledFab
          className="nopan nodrag"
          sx={{ position: "absolute", right: 140, top: 20 }}
          onClick={expandChat}
          size="small"
          color="primary"
          aria-label="expand"
          title="Expand Chat"
        >
          <IconArrowsMaximize />
        </StyledFab>
      )}
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [40, 14],
              },
            },
          ],
        }}
        sx={{ zIndex: theme.zIndex.modal }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  border={false}
                  className="cloud-wrapper"
                  elevation={16}
                  content={false}
                  boxShadow
                  shadow={theme.shadows[16]}
                >
                  <ChatMessage
                    isAgentCanvas={isAgentCanvas}
                    chatflowid={chatflowid}
                    open={open}
                    previews={previews}
                    setPreviews={setPreviews}
                  />
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
      <ChatExpandDialog
        show={showExpandDialog}
        dialogProps={expandDialogProps}
        isAgentCanvas={isAgentCanvas}
        onClear={clearChat}
        onCancel={() => setShowExpandDialog(false)}
        previews={previews}
        setPreviews={setPreviews}
      />
    </>
  );
};

ChatPopUp.propTypes = {
  chatflowid: PropTypes.string,
  isAgentCanvas: PropTypes.bool,
  onOpenChange: PropTypes.func,
};

export default memo(ChatPopUp);
