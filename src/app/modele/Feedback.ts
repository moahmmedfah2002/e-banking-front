import { Agent } from "./Agent";
import { Client } from "./Client";

export interface Feedback {
  id: number;
  motif: string;
  detail: string;
  client: Client;
  agent: Agent;
}