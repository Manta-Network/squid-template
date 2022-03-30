import { SubstrateProcessor } from '@subsquid/substrate-processor';
import { lookupArchive } from "@subsquid/archive-registry";
import councilVoteHandler from '../handlers/council.vote.extrinsic';
import democracyVoteHandler from '../handlers/democracy.vote.extrinsic';
import democracySecondHandler from '../handlers/democracy.second.extrinsic';
import electionVoteHandler from '../handlers/phragmenElection.vote.extrinsic';
import { SubstrateNetwork } from '../model';

const processor = new SubstrateProcessor('litentry_squid_governance_khala');

processor.setTypesBundle('khala');
processor.setBatchSize(500);
processor.setDataSource({
  archive: lookupArchive("khala")[0].url,
  chain: 'wss://khala.api.onfinality.io/public-ws',
});
processor.addExtrinsicHandler(
  'phragmenElection.vote',
  electionVoteHandler(SubstrateNetwork.phala)
);
processor.addExtrinsicHandler(
  'council.vote',
  councilVoteHandler(SubstrateNetwork.phala)
);
processor.addExtrinsicHandler(
  'democracy.vote',
  democracyVoteHandler(SubstrateNetwork.phala)
);
processor.addExtrinsicHandler(
  'democracy.second',
  democracySecondHandler(SubstrateNetwork.phala)
);

processor.run();
