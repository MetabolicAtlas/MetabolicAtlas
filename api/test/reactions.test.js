import fetch from "node-fetch";

describe("reactions", () => {
  test("a reaction should have a list of subsystems", async () => {
    const res = await fetch(
      `${API_BASE}/reactions/MAR01166?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const { subsystems } = await res.json();
    expect(subsystems.length).toBeGreaterThan(0);
  });
});
