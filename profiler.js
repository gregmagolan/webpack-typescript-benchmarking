(function(){
  if (!window.IBazelProfilerOptions || !window.IBazelProfilerOptions.url) {
    console.error("iBazel profiler options not set. iBazel profiler events will not be sent.")
    return;
  }

  if (!navigator.sendBeacon) {
    console.error("Beacon API not available. iBazel profiler events will not be sent.")
    return;
  }

  function profilerEvent(eventType, eventData) {
    if (!eventType || typeof eventType !== 'string') {
      console.error("Invalid iBazel profiler event type");
      return;
    }
    if (eventData && typeof eventData !== 'object') {
      console.error("Invalid iBazel profiler event data");
      return;
    }
    const event = { type: eventType, time: Date.now() };
    event.elapsed = event.time - window.performance.timing.navigationStart;
    if (eventData) {
      event.data = JSON.stringify(eventData);
    }
    console.log("Profiler event", event)
    const data = JSON.stringify(event)
    const status = navigator.sendBeacon(window.IBazelProfilerOptions.url, data);
    console.log ("sendBeacon: URL = " + window.IBazelProfilerOptions.url + "; data = " + data + "; status = " + status);
  }

  window.IBazelProfileEvent = profilerEvent;

  window.addEventListener("load", function() {
    var timing = window.performance.timing;

    profilerEvent("PAGE_LOAD", {
      // deltas
      pageLoadTime: timing.loadEventStart - timing.navigationStart, // loadEventEnd is not set yet
      fetchTime: timing.responseEnd - timing.fetchStart,
      connectTime: timing.connectEnd - timing.connectStart,
      requestTime: timing.responseEnd - timing.requestStart,
      responseTime: timing.responseEnd - timing.responseStart,
      renderTime: timing.domComplete - timing.domLoading,

      // absolutes
      navigationStart: timing.navigationStart,
      unloadEventStart: timing.unloadEventStart,
      unloadEventEnd: timing.unloadEventEnd,
      redirectStart: timing.redirectStart,
      redirectEnd: timing.redirectEnd,
      fetchStart: timing.fetchStart,
      domainLookupStart: timing.domainLookupStart,
      domainLookupEnd: timing.domainLookupEnd,
      connectStart: timing.connectStart,
      connectEnd: timing.connectEnd,
      secureConnectionStart: timing.secureConnectionStart,
      requestStart: timing.requestStart,
      responseStart: timing.responseStart,
      responseEnd: timing.responseEnd,
      domLoading: timing.domLoading,
      domInteractive: timing.domInteractive,
      domContentLoadedEventStart: timing.domContentLoadedEventStart,
      domContentLoadedEventEnd: timing.domContentLoadedEventEnd,
      domComplete: timing.domComplete,
      loadEventStart: timing.loadEventStart,
    });
  }, false);
})();
