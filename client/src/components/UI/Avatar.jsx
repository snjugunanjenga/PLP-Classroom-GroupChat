export const Avatar = ({ name }) => (
  <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
    {name[0].toUpperCase()}
  </div>
);