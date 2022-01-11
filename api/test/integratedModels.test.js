import fetch from "node-fetch";

describe("integrated models", () => {
  test("there should be 7 integrated models", async () => {
    const res = await fetch(`${API_BASE}/repository/integrated_models`);

    const data = await res.json();
    expect(data.length).toBe(7);
  });

  test("the Human-GEM should exist", async () => {
    const res = await fetch(
      `${API_BASE}/repository/integrated_models/Human-GEM`
    );

    const { short_name, condition } = await res.json();
    expect(short_name).toBe("Human-GEM");
    expect(condition).toBe("Generic metabolism");
  });
});
