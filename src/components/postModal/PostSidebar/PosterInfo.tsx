export function PosterInfo() {
  return (
    <div className="flex items-center px-4 py-3 lg:border-white/10 lg:border-b">
      <div className="bg-stone-500 rounded-full size-9"></div>
      <span className="ml-3 font-semibold text-sm">frontend.in.depth</span>
      <div className="bg-white/80 mx-2.5 rounded-full size-[5px]"></div>
      <button className="text-sky-500 hover:text-white hover:cursor-pointer">
        Follow
      </button>
    </div>
  );
}
