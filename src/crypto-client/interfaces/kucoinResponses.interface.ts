export interface KucoinGetTickerReponse {
  code: string;
  data: {
    time: number;
    sequence: string;
    price: string;
    size: string;
    bestBid: string;
    bestBidSize: string;
    bestAsk: string;
    bestAskSize: string;
  };
}
