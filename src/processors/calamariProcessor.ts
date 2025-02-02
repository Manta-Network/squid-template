import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import { SubstrateNetwork } from "../model";
import councilVoteHandler from '../handlers/council.vote.extrinsic';
import democracyVoteHandler from '../handlers/democracy.vote.extrinsic';
import democracySecondHandler from '../handlers/democracy.second.extrinsic';
// import electionVoteHandler from '../handlers/phragmenElection.vote.extrinsic';
import balanceTransferEventHandler from '../handlers/events/balances.transfer.event';
import { handleProposedEvent } from '../handlers/events/collective.Proposed.event';
import { handleVotedEvent } from '../handlers/events/collective.Voted.event';
import { handleApprovedEvent } from "../handlers/events/collective.Approved.event";
import { handleDisapprovedEvent } from "../handlers/events/collective.Disapproved.event";
import { handleExecutedEvent } from "../handlers/events/collective.Executed.event";
import { handleMemberExecutedEvent } from "../handlers/events/collective.MemberExecuted.event";
import { handleClosedEvent } from "../handlers/events/collective.Closed.event";
import { bundle } from "../chain-metadata/calamari/calamari"
// import { SystemAccountStorage } from "../types/calamari/storage"
import * as ss58 from "@subsquid/ss58";

const processor = new SubstrateProcessor('manta_calamari_processor');
processor.setTypesBundle(bundle);
processor.setBatchSize(500);
processor.setDataSource({
  archive: lookupArchive("calamari")[0].url,
  chain: "wss://calamari.api.onfinality.io/public-ws/",
});
// processor.addExtrinsicHandler(
//   'phragmenElection.vote',
//   electionVoteHandler(SubstrateNetwork.phala)
// );
processor.addExtrinsicHandler(
  'council.vote',
  councilVoteHandler(SubstrateNetwork.calamari)
);
processor.addExtrinsicHandler(
  'democracy.vote',
  democracyVoteHandler(SubstrateNetwork.calamari)
);
processor.addExtrinsicHandler(
  'democracy.second',
  democracySecondHandler(SubstrateNetwork.calamari)
);

processor.addEventHandler("balances.Transfer", balanceTransferEventHandler(SubstrateNetwork.calamari));
processor.addEventHandler("technicalCommittee.Proposed", handleProposedEvent(SubstrateNetwork.calamari));
processor.addEventHandler("technicalCommittee.Voted", handleVotedEvent(SubstrateNetwork.calamari));
processor.addEventHandler("technicalCommittee.Approved", handleApprovedEvent(SubstrateNetwork.calamari));
processor.addEventHandler("technicalCommittee.Disapproved", handleDisapprovedEvent(SubstrateNetwork.calamari));
processor.addEventHandler("technicalCommittee.Executed", handleExecutedEvent(SubstrateNetwork.calamari));
processor.addEventHandler("technicalCommittee.MemberExecuted", handleMemberExecutedEvent(SubstrateNetwork.calamari));
processor.addEventHandler("technicalCommittee.Closed", handleClosedEvent(SubstrateNetwork.calamari));

/*processor.addPreHook({ range: { from: 0, to: 0 } }, async ctx => {
  let accounts = new SystemAccountStorage(ctx)
  let aliceAddress = ss58.decode('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY').bytes
  let aliceAccount = await accounts.getAsV3010(aliceAddress)
  // if (!(aliceAccount.data.free > 0)) {
  console.log("Alice balance:" + aliceAccount.data.free);
  // }
});
*/

processor.run();
