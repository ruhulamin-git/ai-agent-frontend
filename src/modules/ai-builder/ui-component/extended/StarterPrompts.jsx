// material-ui
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  List,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { IconBulb, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// API
import chatflowsApi from "@/modules/ai-builder/api/chatflows";
import {
  closeSnackbar as closeSnackbarAction,
  enqueueSnackbar as enqueueSnackbarAction,
  SET_CHATFLOW,
} from "@/modules/ai-builder/store/actions";
// Project import
import { StyledButton } from "@/modules/ai-builder/ui-component/button/StyledButton";
// store
import useNotifier from "@/modules/ai-builder/utils/useNotifier";

const StarterPrompts = ({ dialogProps, onConfirm }) => {
  const dispatch = useDispatch();

  useNotifier();

  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
  const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args));

  const [inputFields, setInputFields] = useState([
    {
      prompt: "",
    },
  ]);

  const [chatbotConfig, setChatbotConfig] = useState({});

  const addInputField = () => {
    setInputFields([
      ...inputFields,
      {
        prompt: "",
      },
    ]);
  };
  const removeInputFields = (index) => {
    const rows = [...inputFields];
    rows.splice(index, 1);
    setInputFields(rows);
  };

  const handleChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const list = [...inputFields];
    list[index][name] = value;
    setInputFields(list);
  };

  const onSave = async () => {
    try {
      const value = {
        starterPrompts: {
          ...inputFields,
        },
      };
      chatbotConfig.starterPrompts = value.starterPrompts;
      const saveResp = await chatflowsApi.updateChatflow(dialogProps.chatflow.id, {
        chatbotConfig: JSON.stringify(chatbotConfig),
      });
      if (saveResp.data) {
        enqueueSnackbar({
          message: "Conversation Starter Prompts Saved",
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
        message: `Failed to save Conversation Starter Prompts: ${
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
      try {
        const chatbotConfig = JSON.parse(dialogProps.chatflow.chatbotConfig);
        setChatbotConfig(chatbotConfig || {});
        if (chatbotConfig.starterPrompts) {
          const inputFields = [];
          Object.getOwnPropertyNames(chatbotConfig.starterPrompts).forEach((key) => {
            if (chatbotConfig.starterPrompts[key]) {
              inputFields.push(chatbotConfig.starterPrompts[key]);
            }
          });
          setInputFields(inputFields);
        } else {
          setInputFields([
            {
              prompt: "",
            },
          ]);
        }
      } catch (_e) {
        setInputFields([
          {
            prompt: "",
          },
        ]);
      }
    }

    return () => {};
  }, [dialogProps]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          borderRadius: "8px",
          bgcolor: "rgba(34, 197, 94, 0.08)",
          border: "1px solid",
          borderColor: "rgba(34, 197, 94, 0.2)",
          px: 1.75,
          py: 1.25,
        }}
      >
        <IconBulb size={20} color="#16a34a" style={{ flexShrink: 0 }} />
        <Typography sx={{ color: "text.secondary", fontSize: "0.8125rem", lineHeight: 1.5 }}>
          Starter prompts will only be shown when there are no messages on the chat
        </Typography>
      </Box>
      <Box sx={{ "& > :not(style)": { m: 1 }, pt: 2 }}>
        <List>
          {inputFields.map((data, index) => {
            return (
              <div key={index} style={{ display: "flex", width: "100%" }}>
                <Box sx={{ width: "95%", mb: 1 }}>
                  <OutlinedInput
                    sx={{ width: "100%" }}
                    key={index}
                    type="text"
                    onChange={(e) => handleChange(index, e)}
                    size="small"
                    value={data.prompt}
                    name="prompt"
                    endAdornment={
                      <InputAdornment position="end" sx={{ padding: "2px" }}>
                        {inputFields.length > 1 && (
                          <IconButton
                            sx={{ height: 30, width: 30 }}
                            size="small"
                            color="error"
                            disabled={inputFields.length === 1}
                            onClick={() => removeInputFields(index)}
                            edge="end"
                          >
                            <IconTrash />
                          </IconButton>
                        )}
                      </InputAdornment>
                    }
                  />
                </Box>
                <Box sx={{ width: "5%", mb: 1 }}>
                  {index === inputFields.length - 1 && (
                    <IconButton color="primary" onClick={addInputField}>
                      <IconPlus />
                    </IconButton>
                  )}
                </Box>
              </div>
            );
          })}
        </List>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mt: 2 }}>
        <StyledButton variant="contained" onClick={onSave} sx={{ minWidth: 100 }}>
          Save
        </StyledButton>
      </Box>
    </>
  );
};

StarterPrompts.propTypes = {
  dialogProps: PropTypes.object,
  onConfirm: PropTypes.func,
};

export default StarterPrompts;
