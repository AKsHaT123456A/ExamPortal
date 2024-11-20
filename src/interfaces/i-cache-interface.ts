
export interface ICache {
  set(
    responses:any[],
    userId: string,
  ): Promise<void>;

  get(quesId: string, userId: string): Promise<any>;

  evict(quesId: string, userId: string): Promise<null>;
}
