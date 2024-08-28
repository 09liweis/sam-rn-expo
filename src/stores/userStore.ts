import { LOGIN_API } from "src/constant/api";
import { RoomListResponse, UserStore } from "src/types/roomType";
import { fetchData } from "src/utils";
import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';


const useUserStore = create<UserStore>()((set) => ({
  curUser: {},
  login: async ({eml,pwd}) => {
    const response = await fetchData({ method:"POST", url: LOGIN_API,body:{eml,pwd} });
    if(response.token) {
      try {
        await AsyncStorage.setItem('auth-token', response.token);
      } catch (e) {
        // saving error
      }
    }
  },
  fetchUserDetail: async (roomId: string) => {
    
  },
}));
export default useUserStore;
