import { Agent } from "./Agent";

export interface Bank {
  id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    status?: 'Active' | 'Pending' | 'Inactive';
    agents: Agent[];
}