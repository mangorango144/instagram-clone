import { SlOptions } from "react-icons/sl";
import { IoMdGrid } from "react-icons/io";
import { GrTag } from "react-icons/gr";
import { CiCamera } from "react-icons/ci";

export function UserPage() {
  // const posts: number[] = [];
  const posts: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="m-auto mt-8 sm:px-0 w-full max-w-[935px]">
      {/* Desktop Layout */}
      <div className="hidden sm:grid grid-cols-[284px_auto] h-[195px]">
        <div className="flex justify-center items-center row-span-4">
          <div className="bg-stone-500 rounded-full w-[150px] h-[150px]"></div>
        </div>

        <div className="flex items-center">
          <p className="mr-5 text-white text-xl">username</p>
          <button className="bg-sky-500 hover:bg-sky-600 px-5 py-1.5 rounded-lg font-medium text-white text-sm hover:cursor-pointer">
            Follow
          </button>
          <SlOptions className="ml-3 h-full text-white text-xl hover:cursor-pointer" />
        </div>

        <div className="flex items-center gap-9 mt-4 text-stone-400">
          <p>
            <span className="font-semibold text-white">100</span> posts
          </p>
          <p>
            <span className="font-semibold text-white">101</span> followers
          </p>
          <p>
            <span className="font-semibold text-white">102</span> following
          </p>
        </div>

        <div className="flex flex-col mt-2">
          <p className="font-medium text-white text-sm">Full Name</p>
          <p className="text-white text-sm">This is the bio.</p>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden flex flex-col mt-8">
        <div className="flex gap-6 px-4 w-full">
          <div className="bg-stone-500 rounded-full w-[77px] h-[77px]"></div>
          <div className="flex flex-col flex-grow justify-center">
            <div className="flex items-center">
              <p className="text-white text-xl">username</p>
              <SlOptions className="ml-3 text-white text-xl hover:cursor-pointer" />
            </div>
            <button className="bg-sky-500 hover:bg-sky-600 mt-2 px-5 py-1.5 rounded-lg font-medium text-white text-sm hover:cursor-pointer">
              Follow
            </button>
          </div>
        </div>

        <div className="mt-3 px-4">
          <p className="font-medium text-white text-sm">Full Name</p>
          <p className="text-white text-sm">This is the bio.</p>
        </div>

        <div className="flex justify-center gap-5 mt-3 py-5 border-stone-800 border-t-[1px] text-stone-400">
          <p>
            <span className="font-semibold text-white">100</span> posts
          </p>
          <p>
            <span className="font-semibold text-white">101</span> followers
          </p>
          <p>
            <span className="font-semibold text-white">102</span> following
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex justify-between sm:justify-center sm:gap-[60px] sm:mt-8 border-stone-800 border-y-[1px] h-[53px]">
        <div className="flex justify-center items-center w-full sm:w-auto h-full font-medium text-stone-400 text-xs uppercase tracking-widest">
          <IoMdGrid className="mr-1.5 sm:text-base text-3xl" />
          <span className="hidden sm:inline">Posts</span>
        </div>
        <div className="flex justify-center items-center w-full sm:w-auto h-full font-medium text-stone-400 text-xs uppercase tracking-widest">
          <GrTag className="mr-1.5 sm:text-sm text-2xl" />
          <span className="hidden sm:inline">Tagged</span>
        </div>
      </div>

      {/* Posts Section */}
      {posts.length ? (
        <div className="gap-[3px] sm:gap-[5px] grid grid-cols-3">
          {posts.map((post) => (
            <div className="bg-stone-500 aspect-square">{post}</div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center mt-[60px]">
          <div className="flex flex-col items-center text-white">
            <div className="border-1 rounded-full">
              <CiCamera className="m-3 text-5xl" />
            </div>
            <p className="my-4 font-extrabold text-3xl">No Posts Yet</p>
          </div>
        </div>
      )}
    </div>
  );
}
