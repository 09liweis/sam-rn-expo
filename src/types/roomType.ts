export type Room = {
  _id: string;
  nm: string;
};

export type RoomListResponse = {
  rooms: Room[];
};

export type RoomStore = {
  rentRoomList: Array<Room>;
  fetchRoomList: () => void;
};
