import fetch from "node-fetch";

describe("maps", () => {
  test("a maps listing should include lists of compartments and subsystems", async () => {
    const res = await fetch(
      `${API_BASE}/maps/listing?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const { compartments, subsystems } = await res.json();
    expect(compartments.length).toBeGreaterThan(0);
    expect(subsystems.length).toBeGreaterThan(0);
  });
});
