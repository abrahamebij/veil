# Veil — Build Specification (for coding agent)

**Read this whole document before writing any code.** This is the source of truth for what Veil is, why it exists, and what "done" looks like for the hackathon deadline.

---

## 1. What Veil Is

Veil is a confidential payroll/contractor-payment streaming app. It lets a payer (DAO or startup) create a recurring payment stream to a recipient where the **amount and recipient identity are encrypted on-chain** via iExec Nox's confidential compute layer (TEE-based), while the actual money still moves through **Sablier V2** — a real, public, composable streaming protocol — unmodified.

**The core trick:** we don't fork or modify Sablier. We sit a confidential authorization layer in front of it. Sablier still does what it always does; Nox just makes sure the public chain can't read who/how much until the payer chooses to reveal it.

---

## 2. Why This Exists (Problem Statement)

Onchain payroll streams today are permanently public — anyone can watch a block explorer and see exactly which wallet gets paid what, forever. This is a real adoption blocker for companies who would otherwise use onchain payroll. Veil removes that blocker without asking Sablier to change or asking recipients to use anything other than their normal wallet.

---

## 3. Hackathon Constraints (non-negotiable)

- **Deadline:** 2026/08/01 22:59
- **Must deploy on:** ETH Sepolia
- **Must be:** fully functional end-to-end, no mock data
- **Must include:** public GitHub repo, README, feedback.md (notes on iExec/Nox dev experience — keep updating this as you build, don't write it at the end), 4-minute demo video
- **Scope discipline:** ONE flow, done completely. Do not add multi-token support, swap/lending features, or multiple concurrent streams to the demo. One clean stream, created and claimed, is the entire deliverable.

---

## 4. Tech Stack

- **Underlying streaming protocol:** Sablier V2 (linear streams — NOT Superfluid, do not use Superfluid)
- **Confidentiality layer:** iExec Nox (TEE-based confidential smart contracts)
  - Docs: https://docs.iex.ec/nox-protocol/getting-started/welcome
  - Hardhat plugin: https://github.com/iExec-Nox/nox-hardhat-plugin
  - Hardhat starter: https://github.com/iExec-Nox/nox-hardhat-starter
  - Confidential contract wizard: https://cdefi-wizard.iex.ec/
- **Chain:** ETH Sepolia (testnet)
- **Contracts:** Solidity, Hardhat
- **Frontend:** already built in Stitch (React/HTML export) — see `/frontend` once dropped into the repo. Wire this up to real contract calls; do not redesign it.
- **Wallet connection:** standard (MetaMask/Rabby/Rainbow) — no custom wallet, no new key management for recipients

---

## 5. The Flow (exactly what must work end-to-end)

1. **Payer connects wallet** (standard wallet connect — no crypto jargon exposed beyond this)
2. **Payer creates a stream:** enters recipient address, amount, cadence
3. **Encryption + authorization:** recipient + amount are encrypted client-side, passed to a Nox confidential contract, which computes/authorizes the stream parameters inside the TEE without exposing plaintext on-chain
4. **Disbursement:** the authorized parameters trigger the actual Sablier V2 stream creation — real money, real protocol, real composability
5. **Public view:** anyone looking at the stream on a block explorer sees that a stream exists and is active, but NOT the amount or the counterparties
6. **Recipient claims:** recipient interacts with their normal wallet exactly as they would for any standard Sablier claim — nothing about their experience should look different or "crypto-privacy-native"
7. **Payer-side reveal toggle:** on the stream detail screen, the payer can see full plaintext details, AND toggle a view showing "what the public explorer sees" (redacted) — this is the single most important visual for the demo/pitch, build it carefully

---

## 6. What "Done" Looks Like (acceptance criteria)

- [ ] Wallet connects on Sepolia
- [ ] Payer can create one real confidential stream (real transaction, not simulated)
- [ ] Stream amount/recipient are NOT visible in plaintext via Sepolia block explorer
- [ ] Recipient can claim via their normal wallet flow, successfully receiving real testnet funds
- [ ] Payer-side detail screen has a working "payer view / public view" toggle showing the contrast
- [ ] feedback.md exists and has real notes on the Nox integration experience, written as you go
- [ ] README explains setup/install/usage clearly enough a judge could run it
- [ ] Everything is deployed and live on Sepolia, not just running locally

---

## 7. Explicitly Out of Scope

Do not build, and do not suggest building:
- Multi-token support
- Swap or lending integrations
- Multiple simultaneous streams in the demo
- A custom wallet or new key management scheme
- Superfluid integration (Sablier only)
- Pricing pages, user accounts/auth beyond wallet connect, or anything not in the flow above

If you find yourself building something not listed in Section 5, stop and flag it before continuing.

---

## 8. Reference Materials Available

- `veil-frontend/` — Stitch-generated screens (landing, login, dashboard, create stream, stream detail with toggle, recipient claim) — wire these to real logic, do not redesign
- iExec Nox docs and starter repos (links above)
- Sablier V2 docs: https://docs.sablier.com/

---

## 9. Questions to Resolve Before/During Build

If any of the following come up, flag them back rather than guessing silently:
- Exact Nox confidential contract pattern for encrypting two params (recipient, amount) before passing to Sablier's create-stream call
- Gas/fee handling on Sepolia for the TEE authorization step
- Whether Sablier V2's linear stream type or tranched type fits the "recurring payroll" framing better
