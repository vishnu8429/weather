import { TbLoader2 } from "react-icons/tb";

export default function Loader() {
  return (
    <div className="flex items-center justify-center py-12">
      <TbLoader2 size={32} className="animate-spin text-blue-600" />
    </div>
  );
}