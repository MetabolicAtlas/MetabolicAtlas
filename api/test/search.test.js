import { default as driver } from "neo4j/driver";
import { search } from "neo4j/queries/search";

describe("search", () => {
  afterAll(async () => {
    await driver.close();
  });

  test("model search to have 50 results per component type if there are too many matches", async () => {
    const data = await search({
      searchTerm: "H2O",
      model: "HumanGem",
      version: HUMAN_GEM_VERSION,
    });

    expect(Object.keys(data)).toContain("Human-GEM");

    const { metabolite } = data["Human-GEM"];
    expect(metabolite.length).toBe(50);
  });
});
