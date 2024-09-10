const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const ROOM_API = `${BASE_URL}/api/rooms`;

export const RENTEE_API = `${BASE_URL}/api/rentees`;

export const TODO_API = `${BASE_URL}/api/todos`;

export const TODO_LIST_API = `${BASE_URL}/api/todos/lists`;

export const LOGIN_API = `${BASE_URL}/api/user/login`;

export const USER_API = `${BASE_URL}/api/user/detail`;

export const PLACE_SEARCH_API = `https://api.mapbox.com/search/searchbox/v1/forward?proximity=ip&access_token=${process.env.EXPO_PUBLIC_MAPBOX_APIKEY}&country=CA&q=`;