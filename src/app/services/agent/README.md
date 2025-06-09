# Agent Services

This directory contains service classes for the agent section of the e-banking application.

## Services Overview

### AgentCryptoService

Handles cryptocurrency-related operations for agents, including:
- Fetching current crypto prices
- Getting historical price data
- Retrieving crypto statistics
- Executing crypto transactions for clients

### AgentTransactionService

Manages transaction operations for agents, including:
- Fetching all transactions
- Getting client-specific transactions
- Retrieving transaction details
- Updating transaction status
- Creating new transactions

### AgentClientService

Handles client management for agents, including:
- Getting all clients assigned to the agent
- Retrieving client details
- Managing client accounts
- Updating client information
- Adding new clients
- Accessing client crypto portfolio

### AgentAccountService

Manages account operations for agents, including:
- Fetching all managed accounts
- Getting account details
- Retrieving account transaction history
- Updating account information
- Creating new accounts
- Getting account balance history

### AgentDashboardService

Provides statistics and analytics for the agent dashboard, including:
- Dashboard summary statistics
- Performance metrics
- Client acquisition metrics
- Transaction volume metrics
- Agent alerts and tasks

## Usage

Services can be imported either individually or via the barrel file:

```typescript
// Individual import
import { AgentCryptoService } from './services/agent/agent-crypto.service';

// Barrel import (preferred)
import { 
  AgentCryptoService, 
  AgentClientService 
} from './services/agent';
```

All services are registered in the app module and can be injected into components as needed.
