import { ROOM_API } from "src/constant/api";
import { Room } from "src/types/roomType";
import { fetchData } from "utils";
import { create } from "zustand";

type Store = {
  rentRoomList: Array<Room>;
  fetchRoomList: () => void;
};

const useRentStore = create<Store>()((set) => ({
  rentRoomList: [],
  fetchRoomList: async () => {
    const response = await fetchData({ url: ROOM_API });
    set({ rentRoomList: response });
  },
}));
export default useRentStore;
