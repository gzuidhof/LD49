// RateLimiterClient implements rate limiting logic on the caller's side.
export class RateLimiterClient {
  reportError: any;
  limiter: any;
  inCooldown: boolean;
  getLimiterStub: () => DurableObjectStub;
  allowedInverseFrequency: string;

  // The constructor takes two functions:
  // * getLimiterStub() returns a new Durable Object stub for the RateLimiter object that manages
  //   the limit. This may be called multiple times as needed to reconnect, if the connection is
  //   lost.
  // * reportError(err) is called when something goes wrong and the rate limiter is broken. It
  //   should probably disconnect the client, so that they can reconnect and start over.
  constructor(getLimiterStub: () => DurableObjectStub, reportError: (err: any) => void, allowedFrequency: number) {
    this.getLimiterStub = getLimiterStub;
    this.reportError = reportError;

    // Call the callback to get the initial stub.
    this.limiter = getLimiterStub();

    // When `inCooldown` is true, the rate limit is currently applied and checkLimit() will return
    // false.
    this.inCooldown = false;

    this.allowedInverseFrequency = (1/allowedFrequency).toString();
  }

  // Call checkLimit() when a message is received to decide if it should be blocked due to the
  // rate limit. Returns `true` if the message should be accepted, `false` to reject.
  checkLimit() {
    if (this.inCooldown) {
      return false;
    }
    this.inCooldown = true;
    this.callLimiter();
    return true;
  }

  // callLimiter() is an internal method which talks to the rate limiter.
  private async callLimiter() {
    try {
      let response;
      try {
        // Currently, fetch() needs a valid URL even though it's not actually going to the
        // internet. We may loosen this in the future to accept an arbitrary string. But for now,
        // we have to provide a dummy URL that will be ignored at the other end anyway.
        response = await this.limiter.fetch("https://dummy-url", {method: "POST", body: this.allowedInverseFrequency});
      } catch (err) {
        // `fetch()` threw an exception. This is probably because the limiter has been
        // disconnected. Stubs implement E-order semantics, meaning that calls to the same stub
        // are delivered to the remote object in order, until the stub becomes disconnected, after
        // which point all further calls fail. This guarantee makes a lot of complex interaction
        // patterns easier, but it means we must be prepared for the occasional disconnect, as
        // networks are inherently unreliable.
        //
        // Anyway, get a new limiter and try again. If it fails again, something else is probably
        // wrong.
        this.limiter = this.getLimiterStub();
        response = await this.limiter.fetch("https://dummy-url", {method: "POST", body: this.allowedInverseFrequency});
      }

      // The response indicates how long we want to pause before accepting more requests.
      let cooldown = +(await response.text());

      await new Promise(resolve => setTimeout(resolve, cooldown * 1000));
      // Done waiting.
      this.inCooldown = false;
    } catch (err) {
      this.reportError(err);
    }
  }
}