import axios from "axios";
import { toast } from "sonner";

const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_UNAUTHORIZED = 401;
const HTTP_STATUS_FORBIDDEN = 403;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

const handleApiError = (error: unknown, customMessage?: string) => {
  if (customMessage) {
    toast.error(customMessage);
    return;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error;
    if (axiosError.response) {
      const status = axiosError.response.status;
      const message =
        axiosError.response.data?.message ??
        (() => {
          switch (status) {
            case HTTP_STATUS_BAD_REQUEST:
              return "Please check your inputs.";
            case HTTP_STATUS_UNAUTHORIZED:
              return "Unauthorized! Please log in.";
            case HTTP_STATUS_FORBIDDEN:
              return "You don't have permission to access this resource.";
            case HTTP_STATUS_NOT_FOUND:
              return "The requested resource could not be found.";
            case HTTP_STATUS_INTERNAL_SERVER_ERROR:
              return "Something went wrong! Please try again later.";
            default:
              return `Error: ${status} - An error occurred.`;
          }
        })();

      toast.error(message);

      const errorData = axiosError.response.data;
      if (typeof errorData === "string" && errorData.includes("<!DOCTYPE html>")) {
        console.error(
          "Server Error: Received HTML response (likely 404 from frontend). Check your API URL configuration."
        );
      } else {
        console.warn("Server Error:", errorData);
      }
    } else if (axiosError.request) {
      toast.error("No response received from the server.");
      console.error("Request Error:", axiosError.request);
    } else {
      toast.error("Request setup error.");
      console.error("Request Setup Error:", axiosError.message);
    }
  } else {
    toast.error("An unexpected error occurred.");
    console.error("Unexpected Error:", error);
  }
};

export { handleApiError };
