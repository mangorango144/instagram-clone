export function PostCaption({
  username,
  caption,
}: {
  username: string;
  caption: string;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <div className="flex-shrink-0 bg-stone-500 rounded-full size-9"></div>
      <p className="text-white/87">
        <span className="mr-1 font-semibold text-white">{username}</span>{" "}
        {caption}
      </p>
    </div>
  );
}
