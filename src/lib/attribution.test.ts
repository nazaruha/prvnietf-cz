import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { emptyAttribution, readAttribution, withAttribution } from "./attribution.ts";

const params = (query: string) => new URLSearchParams(query);

describe("readAttribution", () => {
  it("defaults to hero A with no ad version and no UTMs", () => {
    assert.deepEqual(readAttribution(params("")), {
      ad_version: null,
      hero_variant: "a",
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
    });
  });

  it("shows hero B only for v=b", () => {
    assert.equal(readAttribution(params("v=b")).hero_variant, "b");
    assert.equal(readAttribution(params("v=a")).hero_variant, "a");
    assert.equal(readAttribution(params("v=B")).hero_variant, "a");
  });

  it("ignores unknown ad versions", () => {
    assert.equal(readAttribution(params("v=c")).ad_version, null);
  });

  it("reads all utm_* params", () => {
    const result = readAttribution(
      params("utm_source=facebook&utm_medium=paid&utm_campaign=etf&utm_content=ad_b&utm_term=x"),
    );
    assert.equal(result.utm_source, "facebook");
    assert.equal(result.utm_medium, "paid");
    assert.equal(result.utm_campaign, "etf");
    assert.equal(result.utm_content, "ad_b");
    assert.equal(result.utm_term, "x");
  });

  it("keeps carried values when the URL has none", () => {
    const carried = readAttribution(params("v=b&utm_source=facebook"));
    const result = readAttribution(params("etf=VWCE"), carried);
    assert.equal(result.ad_version, "b");
    assert.equal(result.hero_variant, "b");
    assert.equal(result.utm_source, "facebook");
  });

  it("lets URL values override carried ones", () => {
    const carried = readAttribution(params("v=b&utm_source=facebook"));
    const result = readAttribution(params("v=a&utm_source=instagram"), carried);
    assert.equal(result.ad_version, "a");
    assert.equal(result.utm_source, "instagram");
  });

  it("treats empty params as missing", () => {
    const carried = readAttribution(params("utm_source=facebook"));
    assert.equal(readAttribution(params("utm_source="), carried).utm_source, "facebook");
  });
});

describe("withAttribution", () => {
  it("adds v and UTMs while keeping the path's own params", () => {
    const attribution = readAttribution(params("v=b&utm_source=facebook&utm_campaign=etf"));
    assert.equal(
      withAttribution("/dekujeme?etf=VWCE", attribution),
      "/dekujeme?etf=VWCE&v=b&utm_source=facebook&utm_campaign=etf",
    );
  });

  it("leaves the path unchanged without attribution", () => {
    assert.equal(withAttribution("/dekujeme?etf=VWCE", emptyAttribution()), "/dekujeme?etf=VWCE");
  });

  it("encodes values safely", () => {
    const attribution = readAttribution(params("utm_campaign=a%26b%20c"));
    assert.equal(withAttribution("/dekujeme", attribution), "/dekujeme?utm_campaign=a%26b+c");
  });
});
