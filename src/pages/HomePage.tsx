import { Posts, Stories } from "../components";

export function HomePage() {
  return (
    <>
      <div className="flex flex-col gap-6 m-auto mt-6 w-full md:w-[630px] h-[3000px]">
        <Stories />

        <Posts />
      </div>
    </>
  );
}
