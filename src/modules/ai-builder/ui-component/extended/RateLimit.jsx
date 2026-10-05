import { Box, Button, OutlinedInput, Stack, Typography } from "@mui/material";
// Icons
import { IconX } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// API
import chatflowsApi from "@/modules/ai-builder/api/chatflows";
import {
  closeSnackbar as closeSnackbarAction,
  enqueueSnackbar as enqueueSnackbarAction,
  SET_CHATFLOW,
} from "@/modules/ai-builder/store/actions";
// Project import
import { StyledButton } from "@/modules/ai-builder/ui-component/button/StyledButton";
import { SwitchInput } from "@/modules/ai-builder/ui-component/switch/Switch";
import { TooltipWithParser } from "@/modules/ai-builder/ui-component/tooltip/TooltipWithParser";
// utils
import useNotifier from "@/modules/ai-builder/utils/useNotifier";

const RateLimit = ({ dialogProps, hideTitle = false }) => {
  const dispatch = useDispatch();
  const chatflow = useSelector((state) => state.canvas.chatflow);
  const chatflowid = chatflow.id;
  const apiConfig = chatflow.apiConfig ? JSON.parse(chatflow.apiConfig) : {};

  useNotifier();

  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
  const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args));

  const [rateLimitStatus, setRateLimitStatus] = useState(
    apiConfig?.rateLimit?.status !== undefined ? apiConfig.rateLimit.status : false
  );
  const [limitMax, setLimitMax] = useState(apiConfig?.rateLimit?.limitMax ?? "");
  const [limitDuration, setLimitDuration] = useState(apiConfig?.rateLimit?.limitDuration ?? "");
  const [limitMsg, setLimitMsg] = useState(apiConfig?.rateLimit?.limitMsg ?? "");

  const formatObj = () => {
    let apiConfig = JSON.parse(dialogProps.chatflow.apiConfig);
    if (apiConfig === null || apiConfig === undefined) {
      apiConfig = {};
    }
    let obj = { status: rateLimitStatus };

    if (rateLimitStatus) {
      const rateLimitValuesBoolean = [!limitMax, !limitDuration, !limitMsg];
      const rateLimitFilledValues = rateLimitValuesBoolean.filter((value) => value === false);
      if (rateLimitFilledValues.length >= 1 && rateLimitFilledValues.length <= 2) {
        throw new Error("Need to fill all rate limit input fields");
      } else if (rateLimitFilledValues.length === 3) {
        obj = {
          ...obj,
          limitMax,
          limitDuration,
          limitMsg,
        };
      }
    }
    apiConfig.rateLimit = obj;
    return apiConfig;
  };

  const handleChange = (value) => {
    setRateLimitStatus(value);
  };

  const checkDisabled = () => {
    if (rateLimitStatus) {
      if (limitMax === "" || limitDuration === "" || limitMsg === "") {
        return true;
      }
    }
    return false;
  };

  const onSave = async () => {
    try {
      const saveResp = await chatflowsApi.updateChatflow(chatflowid, {
        apiConfig: JSON.stringify(formatObj()),
      });
      if (saveResp.data) {
        enqueueSnackbar({
          message: "Rate Limit Configuration Saved",
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
      }
    } catch (error) {
      enqueueSnackbar({
        message: `Failed to save Rate Limit Configuration: ${
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

  const onTextChanged = (value, fieldName) => {
    switch (fieldName) {
      case "limitMax":
        setLimitMax(value);
        break;
      case "limitDuration":
        setLimitDuration(value);
        break;
      case "limitMsg":
        setLimitMsg(value);
        break;
    }
  };

  const textField = (message, fieldName, fieldLabel, fieldType = "string", placeholder = "") => {
    return (
      <Stack direction="column" spacing={1}>
        <Typography>{fieldLabel}</Typography>
        <OutlinedInput
          id={fieldName}
          type={fieldType}
          fullWidth
          value={message}
          placeholder={placeholder}
          name={fieldName}
          size="small"
          onChange={(e) => {
            onTextChanged(e.target.value, fieldName);
          }}
        />
      </Stack>
    );
  };

  return (
    <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
      {!hideTitle && (
        <Typography variant="h3">
          Rate Limit{" "}
          <TooltipWithParser
            style={{ marginLeft: 10 }}
            title={
              'Visit <a target="_blank" href="https://docs.flowiseai.com/configuration/rate-limit">Rate Limit Setup Guide</a> to set up Rate Limit correctly in your hosting environment.'
            }
          />
        </Typography>
      )}
      <SwitchInput label="Enable Rate Limit" onChange={handleChange} value={rateLimitStatus} />
      {rateLimitStatus && (
        <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
          {textField(limitMax, "limitMax", "Message Limit per Duration", "number", "5")}
          {textField(limitDuration, "limitDuration", "Duration in Second", "number", "60")}
          {textField(limitMsg, "limitMsg", "Limit Message", "string", "You have reached the quota")}
        </Stack>
      )}
      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mt: 2 }}>
        <StyledButton
          disabled={checkDisabled()}
          variant="contained"
          onClick={() => onSave()}
          sx={{ minWidth: 100 }}
        >
          Save
        </StyledButton>
      </Box>
    </Stack>
  );
};

RateLimit.propTypes = {
  isSessionMemory: PropTypes.bool,
  dialogProps: PropTypes.object,
  hideTitle: PropTypes.bool,
};

export default RateLimit;
