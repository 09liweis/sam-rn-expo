const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const TODO_API = `${BASE_URL}/api/todos`;

export const TODO_LIST_API = `${TODO_API}/lists`;

export const LOGIN_API = `${BASE_URL}/api/user/login`;

export const USER_API = `${BASE_URL}/api/user/detail`;

export const EXPENSES_STATISTICS_API = `${BASE_URL}/api/transactions/statistics`;

export const MOVIES_API = `${BASE_URL}/api/movies`;

export const PLACE_SEARCH_API = `https://api.mapbox.com/search/searchbox/v1/forward?proximity=ip&access_token=${process.env.EXPO_PUBLIC_MAPBOX_APIKEY}&country=CA&q=`;