import http from "@/core/utils/http/http-common";
import { apiQueryBuilder } from "@/core/utils/common";

class CollectionsService {
  checkAuthentic(data) {
    return http.get(`contracts/check-authentic?${apiQueryBuilder(data)}`);
  }
}

export default new CollectionsService();
