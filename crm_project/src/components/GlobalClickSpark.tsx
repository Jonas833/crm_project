

import ClickSpark from "@/components/ClickSpark";

export default function GlobalClickSpark() {
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-auto">
      <ClickSpark
        sparkColor="#fff"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      />
    </div>
  );
}
