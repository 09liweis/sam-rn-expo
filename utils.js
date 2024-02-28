exports.fetchData = async ({ method, url }) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-type": "application/json",
      },
    });
    const json = await response.json();
    return { resp: json };
  } catch (error) {
    return { error };
  }
};
