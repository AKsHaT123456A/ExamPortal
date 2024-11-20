import { Kafka, PartitionMetadata } from "kafkajs";
import { sendEmail } from "../utils/email-utils";

export class KafkaService {
  private static instance: KafkaService;
  private kafka: Kafka;
  private producer: any;
  private consumer: any;

  private constructor(clientId: string, brokers: string[]) {
    this.kafka = new Kafka({
      clientId: clientId,
      brokers: brokers,
    });
    this.producer = this.kafka.producer();
  }

  public static getInstance(clientId: string = "portal", brokers: string[] = ["localhost:9092"]): KafkaService {
    if (!KafkaService.instance) {
      KafkaService.instance = new KafkaService(clientId, brokers);
    }
    return KafkaService.instance;
  }

  // Producer method to send a message to Kafka
  async run(topic: string, value: string, key: string, partition?: number) {
    await this.producer.connect();
    await this.producer.send({
      topic: topic,
      messages: [{ value: value, key: key, partition }], // sending message
    });
  }

  // Consumer method to subscribe to Kafka topic and process messages
  async getTopic(groupId: string, topic: string, partition?: number) {
    this.consumer = this.kafka.consumer({ groupId });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic, fromBeginning: true });

    // Kafka consumer processing
    await this.consumer.run({
      //@ts-ignore
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`Received message: ${message.value.toString()} from partition ${partition}`);

        const emailData = JSON.parse(message.value.toString());
        await sendEmail(emailData); // Process the email sending
      },
    });
  }

  // Fetch partition metadata for a topic
  async getPartitionMetadata(topic: string): Promise<PartitionMetadata[]> {
    const admin = this.kafka.admin();
    await admin.connect();
    const topicMetadata = await admin.fetchTopicMetadata({ topics: [topic] });
    await admin.disconnect();

    return topicMetadata.topics[0]?.partitions || [];
  }
}
