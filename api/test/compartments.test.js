import fetch from "node-fetch";

describe("compartments", () => {
  test("a compartment should have a list of subsystems", async () => {
    const res = await fetch(
      `${API_BASE}/compartments/nucleus?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const { info, subsystems } = await res.json();
    expect(info.subsystemCount).toBeGreaterThan(0);
    expect(info.subsystemCount).toBe(subsystems.length);
  });

  test("a compartment should have related reactions", async () => {
    const res = await fetch(
      `${API_BASE}/compartments/nucleus/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const data = await res.json();
    expect(data.length).toBeGreaterThan(0);
  });
});
