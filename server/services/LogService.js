import LogRepository from "@/server/resource/LogRepository";

export default class LogService {
  constructor() {
    this.logRepository = new LogRepository();
  }

  async getLogsByProductId(productId) {
    return this.logRepository.getLogsByProductId(productId);
  }
}
