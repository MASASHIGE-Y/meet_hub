export type SimpleEvent = {
  id: string;
  title: string;
  description: string | null;
};

export type EventCardType = {
  id: string;
  title: string;
  description: string | null;
  startAt: Date | null;
  endAt: Date | null;
  location: string | null;
  capacity: number | null;
  creator: {
    id: string;
    name: string | null;
    image: string | null;
  };
  participations: {
    id: string;
  }[];
};

export type BookmarkWithEvent = {
  id: string;
  event: {
    id: string;
    title: string;
    description: string | null;
    date: Date;
  };
};

export type EventUser = {
  id: string;
  name: string | null;
  image: string | null;
};

export type EventWithRelations = {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  location: string | null;
  capacity: number | null;
  startAt: Date | null;
  endAt: Date | null;
  creatorId: string;
  creator: EventUser;
  comments: {
    id: string;
    content: string;
    user: EventUser;
  }[];
  participations: {
    id: string;
    user: EventUser;
  }[];
};
