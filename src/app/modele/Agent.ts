import { Bank } from "./Bank";
import { User } from "./User";

export interface Agent extends User{
    bank: Bank;
    clientIds: string[];
}