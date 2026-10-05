import { SnackbarProvider } from "notistack";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
// third party
import { BrowserRouter } from "react-router-dom";

import App from "@/App";
import { store } from "@/modules/ai-builder/store";
import { ConfigProvider } from "@/modules/ai-builder/store/context/ConfigContext";
import ConfirmContextProvider from "@/modules/ai-builder/store/context/ConfirmContextProvider";
import { ErrorProvider } from "@/modules/ai-builder/store/context/ErrorContext";
import { ReactFlowContext } from "@/modules/ai-builder/store/context/ReactFlowContext";

// style + assets
import "@/modules/ai-builder/assets/scss/style.scss";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <SnackbarProvider>
          <ConfigProvider>
            <ErrorProvider>
              <ConfirmContextProvider>
                <ReactFlowContext>
                  <App />
                </ReactFlowContext>
              </ConfirmContextProvider>
            </ErrorProvider>
          </ConfigProvider>
        </SnackbarProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
