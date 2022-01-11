import fetch from "node-fetch";

describe("GEM comparison", () => {
  test("the comparison should have reactions data", async () => {
    const res = await fetch(
      `${API_BASE}/compare?models=[%7B"model":"FruitflyGem","version":"1_1_0"%7D,%7B"model":"HumanGem","version":"1_10_0"%7D]`
    );

    const { Reaction } = await res.json();
    expect(Reaction[0].FruitflyGem).toBeGreaterThanOrEqual(
      Reaction[2].FruitflyGem
    );
    expect(Reaction[1].HumanGem).toBeGreaterThanOrEqual(Reaction[2].HumanGem);
  });

  test("the comparison details should have lists of unique reactions and metabolites", async () => {
    const res = await fetch(
      `${API_BASE}/comparison-details?model=%7B"model":"FruitflyGem","version":"1_1_0"%7D&models=[%7B"model":"HumanGem","version":"1_10_0"%7D]`
    );

    const {
      details: { CompartmentalizedMetabolite, Reaction },
    } = await res.json();

    expect(CompartmentalizedMetabolite.unique.length).toBeGreaterThan(0);
    expect(Reaction.unique.length).toBeGreaterThan(0);
  });
});
