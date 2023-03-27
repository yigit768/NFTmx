import http from "@/core/utils/http/http-common";
import { apiQueryBuilder } from "@/core/utils/common";

class NftsService {
  vote(data) {
    return http.patch(`nfts/vote?${apiQueryBuilder(data)}`);
  }

  checkLiquidity(chain, tokenAddress, tokenId) {
    return http.get(
      `nfts/check-liquidity?chain=${chain}&tokenAddress=${tokenAddress}&tokenId=${tokenId}`
    );
  }
}

export default new NftsService();
