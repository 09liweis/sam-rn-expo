import { LOGIN_API } from "src/constant/api";
import { UserStore } from "src/types/userType";
import { fetchData } from "src/utils";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useUserStore = create<UserStore>()((set) => ({
  // curUser: {},
  login: async ({ eml, pwd }: any) => {
    const response = await fetchData({
      method: "POST",
      url: LOGIN_API,
      body: { eml, pwd },
    });
    if (response.token) {
      try {
        await AsyncStorage.setItem("auth-token", response.token);
      } catch (e) {
        // saving error
      }
    }
    return response;
  },
  // fetchUserDetail: async () => {
  //   const response = await fetchData({ method:"POST", url: USER_API });
  //   if(response.user) {
  //     set({ curUser: response.user });
  //   }
  // },
}));
export default useUserStore;
