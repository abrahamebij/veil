# iExec Nox Developer Experience & Integration Feedback

## Overview
This document tracks developer notes, integration observations, and feedback regarding the **iExec Nox** confidential computing protocol, Hardhat plugin, and smart contract developer experience during the hackathon build of **Veil**.

---

## Developer Log & Milestones

### 1. Initial Architecture & Confidentiality Model
- **Goal**: Integrate Nox confidential compute layer to authorize Sablier V2 streams without leaking recipient wallet or salary amount on-chain.
- **Pattern**: Confidential authorization via Nox TEE contract + 1-click atomic proxy claim via `VeilStreamProxy`.

### 2. Nox Tooling & Hardhat Integration
- **Hardhat Plugin (`@iexec/nox-hardhat-plugin`)**: Configured in `contracts/hardhat.config.js`.
- **Observations**:
  - TEE-based parameter encryption provides privacy for stream rates and recipient identifiers.
  - Using stealth proxy vaults prevents public block explorers from observing Sablier V2 event parameter leaks.

---
*Document updated continuously during build.*
