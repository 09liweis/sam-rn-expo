import { ROOM_API } from "src/constant/api";
import { fetchData } from "utils";
import { create } from "zustand";

type Room = {
  _id: string;
  nm: string;
};

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
