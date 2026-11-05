import { beforeEach, describe, expect, it } from "vitest";
import { ensureGiveawayData, GiveawayORM, PermitStatus } from "./orm_giveaway";

describe("giveaway database", () => {
	beforeEach(async () => {
		await GiveawayORM.getInstance().purge();
	});

	it("loads the campaign and permits from the store", async () => {
		const campaign = await ensureGiveawayData();
		expect(campaign.starting_balance).toBeGreaterThan(0);
		expect(campaign.permit_label.length).toBeGreaterThan(0);

		const again = await ensureGiveawayData();
		expect(again.id).toBe(campaign.id);

		const permit = await GiveawayORM.getInstance().findPermit("hybh4cex464rw");
		expect(permit?.holder_name).toBeTruthy();
		expect(permit?.status).toBe(PermitStatus.available);

		const claimed = await GiveawayORM.getInstance().claimPermit(permit!, "user-1");
		expect(claimed.status).toBe(PermitStatus.claimed);
		expect(claimed.claimed_by).toBe("user-1");

		const reread = await GiveawayORM.getInstance().findPermit(permit!.code);
		expect(reread?.status).toBe(PermitStatus.claimed);
	});
});
