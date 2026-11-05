import { describe, expect, it } from "vitest";
import { buildPageSearch, readPageRequest, shouldReplaceHistory } from "./app-page";

describe("app page links", () => {
	it("keeps a signed-out stock link through the login gate and a refresh", () => {
		const requested = readPageRequest("?page=stock-detail&symbol=HYBE", false);
		expect(requested).toEqual({
			view: "login",
			returnView: "stock-detail",
			symbol: "HYBE",
		});

		const gated = buildPageSearch({
			view: requested.view,
			returnView: requested.returnView,
			symbol: requested.symbol,
		});
		expect(gated).toBe("?page=login&next=stock-detail&symbol=HYBE");
		expect(shouldReplaceHistory("?page=stock-detail&symbol=HYBE", "login", "stock-detail")).toBe(true);

		expect(readPageRequest(gated, false)).toEqual(requested);
	});

	it("opens the saved stock after sign-in without stacking another login entry", () => {
		const gated = "?page=login&next=stock-detail&symbol=HYBE";
		expect(readPageRequest(gated, true)).toEqual({
			view: "stock-detail",
			returnView: null,
			symbol: "HYBE",
		});
		expect(shouldReplaceHistory(gated, "stock-detail", null)).toBe(true);
		expect(buildPageSearch({ view: "stock-detail", symbol: "HYBE" })).toBe("?page=stock-detail&symbol=HYBE");
	});

	it("leaves an ordinary navigation on the history stack", () => {
		expect(shouldReplaceHistory("?page=portfolio", "markets", null)).toBe(false);
		expect(buildPageSearch({ view: "markets" })).toBe("?page=markets");
	});
});
