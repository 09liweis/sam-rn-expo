import AsyncStorage from '@react-native-async-storage/async-storage';

type FetchDataProps = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  body?: any;
};

type FetchDataOption = {
  method: string;
  headers: {
    "Content-type": string;
  };
  body?: any;
};

export const fetchData = async ({
  method = "GET",
  url,
  body = {},
}: FetchDataProps) => {
  const token = await AsyncStorage.getItem('auth-token');
  const opt: FetchDataOption = {
    method,
    headers: {
      "Content-type": "application/json",
      "Auth-Token": token,
    },
  };
  if (body && Object.keys(body).length) {
    opt.body = JSON.stringify(body);
  }
  try {
    const response = await fetch(url, opt);
    const json = await response.json();
    return json;
  } catch (error) {
    return { error };
  }
};
