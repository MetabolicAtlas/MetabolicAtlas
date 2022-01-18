import fetch from "node-fetch";

describe("HPA", () => {
  test("should return a list of genes", async () => {
    const res = await fetch(`${API_BASE}/hpa/genes`);

    const genes = await res.json();
    expect(genes.length).toBeGreaterThan(0);
    expect(genes[0].length).toBe(3);
    expect(genes[genes.length - 1].length).toBe(3);
  });

  test("should return details for a gene", async () => {
    const res = await fetch(`${API_BASE}/hpa/gene/ENSG00000126091`);

    const { gene_url, compartments, subsystems } = await res.json();
    expect(gene_url.length).toBeGreaterThan(0);
    expect(compartments.length).toBeGreaterThan(0);
    expect(subsystems.length).toBeGreaterThan(0);
  });
});
