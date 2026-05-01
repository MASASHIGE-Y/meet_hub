import EventCard from "./EventCard";

type Event = {
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

type Props = {
  events: Event[];
};

export default function EventList({ events }: Props) {
  if (events.length === 0) {
    return <p className="mt-4">まだイベントはありません</p>;
  }

  return (
    <ul className="mt-4 space-y-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </ul>
  );
}
