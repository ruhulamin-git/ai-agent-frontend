import { Box, CircularProgress, Popper, TextField, Tooltip, Typography } from "@mui/material";
// Material
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import { styled, useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

// API
import credentialsApi from "@/modules/ai-builder/api/credentials";
import nodesApi from "@/modules/ai-builder/api/nodes";
// const
import { baseURL } from "@/modules/ai-builder/store/constant";
import { flowContext } from "@/modules/ai-builder/store/context/ReactFlowContext";
import { getAvailableNodesForVariable } from "@/modules/ai-builder/utils/genericHelper";

const StyledPopper = styled(Popper)({
  boxShadow:
    "0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%)",
  borderRadius: "10px",
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 10,
      margin: 10,
    },
  },
});

const fetchList = async ({ name, nodeData, previousNodes, currentNode }) => {
  const selectedParam = nodeData.inputParams.find((param) => param.name === name);
  const loadMethod = selectedParam?.loadMethod;

  let credentialId = nodeData.credential;
  if (
    !credentialId &&
    (nodeData.inputs?.credential || nodeData.inputs?.["FLOWISE_CREDENTIAL_ID"])
  ) {
    credentialId = nodeData.inputs.credential || nodeData.inputs?.["FLOWISE_CREDENTIAL_ID"];
  }

  try {
    const { data } = await nodesApi.executeNodeLoadMethod(nodeData.name, {
      ...nodeData,
      loadMethod,
      previousNodes,
      currentNode,
      credential: credentialId,
    });
    return data ?? [];
  } catch (error) {
    if (!error?.isAxiosError) {
      console.error(error);
    }
    return [];
  }
};

const DEFAULT_CREDENTIAL_NAMES = [];

export const AsyncDropdown = ({
  name,
  nodeData,
  value,
  onSelect,
  isCreateNewOption,
  onCreateNew,
  credentialNames = DEFAULT_CREDENTIAL_NAMES,
  disabled = false,
  freeSolo = false,
  disableClearable = false,
  multiple = false,
  fullWidth = false,
}) => {
  const customization = useSelector((state) => state.customization);
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const findMatchingOptions = (options = [], value) => {
    if (multiple) {
      let values = [];
      if ("choose an option" !== value && value && typeof value === "string") {
        values = JSON.parse(value);
      } else {
        values = value;
      }
      return options.filter((option) => values.includes(option.name));
    }
    return options.find((option) => option.name === value);
  };
  const getDefaultOptionValue = () => (multiple ? [] : "");
  const addNewOption = [{ label: "- Create New -", name: "-create-" }];
  const [internalValue, setInternalValue] = useState(value ?? "choose an option");
  const { reactFlowInstance } = useContext(flowContext);

  const fetchCredentialList = async () => {
    try {
      let names = "";
      if (credentialNames.length > 1) {
        names = credentialNames.join("&credentialName=");
      } else if (credentialNames.length > 0) {
        names = credentialNames[0];
      }

      if (!names) {
        return [];
      }

      const resp = await credentialsApi.getCredentialsByName(names);
      if (resp.data) {
        const returnList = [];
        for (let i = 0; i < resp.data.length; i += 1) {
          const data = {
            label: resp.data[i].name,
            name: resp.data[i].id,
          };
          returnList.push(data);
        }
        return returnList;
      }
    } catch (error) {
      if (!error?.isAxiosError) {
        console.error(error);
      }
    }

    return [];
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    (async () => {
      const fetchData = async () => {
        let response = [];
        if (credentialNames.length) {
          response = await fetchCredentialList();
        } else {
          const body = {
            name,
            nodeData,
          };
          if (reactFlowInstance) {
            const previousNodes = getAvailableNodesForVariable(
              reactFlowInstance.getNodes(),
              reactFlowInstance.getEdges(),
              nodeData.id,
              `${nodeData.id}-input-${name}-${nodeData.inputParams.find((param) => param.name === name)?.type || ""
              }`,
              true
            ).map((node) => ({
              id: node.id,
              name: node.data.name,
              label: node.data.label,
              inputs: node.data.inputs,
            }));

            let currentNode = reactFlowInstance.getNodes().find((node) => node.id === nodeData.id);
            if (currentNode) {
              currentNode = {
                id: currentNode.id,
                name: currentNode.data.name,
                label: currentNode.data.label,
                inputs: currentNode.data.inputs,
              };
              body.currentNode = currentNode;
            }

            body.previousNodes = previousNodes;
          }

          response = (await fetchList(body)) || [];
        }

        if (!isMounted) return;
        response = response || [];

        for (let j = 0; j < response.length; j += 1) {
          if (response[j].imageSrc) {
            const imageSrc = `${baseURL}/api/v1/node-icon/${response[j].name}`;
            response[j].imageSrc = imageSrc;
          }
        }
        if (isCreateNewOption) setOptions([...response, ...addNewOption]);
        else setOptions([...response]);
        setLoading(false);
      };
      fetchData();
    })();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <Autocomplete
      id={name}
      freeSolo={freeSolo}
      disabled={disabled}
      disableClearable={disableClearable}
      multiple={multiple}
      filterSelectedOptions={multiple}
      size="small"
      sx={{ mt: 1, width: fullWidth ? "100%" : multiple ? "90%" : "100%" }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      options={options}
      value={findMatchingOptions(options, internalValue) || getDefaultOptionValue()}
      onChange={(e, selection) => {
        if (multiple) {
          let value = "";
          if (selection.length) {
            const selectionNames = selection.map((item) => item.name);
            value = JSON.stringify(selectionNames);
          }
          setInternalValue(value);
          onSelect(value);
        } else {
          const value = selection ? selection.name : "";
          if (isCreateNewOption && value === "-create-") {
            onCreateNew();
          } else {
            setInternalValue(value);
            onSelect(value);
          }
        }
      }}
      PopperComponent={StyledPopper}
      loading={loading}
      renderInput={(params) => {
        const matchingOptions = multiple
          ? findMatchingOptions(options, internalValue)
          : [findMatchingOptions(options, internalValue)].filter(Boolean);

        const textField = (
          <TextField
            {...params}
            value={internalValue}
            sx={{
              height: "100%",
              "& .MuiInputBase-root": {
                height: "100%",
                "& fieldset": {
                  borderColor: theme.palette.grey[900] + 25,
                },
              },
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  {matchingOptions.map((option) =>
                    option?.imageSrc ? (
                      <Box
                        key={option.name}
                        component="img"
                        src={option.imageSrc}
                        alt={option.label || "Selected Option"}
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          marginRight: 0.5,
                        }}
                      />
                    ) : null
                  )}
                  {params.InputProps.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        );

        return !multiple ? (
          textField
        ) : (
          <Tooltip
            title={
              typeof internalValue === "string"
                ? internalValue.replace(/[[\]"]/g, "").replace(/,/g, ", ")
                : internalValue
            }
            placement="top"
            arrow
          >
            {textField}
          </Tooltip>
        );
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        const uniqueKey = option.name ? `${option.name}-${key}` : key;

        return (
          <Box
            key={uniqueKey}
            component="li"
            {...optionProps}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {option.imageSrc && (
              <img
                src={option.imageSrc}
                alt={option.description || option.label || ""}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                style={{
                  width: 30,
                  height: 30,
                  padding: 1,
                  borderRadius: "50%",
                }}
              />
            )}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h5">{option.label}</Typography>
              {option.description && (
                <Typography sx={{ color: customization.isDarkMode ? "#9e9e9e" : "" }}>
                  {option.description}
                </Typography>
              )}
            </div>
          </Box>
        );
      }}
    />
  );
};

AsyncDropdown.propTypes = {
  name: PropTypes.string,
  nodeData: PropTypes.object,
  value: PropTypes.string,
  onSelect: PropTypes.func,
  onCreateNew: PropTypes.func,
  disabled: PropTypes.bool,
  freeSolo: PropTypes.bool,
  credentialNames: PropTypes.array,
  disableClearable: PropTypes.bool,
  isCreateNewOption: PropTypes.bool,
  multiple: PropTypes.bool,
  fullWidth: PropTypes.bool,
};
