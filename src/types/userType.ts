export type User = {
  _id: string;
  nm: string;
};

export type LoginResponse = {
  token: string;
  msg: string;
  err: string;
};

export type UserStore = {
  curUser?: User;
  login: ({ eml, pwd }: any) => Promise<LoginResponse>;
  // fetchUserDetail: () => Promise<User>;
};
