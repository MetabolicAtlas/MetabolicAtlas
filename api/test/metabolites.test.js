import fetch from "node-fetch";

describe("metabolites", () => {
  test("a metabolite should have a list of subsystems", async () => {
    const res = await fetch(
      `${API_BASE}/metabolites/MAM01199m?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const { subsystems } = await res.json();
    expect(subsystems.length).toBeGreaterThan(0);
  });

  test("a metabolite should have related reactions", async () => {
    const res = await fetch(
      `${API_BASE}/metabolites/MAM01199m/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const data = await res.json();
    expect(data.length).toBeGreaterThan(0);
  });
});
