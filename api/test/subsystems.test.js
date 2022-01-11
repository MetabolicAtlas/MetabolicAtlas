import fetch from "node-fetch";

describe("subsystems", () => {
  test("a subsystem should have a list of genes", async () => {
    const res = await fetch(
      `${API_BASE}/subsystems/lysine_metabolism?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const { genes } = await res.json();
    expect(genes.length).toBeGreaterThan(0);
  });

  test("a subsystem should have related reactions", async () => {
    const res = await fetch(
      `${API_BASE}/subsystems/lysine_metabolism/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const data = await res.json();
    expect(data.length).toBeGreaterThan(0);
  });
});
