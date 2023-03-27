import http from "@/core/utils/http/http-common";
import { apiQueryBuilder } from "@/core/utils/common";

class HistoryService {
  getNftHistory(data) {
    return http.get(`history/nft?${apiQueryBuilder(data)}`);
  }
}

export default new HistoryService();
