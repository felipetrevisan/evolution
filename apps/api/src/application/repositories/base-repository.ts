export type UserScopedRecord = {
  id: string;
  uid: string;
  createdAt: string;
  updatedAt?: string;
};

export type UserScopedRepository<TRecord extends UserScopedRecord> = {
  get(uid: string, id: string): Promise<TRecord | null>;
  getLatest(uid: string): Promise<TRecord | null>;
  list(uid: string, limit?: number): Promise<TRecord[]>;
  save(uid: string, id: string, record: TRecord): Promise<TRecord>;
};
