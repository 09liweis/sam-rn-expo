import { ROOM_API } from "src/constant/api";
import { RoomStore } from "src/types/roomType";
import { fetchData } from "utils";
import { create } from "zustand";

const useRentStore = create<RoomStore>()((set) => ({
  rentRoomList: [],
  fetchRoomList: async () => {
    const response = await fetchData({ url: ROOM_API });
    set({ rentRoomList: response });
  },
}));
export default useRentStore;
