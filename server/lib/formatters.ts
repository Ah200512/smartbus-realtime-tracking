type WithId = {
  id: string;
};

export function withLegacyId<T extends WithId>(record: T) {
  return {
    ...record,
    _id: record.id,
  };
}

export function withLegacyIds<T extends WithId>(records: T[]) {
  return records.map((record) => withLegacyId(record));
}

export function withLegacyUser<T extends WithId & { password?: string }>(record: T) {
  const rest = { ...record } as { password?: string } & WithId;
  delete rest.password;
  return {
    ...rest,
    _id: record.id,
  };
}
