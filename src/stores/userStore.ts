import { LOGIN_API } from "src/constant/api";
import { UserStore } from "src/types/userType";
import { fetchData } from "src/utils";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useUserStore = create<UserStore>()((set) => ({
  user: null,
  isAuthenticated: false,

  login: async ({ eml, pwd }: any) => {
    const response = await fetchData({
      method: "POST",
      url: LOGIN_API,
      body: { eml, pwd },
    });
    if (response.token) {
      try {
        await AsyncStorage.setItem("auth-token", response.token);
        set({ user: response.user, isAuthenticated: true });
      } catch (e) {
        console.error("Error saving token:", e);
      }
    }
    return response;
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem("auth-token");
      set({ user: null, isAuthenticated: false });
    } catch (e) {
      console.error("Error removing token:", e);
    }
  },

  updateProfile: async (userData: any) => {
    try {
      const response = await fetchData({
        method: "PUT",
        url: `${LOGIN_API}/profile`,
        body: userData,
      });
      if (response.user) {
        set({ user: response.user });
      }
      return response;
    } catch (error) {
      console.error("Error updating profile:", error);
      return { error: "Failed to update profile" };
    }
  },
}));
export default useUserStore;
