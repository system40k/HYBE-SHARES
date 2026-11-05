import { DataType, Direction, MultiSelector, SimpleSelector } from "./common";
import type {
  Page,
  Format,
  Index,
  Filter,
  Sort,
  Data,
  SimpleFilter,
  MultiFilter,
  Value,
  AllRequest,
  InsertRequest,
  PurgeRequest,
  GetRequest,
  SetRequest,
  DeleteRequest,
  MGetRequest,
  MSetRequest,
  ListRequest,
  IncreaseCounterRequest,
  CountRankedListRequest,
  AllResponse,
  InsertResponse,
  PurgeResponse,
  GetResponse,
  SetResponse,
  DeleteResponse,
  MGetResponse,
  MSetResponse,
  ListResponse,
  IncreaseCounterResponse,
  CountRankedListResponse,
} from "./common";

const STORAGE_KEY = "hybe_local_datastore";

type Database = Record<string, Data[]>;

/**
 * Browser-local data store.
 * Records stay in this browser. Each call reloads localStorage so one tab
 * cannot persist a stale copy over another tab's writes.
 */
export class DataStoreClient {
  private static instance: DataStoreClient | null = null;

  /**
   * Get singleton instance of DataStoreClient.
   */
  public static getInstance(_timeout?: number): DataStoreClient {
    if (!DataStoreClient.instance) {
      DataStoreClient.instance = new DataStoreClient();
    }

    return DataStoreClient.instance;
  }

  private readRows(entityId: string): Data[] {
    const rows = readDatabase()[entityId];
    return Array.isArray(rows) ? rows : [];
  }

  private modify(entityId: string, update: (rows: Data[]) => Data[]): Data[] {
    const db = readDatabase();
    const current = Array.isArray(db[entityId]) ? db[entityId] : [];
    const next = update(current);
    db[entityId] = next;
    writeDatabase(db);
    return next;
  }

  async all(request: AllRequest): Promise<AllResponse> {
    return { data: resultOf(this.readRows(request.id).map(cloneData)) };
  }

  async insert(request: InsertRequest): Promise<InsertResponse> {
    const incoming = request.batch ?? (request.data ? [request.data] : []);
    const created = incoming.map((item) => stamp(cloneData(item), true));
    this.modify(request.id, (rows) => [...rows, ...created]);
    return { data: resultOf(created.map(cloneData)) };
  }

  async purge(request: PurgeRequest): Promise<PurgeResponse> {
    this.modify(request.id, () => []);
    return { data: resultOf([]) };
  }

  async get(request: GetRequest): Promise<GetResponse> {
    const matches = this.readRows(request.id).filter((row) => matchesIndex(row, request.index));
    return { data: resultOf(matches.map(cloneData)) };
  }

  async set(request: SetRequest): Promise<SetResponse> {
    const current = this.readRows(request.id);
    const matches = current.filter((row) => matchesIndex(row, request.index));
    if (matches.length === 0) {
      if (request.upsert && request.data) {
        return this.insert({ ...request, batch: [request.data] });
      }
      return { data: resultOf([]) };
    }

    const updated: Data[] = [];
    this.modify(request.id, (rows) =>
      rows.map((row) => {
        if (!matchesIndex(row, request.index) || !request.data) {
          return row;
        }
        const merged = cloneData(request.data);
        if (!fieldString(merged, "id")) copyField(row, merged, "id");
        if (!fieldString(merged, "create_time")) copyField(row, merged, "create_time");
        if (!fieldString(merged, "data_creator")) copyField(row, merged, "data_creator");
        const stamped = stamp(merged, false);
        updated.push(stamped);
        return stamped;
      }),
    );
    return { data: resultOf(updated.map(cloneData)) };
  }

  async delete(request: DeleteRequest): Promise<DeleteResponse> {
    this.modify(request.id, (rows) => rows.filter((row) => !matchesIndex(row, request.index)));
    return { data: resultOf([]) };
  }

  async mGet(request: MGetRequest): Promise<MGetResponse> {
    const rows = this.readRows(request.id);
    const matches = request.indexes.flatMap((index) => rows.filter((row) => matchesIndex(row, index)));
    return { data: resultOf(matches.map(cloneData)) };
  }

  async mSet(request: MSetRequest): Promise<MSetResponse> {
    const updated: Data[] = [];
    for (let i = 0; i < request.indexes.length; i++) {
      const data = request.data[i];
      if (!data) continue;
      const response = await this.set({
        id: request.id,
        namespace: request.namespace,
        name: request.name,
        version: request.version,
        task: request.task,
        index: request.indexes[i],
        data,
        upsert: request.upsert,
        format: request.format,
      });
      updated.push(...(response.data?.values ?? []));
    }
    return { data: resultOf(updated) };
  }

  async list(request: ListRequest): Promise<ListResponse> {
    let rows = this.readRows(request.id).filter((row) => matchesFilter(row, request.filter));
    rows = [...rows].sort((left, right) => compareRecords(left, right, request.sort));
    const total = rows.length;
    const page = paginate(rows, request.paginate, total);
    return { data: { values: page.rows.map(cloneData), page: page.page } };
  }

  async increaseCounter(request: IncreaseCounterRequest): Promise<IncreaseCounterResponse> {
    const delta = request.delta ?? 1;
    const updated: Data[] = [];
    this.modify(request.id, (rows) =>
      rows.map((row) => {
        if (!matchesIndex(row, request.index)) return row;
        const copy = cloneData(row);
        const target = copy.structured.find((value) => value.type === DataType.number) ?? copy.structured.find((value) => value.name === "value");
        if (target) {
          const currentValue = Number(ParseValue(target, DataType.number));
          target.type = DataType.number;
          target.number = currentValue + delta;
        } else {
          copy.structured.push(CreateValue(DataType.number, delta, "value"));
        }
        updated.push(copy);
        return copy;
      }),
    );
    return { data: resultOf(updated.map(cloneData)) };
  }

  async countRankedList(request: CountRankedListRequest): Promise<CountRankedListResponse> {
    const total = this.readRows(request.id).length;
    return { data: { values: [], page: { number: 0, size: 0, total } } };
  }
}

function readDatabase(): Database {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Database;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeDatabase(db: Database): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function cloneData(data: Data): Data {
  return {
    structured: data.structured.map((value) => ({
      ...value,
      object: value.object ? [...value.object] : [],
      array: value.array ? [...value.array] : [],
    })),
    serialized: data.serialized,
  };
}

function resultOf(values: Data[]): { values: Data[]; page: Page } {
  return { values, page: { number: 0, size: values.length, total: values.length } };
}

function fieldString(record: Data, name: string): string {
  const field = record.structured.find((value) => value.name === name);
  if (!field) return "";
  const parsed = ParseValue(field, field.type);
  return parsed === undefined || parsed === null ? "" : String(parsed);
}

function copyField(from: Data, to: Data, name: string): void {
  const source = from.structured.find((value) => value.name === name);
  if (!source) return;
  const target = to.structured.find((value) => value.name === name);
  if (target) {
    Object.assign(target, source);
    return;
  }
  to.structured.push({ ...source, object: [...(source.object ?? [])], array: [...(source.array ?? [])] });
}

function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `local-${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
}

function stamp(record: Data, creating: boolean): Data {
  const now = String(Math.floor(Date.now() / 1000));
  const setString = (name: string, value: string) => {
    const existing = record.structured.find((field) => field.name === name);
    if (existing) {
      existing.type = DataType.string;
      existing.string = value;
      return;
    }
    record.structured.push(CreateValue(DataType.string, value, name));
  };
  if (!fieldString(record, "id")) setString("id", newId());
  if (creating && !fieldString(record, "create_time")) setString("create_time", now);
  setString("update_time", now);
  return record;
}

function matchesIndex(record: Data, index?: Index): boolean {
  if (!index || index.fields.length === 0) return false;
  return index.fields.every((field, position) => {
    const expected = index.values[position];
    const actual = record.structured.find((value) => value.name === field);
    if (!expected || !actual) return false;
    return ParseValue(actual, actual.type) === ParseValue(expected, expected.type);
  });
}

function matchesFilter(record: Data, filter?: Filter): boolean {
  if (!filter) return true;
  const simples = filter.simples ?? [];
  const multiples = filter.multiples ?? [];
  return simples.every((item) => matchSimple(record, item)) && multiples.every((item) => matchMulti(record, item));
}

function matchSimple(record: Data, filter: SimpleFilter): boolean {
  const field = record.structured.find((value) => value.name === filter.field);
  if (filter.symbol === SimpleSelector.exists) return Boolean(field);
  if (filter.symbol === SimpleSelector.not_exists) return !field;
  if (!filter.value) return false;
  const left = field ? ParseValue(field, field.type) : undefined;
  const right = ParseValue(filter.value, filter.value.type);
  switch (filter.symbol) {
    case SimpleSelector.equal:
      return left === right;
    case SimpleSelector.not_equal:
    case SimpleSelector.not:
      return left !== right;
    case SimpleSelector.greater:
      return Number(left) > Number(right);
    case SimpleSelector.greater_or_equal:
      return Number(left) >= Number(right);
    case SimpleSelector.less:
      return Number(left) < Number(right);
    case SimpleSelector.less_or_equal:
      return Number(left) <= Number(right);
    case SimpleSelector.similar:
    case SimpleSelector.not_similar:
    case SimpleSelector.match:
    case SimpleSelector.not_match: {
      const includes = String(left ?? "").toLowerCase().includes(String(right).toLowerCase());
      return filter.symbol === SimpleSelector.not_similar || filter.symbol === SimpleSelector.not_match ? !includes : includes;
    }
    case SimpleSelector.in:
    case SimpleSelector.not_in: {
      const included = arrayIncludes(filter.value, left);
      return filter.symbol === SimpleSelector.not_in ? !included : included;
    }
    default:
      return left === right;
  }
}

function matchMulti(record: Data, filter: MultiFilter): boolean {
  const results = filter.value.map((item) => matchSimple(record, item));
  switch (filter.symbol) {
    case MultiSelector.or:
      return results.some(Boolean);
    case MultiSelector.nor:
      return results.every((item) => !item);
    case MultiSelector.and:
    default:
      return results.every(Boolean);
  }
}

function arrayIncludes(value: Value, candidate: unknown): boolean {
  const items = value.array?.length ? value.array.map((item) => ParseValue(item, item.type)) : [];
  return items.some((item) => item === candidate);
}

function compareRecords(left: Data, right: Data, sort?: Sort): number {
  if (!sort) return 0;
  for (const order of sort.orders) {
    const leftField = left.structured.find((value) => value.name === order.field);
    const rightField = right.structured.find((value) => value.name === order.field);
    const leftValue = leftField ? ParseValue(leftField, leftField.type) : "";
    const rightValue = rightField ? ParseValue(rightField, rightField.type) : "";
    let compared = 0;
    if (typeof leftValue === "number" && typeof rightValue === "number") {
      compared = leftValue - rightValue;
    } else {
      compared = String(leftValue).localeCompare(String(rightValue));
    }
    if (compared !== 0) {
      return order.symbol === Direction.descending ? -compared : compared;
    }
  }
  return 0;
}

function paginate(rows: Data[], page: Page | undefined, total: number): { rows: Data[]; page: Page } {
  if (!page || page.size <= 0) {
    return { rows, page: { number: 0, size: rows.length, total } };
  }
  const start = Math.max(0, page.number) * page.size;
  return {
    rows: rows.slice(start, start + page.size),
    page: { number: page.number, size: page.size, total },
  };
}

/**
 * Builder for creating filters
 */
export class FilterBuilder {
  private simples: SimpleFilter[] = [];
  private multiples: MultiFilter[] = [];

  simple(
    field: string,
    selector: SimpleSelector,
    value?: Value
  ): FilterBuilder {
    this.simples.push({
      symbol: selector,
      field,
      value,
    });
    return this;
  }

  multiple(
    field: string | undefined,
    selector: MultiSelector,
    filters: SimpleFilter[]
  ): FilterBuilder {
    this.multiples.push({
      symbol: selector,
      field,
      value: filters,
    });
    return this;
  }

  // Convenience methods
  equal(field: string, value: Value): FilterBuilder {
    return this.simple(field, SimpleSelector.equal, value);
  }

  notEqual(field: string, value: Value): FilterBuilder {
    return this.simple(field, SimpleSelector.not_equal, value);
  }

  greater(field: string, value: Value): FilterBuilder {
    return this.simple(field, SimpleSelector.greater, value);
  }

  less(field: string, value: Value): FilterBuilder {
    return this.simple(field, SimpleSelector.less, value);
  }

  in(field: string, value: Value): FilterBuilder {
    return this.simple(field, SimpleSelector.in, value);
  }

  exists(field: string): FilterBuilder {
    return this.simple(field, SimpleSelector.exists);
  }

  build(): Filter {
    return {
      simples: this.simples,
      multiples: this.multiples,
      groups: [],
      unwinds: [],
    };
  }
}

/**
 * Builder for creating sort orders
 */
export class SortBuilder {
  private orders: Array<{ symbol: Direction; field: string }> = [];

  add(field: string, direction: Direction): SortBuilder {
    this.orders.push({ symbol: direction, field });
    return this;
  }

  ascending(field: string): SortBuilder {
    return this.add(field, Direction.ascending);
  }

  descending(field: string): SortBuilder {
    return this.add(field, Direction.descending);
  }

  build(): Sort {
    return {
      orders: this.orders,
    };
  }
}

export function CreateData(fields: Value[]): Data {
  return {
    structured: fields,
  };
}

export function CreateValue(
  type: DataType,
  value: unknown,
  name?: string
): Value {
  const v: Value = {
    type: type,
    name: name,
    object: [],
    array: [],
  };

  // Set the appropriate value field based on type
  switch (type) {
    case DataType.string:
      v.string = String(value);
      break;
    case DataType.number:
      v.number = Number(value);
      break;
    case DataType.boolean:
      v.boolean = Boolean(value);
      break;
    case DataType.enumeration:
      v.enumeration = typeof value === "bigint" ? Number(value) : Number(value);
      break;
    case DataType.array:
      v.array = createArrayValue(value);
      break;
    case DataType.object:
      v.object = createObjectValue(value);
      break;
    case DataType.reference:
      v.object = createObjectValue(value);
      break;
    default:
      break;
  }
  return v;
}

function createArrayValue(value: unknown): Value[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item, _) => {
    const itemType = determineValueType(item);
    return CreateValue(itemType, item);
  });
}

function createObjectValue(value: unknown): Value[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return [];
  }

  const fields: Value[] = [];
  for (const [key, val] of Object.entries(value)) {
    const fieldType = determineValueType(val);
    fields.push(CreateValue(fieldType, val, key));
  }

  return fields;
}

function determineValueType(value: unknown): DataType {
  if (typeof value === "string") return DataType.string;
  if (typeof value === "number") return DataType.number;
  if (typeof value === "boolean") return DataType.boolean;
  if (Array.isArray(value)) return DataType.array;
  if (typeof value === "object" && value !== null) return DataType.object;

  // Default to string for unknown types
  return DataType.string;
}

export function ParseValue(value: Value, type: DataType): unknown {
  switch (type) {
    case DataType.string:
      return value.string || "";
    case DataType.number:
      return value.number !== undefined ? Number(value.number) : 0;
    case DataType.boolean:
      return value.boolean !== undefined ? Boolean(value.boolean) : false;
    case DataType.enumeration:
      // Use number instead of BigInt
      return value.enumeration !== undefined ? Number(value.enumeration) : 0;
    case DataType.array:
      return parseArrayValue(value.array);
    case DataType.object:
      return parseObjectValue(value.object);
    case DataType.reference:
      return parseObjectValue(value.object);
    default:
      return "";
  }
}

function parseArrayValue(value: Value[]): unknown[] {
  if (!Array.isArray(value)) {
    return [];
  }

  // Sort by name (which should be the index) to maintain order
  const sortedItems = value.sort((a, b) => {
    const indexA = Number.parseInt(a.name ?? "") || 0;
    const indexB = Number.parseInt(b.name ?? "") || 0;
    return indexA - indexB;
  });

  return sortedItems.map((item) => {
    return ParseValue(item, item.type);
  });
}

function parseObjectValue(value: Value[]): Record<string, unknown> {
  if (!Array.isArray(value)) {
    return {};
  }

  const result: Record<string, unknown> = {};
  for (const field of value) {
    if (field.name) {
      result[field.name] = ParseValue(field, field.type);
    }
  }

  return result;
}

// Export convenience types
export type { Page, Format, Value, Filter, Index, Sort };
