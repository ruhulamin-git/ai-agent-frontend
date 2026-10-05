// material-ui
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  OutlinedInput,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";

// store
import { HIDE_CANVAS_DIALOG, SHOW_CANVAS_DIALOG } from "@/modules/ai-builder/store/actions";
// Project import
import { StyledButton } from "@/modules/ai-builder/ui-component/button/StyledButton";

const ChatFeedbackContentDialog = ({ show, onCancel, onConfirm }) => {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPortalElement(document.getElementById("portal") || document.body);
    }
  }, []);
  const dispatch = useDispatch();

  const [feedbackContent, setFeedbackContent] = useState("");

  const onChange = useCallback((e) => setFeedbackContent(e.target.value), [setFeedbackContent]);

  const onSave = () => {
    onConfirm(feedbackContent);
  };

  useEffect(() => {
    if (show) dispatch({ type: SHOW_CANVAS_DIALOG });
    else dispatch({ type: HIDE_CANVAS_DIALOG });
    return () => {
      dispatch({ type: HIDE_CANVAS_DIALOG });
      setFeedbackContent("");
    };
  }, [show, dispatch]);

  const component = show ? (
    <Dialog
      onClose={onCancel}
      open={show}
      fullWidth
      maxWidth="sm"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle sx={{ fontSize: "1rem" }} id="alert-dialog-title">
        Provide additional feedback
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <OutlinedInput
            // eslint-disable-next-line
            autoFocus
            id="feedbackContentInput"
            multiline
            name="feedbackContentInput"
            onChange={onChange}
            placeholder="What do you think of the response?"
            rows={4}
            value={feedbackContent}
            sx={{ width: "100%" }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <StyledButton variant="contained" onClick={onSave}>
          Submit Feedback
        </StyledButton>
      </DialogActions>
    </Dialog>
  ) : null;

  return portalElement ? createPortal(component, portalElement) : component;
};

export default ChatFeedbackContentDialog;
