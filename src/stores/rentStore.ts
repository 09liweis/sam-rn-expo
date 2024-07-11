import { ROOM_API } from "src/constant/api";
import { RoomListResponse, RoomStore } from "src/types/roomType";
import { fetchData } from "utils";
import { create } from "zustand";

const useRentStore = create<RoomStore>()((set) => ({
  rentRoomList: [],
  fetchRoomList: async () => {
    const { rooms }: RoomListResponse = await fetchData({ url: ROOM_API });
    if (Array.isArray(rooms)) {
      set({ rentRoomList: rooms });
    }
  },
  fetchRoomDetail: async (roomId: string) => {
    const room = await fetchData({ url: `${ROOM_API}/${roomId}` });
    return room;
  },
}));
export default useRentStore;
