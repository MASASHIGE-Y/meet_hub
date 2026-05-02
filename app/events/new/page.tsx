import BackToTopLink from "@/app/components/BackToTopLink";
import EventCreateForm from "@/app/components/EventCreateForm";

export default function EventNewPage() {
  return (
    <main className="p-8">
      <BackToTopLink />
      <EventCreateForm />
    </main>
  );
}
