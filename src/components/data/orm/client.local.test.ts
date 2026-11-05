import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateValue } from "./client";
import { DataType, SimpleSelector } from "./common";
import { UserORM, UserRiskProfile, type UserModel } from "./orm_user";

describe("local data store", () => {
	beforeEach(async () => {
		await UserORM.getInstance().purgeAllUser();
	});

	it("creates and reads a user without calling the network", async () => {
		const fetchSpy = vi.spyOn(globalThis, "fetch");
		const orm = UserORM.getInstance();

		const created = await orm.insertUser([
			{
				email: "ada@example.com",
				password_hash: "hash",
				name: "Ada",
				risk_profile: UserRiskProfile.Moderate,
				virtual_balance: 10000000,
				loyalty_points: 0,
				two_factor_enabled: false,
				onboarding_completed: false,
			} as UserModel,
		]);

		expect(created).toHaveLength(1);
		expect(created[0]?.id).toBeTruthy();
		expect(created[0]?.email).toBe("ada@example.com");

		const byEmail = await orm.getUserByEmail("ada@example.com");
		expect(byEmail).toHaveLength(1);
		expect(byEmail[0]?.name).toBe("Ada");

		const [listed] = await orm.listUser({
			simples: [
				{
					symbol: SimpleSelector.equal,
					field: "email",
					value: CreateValue(DataType.string, "ada@example.com", "email"),
				},
			],
			multiples: [],
			groups: [],
			unwinds: [],
		});
		expect(listed).toHaveLength(1);

		const updated = await orm.setUserById(created[0].id, {
			...created[0],
			onboarding_completed: true,
		});
		expect(updated[0]?.onboarding_completed).toBe(true);
		expect(fetchSpy).not.toHaveBeenCalled();
		fetchSpy.mockRestore();
	});
});
