import { toCamelCase } from "@/utils";
import { axios } from "@/utils/axios";
import { handleApiError } from "@/utils/handleApiError";

export interface ContactDTO {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  id?: number; // Adding id field to match actual API response
}

const CONTACT_URL = "/api/cms/v1/contact-messages/";

export const sendContactMessage = async (data: ContactDTO): Promise<ContactResponse> => {
  try {
    const response = await axios.post(CONTACT_URL, data);
    const transformedData = toCamelCase(response.data);
    return transformedData;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};
