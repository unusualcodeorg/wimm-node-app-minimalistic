import {} from './client-types'; // TODO: remove it after any other import. Done only for types import via link

declare type Mood = {
  id: number;
  code: string;
  createdAt: Date;
};

declare type Journal = {
  id: number;
  text: string;
  createdAt: Date;
};
