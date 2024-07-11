export type Room = {
  _id: string;
  nm: string;
  rentees: [];
};

export type RoomListResponse = {
  rooms: Room[];
};

export type RoomStore = {
  rentRoomList: Array<Room>;
  fetchRoomList: () => void;
  curRoom?: Room;
  fetchRoomDetail: (roomId: string) => Promise<Room>;
};
