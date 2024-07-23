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
  const opt: FetchDataOption = {
    method,
    headers: {
      "Content-type": "application/json",
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
