"use client";
import PropTypes from "prop-types";
import { createContext, useContext } from "react";

const ConfigContext = createContext();

// Authentication removed - always treat as open source
export const ConfigProvider = ({ children }) => {
  return (
    <ConfigContext.Provider
      value={{
        config: {},
        loading: false,
        isEnterpriseLicensed: false,
        isCloud: false,
        isOpenSource: true,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);

ConfigProvider.propTypes = {
  children: PropTypes.any,
};
