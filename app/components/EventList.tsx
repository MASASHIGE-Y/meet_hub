import { EventCardType } from "@/types/event";
import EventCard from "./EventCard";

type Props = {
  events: EventCardType[];
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
