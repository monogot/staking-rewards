import {SubstrateEvent} from "@subql/types";
import {StakingReward, SumReward} from "../types";
import {Balance} from "@polkadot/types/interfaces";

function createSumReward(accountId: string): SumReward {
  const entity = new SumReward(accountId);
  entity.totalReward = BigInt(0);
  return entity;
}

export async function handleSumRewared(event: SubstrateEvent): Promise<void> {
  const {event: {data: [account, newReward]}} = event;
  let entity = await SumReward.get(account.toString());
  if (entity === undefined) {
    entity = createSumReward(account.toString());
  }
  entity.totalReward = entity.totalReward + (newReward as Balance).toBigInt();
  entity.blockHeight = event.block.block.header.number.toNumber();
  await entity.save();
}

export async function handleStakingRewarded(event: SubstrateEvent): Promise<void> {
  const {event: {data: [account, newReward]}} = event;
  const entity = new StakingReward(`${event.block.block.header.number}-${event.idx.toString()}`);
  entity.account = account.toString();
  entity.balance = (newReward as Balance).toBigInt();
  entity.date = event.block.timestamp;
  await entity.save();
}
