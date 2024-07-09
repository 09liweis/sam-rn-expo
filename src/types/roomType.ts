export type Room = {
  _id: string;
  nm: string;
};

export type RoomStore = {
  rentRoomList: Array<Room>;
  fetchRoomList: () => void;
};
