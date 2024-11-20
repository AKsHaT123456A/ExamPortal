export interface IKafkaService {
  run(value: string, key: string): Promise<void>;

  getTopic(): Promise<void>;
}
