import React, { useMemo, useState } from "react";

import Hero from "./Hero";
import Faq, { FAQ } from "./Faq";

function SupportPage() {
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQ;
    return FAQ.map((group) => ({
      ...group,
      items: group.items.filter((item) => `${item.q} ${item.a}`.toLowerCase().includes(q)),
    })).filter((group) => group.items.length);
  }, [query]);

  return (
    <>
      <Hero query={query} onQuery={setQuery} />
      <Faq groups={groups} query={query.trim()} />
    </>
  );
}

export default SupportPage;
