export type User = {
  _id: string;
  nm: string;
};

export type LoginResponse = {
  token:string;
};

export type UserStore = {
  curUser?: User;
  login:()=>Promise<LoginResponse>;
  fetchUserDetail: () => Promise<User>;
};
