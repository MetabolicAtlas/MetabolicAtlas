import { default as driver } from "neo4j/driver";
import { search } from "neo4j/queries/search";

describe("search", () => {
  afterAll(async () => {
    await driver.close();
  });

  test("model search to have max 50 results per component type as default", async () => {
    const data = await search({
      searchTerm: "H2O",
      model: "HumanGem",
      version: "1_10_0",
    });

    expect(Object.keys(data)).toContain("Human-GEM");

    const { metabolite } = data["Human-GEM"];
    expect(metabolite.length).toBe(50);
  });
});
