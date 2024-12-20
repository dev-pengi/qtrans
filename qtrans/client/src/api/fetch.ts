import axios, { AxiosHeaders, ResponseType } from "axios";

interface FetchParams {
  data?: any;
  headers?: AxiosHeaders | {};
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";
  responseType?: ResponseType;
  multiForm?: boolean;
}

const handleFetch = async (
  url: string,
  {
    data,
    method = "GET",
    headers = {},
    multiForm = false,
    responseType,
  }: FetchParams = {}
) => {
  try {
    const { data: responseData } = await axios({
      url,
      data,
      method: method,
      timeout: 12000,
      responseType: responseType,
      headers: multiForm
        ? {
            ...headers,
            "Content-Type": "multipart/form-data",
          }
        : headers,
    });

    return responseData;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export default handleFetch;
