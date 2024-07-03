exports.fetchData = async ({ method = "GET", url, body = {} }) => {
  const opt = {
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
