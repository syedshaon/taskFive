import Controls from "@/components/Controls";
import BookList from "@/components/BookList";

function page() {
  return (
    <div className="max-w-7xl px-2 py-4 mx-auto h-screen ">
      <Controls />
      <BookList />
    </div>
  );
}

export default page;
