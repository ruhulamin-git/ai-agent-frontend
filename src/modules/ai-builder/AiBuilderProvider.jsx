"use client";

import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useTheme as useNextTheme } from "next-themes";
import { SnackbarProvider } from "notistack";
import React, { useEffect, useLayoutEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

import NavigationScroll from "@/modules/ai-builder/layout/NavigationScroll";
import { store } from "@/modules/ai-builder/store";
import { SET_DARKMODE } from "@/modules/ai-builder/store/actions";
import { ConfigProvider } from "@/modules/ai-builder/store/context/ConfigContext";
import ConfirmContextProvider from "@/modules/ai-builder/store/context/ConfirmContextProvider";
import { ErrorProvider } from "@/modules/ai-builder/store/context/ErrorContext";
import { ReactFlowContext } from "@/modules/ai-builder/store/context/ReactFlowContext";
import themes from "@/modules/ai-builder/themes";

import "@/modules/ai-builder/assets/scss/style.scss";
import "react-perfect-scrollbar/dist/css/styles.css";

// Use useLayoutEffect on client, useEffect on server to avoid SSR warnings
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const ThemeWrapper = ({ children }) => {
  const customization = useSelector((state) => state.customization);
  const dispatch = useDispatch();
  const { resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = React.useState(false);

  // Track when component is mounted (client-side hydration complete)
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the effective dark mode state
  const effectiveIsDark = React.useMemo(() => {
    // During SSR or initial client render (before mount), use a consistent default
    // to avoid hydration mismatch errors.
    if (!mounted) {
      return true; // Default to dark (matching Redux/Server default)
    }

    // After mount, use resolvedTheme from next-themes or fallback to localStorage
    if (resolvedTheme !== undefined) {
      return resolvedTheme === "dark";
    }

    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("newdashboard-theme");
      if (storedTheme !== null) {
        return storedTheme === "dark";
      }
    }

    return true; // Final fallback
  }, [mounted, resolvedTheme]);

  // Sync Redux store with the effective dark mode
  useIsomorphicLayoutEffect(() => {
    if (customization.isDarkMode !== effectiveIsDark) {
      dispatch({ type: SET_DARKMODE, isDarkMode: effectiveIsDark });
      localStorage.setItem("isDarkMode", String(effectiveIsDark));
    }
  }, [effectiveIsDark, customization.isDarkMode, dispatch]);

  // Create the MUI theme using the effective dark mode state
  const muiTheme = React.useMemo(() => {
    const effectiveCustomization = {
      ...customization,
      isDarkMode: effectiveIsDark,
    };
    return themes(effectiveCustomization);
  }, [customization, effectiveIsDark]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <NavigationScroll>{children}</NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export const AiBuilderProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <SnackbarProvider>
        <ConfigProvider>
          <ErrorProvider>
            <ConfirmContextProvider>
              <ReactFlowContext>
                <ThemeWrapper>{children}</ThemeWrapper>
              </ReactFlowContext>
            </ConfirmContextProvider>
          </ErrorProvider>
        </ConfigProvider>
      </SnackbarProvider>
    </Provider>
  );
};
