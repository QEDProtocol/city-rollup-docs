---
sidebar_position: 1
---

# OP_GROTH16VERIFY
**An ultra-lightweight, soft-forkable solution to trustlessly scale and add smart contract-like functionality to Dogecoin**

## Highlights:

- Allows for building complex applications like decentralized exchanges and smart contracts on Doge
- Allows Doge to be trustlessly scaled virtually ad-infinitum without increasing the block size or the barrier of entry to running a Doge full node
- Fully soft forkable
  - Older versions of Doge can interpret OP_CHECKGROTH16VERIFY as OP_NOP as the stack is unmodified by our proposed op code
- Does not require increasing/modifying any limits (stack depth, stack item size, transaction size, block size, etc)
  - Fully functional zk Rollups enabling smart contracts/trustless rollups can be built using existing P2PKH + P2SH transactions
- Does not require modifying any existing code in Dogecoin other than adding an op code handler to [script/interpreter.cpp](https://github.com/cf/dogecoin/blob/eaae7859367b0dab0ca0c0038ed71d4b021ccef0/src/script/interpreter.cpp#L1029)
- Our team has already built a working reference rollup which demonstrates how OP_CHECKGROTH16VERIFY can be used to scale dogecoin and build complex applications, such as [CityRollup](https://github.com/QEDProtocol/city-rollup)

## Summary:

We propose adding an op code to dogecoin which verifies a Groth16 zero knowledge proof over BLS12-381, **OP_CHECKGROTH16VERIFY**.

In particular, we propose that the op code verify a Groth16 proof with two public inputs, and support two modes of operation controlled by the stack:

- Mode 0: Verify a proof with 2 public inputs and verifier key, all of which are stored on the stack, marking the transaction if the proof is invalid and behaving like OP_NOP otherwise
  
- Mode 1: Verify a proof with 2 public inputs and verifier key, where the verifier key and first public input are stored on the stack, and the second public input is the transaction's SIGHASH.
  

By adding this op code (specifically mode 1), it makes it possible to verify any trustless computation on Dogecoin, build recursive covenants and design smart contract functionality via sighash introspection.

A working rough-draft implementation of OP_CHECKGROTH16VERIFY can be found in [our fork](https://github.com/cf/dogecoin/tree/g16-dev), and you can also test it out with a docker image we built that includes a local testnet (regtest), block explorer (fork of blockstream electrs):

```bash
docker run -p 1337:1337 -it --rm qedprotocol/bitide-doge:latest
```

To test, you can visit http://localhost:1337 for BitIDE with OP_CHECKGROTH16VERIFY enabled, http://localhost:1337/explorer/ to view a block explorer and http://devnet:devnet@localhost:1337/bitcoin-rpc to interact with the local testnet via RPC.

## Deep Dive: How Groth16 + Sighash enables trustless scaling and smart contract functionality on Dogecoin

To better explain how the OP_CHECKGROTH16VERIFY can help scale Dogecoin, it is necessary to first examine how zero knowledge proofs enable the verification of arbitrary computation from a birds eye view.

In general, zk-SNARK based zero knowledge proving backends allow a prover to succintly prove that a program described as an arithmetic constraint system is satisfied.

Consider the program:

```c
void multiply(int a, int b, int c){
    assert(a * b == c);
}
```

if we wanted to prove that prover knows two numbers `a` and `b` which when multiplied equal `c` we could represent this program with the following diagram:

![arithmeticcircuit@2xpng](./img/arithmetic-circuit@2x.png)

One could then take such a circuit and generate a corresponding verifier key which is unique to the program, and can be used to verify arbitrary executions of the program by utilizing a proving backend such as Groth16:

![zkproverintropng](./img/zk-prover-intro.png)

The verifier key of such a circuit can then be encoded in the spend script of a P2SH UTXO, and require a valid proof in order to be spent. One can then utilize a zk proving backend such as Groth16 to generate a valid proof:

![zkprovingpng](./img/zk-proving.png)

The prover could then spend the UTXO by providing the proof in the witness of the P2SH spend transaction to successfully spend the UTXO:

![zkverifierpng](./img/zk-verifier.png)

Crucially, the size and complexity of verifying a Groth16 proof does not depend on the complexity or size of the computation being verified, meaning that OP_CHECKGROTH16VERIFY can verify an arbitrary amount of computation performed off chain without increasing the workload on Dogecoin nodes, meaning that UTXO spend condition logic can be arbitrarilly computationally complex while still respecting all existing limitations imposed on P2SH spends:

![constantsizeproofs@2xpng](./img/constant-size-proofs@2x.png)

To enable trustless smart contract-like functionality without any additional burden on the network, we can use one of the public inputs as the spend transaction's SIGHASH and use the other public input to store the merkelized state of an application such as a smart contract:

![statetransitionproofspng](./img/state-transition-proofs.png)

Via the SIGHASH, we can allow the smart contract to be aware of any deposits of Doge made into the contract as well as any withdrawals or outputs that must be made in order to spend the UTXO:

![sighashintrospection@2xpng](./img/sighash-introspection@2x.png)