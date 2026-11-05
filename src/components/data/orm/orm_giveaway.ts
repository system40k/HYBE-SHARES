import seed from "@/components/data/seed/giveaway.json";
import { DataType } from "./common";
import type { Data, Value } from "./common";
import { CreateData, CreateValue, DataStoreClient, ParseValue } from "./client";

const CAMPAIGN_ENTITY = "hybe-giveaway-campaign";
const PERMIT_ENTITY = "hybe-giveaway-permit";

export const PermitStatus = {
	available: "available",
	claimed: "claimed",
} as const;

export interface GiveawayCampaign {
	id: string;
	title: string;
	artists: string;
	tagline: string;
	permit_label: string;
	access_note: string;
	registration_note: string;
	consent_note: string;
	welcome_title: string;
	starting_balance: number;
	currency: string;
}

export interface GiveawayPermit {
	id: string;
	code: string;
	holder_name: string;
	holder_email: string;
	status: string;
	claimed_by: string;
}

type CampaignSeed = Omit<GiveawayCampaign, "id">;
type PermitSeed = Omit<GiveawayPermit, "id">;

const campaignFields: Array<[keyof CampaignSeed, DataType]> = [
	["title", DataType.string],
	["artists", DataType.string],
	["tagline", DataType.string],
	["permit_label", DataType.string],
	["access_note", DataType.string],
	["registration_note", DataType.string],
	["consent_note", DataType.string],
	["welcome_title", DataType.string],
	["starting_balance", DataType.number],
	["currency", DataType.string],
];

const permitFields: Array<[keyof PermitSeed, DataType]> = [
	["code", DataType.string],
	["holder_name", DataType.string],
	["holder_email", DataType.string],
	["status", DataType.string],
	["claimed_by", DataType.string],
];

function toData(fields: Array<[string, DataType]>, record: object): Data {
	const values = fields.map(([name, type]) => {
		const raw = (record as Record<string, unknown>)[name];
		return CreateValue(type, raw ?? (type === DataType.number ? 0 : ""), name);
	});
	return CreateData(values);
}

function fromData<T>(data: Data): T {
	const record: Record<string, unknown> = {};
	for (const field of data.structured) {
		if (!field.name) continue;
		record[field.name] = ParseValue(field, field.type);
	}
	return record as T;
}

function rows(response: { data?: { values: Data[] } }): Data[] {
	return response.data?.values ?? [];
}

export class GiveawayORM {
	private static instance: GiveawayORM | null = null;
	private client = DataStoreClient.getInstance();

	static getInstance(): GiveawayORM {
		if (!GiveawayORM.instance) GiveawayORM.instance = new GiveawayORM();
		return GiveawayORM.instance;
	}

	async getCampaign(): Promise<GiveawayCampaign | null> {
		const response = await this.client.all({
			id: CAMPAIGN_ENTITY,
			namespace: "giveaway",
			name: "campaign",
			version: "1",
			task: "giveaway",
		});
		const [first] = rows(response);
		return first ? fromData<GiveawayCampaign>(first) : null;
	}

	async getPermits(): Promise<GiveawayPermit[]> {
		const response = await this.client.all({
			id: PERMIT_ENTITY,
			namespace: "giveaway",
			name: "permit",
			version: "1",
			task: "giveaway",
		});
		return rows(response).map((row) => fromData<GiveawayPermit>(row));
	}

	async findPermit(code: string): Promise<GiveawayPermit | null> {
		const normalized = code.trim().toUpperCase();
		const permits = await this.getPermits();
		return permits.find((permit) => permit.code.toUpperCase() === normalized) ?? null;
	}

	async claimPermit(permit: GiveawayPermit, userId: string): Promise<GiveawayPermit> {
		const next: GiveawayPermit = { ...permit, status: PermitStatus.claimed, claimed_by: userId };
		const response = await this.client.set({
			id: PERMIT_ENTITY,
			namespace: "giveaway",
			name: "permit",
			version: "1",
			task: "giveaway",
			index: {
				fields: ["id"],
				values: [CreateValue(DataType.string, permit.id, "id") as Value],
			},
			data: toData([["id", DataType.string], ...permitFields], next),
		});
		const [saved] = rows(response);
		return saved ? fromData<GiveawayPermit>(saved) : next;
	}

	async purge(): Promise<void> {
		await this.client.purge({ id: CAMPAIGN_ENTITY, namespace: "giveaway", name: "campaign", version: "1", task: "giveaway" });
		await this.client.purge({ id: PERMIT_ENTITY, namespace: "giveaway", name: "permit", version: "1", task: "giveaway" });
	}

	async insertCampaign(campaign: CampaignSeed): Promise<GiveawayCampaign> {
		const response = await this.client.insert({
			id: CAMPAIGN_ENTITY,
			namespace: "giveaway",
			name: "campaign",
			version: "1",
			task: "giveaway",
			data: toData(campaignFields, campaign),
		});
		const [saved] = rows(response);
		if (!saved) throw new Error("Campaign was not stored");
		return fromData<GiveawayCampaign>(saved);
	}

	async insertPermits(permits: PermitSeed[]): Promise<void> {
		if (permits.length === 0) return;
		await this.client.insert({
			id: PERMIT_ENTITY,
			namespace: "giveaway",
			name: "permit",
			version: "1",
			task: "giveaway",
			batch: permits.map((permit) => toData(permitFields, permit)),
		});
	}
}

export async function ensureGiveawayData(): Promise<GiveawayCampaign> {
	const orm = GiveawayORM.getInstance();
	const existing = await orm.getCampaign();
	if (existing) return existing;
	const campaign = await orm.insertCampaign(seed.campaign);
	await orm.insertPermits(seed.permits);
	return campaign;
}
