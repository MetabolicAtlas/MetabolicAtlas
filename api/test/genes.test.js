import fetch from "node-fetch";

describe("genes", () => {
  test("a gene should have a list of subsystems", async () => {
    const res = await fetch(
      `${API_BASE}/genes/ENSG00000126091?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const { subsystems } = await res.json();
    expect(subsystems.length).toBeGreaterThan(0);
  });

  test("a gene should have related reactions", async () => {
    const res = await fetch(
      `${API_BASE}/genes/ENSG00000126091/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const data = await res.json();
    expect(data.length).toBeGreaterThan(0);
  });
});
