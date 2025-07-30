import { useState } from "react";
import UserSelect from "@/features/user/components/UserSelect";

export default function ExampleUserSelectUsage() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <UserSelect
      selected={selected}
      handleUpdateSelected={(selected) => setSelected(selected)}
    />
  );
}
