export const APP_VIEWS = [
	"splash",
	"login",
	"register",
	"forgot-password",
	"onboarding",
	"portfolio",
	"trade",
	"markets",
	"account",
	"stock-detail",
	"exclusive",
	"education",
	"notifications",
	"transaction-history",
	"portfolio-analytics",
	"leaderboard",
	"security-settings",
	"price-alerts",
	"fan-vestor",
	"weverse-wallet",
	"nft-collectibles",
	"agm-voting",
	"recurring-buys",
	"fandom-analytics",
	"sell-shares",
	"settlement-status",
	"withdraw-funds",
] as const;

export type AppView = (typeof APP_VIEWS)[number];

export const PUBLIC_VIEWS = new Set<AppView>(["splash", "login", "register", "forgot-password"]);

export interface PageRequest {
	view: AppView;
	returnView: AppView | null;
	symbol: string | null;
}

export function isAppView(value: string | null): value is AppView {
	return !!value && (APP_VIEWS as readonly string[]).includes(value);
}

function searchParams(search: string): URLSearchParams {
	const query = search.startsWith("?") ? search.slice(1) : search;
	return new URLSearchParams(query);
}

/**
 * Resolve which screen to show without discarding a signed-out deep link.
 * A private page stays available as `returnView` plus `symbol`.
 */
export function readPageRequest(search: string, signedIn: boolean): PageRequest {
	const params = searchParams(search);
	const page = params.get("page");
	const next = params.get("next");
	const symbol = params.get("symbol");
	const privatePage = isAppView(page) && !PUBLIC_VIEWS.has(page) ? page : null;
	const returnFromNext = isAppView(next) && !PUBLIC_VIEWS.has(next) ? next : null;

	if (!signedIn && privatePage) {
		return {
			view: "login",
			returnView: privatePage,
			symbol: privatePage === "stock-detail" ? symbol : null,
		};
	}

	if ((page === "login" || page === "register") && returnFromNext) {
		if (signedIn) {
			return {
				view: returnFromNext,
				returnView: null,
				symbol: returnFromNext === "stock-detail" ? symbol : null,
			};
		}
		return {
			view: page,
			returnView: returnFromNext,
			symbol: returnFromNext === "stock-detail" ? symbol : null,
		};
	}

	if (page === "onboarding" && returnFromNext) {
		return {
			view: "onboarding",
			returnView: returnFromNext,
			symbol: returnFromNext === "stock-detail" ? symbol : null,
		};
	}

	const view = isAppView(page) ? page : "splash";
	return {
		view,
		returnView: null,
		symbol: view === "stock-detail" ? symbol : null,
	};
}

/**
 * Build a query string. Login and register keep `next` and `symbol` so a
 * refresh can still open the page the visitor asked for.
 */
export function buildPageSearch(options: {
	view: AppView;
	symbol?: string | null;
	returnView?: AppView | null;
}): string {
	const params = new URLSearchParams();
	const returnView = options.returnView && !PUBLIC_VIEWS.has(options.returnView) ? options.returnView : null;
	const keepsDestination = options.view === "login" || options.view === "register" || options.view === "onboarding";

	if (keepsDestination && returnView) {
		params.set("page", options.view);
		params.set("next", returnView);
		if (returnView === "stock-detail" && options.symbol) params.set("symbol", options.symbol);
		return `?${params.toString()}`;
	}

	params.set("page", options.view);
	if (options.view === "stock-detail" && options.symbol) params.set("symbol", options.symbol);
	return `?${params.toString()}`;
}

/**
 * Auth gates replace the current history entry. Pushing a login URL on top of
 * the private page makes Back return to that page and immediately bounce to
 * login again.
 */
export function shouldReplaceHistory(currentSearch: string, nextView: AppView, returnView: AppView | null): boolean {
	const params = searchParams(currentSearch);
	if (!params.has("page")) return true;
	if ((nextView === "login" || nextView === "register") && returnView && !PUBLIC_VIEWS.has(returnView)) return true;
	const page = params.get("page");
	const next = params.get("next");
	if ((page === "login" || page === "register") && next === nextView) return true;
	return false;
}
