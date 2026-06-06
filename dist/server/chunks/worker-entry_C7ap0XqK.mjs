globalThis.process ??= {};
globalThis.process.env ??= {};
import { EventEmitter } from "node:events";
import stream, { Writable } from "node:stream";
import { DurableObject } from "cloudflare:workers";
import * as node_async_hooks_star from "node:async_hooks";
import { AsyncLocalStorage } from "node:async_hooks";
import * as node_buffer_star from "node:buffer";
import { Buffer } from "node:buffer";
import { ReadableStream as ReadableStream$1 } from "node:stream/web";
import { createHash } from "node:crypto";
import { stringify, parse as parse$1 } from "node:querystring";
import path from "node:path";
const hrtime$1 = /* @__PURE__ */ Object.assign(function hrtime(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, { bigint: function bigint() {
  return BigInt(Date.now() * 1e6);
} });
class ReadStream {
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
}
class WriteStream {
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
}
// @__NO_SIDE_EFFECTS__
function rawHeaders(headers) {
  const rawHeaders2 = [];
  for (const key in headers) {
    if (Array.isArray(headers[key])) {
      for (const h of headers[key]) {
        rawHeaders2.push(key, h);
      }
    } else {
      rawHeaders2.push(key, headers[key]);
    }
  }
  return rawHeaders2;
}
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = () => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  };
  return Object.assign(fn, { __unenv__: true });
}
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
const NODE_VERSION = "22.14.0";
class Process extends EventEmitter {
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw /* @__PURE__ */ createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw /* @__PURE__ */ createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw /* @__PURE__ */ createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw /* @__PURE__ */ createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw /* @__PURE__ */ createNotImplementedError("process.kill");
  }
  abort() {
    throw /* @__PURE__ */ createNotImplementedError("process.abort");
  }
  dlopen() {
    throw /* @__PURE__ */ createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw /* @__PURE__ */ createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw /* @__PURE__ */ createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw /* @__PURE__ */ createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw /* @__PURE__ */ createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw /* @__PURE__ */ createNotImplementedError("process.openStdin");
  }
  assert() {
    throw /* @__PURE__ */ createNotImplementedError("process.assert");
  }
  binding() {
    throw /* @__PURE__ */ createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: () => 0 });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
}
const globalProcess = globalThis["process"];
const getBuiltinModule = globalProcess.getBuiltinModule;
const workerdProcess = getBuiltinModule("node:process");
const unenvProcess = new Process({
  env: globalProcess.env,
  hrtime: hrtime$1,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
const { exit, features, platform } = workerdProcess;
const {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime2,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
const _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime2,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
globalThis.process = _process;
const noop = Object.assign(() => {
}, { __unenv__: true });
const _console = globalThis.console;
const _ignoreErrors = true;
const _stderr = new Writable();
const _stdout = new Writable();
const Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
const _times = /* @__PURE__ */ new Map();
const _stdoutErrorHandler = noop;
const _stderrErrorHandler = noop;
const workerdConsole = globalThis["console"];
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
globalThis.console = workerdConsole;
const _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
const _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
const nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
class PerformanceEntry {
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
}
const PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
class PerformanceMeasure extends PerformanceEntry {
  entryType = "measure";
}
class PerformanceResourceTiming extends PerformanceEntry {
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
}
class PerformanceObserverEntryList {
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
}
class Performance {
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw /* @__PURE__ */ createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw /* @__PURE__ */ createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
}
class PerformanceObserver {
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw /* @__PURE__ */ createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
}
const performance$1 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
if (!("__unenv__" in performance$1)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance$1)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance$1, key, desc);
      }
    }
  }
}
globalThis.performance = performance$1;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
var define_IMAGES_DEVICE_SIZES_default = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
var define_IMAGES_FORMATS_default = ["image/webp"];
var define_IMAGES_IMAGE_SIZES_default = [32, 48, 64, 96, 128, 256, 384];
var define_IMAGES_LOCAL_PATTERNS_default = [{ pathname: "^(?:(?!(?:^|\\/)\\.{1,2}(?:\\/|$))(?:(?:(?!(?:^|\\/)\\.{1,2}(?:\\/|$)).)*?)\\/?)$", search: "" }];
var define_IMAGES_QUALITIES_default = [75];
var define_IMAGES_REMOTE_PATTERNS_default = [{ protocol: "https", hostname: "^(?:(?!\\.)(?=.)[^/]*?\\.r2\\.cloudflarestorage\\.com\\/?)$", pathname: "^(?:(?!(?:^|\\/)\\.{1,2}(?:\\/|$))(?:(?:(?!(?:^|\\/)\\.{1,2}(?:\\/|$)).)*?)\\/?)$" }, { protocol: "https", hostname: "^(?:(?!\\.)(?=.)[^/]*?\\.supabase\\.co\\/?)$", pathname: "^(?:(?!(?:^|\\/)\\.{1,2}(?:\\/|$))(?:(?:(?!(?:^|\\/)\\.{1,2}(?:\\/|$)).)*?)\\/?)$" }];
function isOpenNextError$3(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
function debug$3(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn$3(...args) {
  console.warn(...args);
}
var DOWNPLAYED_ERROR_LOGS$3 = [
  {
    clientName: "S3Client",
    commandName: "GetObjectCommand",
    errorName: "NoSuchKey"
  }
];
var isDownplayedErrorLog$3 = (errorLog) => DOWNPLAYED_ERROR_LOGS$3.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
function error$3(...args) {
  if (args.some((arg) => isDownplayedErrorLog$3(arg))) {
    return debug$3(...args);
  }
  if (args.some((arg) => isOpenNextError$3(arg))) {
    const error2 = args.find((arg) => isOpenNextError$3(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel$3()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError$3(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn$3(...args.map((arg) => isOpenNextError$3(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel$3() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
async function handleImageRequest(requestURL, requestHeaders, env2) {
  const parseResult = parseImageRequest(requestURL, requestHeaders);
  if (!parseResult.ok) {
    return new Response(parseResult.message, {
      status: 400
    });
  }
  let imageResponse;
  if (parseResult.url.startsWith("/")) {
    if (env2.ASSETS === void 0) {
      error$3("env.ASSETS binding is not defined");
      return new Response('"url" parameter is valid but upstream response is invalid', {
        status: 404
      });
    }
    const absoluteURL = new URL(parseResult.url, requestURL);
    imageResponse = await env2.ASSETS.fetch(absoluteURL);
  } else {
    let fetchImageResult;
    try {
      fetchImageResult = await fetchWithRedirects(parseResult.url, 7e3, 3);
    } catch (e) {
      throw new Error("Failed to fetch image", { cause: e });
    }
    if (!fetchImageResult.ok) {
      if (fetchImageResult.error === "timed_out") {
        return new Response('"url" parameter is valid but upstream response timed out', {
          status: 504
        });
      }
      if (fetchImageResult.error === "too_many_redirects") {
        return new Response('"url" parameter is valid but upstream response is invalid', {
          status: 508
        });
      }
      throw new Error("Failed to fetch image");
    }
    imageResponse = fetchImageResult.response;
  }
  if (!imageResponse.ok || imageResponse.body === null) {
    return new Response('"url" parameter is valid but upstream response is invalid', {
      status: imageResponse.status
    });
  }
  let immutable = false;
  if (parseResult.static) {
    immutable = true;
  } else {
    const cacheControlHeader = imageResponse.headers.get("Cache-Control");
    if (cacheControlHeader !== null) {
      immutable = cacheControlHeader.includes("immutable");
    }
  }
  const readHeaderResult = await readImageHeader(imageResponse);
  if (readHeaderResult instanceof Response) {
    return readHeaderResult;
  }
  const { contentType, imageStream } = readHeaderResult;
  if (contentType === null) {
    warn$3(`Failed to detect content type of "${parseResult.url}"`);
    return new Response('"url" parameter is valid but image type is not allowed', {
      status: 400
    });
  }
  if (contentType === SVG) {
    {
      return new Response('"url" parameter is valid but image type is not allowed', {
        status: 400
      });
    }
  }
  if (contentType === GIF) {
    if (env2.IMAGES === void 0) {
      warn$3("env.IMAGES binding is not defined");
      const response3 = createImageResponse(imageStream, contentType, {
        immutable
      });
      return response3;
    }
    const imageSource = env2.IMAGES.input(imageStream);
    const imageTransformationResult = await imageSource.transform({
      width: parseResult.width,
      fit: "scale-down"
    }).output({
      quality: parseResult.quality,
      format: GIF
    });
    const outputImageStream = imageTransformationResult.image();
    const response2 = createImageResponse(outputImageStream, GIF, {
      immutable
    });
    return response2;
  }
  if (contentType === AVIF || contentType === WEBP || contentType === JPEG || contentType === PNG) {
    if (env2.IMAGES === void 0) {
      warn$3("env.IMAGES binding is not defined");
      const response3 = createImageResponse(imageStream, contentType, {
        immutable
      });
      return response3;
    }
    const outputFormat = parseResult.format ?? contentType;
    const imageSource = env2.IMAGES.input(imageStream);
    const imageTransformationResult = await imageSource.transform({
      width: parseResult.width,
      fit: "scale-down"
    }).output({
      quality: parseResult.quality,
      format: outputFormat
    });
    const outputImageStream = imageTransformationResult.image();
    const response2 = createImageResponse(outputImageStream, outputFormat, {
      immutable
    });
    return response2;
  }
  warn$3(`Image content type ${contentType} not supported`);
  const response = createImageResponse(imageStream, contentType, {
    immutable
  });
  return response;
}
async function handleCdnCgiImageRequest(requestURL, env2) {
  const parseResult = parseCdnCgiImageRequest(requestURL.pathname);
  if (!parseResult.ok) {
    return new Response(parseResult.message, {
      status: 400
    });
  }
  let imageResponse;
  if (parseResult.url.startsWith("/")) {
    if (env2.ASSETS === void 0) {
      return new Response("env.ASSETS binding is not defined", {
        status: 404
      });
    }
    const absoluteURL = new URL(parseResult.url, requestURL);
    imageResponse = await env2.ASSETS.fetch(absoluteURL);
  } else {
    imageResponse = await fetch(parseResult.url);
  }
  if (!imageResponse.ok || imageResponse.body === null) {
    return new Response('"url" parameter is valid but upstream response is invalid', {
      status: imageResponse.status
    });
  }
  const readHeaderResult = await readImageHeader(imageResponse);
  if (readHeaderResult instanceof Response) {
    return readHeaderResult;
  }
  const { contentType, imageStream } = readHeaderResult;
  if (contentType === null || !SUPPORTED_CDN_CGI_INPUT_TYPES.has(contentType)) {
    return new Response('"url" parameter is valid but image type is not allowed', {
      status: 400
    });
  }
  if (contentType === SVG && true) {
    return new Response('"url" parameter is valid but image type is not allowed', {
      status: 400
    });
  }
  return new Response(imageStream, {
    headers: { "Content-Type": contentType }
  });
}
function parseCdnCgiImageRequest(pathname) {
  const match2 = pathname.match(/^\/cdn-cgi\/image\/(?<options>[^/]+)\/(?<url>.+)$/);
  if (match2 === null || // Valid URLs have at least one option
  !match2.groups?.options || !match2.groups?.url) {
    return { ok: false, message: "Invalid /cdn-cgi/image/ URL format" };
  }
  const imageUrl = match2.groups.url;
  if (imageUrl.startsWith("/")) {
    return { ok: false, message: '"url" parameter cannot be a protocol-relative URL (//)' };
  }
  let resolvedUrl;
  if (imageUrl.match(/^https?:\/\//)) {
    resolvedUrl = imageUrl;
  } else {
    resolvedUrl = `/${imageUrl}`;
  }
  return {
    ok: true,
    url: resolvedUrl,
    static: false
  };
}
async function readImageHeader(imageResponse) {
  const [contentTypeStream, imageStream] = imageResponse.body.tee();
  const headerBytes = new Uint8Array(32);
  const reader = contentTypeStream.getReader({ mode: "byob" });
  const readResult = await reader.readAtLeast(32, headerBytes);
  if (readResult.value === void 0) {
    await imageResponse.body.cancel();
    return new Response('"url" parameter is valid but upstream response is invalid', {
      status: 400
    });
  }
  const contentType = detectImageContentType(readResult.value);
  return { contentType, imageStream };
}
async function fetchWithRedirects(url, timeoutMS, maxRedirectCount) {
  let response;
  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMS),
      redirect: "manual"
    });
  } catch (e) {
    if (e instanceof Error && e.name === "TimeoutError") {
      const result2 = {
        ok: false,
        error: "timed_out"
      };
      return result2;
    }
    throw e;
  }
  if (redirectResponseStatuses.includes(response.status)) {
    const locationHeader = response.headers.get("Location");
    if (locationHeader !== null) {
      if (maxRedirectCount < 1) {
        const result3 = {
          ok: false,
          error: "too_many_redirects"
        };
        return result3;
      }
      let redirectTarget;
      if (locationHeader.startsWith("/")) {
        redirectTarget = new URL(locationHeader, url).href;
      } else {
        redirectTarget = locationHeader;
      }
      const result2 = await fetchWithRedirects(redirectTarget, timeoutMS, maxRedirectCount - 1);
      return result2;
    }
  }
  const result = {
    ok: true,
    response
  };
  return result;
}
var redirectResponseStatuses = [301, 302, 303, 307, 308];
function createImageResponse(image, contentType, imageResponseFlags) {
  const response = new Response(image, {
    headers: {
      Vary: "Accept",
      "Content-Type": contentType,
      "Content-Disposition": "attachment",
      "Content-Security-Policy": "script-src 'none'; frame-src 'none'; sandbox;"
    }
  });
  if (imageResponseFlags.immutable) {
    response.headers.set("Cache-Control", "public, max-age=315360000, immutable");
  }
  return response;
}
function parseImageRequest(requestURL, requestHeaders) {
  const formats = define_IMAGES_FORMATS_default;
  const parsedUrlOrError = validateUrlQueryParameter(requestURL);
  if (!("url" in parsedUrlOrError)) {
    return parsedUrlOrError;
  }
  const widthOrError = validateWidthQueryParameter(requestURL);
  if (typeof widthOrError !== "number") {
    return widthOrError;
  }
  const qualityOrError = validateQualityQueryParameter(requestURL);
  if (typeof qualityOrError !== "number") {
    return qualityOrError;
  }
  const acceptHeader = requestHeaders.get("Accept") ?? "";
  let format = null;
  for (const allowedFormat of formats) {
    if (acceptHeader.includes(allowedFormat)) {
      format = allowedFormat;
      break;
    }
  }
  const result = {
    ok: true,
    url: parsedUrlOrError.url,
    width: widthOrError,
    quality: qualityOrError,
    format,
    static: parsedUrlOrError.static
  };
  return result;
}
function validateUrlQueryParameter(requestURL) {
  const urls = requestURL.searchParams.getAll("url");
  if (urls.length < 1) {
    const result = {
      ok: false,
      message: '"url" parameter is required'
    };
    return result;
  }
  if (urls.length > 1) {
    const result = {
      ok: false,
      message: '"url" parameter cannot be an array'
    };
    return result;
  }
  const url = urls[0];
  if (url.length > 3072) {
    const result = {
      ok: false,
      message: '"url" parameter is too long'
    };
    return result;
  }
  if (url.startsWith("//")) {
    const result = {
      ok: false,
      message: '"url" parameter cannot be a protocol-relative URL (//)'
    };
    return result;
  }
  if (url.startsWith("/")) {
    const staticAsset = url.startsWith(`${__NEXT_BASE_PATH__ || ""}/_next/static/media`);
    const pathname = getPathnameFromRelativeURL(url);
    if (/\/_next\/image($|\/)/.test(decodeURIComponent(pathname))) {
      const result = {
        ok: false,
        message: '"url" parameter cannot be recursive'
      };
      return result;
    }
    if (!staticAsset) {
      if (!hasLocalMatch(define_IMAGES_LOCAL_PATTERNS_default, url)) {
        const result = { ok: false, message: '"url" parameter is not allowed' };
        return result;
      }
    }
    return { url, static: staticAsset };
  }
  let parsedURL;
  try {
    parsedURL = new URL(url);
  } catch {
    const result = { ok: false, message: '"url" parameter is invalid' };
    return result;
  }
  const validProtocols = ["http:", "https:"];
  if (!validProtocols.includes(parsedURL.protocol)) {
    const result = {
      ok: false,
      message: '"url" parameter is invalid'
    };
    return result;
  }
  if (!hasRemoteMatch(define_IMAGES_REMOTE_PATTERNS_default, parsedURL)) {
    const result = {
      ok: false,
      message: '"url" parameter is not allowed'
    };
    return result;
  }
  return { url: parsedURL.href, static: false };
}
function validateWidthQueryParameter(requestURL) {
  const widthQueryValues = requestURL.searchParams.getAll("w");
  if (widthQueryValues.length < 1) {
    const result = {
      ok: false,
      message: '"w" parameter (width) is required'
    };
    return result;
  }
  if (widthQueryValues.length > 1) {
    const result = {
      ok: false,
      message: '"w" parameter (width) cannot be an array'
    };
    return result;
  }
  const widthQueryValue = widthQueryValues[0];
  if (!/^[0-9]+$/.test(widthQueryValue)) {
    const result = {
      ok: false,
      message: '"w" parameter (width) must be an integer greater than 0'
    };
    return result;
  }
  const width = parseInt(widthQueryValue, 10);
  if (width <= 0 || isNaN(width)) {
    const result = {
      ok: false,
      message: '"w" parameter (width) must be an integer greater than 0'
    };
    return result;
  }
  const sizeValid = define_IMAGES_DEVICE_SIZES_default.includes(width) || define_IMAGES_IMAGE_SIZES_default.includes(width);
  if (!sizeValid) {
    const result = {
      ok: false,
      message: `"w" parameter (width) of ${width} is not allowed`
    };
    return result;
  }
  return width;
}
function validateQualityQueryParameter(requestURL) {
  const qualityQueryValues = requestURL.searchParams.getAll("q");
  if (qualityQueryValues.length < 1) {
    const result = {
      ok: false,
      message: '"q" parameter (quality) is required'
    };
    return result;
  }
  if (qualityQueryValues.length > 1) {
    const result = {
      ok: false,
      message: '"q" parameter (quality) cannot be an array'
    };
    return result;
  }
  const qualityQueryValue = qualityQueryValues[0];
  if (!/^[0-9]+$/.test(qualityQueryValue)) {
    const result = {
      ok: false,
      message: '"q" parameter (quality) must be an integer between 1 and 100'
    };
    return result;
  }
  const quality = parseInt(qualityQueryValue, 10);
  if (isNaN(quality) || quality < 1 || quality > 100) {
    const result = {
      ok: false,
      message: '"q" parameter (quality) must be an integer between 1 and 100'
    };
    return result;
  }
  if (!define_IMAGES_QUALITIES_default.includes(quality)) {
    const result = {
      ok: false,
      message: `"q" parameter (quality) of ${quality} is not allowed`
    };
    return result;
  }
  return quality;
}
function getPathnameFromRelativeURL(relativeURL) {
  return relativeURL.split("?")[0];
}
function hasLocalMatch(localPatterns, relativeURL) {
  const parseRelativeURLResult = parseRelativeURL(relativeURL);
  for (const localPattern of localPatterns) {
    const matched = matchLocalPattern(localPattern, parseRelativeURLResult);
    if (matched) {
      return true;
    }
  }
  return false;
}
function parseRelativeURL(relativeURL) {
  if (!relativeURL.includes("?")) {
    const result2 = {
      pathname: relativeURL,
      search: ""
    };
    return result2;
  }
  const parts = relativeURL.split("?");
  const pathname = parts[0];
  const search = "?" + parts.slice(1).join("?");
  const result = {
    pathname,
    search
  };
  return result;
}
function matchLocalPattern(pattern, url) {
  if (pattern.search !== void 0 && pattern.search !== url.search) {
    return false;
  }
  return new RegExp(pattern.pathname).test(url.pathname);
}
function hasRemoteMatch(remotePatterns, url) {
  for (const remotePattern of remotePatterns) {
    const matched = matchRemotePattern(remotePattern, url);
    if (matched) {
      return true;
    }
  }
  return false;
}
function matchRemotePattern(pattern, url) {
  if (pattern.protocol !== void 0 && pattern.protocol.replace(/:$/, "") !== url.protocol.replace(/:$/, "")) {
    return false;
  }
  if (pattern.port !== void 0 && pattern.port !== url.port) {
    return false;
  }
  if (pattern.hostname === void 0 || !new RegExp(pattern.hostname).test(url.hostname)) {
    return false;
  }
  if (pattern.search !== void 0 && pattern.search !== url.search) {
    return false;
  }
  return new RegExp(pattern.pathname).test(url.pathname);
}
var AVIF = "image/avif";
var WEBP = "image/webp";
var PNG = "image/png";
var JPEG = "image/jpeg";
var JXL = "image/jxl";
var JP2 = "image/jp2";
var HEIC = "image/heic";
var GIF = "image/gif";
var SVG = "image/svg+xml";
var ICO = "image/x-icon";
var ICNS = "image/x-icns";
var TIFF = "image/tiff";
var BMP = "image/bmp";
var SUPPORTED_CDN_CGI_INPUT_TYPES = /* @__PURE__ */ new Set([JPEG, PNG, GIF, WEBP, SVG, HEIC]);
function detectImageContentType(buffer) {
  if ([255, 216, 255].every((b, i) => buffer[i] === b)) {
    return JPEG;
  }
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((b, i) => buffer[i] === b)) {
    return PNG;
  }
  if ([71, 73, 70, 56].every((b, i) => buffer[i] === b)) {
    return GIF;
  }
  if ([82, 73, 70, 70, 0, 0, 0, 0, 87, 69, 66, 80].every((b, i) => !b || buffer[i] === b)) {
    return WEBP;
  }
  if ([60, 63, 120, 109, 108].every((b, i) => buffer[i] === b)) {
    return SVG;
  }
  if ([60, 115, 118, 103].every((b, i) => buffer[i] === b)) {
    return SVG;
  }
  if ([0, 0, 0, 0, 102, 116, 121, 112, 97, 118, 105, 102].every((b, i) => !b || buffer[i] === b)) {
    return AVIF;
  }
  if ([0, 0, 1, 0].every((b, i) => buffer[i] === b)) {
    return ICO;
  }
  if ([105, 99, 110, 115].every((b, i) => buffer[i] === b)) {
    return ICNS;
  }
  if ([73, 73, 42, 0].every((b, i) => buffer[i] === b)) {
    return TIFF;
  }
  if ([66, 77].every((b, i) => buffer[i] === b)) {
    return BMP;
  }
  if ([255, 10].every((b, i) => buffer[i] === b)) {
    return JXL;
  }
  if ([0, 0, 0, 12, 74, 88, 76, 32, 13, 10, 135, 10].every((b, i) => buffer[i] === b)) {
    return JXL;
  }
  if ([0, 0, 0, 0, 102, 116, 121, 112, 104, 101, 105, 99].every((b, i) => !b || buffer[i] === b)) {
    return HEIC;
  }
  if ([0, 0, 0, 12, 106, 80, 32, 32, 13, 10, 135, 10].every((b, i) => buffer[i] === b)) {
    return JP2;
  }
  return null;
}
const production = { "NEXT_PUBLIC_SUPABASE_URL": "https://gwzjfqgvunyvvwygzkxp.supabase.co", "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3empmcWd2dW55dnZ3eWd6a3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MzQ1ODgsImV4cCI6MjA5NTAxMDU4OH0.Uz4rDCzhpW2fhoujfRH2zsIQf5rsSvZ3YvlaSq4klEY" };
const development = { "NEXT_PUBLIC_SUPABASE_URL": "https://gwzjfqgvunyvvwygzkxp.supabase.co", "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3empmcWd2dW55dnZ3eWd6a3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MzQ1ODgsImV4cCI6MjA5NTAxMDU4OH0.Uz4rDCzhpW2fhoujfRH2zsIQf5rsSvZ3YvlaSq4klEY" };
const test = { "NEXT_PUBLIC_SUPABASE_URL": "https://gwzjfqgvunyvvwygzkxp.supabase.co", "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3empmcWd2dW55dnZ3eWd6a3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MzQ1ODgsImV4cCI6MjA5NTAxMDU4OH0.Uz4rDCzhpW2fhoujfRH2zsIQf5rsSvZ3YvlaSq4klEY" };
const nextEnvVars = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  development,
  production,
  test
}, Symbol.toStringTag, { value: "Module" }));
const cloudflareContextALS = new AsyncLocalStorage();
Object.defineProperty(globalThis, /* @__PURE__ */ Symbol.for("__cloudflare-context__"), {
  get() {
    return cloudflareContextALS.getStore();
  }
});
async function runWithCloudflareRequestContext(request, env2, ctx, handler3) {
  init(request, env2);
  return cloudflareContextALS.run({ env: env2, ctx, cf: request.cf }, handler3);
}
let initialized$1 = false;
function init(request, env2) {
  if (initialized$1) {
    return;
  }
  initialized$1 = true;
  const url = new URL(request.url);
  initRuntime();
  populateProcessEnv(url, env2);
}
function initRuntime() {
  globalThis.__dirname ??= "";
  globalThis.__filename ??= "";
  import.meta.url ??= "file:///worker.js";
  const __original_fetch = globalThis.fetch;
  globalThis.fetch = (input, init2) => {
    if (init2) {
      delete init2.cache;
    }
    return __original_fetch(input, init2);
  };
  const CustomRequest = class extends globalThis.Request {
    constructor(input, init2) {
      if (init2) {
        delete init2.cache;
        Object.defineProperty(init2, "body", {
          // @ts-ignore
          value: init2.body instanceof stream.Readable ? ReadableStream.from(init2.body) : init2.body
        });
      }
      super(input, init2);
    }
  };
  Object.assign(globalThis, {
    Request: CustomRequest,
    __BUILD_TIMESTAMP_MS__: 1780756187851,
    __NEXT_BASE_PATH__: "",
    __ASSETS_RUN_WORKER_FIRST__: false,
    __TRAILING_SLASH__: false,
    // The external middleware will use the convertTo function of the `edge` converter
    // by default it will try to fetch the request, but since we are running everything in the same worker
    // we need to use the request as is.
    __dangerous_ON_edge_converter_returns_request: true
  });
}
function populateProcessEnv(url, env2) {
  for (const [key, value] of Object.entries(env2)) {
    if (typeof value === "string") {
      _process.env[key] = value;
    }
  }
  const mode = env2.NEXTJS_ENV ?? "production";
  if (nextEnvVars[mode]) {
    for (const key in nextEnvVars[mode]) {
      _process.env[key] ??= nextEnvVars[mode][key];
    }
  }
  _process.env.OPEN_NEXT_ORIGIN = JSON.stringify({
    default: {
      host: url.hostname,
      protocol: url.protocol.slice(0, -1),
      port: url.port
    }
  });
  _process.env.__NEXT_PRIVATE_ORIGIN = url.origin;
}
function maybeGetSkewProtectionResponse(request) {
}
globalThis.Buffer = Buffer;
globalThis.AsyncLocalStorage = AsyncLocalStorage;
const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if (p === "__import_unsupported" && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};
globalThis.openNextDebug = false;
globalThis.openNextVersion = "4.0.2";
globalThis.nextVersion = "16.2.6";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget);
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  __defProp(target, "default", { value: mod, enumerable: true }),
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
function isOpenNextError$2(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});
function debug$2(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn$2(...args) {
  console.warn(...args);
}
function error$2(...args) {
  if (args.some((arg) => isDownplayedErrorLog$2(arg))) {
    return debug$2(...args);
  }
  if (args.some((arg) => isOpenNextError$2(arg))) {
    const error2 = args.find((arg) => isOpenNextError$2(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel$2()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError$2(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn$2(...args.map((arg) => isOpenNextError$2(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel$2() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS$2, isDownplayedErrorLog$2;
var init_logger = __esm({
  "node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS$2 = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog$2 = (errorLog) => DOWNPLAYED_ERROR_LOGS$2.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});
var require_dist = __commonJS({
  "node_modules/cookie/dist/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie;
    exports.parse = parseCookie;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date = new Date(val);
            if (Number.isFinite(date.valueOf()))
              setCookie.expires = date;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger();
  }
});
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist());
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const body = shouldHaveBody ? Buffer.from(await event.arrayBuffer()) : void 0;
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env2, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env2)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
function initializeOnce() {
  if (initialized)
    return;
  cachedOrigins = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
  const functions = globalThis.openNextConfig.functions ?? {};
  for (const key in functions) {
    if (key !== "default") {
      const value = functions[key];
      const regexes = [];
      for (const pattern of value.patterns) {
        const regexPattern = `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`;
        regexes.push(new RegExp(regexPattern));
      }
      cachedPatterns.push({
        key,
        patterns: value.patterns,
        regexes
      });
    }
  }
  initialized = true;
}
var cachedOrigins, cachedPatterns, initialized, envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    cachedPatterns = [];
    initialized = false;
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          initializeOnce();
          for (const { key, patterns, regexes } of cachedPatterns) {
            for (const regex of regexes) {
              if (regex.test(_path)) {
                debug$2("Using origin", key, patterns);
                return cachedOrigins[key];
              }
            }
          }
          if (_path.startsWith("/_next/image") && cachedOrigins.imageOptimizer) {
            debug$2("Using origin", "imageOptimizer", _path);
            return cachedOrigins.imageOptimizer;
          }
          if (cachedOrigins.default) {
            debug$2("Using default origin", cachedOrigins.default, _path);
            return cachedOrigins.default;
          }
          return false;
        } catch (e) {
          error$2("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});
function toReadableStream(value, isBase64) {
  return new ReadableStream$1({
    pull(controller) {
      controller.enqueue(Buffer.from(value, isBase64 ? "base64" : "utf8"));
      controller.close();
    }
  }, { highWaterMark: 0 });
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return new ReadableStream$1({
      pull(controller) {
        maybeSomethingBuffer ??= Buffer.from("SOMETHING");
        controller.enqueue(maybeSomethingBuffer);
        controller.close();
      }
    }, { highWaterMark: 0 });
  }
  return new ReadableStream$1({
    start(controller) {
      controller.close();
    }
  });
}
var maybeSomethingBuffer;
var init_stream = __esm({
  "node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          const cur = responseHeaders[key];
          if (cur === void 0) {
            responseHeaders[key] = value;
          } else if (Array.isArray(cur)) {
            cur.push(value);
          } else {
            responseHeaders[key] = [cur, value];
          }
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});
var require_edge_runtime_webpack = __commonJS({
  ".next/server/edge-runtime-webpack.js"() {
    (() => {
      var a, b, c, d, e = {}, f = {};
      function g(a2) {
        var b2 = f[a2];
        if (void 0 !== b2) return b2.exports;
        var c2 = f[a2] = { exports: {} }, d2 = true;
        try {
          e[a2](c2, c2.exports, g), d2 = false;
        } finally {
          d2 && delete f[a2];
        }
        return c2.exports;
      }
      g.m = e, g.amdO = {}, a = [], g.O = (b2, c2, d2, e2) => {
        if (c2) {
          e2 = e2 || 0;
          for (var f2 = a.length; f2 > 0 && a[f2 - 1][2] > e2; f2--) a[f2] = a[f2 - 1];
          a[f2] = [c2, d2, e2];
          return;
        }
        for (var h = 1 / 0, f2 = 0; f2 < a.length; f2++) {
          for (var [c2, d2, e2] = a[f2], i = true, j = 0; j < c2.length; j++) (false & e2 || h >= e2) && Object.keys(g.O).every((a2) => g.O[a2](c2[j])) ? c2.splice(j--, 1) : (i = false, e2 < h && (h = e2));
          if (i) {
            a.splice(f2--, 1);
            var k = d2();
            void 0 !== k && (b2 = k);
          }
        }
        return b2;
      }, g.n = (a2) => {
        var b2 = a2 && a2.__esModule ? () => a2.default : () => a2;
        return g.d(b2, { a: b2 }), b2;
      }, g.d = (a2, b2) => {
        for (var c2 in b2) g.o(b2, c2) && !g.o(a2, c2) && Object.defineProperty(a2, c2, { enumerable: true, get: b2[c2] });
      }, g.g = (function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || Function("return this")();
        } catch (a2) {
          if ("object" == typeof window) return window;
        }
      })(), g.o = (a2, b2) => Object.prototype.hasOwnProperty.call(a2, b2), g.r = (a2) => {
        "u" > typeof Symbol && Symbol.toStringTag && Object.defineProperty(a2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(a2, "__esModule", { value: true });
      }, b = { 149: 0 }, g.O.j = (a2) => 0 === b[a2], c = (a2, c2) => {
        var d2, e2, [f2, h, i] = c2, j = 0;
        if (f2.some((a3) => 0 !== b[a3])) {
          for (d2 in h) g.o(h, d2) && (g.m[d2] = h[d2]);
          if (i) var k = i(g);
        }
        for (a2 && a2(c2); j < f2.length; j++) e2 = f2[j], g.o(b, e2) && b[e2] && b[e2][0](), b[e2] = 0;
        return g.O(k);
      }, (d = self.webpackChunk_N_E = self.webpackChunk_N_E || []).forEach(c.bind(null, 0)), d.push = c.bind(null, d.push.bind(d));
    })();
  }
});
var node_buffer_exports = {};
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});
var node_async_hooks_exports = {};
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});
var VERSION;
var init_version = __esm({
  "node_modules/@opentelemetry/api/build/esm/version.js"() {
    VERSION = "1.9.1";
  }
});
function _makeCompatibilityCheck(ownVersion) {
  const acceptedVersions = /* @__PURE__ */ new Set([ownVersion]);
  const rejectedVersions = /* @__PURE__ */ new Set();
  const myVersionMatch = ownVersion.match(re);
  if (!myVersionMatch) {
    return () => false;
  }
  const ownVersionParsed = {
    major: +myVersionMatch[1],
    minor: +myVersionMatch[2],
    patch: +myVersionMatch[3],
    prerelease: myVersionMatch[4]
  };
  if (ownVersionParsed.prerelease != null) {
    return function isExactmatch(globalVersion) {
      return globalVersion === ownVersion;
    };
  }
  function _reject(v) {
    rejectedVersions.add(v);
    return false;
  }
  function _accept(v) {
    acceptedVersions.add(v);
    return true;
  }
  return function isCompatible2(globalVersion) {
    if (acceptedVersions.has(globalVersion)) {
      return true;
    }
    if (rejectedVersions.has(globalVersion)) {
      return false;
    }
    const globalVersionMatch = globalVersion.match(re);
    if (!globalVersionMatch) {
      return _reject(globalVersion);
    }
    const globalVersionParsed = {
      major: +globalVersionMatch[1],
      minor: +globalVersionMatch[2],
      patch: +globalVersionMatch[3],
      prerelease: globalVersionMatch[4]
    };
    if (globalVersionParsed.prerelease != null) {
      return _reject(globalVersion);
    }
    if (ownVersionParsed.major !== globalVersionParsed.major) {
      return _reject(globalVersion);
    }
    if (ownVersionParsed.major === 0) {
      if (ownVersionParsed.minor === globalVersionParsed.minor && ownVersionParsed.patch <= globalVersionParsed.patch) {
        return _accept(globalVersion);
      }
      return _reject(globalVersion);
    }
    if (ownVersionParsed.minor <= globalVersionParsed.minor) {
      return _accept(globalVersion);
    }
    return _reject(globalVersion);
  };
}
var re, isCompatible;
var init_semver = __esm({
  "node_modules/@opentelemetry/api/build/esm/internal/semver.js"() {
    init_version();
    re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
    isCompatible = _makeCompatibilityCheck(VERSION);
  }
});
function registerGlobal(type, instance, diag3, allowOverride = false) {
  var _a;
  const api = _global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a !== void 0 ? _a : {
    version: VERSION
  };
  if (!allowOverride && api[type]) {
    const err = new Error(`@opentelemetry/api: Attempted duplicate registration of API: ${type}`);
    diag3.error(err.stack || err.message);
    return false;
  }
  if (api.version !== VERSION) {
    const err = new Error(`@opentelemetry/api: Registration of version v${api.version} for ${type} does not match previously registered API v${VERSION}`);
    diag3.error(err.stack || err.message);
    return false;
  }
  api[type] = instance;
  diag3.debug(`@opentelemetry/api: Registered a global for ${type} v${VERSION}.`);
  return true;
}
function getGlobal(type) {
  var _a, _b;
  const globalVersion = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a === void 0 ? void 0 : _a.version;
  if (!globalVersion || !isCompatible(globalVersion)) {
    return;
  }
  return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
}
function unregisterGlobal(type, diag3) {
  diag3.debug(`@opentelemetry/api: Unregistering a global for ${type} v${VERSION}.`);
  const api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
  if (api) {
    delete api[type];
  }
}
var major, GLOBAL_OPENTELEMETRY_API_KEY, _global;
var init_global_utils = __esm({
  "node_modules/@opentelemetry/api/build/esm/internal/global-utils.js"() {
    init_version();
    init_semver();
    major = VERSION.split(".")[0];
    GLOBAL_OPENTELEMETRY_API_KEY = /* @__PURE__ */ Symbol.for(`opentelemetry.js.api.${major}`);
    _global = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};
  }
});
function logProxy(funcName, namespace, args) {
  const logger = getGlobal("diag");
  if (!logger) {
    return;
  }
  return logger[funcName](namespace, ...args);
}
var DiagComponentLogger;
var init_ComponentLogger = __esm({
  "node_modules/@opentelemetry/api/build/esm/diag/ComponentLogger.js"() {
    init_global_utils();
    DiagComponentLogger = class {
      constructor(props) {
        this._namespace = props.namespace || "DiagComponentLogger";
      }
      debug(...args) {
        return logProxy("debug", this._namespace, args);
      }
      error(...args) {
        return logProxy("error", this._namespace, args);
      }
      info(...args) {
        return logProxy("info", this._namespace, args);
      }
      warn(...args) {
        return logProxy("warn", this._namespace, args);
      }
      verbose(...args) {
        return logProxy("verbose", this._namespace, args);
      }
    };
  }
});
var DiagLogLevel;
var init_types = __esm({
  "node_modules/@opentelemetry/api/build/esm/diag/types.js"() {
    (function(DiagLogLevel2) {
      DiagLogLevel2[DiagLogLevel2["NONE"] = 0] = "NONE";
      DiagLogLevel2[DiagLogLevel2["ERROR"] = 30] = "ERROR";
      DiagLogLevel2[DiagLogLevel2["WARN"] = 50] = "WARN";
      DiagLogLevel2[DiagLogLevel2["INFO"] = 60] = "INFO";
      DiagLogLevel2[DiagLogLevel2["DEBUG"] = 70] = "DEBUG";
      DiagLogLevel2[DiagLogLevel2["VERBOSE"] = 80] = "VERBOSE";
      DiagLogLevel2[DiagLogLevel2["ALL"] = 9999] = "ALL";
    })(DiagLogLevel || (DiagLogLevel = {}));
  }
});
function createLogLevelDiagLogger(maxLevel, logger) {
  if (maxLevel < DiagLogLevel.NONE) {
    maxLevel = DiagLogLevel.NONE;
  } else if (maxLevel > DiagLogLevel.ALL) {
    maxLevel = DiagLogLevel.ALL;
  }
  logger = logger || {};
  function _filterFunc(funcName, theLevel) {
    const theFunc = logger[funcName];
    if (typeof theFunc === "function" && maxLevel >= theLevel) {
      return theFunc.bind(logger);
    }
    return function() {
    };
  }
  return {
    error: _filterFunc("error", DiagLogLevel.ERROR),
    warn: _filterFunc("warn", DiagLogLevel.WARN),
    info: _filterFunc("info", DiagLogLevel.INFO),
    debug: _filterFunc("debug", DiagLogLevel.DEBUG),
    verbose: _filterFunc("verbose", DiagLogLevel.VERBOSE)
  };
}
var init_logLevelLogger = __esm({
  "node_modules/@opentelemetry/api/build/esm/diag/internal/logLevelLogger.js"() {
    init_types();
  }
});
var API_NAME, DiagAPI;
var init_diag = __esm({
  "node_modules/@opentelemetry/api/build/esm/api/diag.js"() {
    init_ComponentLogger();
    init_logLevelLogger();
    init_types();
    init_global_utils();
    API_NAME = "diag";
    DiagAPI = class _DiagAPI {
      /** Get the singleton instance of the DiagAPI API */
      static instance() {
        if (!this._instance) {
          this._instance = new _DiagAPI();
        }
        return this._instance;
      }
      /**
       * Private internal constructor
       * @private
       */
      constructor() {
        function _logProxy(funcName) {
          return function(...args) {
            const logger = getGlobal("diag");
            if (!logger)
              return;
            return logger[funcName](...args);
          };
        }
        const self2 = this;
        const setLogger = (logger, optionsOrLogLevel = { logLevel: DiagLogLevel.INFO }) => {
          var _a, _b, _c;
          if (logger === self2) {
            const err = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
            self2.error((_a = err.stack) !== null && _a !== void 0 ? _a : err.message);
            return false;
          }
          if (typeof optionsOrLogLevel === "number") {
            optionsOrLogLevel = {
              logLevel: optionsOrLogLevel
            };
          }
          const oldLogger = getGlobal("diag");
          const newLogger = createLogLevelDiagLogger((_b = optionsOrLogLevel.logLevel) !== null && _b !== void 0 ? _b : DiagLogLevel.INFO, logger);
          if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
            const stack = (_c = new Error().stack) !== null && _c !== void 0 ? _c : "<failed to generate stacktrace>";
            oldLogger.warn(`Current logger will be overwritten from ${stack}`);
            newLogger.warn(`Current logger will overwrite one already registered from ${stack}`);
          }
          return registerGlobal("diag", newLogger, self2, true);
        };
        self2.setLogger = setLogger;
        self2.disable = () => {
          unregisterGlobal(API_NAME, self2);
        };
        self2.createComponentLogger = (options) => {
          return new DiagComponentLogger(options);
        };
        self2.verbose = _logProxy("verbose");
        self2.debug = _logProxy("debug");
        self2.info = _logProxy("info");
        self2.warn = _logProxy("warn");
        self2.error = _logProxy("error");
      }
    };
  }
});
var BaggageImpl;
var init_baggage_impl = __esm({
  "node_modules/@opentelemetry/api/build/esm/baggage/internal/baggage-impl.js"() {
    BaggageImpl = class _BaggageImpl {
      constructor(entries) {
        this._entries = entries ? new Map(entries) : /* @__PURE__ */ new Map();
      }
      getEntry(key) {
        const entry = this._entries.get(key);
        if (!entry) {
          return void 0;
        }
        return Object.assign({}, entry);
      }
      getAllEntries() {
        return Array.from(this._entries.entries());
      }
      setEntry(key, entry) {
        const newBaggage = new _BaggageImpl(this._entries);
        newBaggage._entries.set(key, entry);
        return newBaggage;
      }
      removeEntry(key) {
        const newBaggage = new _BaggageImpl(this._entries);
        newBaggage._entries.delete(key);
        return newBaggage;
      }
      removeEntries(...keys) {
        const newBaggage = new _BaggageImpl(this._entries);
        for (const key of keys) {
          newBaggage._entries.delete(key);
        }
        return newBaggage;
      }
      clear() {
        return new _BaggageImpl();
      }
    };
  }
});
var baggageEntryMetadataSymbol;
var init_symbol = __esm({
  "node_modules/@opentelemetry/api/build/esm/baggage/internal/symbol.js"() {
    baggageEntryMetadataSymbol = /* @__PURE__ */ Symbol("BaggageEntryMetadata");
  }
});
function createBaggage(entries = {}) {
  return new BaggageImpl(new Map(Object.entries(entries)));
}
function baggageEntryMetadataFromString(str) {
  if (typeof str !== "string") {
    diag.error(`Cannot create baggage metadata from unknown type: ${typeof str}`);
    str = "";
  }
  return {
    __TYPE__: baggageEntryMetadataSymbol,
    toString() {
      return str;
    }
  };
}
var diag;
var init_utils2 = __esm({
  "node_modules/@opentelemetry/api/build/esm/baggage/utils.js"() {
    init_diag();
    init_baggage_impl();
    init_symbol();
    diag = DiagAPI.instance();
  }
});
function createContextKey(description) {
  return Symbol.for(description);
}
var BaseContext, ROOT_CONTEXT;
var init_context = __esm({
  "node_modules/@opentelemetry/api/build/esm/context/context.js"() {
    BaseContext = class _BaseContext {
      /**
       * Construct a new context which inherits values from an optional parent context.
       *
       * @param parentContext a context from which to inherit values
       */
      constructor(parentContext) {
        const self2 = this;
        self2._currentContext = parentContext ? new Map(parentContext) : /* @__PURE__ */ new Map();
        self2.getValue = (key) => self2._currentContext.get(key);
        self2.setValue = (key, value) => {
          const context2 = new _BaseContext(self2._currentContext);
          context2._currentContext.set(key, value);
          return context2;
        };
        self2.deleteValue = (key) => {
          const context2 = new _BaseContext(self2._currentContext);
          context2._currentContext.delete(key);
          return context2;
        };
      }
    };
    ROOT_CONTEXT = new BaseContext();
  }
});
var consoleMap, _originalConsoleMethods, DiagConsoleLogger;
var init_consoleLogger = __esm({
  "node_modules/@opentelemetry/api/build/esm/diag/consoleLogger.js"() {
    consoleMap = [
      { n: "error", c: "error" },
      { n: "warn", c: "warn" },
      { n: "info", c: "info" },
      { n: "debug", c: "debug" },
      { n: "verbose", c: "trace" }
    ];
    _originalConsoleMethods = {};
    if (typeof console !== "undefined") {
      const keys = [
        "error",
        "warn",
        "info",
        "debug",
        "trace",
        "log"
      ];
      for (const key of keys) {
        if (typeof console[key] === "function") {
          _originalConsoleMethods[key] = console[key];
        }
      }
    }
    DiagConsoleLogger = class {
      constructor() {
        function _consoleFunc(funcName) {
          return function(...args) {
            let theFunc = _originalConsoleMethods[funcName];
            if (typeof theFunc !== "function") {
              theFunc = _originalConsoleMethods["log"];
            }
            if (typeof theFunc !== "function" && console) {
              theFunc = console[funcName];
              if (typeof theFunc !== "function") {
                theFunc = console.log;
              }
            }
            if (typeof theFunc === "function") {
              return theFunc.apply(console, args);
            }
          };
        }
        for (let i = 0; i < consoleMap.length; i++) {
          this[consoleMap[i].n] = _consoleFunc(consoleMap[i].c);
        }
      }
    };
  }
});
function createNoopMeter() {
  return NOOP_METER;
}
var NoopMeter, NoopMetric, NoopCounterMetric, NoopUpDownCounterMetric, NoopGaugeMetric, NoopHistogramMetric, NoopObservableMetric, NoopObservableCounterMetric, NoopObservableGaugeMetric, NoopObservableUpDownCounterMetric, NOOP_METER, NOOP_COUNTER_METRIC, NOOP_GAUGE_METRIC, NOOP_HISTOGRAM_METRIC, NOOP_UP_DOWN_COUNTER_METRIC, NOOP_OBSERVABLE_COUNTER_METRIC, NOOP_OBSERVABLE_GAUGE_METRIC, NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
var init_NoopMeter = __esm({
  "node_modules/@opentelemetry/api/build/esm/metrics/NoopMeter.js"() {
    NoopMeter = class {
      constructor() {
      }
      /**
       * @see {@link Meter.createGauge}
       */
      createGauge(_name, _options) {
        return NOOP_GAUGE_METRIC;
      }
      /**
       * @see {@link Meter.createHistogram}
       */
      createHistogram(_name, _options) {
        return NOOP_HISTOGRAM_METRIC;
      }
      /**
       * @see {@link Meter.createCounter}
       */
      createCounter(_name, _options) {
        return NOOP_COUNTER_METRIC;
      }
      /**
       * @see {@link Meter.createUpDownCounter}
       */
      createUpDownCounter(_name, _options) {
        return NOOP_UP_DOWN_COUNTER_METRIC;
      }
      /**
       * @see {@link Meter.createObservableGauge}
       */
      createObservableGauge(_name, _options) {
        return NOOP_OBSERVABLE_GAUGE_METRIC;
      }
      /**
       * @see {@link Meter.createObservableCounter}
       */
      createObservableCounter(_name, _options) {
        return NOOP_OBSERVABLE_COUNTER_METRIC;
      }
      /**
       * @see {@link Meter.createObservableUpDownCounter}
       */
      createObservableUpDownCounter(_name, _options) {
        return NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
      }
      /**
       * @see {@link Meter.addBatchObservableCallback}
       */
      addBatchObservableCallback(_callback, _observables) {
      }
      /**
       * @see {@link Meter.removeBatchObservableCallback}
       */
      removeBatchObservableCallback(_callback) {
      }
    };
    NoopMetric = class {
    };
    NoopCounterMetric = class extends NoopMetric {
      add(_value, _attributes) {
      }
    };
    NoopUpDownCounterMetric = class extends NoopMetric {
      add(_value, _attributes) {
      }
    };
    NoopGaugeMetric = class extends NoopMetric {
      record(_value, _attributes) {
      }
    };
    NoopHistogramMetric = class extends NoopMetric {
      record(_value, _attributes) {
      }
    };
    NoopObservableMetric = class {
      addCallback(_callback) {
      }
      removeCallback(_callback) {
      }
    };
    NoopObservableCounterMetric = class extends NoopObservableMetric {
    };
    NoopObservableGaugeMetric = class extends NoopObservableMetric {
    };
    NoopObservableUpDownCounterMetric = class extends NoopObservableMetric {
    };
    NOOP_METER = new NoopMeter();
    NOOP_COUNTER_METRIC = new NoopCounterMetric();
    NOOP_GAUGE_METRIC = new NoopGaugeMetric();
    NOOP_HISTOGRAM_METRIC = new NoopHistogramMetric();
    NOOP_UP_DOWN_COUNTER_METRIC = new NoopUpDownCounterMetric();
    NOOP_OBSERVABLE_COUNTER_METRIC = new NoopObservableCounterMetric();
    NOOP_OBSERVABLE_GAUGE_METRIC = new NoopObservableGaugeMetric();
    NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new NoopObservableUpDownCounterMetric();
  }
});
var ValueType;
var init_Metric = __esm({
  "node_modules/@opentelemetry/api/build/esm/metrics/Metric.js"() {
    (function(ValueType2) {
      ValueType2[ValueType2["INT"] = 0] = "INT";
      ValueType2[ValueType2["DOUBLE"] = 1] = "DOUBLE";
    })(ValueType || (ValueType = {}));
  }
});
var defaultTextMapGetter, defaultTextMapSetter;
var init_TextMapPropagator = __esm({
  "node_modules/@opentelemetry/api/build/esm/propagation/TextMapPropagator.js"() {
    defaultTextMapGetter = {
      get(carrier, key) {
        if (carrier == null) {
          return void 0;
        }
        return carrier[key];
      },
      keys(carrier) {
        if (carrier == null) {
          return [];
        }
        return Object.keys(carrier);
      }
    };
    defaultTextMapSetter = {
      set(carrier, key, value) {
        if (carrier == null) {
          return;
        }
        carrier[key] = value;
      }
    };
  }
});
var NoopContextManager;
var init_NoopContextManager = __esm({
  "node_modules/@opentelemetry/api/build/esm/context/NoopContextManager.js"() {
    init_context();
    NoopContextManager = class {
      active() {
        return ROOT_CONTEXT;
      }
      with(_context, fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      bind(_context, target) {
        return target;
      }
      enable() {
        return this;
      }
      disable() {
        return this;
      }
    };
  }
});
var API_NAME2, NOOP_CONTEXT_MANAGER, ContextAPI;
var init_context2 = __esm({
  "node_modules/@opentelemetry/api/build/esm/api/context.js"() {
    init_NoopContextManager();
    init_global_utils();
    init_diag();
    API_NAME2 = "context";
    NOOP_CONTEXT_MANAGER = new NoopContextManager();
    ContextAPI = class _ContextAPI {
      /** Empty private constructor prevents end users from constructing a new instance of the API */
      constructor() {
      }
      /** Get the singleton instance of the Context API */
      static getInstance() {
        if (!this._instance) {
          this._instance = new _ContextAPI();
        }
        return this._instance;
      }
      /**
       * Set the current context manager.
       *
       * @returns true if the context manager was successfully registered, else false
       */
      setGlobalContextManager(contextManager) {
        return registerGlobal(API_NAME2, contextManager, DiagAPI.instance());
      }
      /**
       * Get the currently active context
       */
      active() {
        return this._getContextManager().active();
      }
      /**
       * Execute a function with an active context
       *
       * @param context context to be active during function execution
       * @param fn function to execute in a context
       * @param thisArg optional receiver to be used for calling fn
       * @param args optional arguments forwarded to fn
       */
      with(context2, fn, thisArg, ...args) {
        return this._getContextManager().with(context2, fn, thisArg, ...args);
      }
      /**
       * Bind a context to a target function or event emitter
       *
       * @param context context to bind to the event emitter or function. Defaults to the currently active context
       * @param target function or event emitter to bind
       */
      bind(context2, target) {
        return this._getContextManager().bind(context2, target);
      }
      _getContextManager() {
        return getGlobal(API_NAME2) || NOOP_CONTEXT_MANAGER;
      }
      /** Disable and remove the global context manager */
      disable() {
        this._getContextManager().disable();
        unregisterGlobal(API_NAME2, DiagAPI.instance());
      }
    };
  }
});
var TraceFlags;
var init_trace_flags = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/trace_flags.js"() {
    (function(TraceFlags2) {
      TraceFlags2[TraceFlags2["NONE"] = 0] = "NONE";
      TraceFlags2[TraceFlags2["SAMPLED"] = 1] = "SAMPLED";
    })(TraceFlags || (TraceFlags = {}));
  }
});
var INVALID_SPANID, INVALID_TRACEID, INVALID_SPAN_CONTEXT;
var init_invalid_span_constants = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/invalid-span-constants.js"() {
    init_trace_flags();
    INVALID_SPANID = "0000000000000000";
    INVALID_TRACEID = "00000000000000000000000000000000";
    INVALID_SPAN_CONTEXT = {
      traceId: INVALID_TRACEID,
      spanId: INVALID_SPANID,
      traceFlags: TraceFlags.NONE
    };
  }
});
var NonRecordingSpan;
var init_NonRecordingSpan = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/NonRecordingSpan.js"() {
    init_invalid_span_constants();
    NonRecordingSpan = class {
      constructor(spanContext = INVALID_SPAN_CONTEXT) {
        this._spanContext = spanContext;
      }
      // Returns a SpanContext.
      spanContext() {
        return this._spanContext;
      }
      // By default does nothing
      setAttribute(_key, _value) {
        return this;
      }
      // By default does nothing
      setAttributes(_attributes) {
        return this;
      }
      // By default does nothing
      addEvent(_name, _attributes) {
        return this;
      }
      addLink(_link) {
        return this;
      }
      addLinks(_links) {
        return this;
      }
      // By default does nothing
      setStatus(_status) {
        return this;
      }
      // By default does nothing
      updateName(_name) {
        return this;
      }
      // By default does nothing
      end(_endTime) {
      }
      // isRecording always returns false for NonRecordingSpan.
      isRecording() {
        return false;
      }
      // By default does nothing
      recordException(_exception, _time) {
      }
    };
  }
});
function getSpan(context2) {
  return context2.getValue(SPAN_KEY) || void 0;
}
function getActiveSpan() {
  return getSpan(ContextAPI.getInstance().active());
}
function setSpan(context2, span) {
  return context2.setValue(SPAN_KEY, span);
}
function deleteSpan(context2) {
  return context2.deleteValue(SPAN_KEY);
}
function setSpanContext(context2, spanContext) {
  return setSpan(context2, new NonRecordingSpan(spanContext));
}
function getSpanContext(context2) {
  var _a;
  return (_a = getSpan(context2)) === null || _a === void 0 ? void 0 : _a.spanContext();
}
var SPAN_KEY;
var init_context_utils = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/context-utils.js"() {
    init_context();
    init_NonRecordingSpan();
    init_context2();
    SPAN_KEY = createContextKey("OpenTelemetry Context Key SPAN");
  }
});
function isValidHex(id, length) {
  if (typeof id !== "string" || id.length !== length)
    return false;
  let r = 0;
  for (let i = 0; i < id.length; i += 4) {
    r += (isHex[id.charCodeAt(i)] | 0) + (isHex[id.charCodeAt(i + 1)] | 0) + (isHex[id.charCodeAt(i + 2)] | 0) + (isHex[id.charCodeAt(i + 3)] | 0);
  }
  return r === length;
}
function isValidTraceId(traceId) {
  return isValidHex(traceId, 32) && traceId !== INVALID_TRACEID;
}
function isValidSpanId(spanId) {
  return isValidHex(spanId, 16) && spanId !== INVALID_SPANID;
}
function isSpanContextValid(spanContext) {
  return isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId);
}
function wrapSpanContext(spanContext) {
  return new NonRecordingSpan(spanContext);
}
var isHex;
var init_spancontext_utils = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/spancontext-utils.js"() {
    init_invalid_span_constants();
    init_NonRecordingSpan();
    isHex = new Uint8Array([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1
    ]);
  }
});
function isSpanContext(spanContext) {
  return spanContext !== null && typeof spanContext === "object" && "spanId" in spanContext && typeof spanContext["spanId"] === "string" && "traceId" in spanContext && typeof spanContext["traceId"] === "string" && "traceFlags" in spanContext && typeof spanContext["traceFlags"] === "number";
}
var contextApi, NoopTracer;
var init_NoopTracer = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/NoopTracer.js"() {
    init_context2();
    init_context_utils();
    init_NonRecordingSpan();
    init_spancontext_utils();
    contextApi = ContextAPI.getInstance();
    NoopTracer = class {
      // startSpan starts a noop span.
      startSpan(name, options, context2 = contextApi.active()) {
        const root = Boolean(options === null || options === void 0 ? void 0 : options.root);
        if (root) {
          return new NonRecordingSpan();
        }
        const parentFromContext = context2 && getSpanContext(context2);
        if (isSpanContext(parentFromContext) && isSpanContextValid(parentFromContext)) {
          return new NonRecordingSpan(parentFromContext);
        } else {
          return new NonRecordingSpan();
        }
      }
      startActiveSpan(name, arg2, arg3, arg4) {
        let opts;
        let ctx;
        let fn;
        if (arguments.length < 2) {
          return;
        } else if (arguments.length === 2) {
          fn = arg2;
        } else if (arguments.length === 3) {
          opts = arg2;
          fn = arg3;
        } else {
          opts = arg2;
          ctx = arg3;
          fn = arg4;
        }
        const parentContext = ctx !== null && ctx !== void 0 ? ctx : contextApi.active();
        const span = this.startSpan(name, opts, parentContext);
        const contextWithSpanSet = setSpan(parentContext, span);
        return contextApi.with(contextWithSpanSet, fn, void 0, span);
      }
    };
  }
});
var NOOP_TRACER, ProxyTracer;
var init_ProxyTracer = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/ProxyTracer.js"() {
    init_NoopTracer();
    NOOP_TRACER = new NoopTracer();
    ProxyTracer = class {
      constructor(provider, name, version2, options) {
        this._provider = provider;
        this.name = name;
        this.version = version2;
        this.options = options;
      }
      startSpan(name, options, context2) {
        return this._getTracer().startSpan(name, options, context2);
      }
      startActiveSpan(_name, _options, _context, _fn) {
        const tracer = this._getTracer();
        return Reflect.apply(tracer.startActiveSpan, tracer, arguments);
      }
      /**
       * Try to get a tracer from the proxy tracer provider.
       * If the proxy tracer provider has no delegate, return a noop tracer.
       */
      _getTracer() {
        if (this._delegate) {
          return this._delegate;
        }
        const tracer = this._provider.getDelegateTracer(this.name, this.version, this.options);
        if (!tracer) {
          return NOOP_TRACER;
        }
        this._delegate = tracer;
        return this._delegate;
      }
    };
  }
});
var NoopTracerProvider;
var init_NoopTracerProvider = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/NoopTracerProvider.js"() {
    init_NoopTracer();
    NoopTracerProvider = class {
      getTracer(_name, _version, _options) {
        return new NoopTracer();
      }
    };
  }
});
var NOOP_TRACER_PROVIDER, ProxyTracerProvider;
var init_ProxyTracerProvider = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/ProxyTracerProvider.js"() {
    init_ProxyTracer();
    init_NoopTracerProvider();
    NOOP_TRACER_PROVIDER = new NoopTracerProvider();
    ProxyTracerProvider = class {
      /**
       * Get a {@link ProxyTracer}
       */
      getTracer(name, version2, options) {
        var _a;
        return (_a = this.getDelegateTracer(name, version2, options)) !== null && _a !== void 0 ? _a : new ProxyTracer(this, name, version2, options);
      }
      getDelegate() {
        var _a;
        return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_TRACER_PROVIDER;
      }
      /**
       * Set the delegate tracer provider
       */
      setDelegate(delegate) {
        this._delegate = delegate;
      }
      getDelegateTracer(name, version2, options) {
        var _a;
        return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getTracer(name, version2, options);
      }
    };
  }
});
var SamplingDecision;
var init_SamplingResult = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/SamplingResult.js"() {
    (function(SamplingDecision2) {
      SamplingDecision2[SamplingDecision2["NOT_RECORD"] = 0] = "NOT_RECORD";
      SamplingDecision2[SamplingDecision2["RECORD"] = 1] = "RECORD";
      SamplingDecision2[SamplingDecision2["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
    })(SamplingDecision || (SamplingDecision = {}));
  }
});
var SpanKind;
var init_span_kind = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/span_kind.js"() {
    (function(SpanKind2) {
      SpanKind2[SpanKind2["INTERNAL"] = 0] = "INTERNAL";
      SpanKind2[SpanKind2["SERVER"] = 1] = "SERVER";
      SpanKind2[SpanKind2["CLIENT"] = 2] = "CLIENT";
      SpanKind2[SpanKind2["PRODUCER"] = 3] = "PRODUCER";
      SpanKind2[SpanKind2["CONSUMER"] = 4] = "CONSUMER";
    })(SpanKind || (SpanKind = {}));
  }
});
var SpanStatusCode;
var init_status = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/status.js"() {
    (function(SpanStatusCode2) {
      SpanStatusCode2[SpanStatusCode2["UNSET"] = 0] = "UNSET";
      SpanStatusCode2[SpanStatusCode2["OK"] = 1] = "OK";
      SpanStatusCode2[SpanStatusCode2["ERROR"] = 2] = "ERROR";
    })(SpanStatusCode || (SpanStatusCode = {}));
  }
});
function validateKey(key) {
  return VALID_KEY_REGEX.test(key);
}
function validateValue(value) {
  return VALID_VALUE_BASE_REGEX.test(value) && !INVALID_VALUE_COMMA_EQUAL_REGEX.test(value);
}
var VALID_KEY_CHAR_RANGE, VALID_KEY, VALID_VENDOR_KEY, VALID_KEY_REGEX, VALID_VALUE_BASE_REGEX, INVALID_VALUE_COMMA_EQUAL_REGEX;
var init_tracestate_validators = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/internal/tracestate-validators.js"() {
    VALID_KEY_CHAR_RANGE = "[_0-9a-z-*/]";
    VALID_KEY = `[a-z]${VALID_KEY_CHAR_RANGE}{0,255}`;
    VALID_VENDOR_KEY = `[a-z0-9]${VALID_KEY_CHAR_RANGE}{0,240}@[a-z]${VALID_KEY_CHAR_RANGE}{0,13}`;
    VALID_KEY_REGEX = new RegExp(`^(?:${VALID_KEY}|${VALID_VENDOR_KEY})$`);
    VALID_VALUE_BASE_REGEX = /^[ -~]{0,255}[!-~]$/;
    INVALID_VALUE_COMMA_EQUAL_REGEX = /,|=/;
  }
});
var MAX_TRACE_STATE_ITEMS, MAX_TRACE_STATE_LEN, LIST_MEMBERS_SEPARATOR, LIST_MEMBER_KEY_VALUE_SPLITTER, TraceStateImpl;
var init_tracestate_impl = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/internal/tracestate-impl.js"() {
    init_tracestate_validators();
    MAX_TRACE_STATE_ITEMS = 32;
    MAX_TRACE_STATE_LEN = 512;
    LIST_MEMBERS_SEPARATOR = ",";
    LIST_MEMBER_KEY_VALUE_SPLITTER = "=";
    TraceStateImpl = class _TraceStateImpl {
      constructor(rawTraceState) {
        this._internalState = /* @__PURE__ */ new Map();
        if (rawTraceState)
          this._parse(rawTraceState);
      }
      set(key, value) {
        const traceState = this._clone();
        if (traceState._internalState.has(key)) {
          traceState._internalState.delete(key);
        }
        traceState._internalState.set(key, value);
        return traceState;
      }
      unset(key) {
        const traceState = this._clone();
        traceState._internalState.delete(key);
        return traceState;
      }
      get(key) {
        return this._internalState.get(key);
      }
      serialize() {
        return Array.from(this._internalState.keys()).reduceRight((agg, key) => {
          agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER + this.get(key));
          return agg;
        }, []).join(LIST_MEMBERS_SEPARATOR);
      }
      _parse(rawTraceState) {
        if (rawTraceState.length > MAX_TRACE_STATE_LEN)
          return;
        this._internalState = rawTraceState.split(LIST_MEMBERS_SEPARATOR).reduceRight((agg, part) => {
          const listMember = part.trim();
          const i = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
          if (i !== -1) {
            const key = listMember.slice(0, i);
            const value = listMember.slice(i + 1, part.length);
            if (validateKey(key) && validateValue(value)) {
              agg.set(key, value);
            }
          }
          return agg;
        }, /* @__PURE__ */ new Map());
        if (this._internalState.size > MAX_TRACE_STATE_ITEMS) {
          this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, MAX_TRACE_STATE_ITEMS));
        }
      }
      // @ts-expect-error TS6133 Accessed in tests only.
      _keys() {
        return Array.from(this._internalState.keys()).reverse();
      }
      _clone() {
        const traceState = new _TraceStateImpl();
        traceState._internalState = new Map(this._internalState);
        return traceState;
      }
    };
  }
});
function createTraceState(rawTraceState) {
  return new TraceStateImpl(rawTraceState);
}
var init_utils3 = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/internal/utils.js"() {
    init_tracestate_impl();
  }
});
var context;
var init_context_api = __esm({
  "node_modules/@opentelemetry/api/build/esm/context-api.js"() {
    init_context2();
    context = ContextAPI.getInstance();
  }
});
var diag2;
var init_diag_api = __esm({
  "node_modules/@opentelemetry/api/build/esm/diag-api.js"() {
    init_diag();
    diag2 = DiagAPI.instance();
  }
});
var NoopMeterProvider, NOOP_METER_PROVIDER;
var init_NoopMeterProvider = __esm({
  "node_modules/@opentelemetry/api/build/esm/metrics/NoopMeterProvider.js"() {
    init_NoopMeter();
    NoopMeterProvider = class {
      getMeter(_name, _version, _options) {
        return NOOP_METER;
      }
    };
    NOOP_METER_PROVIDER = new NoopMeterProvider();
  }
});
var API_NAME3, MetricsAPI;
var init_metrics = __esm({
  "node_modules/@opentelemetry/api/build/esm/api/metrics.js"() {
    init_NoopMeterProvider();
    init_global_utils();
    init_diag();
    API_NAME3 = "metrics";
    MetricsAPI = class _MetricsAPI {
      /** Empty private constructor prevents end users from constructing a new instance of the API */
      constructor() {
      }
      /** Get the singleton instance of the Metrics API */
      static getInstance() {
        if (!this._instance) {
          this._instance = new _MetricsAPI();
        }
        return this._instance;
      }
      /**
       * Set the current global meter provider.
       * Returns true if the meter provider was successfully registered, else false.
       */
      setGlobalMeterProvider(provider) {
        return registerGlobal(API_NAME3, provider, DiagAPI.instance());
      }
      /**
       * Returns the global meter provider.
       */
      getMeterProvider() {
        return getGlobal(API_NAME3) || NOOP_METER_PROVIDER;
      }
      /**
       * Returns a meter from the global meter provider.
       */
      getMeter(name, version2, options) {
        return this.getMeterProvider().getMeter(name, version2, options);
      }
      /** Remove the global meter provider */
      disable() {
        unregisterGlobal(API_NAME3, DiagAPI.instance());
      }
    };
  }
});
var metrics;
var init_metrics_api = __esm({
  "node_modules/@opentelemetry/api/build/esm/metrics-api.js"() {
    init_metrics();
    metrics = MetricsAPI.getInstance();
  }
});
var NoopTextMapPropagator;
var init_NoopTextMapPropagator = __esm({
  "node_modules/@opentelemetry/api/build/esm/propagation/NoopTextMapPropagator.js"() {
    NoopTextMapPropagator = class {
      /** Noop inject function does nothing */
      inject(_context, _carrier) {
      }
      /** Noop extract function does nothing and returns the input context */
      extract(context2, _carrier) {
        return context2;
      }
      fields() {
        return [];
      }
    };
  }
});
function getBaggage(context2) {
  return context2.getValue(BAGGAGE_KEY) || void 0;
}
function getActiveBaggage() {
  return getBaggage(ContextAPI.getInstance().active());
}
function setBaggage(context2, baggage) {
  return context2.setValue(BAGGAGE_KEY, baggage);
}
function deleteBaggage(context2) {
  return context2.deleteValue(BAGGAGE_KEY);
}
var BAGGAGE_KEY;
var init_context_helpers = __esm({
  "node_modules/@opentelemetry/api/build/esm/baggage/context-helpers.js"() {
    init_context2();
    init_context();
    BAGGAGE_KEY = createContextKey("OpenTelemetry Baggage Key");
  }
});
var API_NAME4, NOOP_TEXT_MAP_PROPAGATOR, PropagationAPI;
var init_propagation = __esm({
  "node_modules/@opentelemetry/api/build/esm/api/propagation.js"() {
    init_global_utils();
    init_NoopTextMapPropagator();
    init_TextMapPropagator();
    init_context_helpers();
    init_utils2();
    init_diag();
    API_NAME4 = "propagation";
    NOOP_TEXT_MAP_PROPAGATOR = new NoopTextMapPropagator();
    PropagationAPI = class _PropagationAPI {
      /** Empty private constructor prevents end users from constructing a new instance of the API */
      constructor() {
        this.createBaggage = createBaggage;
        this.getBaggage = getBaggage;
        this.getActiveBaggage = getActiveBaggage;
        this.setBaggage = setBaggage;
        this.deleteBaggage = deleteBaggage;
      }
      /** Get the singleton instance of the Propagator API */
      static getInstance() {
        if (!this._instance) {
          this._instance = new _PropagationAPI();
        }
        return this._instance;
      }
      /**
       * Set the current propagator.
       *
       * @returns true if the propagator was successfully registered, else false
       */
      setGlobalPropagator(propagator) {
        return registerGlobal(API_NAME4, propagator, DiagAPI.instance());
      }
      /**
       * Inject context into a carrier to be propagated inter-process
       *
       * @param context Context carrying tracing data to inject
       * @param carrier carrier to inject context into
       * @param setter Function used to set values on the carrier
       */
      inject(context2, carrier, setter = defaultTextMapSetter) {
        return this._getGlobalPropagator().inject(context2, carrier, setter);
      }
      /**
       * Extract context from a carrier
       *
       * @param context Context which the newly created context will inherit from
       * @param carrier Carrier to extract context from
       * @param getter Function used to extract keys from a carrier
       */
      extract(context2, carrier, getter = defaultTextMapGetter) {
        return this._getGlobalPropagator().extract(context2, carrier, getter);
      }
      /**
       * Return a list of all fields which may be used by the propagator.
       */
      fields() {
        return this._getGlobalPropagator().fields();
      }
      /** Remove the global propagator */
      disable() {
        unregisterGlobal(API_NAME4, DiagAPI.instance());
      }
      _getGlobalPropagator() {
        return getGlobal(API_NAME4) || NOOP_TEXT_MAP_PROPAGATOR;
      }
    };
  }
});
var propagation;
var init_propagation_api = __esm({
  "node_modules/@opentelemetry/api/build/esm/propagation-api.js"() {
    init_propagation();
    propagation = PropagationAPI.getInstance();
  }
});
var API_NAME5, TraceAPI;
var init_trace = __esm({
  "node_modules/@opentelemetry/api/build/esm/api/trace.js"() {
    init_global_utils();
    init_ProxyTracerProvider();
    init_spancontext_utils();
    init_context_utils();
    init_diag();
    API_NAME5 = "trace";
    TraceAPI = class _TraceAPI {
      /** Empty private constructor prevents end users from constructing a new instance of the API */
      constructor() {
        this._proxyTracerProvider = new ProxyTracerProvider();
        this.wrapSpanContext = wrapSpanContext;
        this.isSpanContextValid = isSpanContextValid;
        this.deleteSpan = deleteSpan;
        this.getSpan = getSpan;
        this.getActiveSpan = getActiveSpan;
        this.getSpanContext = getSpanContext;
        this.setSpan = setSpan;
        this.setSpanContext = setSpanContext;
      }
      /** Get the singleton instance of the Trace API */
      static getInstance() {
        if (!this._instance) {
          this._instance = new _TraceAPI();
        }
        return this._instance;
      }
      /**
       * Set the current global tracer.
       *
       * @returns true if the tracer provider was successfully registered, else false
       */
      setGlobalTracerProvider(provider) {
        const success = registerGlobal(API_NAME5, this._proxyTracerProvider, DiagAPI.instance());
        if (success) {
          this._proxyTracerProvider.setDelegate(provider);
        }
        return success;
      }
      /**
       * Returns the global tracer provider.
       */
      getTracerProvider() {
        return getGlobal(API_NAME5) || this._proxyTracerProvider;
      }
      /**
       * Returns a tracer from the global tracer provider.
       */
      getTracer(name, version2) {
        return this.getTracerProvider().getTracer(name, version2);
      }
      /** Remove the global tracer provider */
      disable() {
        unregisterGlobal(API_NAME5, DiagAPI.instance());
        this._proxyTracerProvider = new ProxyTracerProvider();
      }
    };
  }
});
var trace;
var init_trace_api = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace-api.js"() {
    init_trace();
    trace = TraceAPI.getInstance();
  }
});
var esm_exports = {};
__export(esm_exports, {
  DiagConsoleLogger: () => DiagConsoleLogger,
  DiagLogLevel: () => DiagLogLevel,
  INVALID_SPANID: () => INVALID_SPANID,
  INVALID_SPAN_CONTEXT: () => INVALID_SPAN_CONTEXT,
  INVALID_TRACEID: () => INVALID_TRACEID,
  ProxyTracer: () => ProxyTracer,
  ProxyTracerProvider: () => ProxyTracerProvider,
  ROOT_CONTEXT: () => ROOT_CONTEXT,
  SamplingDecision: () => SamplingDecision,
  SpanKind: () => SpanKind,
  SpanStatusCode: () => SpanStatusCode,
  TraceFlags: () => TraceFlags,
  ValueType: () => ValueType,
  baggageEntryMetadataFromString: () => baggageEntryMetadataFromString,
  context: () => context,
  createContextKey: () => createContextKey,
  createNoopMeter: () => createNoopMeter,
  createTraceState: () => createTraceState,
  default: () => esm_default,
  defaultTextMapGetter: () => defaultTextMapGetter,
  defaultTextMapSetter: () => defaultTextMapSetter,
  diag: () => diag2,
  isSpanContextValid: () => isSpanContextValid,
  isValidSpanId: () => isValidSpanId,
  isValidTraceId: () => isValidTraceId,
  metrics: () => metrics,
  propagation: () => propagation,
  trace: () => trace
});
var esm_default;
var init_esm = __esm({
  "node_modules/@opentelemetry/api/build/esm/index.js"() {
    init_utils2();
    init_context();
    init_consoleLogger();
    init_types();
    init_NoopMeter();
    init_Metric();
    init_TextMapPropagator();
    init_ProxyTracer();
    init_ProxyTracerProvider();
    init_SamplingResult();
    init_span_kind();
    init_status();
    init_trace_flags();
    init_utils3();
    init_spancontext_utils();
    init_invalid_span_constants();
    init_context_api();
    init_diag_api();
    init_metrics_api();
    init_propagation_api();
    init_trace_api();
    esm_default = {
      context,
      diag: diag2,
      metrics,
      propagation,
      trace
    };
  }
});
var require_middleware = __commonJS({
  ".next/server/src/middleware.js"() {
    (self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[550], { 11: (a) => {
      a.exports = c, a.exports.preferredCharsets = c;
      var b = /^\s*([^\s;]+)\s*(?:;(.*))?$/;
      function c(a2, c2) {
        var g = (function(a3) {
          for (var c3 = a3.split(","), d2 = 0, e2 = 0; d2 < c3.length; d2++) {
            var f2 = (function(a4, c4) {
              var d3 = b.exec(a4);
              if (!d3) return null;
              var e3 = d3[1], f3 = 1;
              if (d3[2]) for (var g2 = d3[2].split(";"), h2 = 0; h2 < g2.length; h2++) {
                var i = g2[h2].trim().split("=");
                if ("q" === i[0]) {
                  f3 = parseFloat(i[1]);
                  break;
                }
              }
              return { charset: e3, q: f3, i: c4 };
            })(c3[d2].trim(), d2);
            f2 && (c3[e2++] = f2);
          }
          return c3.length = e2, c3;
        })(void 0 === a2 ? "*" : a2 || "");
        if (!c2) return g.filter(f).sort(d).map(e);
        var h = c2.map(function(a3, b2) {
          for (var c3 = { o: -1, q: 0, s: 0 }, d2 = 0; d2 < g.length; d2++) {
            var e2 = (function(a4, b3, c4) {
              var d3 = 0;
              if (b3.charset.toLowerCase() === a4.toLowerCase()) d3 |= 1;
              else if ("*" !== b3.charset) return null;
              return { i: c4, o: b3.i, q: b3.q, s: d3 };
            })(a3, g[d2], b2);
            e2 && 0 > (c3.s - e2.s || c3.q - e2.q || c3.o - e2.o) && (c3 = e2);
          }
          return c3;
        });
        return h.filter(f).sort(d).map(function(a3) {
          return c2[h.indexOf(a3)];
        });
      }
      function d(a2, b2) {
        return b2.q - a2.q || b2.s - a2.s || a2.o - b2.o || a2.i - b2.i || 0;
      }
      function e(a2) {
        return a2.charset;
      }
      function f(a2) {
        return a2.q > 0;
      }
    }, 42: (a) => {
      !(function() {
        var b = { 114: function(a2) {
          function b2(a3) {
            if ("string" != typeof a3) throw TypeError("Path must be a string. Received " + JSON.stringify(a3));
          }
          function c2(a3, b3) {
            for (var c3, d3 = "", e = 0, f = -1, g = 0, h = 0; h <= a3.length; ++h) {
              if (h < a3.length) c3 = a3.charCodeAt(h);
              else if (47 === c3) break;
              else c3 = 47;
              if (47 === c3) {
                if (f === h - 1 || 1 === g) ;
                else if (f !== h - 1 && 2 === g) {
                  if (d3.length < 2 || 2 !== e || 46 !== d3.charCodeAt(d3.length - 1) || 46 !== d3.charCodeAt(d3.length - 2)) {
                    if (d3.length > 2) {
                      var i = d3.lastIndexOf("/");
                      if (i !== d3.length - 1) {
                        -1 === i ? (d3 = "", e = 0) : e = (d3 = d3.slice(0, i)).length - 1 - d3.lastIndexOf("/"), f = h, g = 0;
                        continue;
                      }
                    } else if (2 === d3.length || 1 === d3.length) {
                      d3 = "", e = 0, f = h, g = 0;
                      continue;
                    }
                  }
                  b3 && (d3.length > 0 ? d3 += "/.." : d3 = "..", e = 2);
                } else d3.length > 0 ? d3 += "/" + a3.slice(f + 1, h) : d3 = a3.slice(f + 1, h), e = h - f - 1;
                f = h, g = 0;
              } else 46 === c3 && -1 !== g ? ++g : g = -1;
            }
            return d3;
          }
          var d2 = { resolve: function() {
            for (var a3, d3, e = "", f = false, g = arguments.length - 1; g >= -1 && !f; g--) g >= 0 ? d3 = arguments[g] : (void 0 === a3 && (a3 = ""), d3 = a3), b2(d3), 0 !== d3.length && (e = d3 + "/" + e, f = 47 === d3.charCodeAt(0));
            if (e = c2(e, !f), f) if (e.length > 0) return "/" + e;
            else return "/";
            return e.length > 0 ? e : ".";
          }, normalize: function(a3) {
            if (b2(a3), 0 === a3.length) return ".";
            var d3 = 47 === a3.charCodeAt(0), e = 47 === a3.charCodeAt(a3.length - 1);
            return (0 !== (a3 = c2(a3, !d3)).length || d3 || (a3 = "."), a3.length > 0 && e && (a3 += "/"), d3) ? "/" + a3 : a3;
          }, isAbsolute: function(a3) {
            return b2(a3), a3.length > 0 && 47 === a3.charCodeAt(0);
          }, join: function() {
            if (0 == arguments.length) return ".";
            for (var a3, c3 = 0; c3 < arguments.length; ++c3) {
              var e = arguments[c3];
              b2(e), e.length > 0 && (void 0 === a3 ? a3 = e : a3 += "/" + e);
            }
            return void 0 === a3 ? "." : d2.normalize(a3);
          }, relative: function(a3, c3) {
            if (b2(a3), b2(c3), a3 === c3 || (a3 = d2.resolve(a3)) === (c3 = d2.resolve(c3))) return "";
            for (var e = 1; e < a3.length && 47 === a3.charCodeAt(e); ++e) ;
            for (var f = a3.length, g = f - e, h = 1; h < c3.length && 47 === c3.charCodeAt(h); ++h) ;
            for (var i = c3.length - h, j = g < i ? g : i, k = -1, l = 0; l <= j; ++l) {
              if (l === j) {
                if (i > j) {
                  if (47 === c3.charCodeAt(h + l)) return c3.slice(h + l + 1);
                  else if (0 === l) return c3.slice(h + l);
                } else g > j && (47 === a3.charCodeAt(e + l) ? k = l : 0 === l && (k = 0));
                break;
              }
              var m = a3.charCodeAt(e + l);
              if (m !== c3.charCodeAt(h + l)) break;
              47 === m && (k = l);
            }
            var n = "";
            for (l = e + k + 1; l <= f; ++l) (l === f || 47 === a3.charCodeAt(l)) && (0 === n.length ? n += ".." : n += "/..");
            return n.length > 0 ? n + c3.slice(h + k) : (h += k, 47 === c3.charCodeAt(h) && ++h, c3.slice(h));
          }, _makeLong: function(a3) {
            return a3;
          }, dirname: function(a3) {
            if (b2(a3), 0 === a3.length) return ".";
            for (var c3 = a3.charCodeAt(0), d3 = 47 === c3, e = -1, f = true, g = a3.length - 1; g >= 1; --g) if (47 === (c3 = a3.charCodeAt(g))) {
              if (!f) {
                e = g;
                break;
              }
            } else f = false;
            return -1 === e ? d3 ? "/" : "." : d3 && 1 === e ? "//" : a3.slice(0, e);
          }, basename: function(a3, c3) {
            if (void 0 !== c3 && "string" != typeof c3) throw TypeError('"ext" argument must be a string');
            b2(a3);
            var d3, e = 0, f = -1, g = true;
            if (void 0 !== c3 && c3.length > 0 && c3.length <= a3.length) {
              if (c3.length === a3.length && c3 === a3) return "";
              var h = c3.length - 1, i = -1;
              for (d3 = a3.length - 1; d3 >= 0; --d3) {
                var j = a3.charCodeAt(d3);
                if (47 === j) {
                  if (!g) {
                    e = d3 + 1;
                    break;
                  }
                } else -1 === i && (g = false, i = d3 + 1), h >= 0 && (j === c3.charCodeAt(h) ? -1 == --h && (f = d3) : (h = -1, f = i));
              }
              return e === f ? f = i : -1 === f && (f = a3.length), a3.slice(e, f);
            }
            for (d3 = a3.length - 1; d3 >= 0; --d3) if (47 === a3.charCodeAt(d3)) {
              if (!g) {
                e = d3 + 1;
                break;
              }
            } else -1 === f && (g = false, f = d3 + 1);
            return -1 === f ? "" : a3.slice(e, f);
          }, extname: function(a3) {
            b2(a3);
            for (var c3 = -1, d3 = 0, e = -1, f = true, g = 0, h = a3.length - 1; h >= 0; --h) {
              var i = a3.charCodeAt(h);
              if (47 === i) {
                if (!f) {
                  d3 = h + 1;
                  break;
                }
                continue;
              }
              -1 === e && (f = false, e = h + 1), 46 === i ? -1 === c3 ? c3 = h : 1 !== g && (g = 1) : -1 !== c3 && (g = -1);
            }
            return -1 === c3 || -1 === e || 0 === g || 1 === g && c3 === e - 1 && c3 === d3 + 1 ? "" : a3.slice(c3, e);
          }, format: function(a3) {
            var b3, c3;
            if (null === a3 || "object" != typeof a3) throw TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof a3);
            return b3 = a3.dir || a3.root, c3 = a3.base || (a3.name || "") + (a3.ext || ""), b3 ? b3 === a3.root ? b3 + c3 : b3 + "/" + c3 : c3;
          }, parse: function(a3) {
            b2(a3);
            var c3, d3 = { root: "", dir: "", base: "", ext: "", name: "" };
            if (0 === a3.length) return d3;
            var e = a3.charCodeAt(0), f = 47 === e;
            f ? (d3.root = "/", c3 = 1) : c3 = 0;
            for (var g = -1, h = 0, i = -1, j = true, k = a3.length - 1, l = 0; k >= c3; --k) {
              if (47 === (e = a3.charCodeAt(k))) {
                if (!j) {
                  h = k + 1;
                  break;
                }
                continue;
              }
              -1 === i && (j = false, i = k + 1), 46 === e ? -1 === g ? g = k : 1 !== l && (l = 1) : -1 !== g && (l = -1);
            }
            return -1 === g || -1 === i || 0 === l || 1 === l && g === i - 1 && g === h + 1 ? -1 !== i && (0 === h && f ? d3.base = d3.name = a3.slice(1, i) : d3.base = d3.name = a3.slice(h, i)) : (0 === h && f ? (d3.name = a3.slice(1, g), d3.base = a3.slice(1, i)) : (d3.name = a3.slice(h, g), d3.base = a3.slice(h, i)), d3.ext = a3.slice(g, i)), h > 0 ? d3.dir = a3.slice(0, h - 1) : f && (d3.dir = "/"), d3;
          }, sep: "/", delimiter: ":", win32: null, posix: null };
          d2.posix = d2, a2.exports = d2;
        } }, c = {};
        function d(a2) {
          var e = c[a2];
          if (void 0 !== e) return e.exports;
          var f = c[a2] = { exports: {} }, g = true;
          try {
            b[a2](f, f.exports, d), g = false;
          } finally {
            g && delete c[a2];
          }
          return f.exports;
        }
        d.ab = "//", a.exports = d(114);
      })();
    }, 116: (a, b, c) => {
      var d, e, f, g, h, i, j, k, l, m, n, o;
      c.r(b), c.d(b, { DiagConsoleLogger: () => L, DiagLogLevel: () => d, INVALID_SPANID: () => aj, INVALID_SPAN_CONTEXT: () => al, INVALID_TRACEID: () => ak, ProxyTracer: () => aD, ProxyTracerProvider: () => aG, ROOT_CONTEXT: () => I, SamplingDecision: () => g, SpanKind: () => h, SpanStatusCode: () => i, TraceFlags: () => f, ValueType: () => e, baggageEntryMetadataFromString: () => F, context: () => aP, createContextKey: () => G, createNoopMeter: () => ac, createTraceState: () => aO, default: () => a7, defaultTextMapGetter: () => ad, defaultTextMapSetter: () => ae, diag: () => aQ, isSpanContextValid: () => ay, isValidSpanId: () => ax, isValidTraceId: () => aw, metrics: () => aV, propagation: () => a3, trace: () => a6 });
      let p = "1.9.1", q = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/, r = (function(a8) {
        let b2 = /* @__PURE__ */ new Set([a8]), c2 = /* @__PURE__ */ new Set(), d2 = a8.match(q);
        if (!d2) return () => false;
        let e2 = { major: +d2[1], minor: +d2[2], patch: +d2[3], prerelease: d2[4] };
        if (null != e2.prerelease) return function(b3) {
          return b3 === a8;
        };
        function f2(a9) {
          return c2.add(a9), false;
        }
        return function(a9) {
          if (b2.has(a9)) return true;
          if (c2.has(a9)) return false;
          let d3 = a9.match(q);
          if (!d3) return f2(a9);
          let g2 = { major: +d3[1], minor: +d3[2], patch: +d3[3], prerelease: d3[4] };
          if (null != g2.prerelease || e2.major !== g2.major) return f2(a9);
          if (0 === e2.major) return e2.minor === g2.minor && e2.patch <= g2.patch ? (b2.add(a9), true) : f2(a9);
          return e2.minor <= g2.minor ? (b2.add(a9), true) : f2(a9);
        };
      })(p), s = p.split(".")[0], t = /* @__PURE__ */ Symbol.for(`opentelemetry.js.api.${s}`), u = "object" == typeof globalThis ? globalThis : "object" == typeof self ? self : "object" == typeof window ? window : "object" == typeof c.g ? c.g : {};
      function v(a8, b2, c2, d2 = false) {
        var e2;
        let f2 = u[t] = null != (e2 = u[t]) ? e2 : { version: p };
        if (!d2 && f2[a8]) {
          let b3 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${a8}`);
          return c2.error(b3.stack || b3.message), false;
        }
        if (f2.version !== p) {
          let b3 = Error(`@opentelemetry/api: Registration of version v${f2.version} for ${a8} does not match previously registered API v${p}`);
          return c2.error(b3.stack || b3.message), false;
        }
        return f2[a8] = b2, c2.debug(`@opentelemetry/api: Registered a global for ${a8} v${p}.`), true;
      }
      function w(a8) {
        var b2, c2;
        let d2 = null == (b2 = u[t]) ? void 0 : b2.version;
        if (d2 && r(d2)) return null == (c2 = u[t]) ? void 0 : c2[a8];
      }
      function x(a8, b2) {
        b2.debug(`@opentelemetry/api: Unregistering a global for ${a8} v${p}.`);
        let c2 = u[t];
        c2 && delete c2[a8];
      }
      class y {
        constructor(a8) {
          this._namespace = a8.namespace || "DiagComponentLogger";
        }
        debug(...a8) {
          return z("debug", this._namespace, a8);
        }
        error(...a8) {
          return z("error", this._namespace, a8);
        }
        info(...a8) {
          return z("info", this._namespace, a8);
        }
        warn(...a8) {
          return z("warn", this._namespace, a8);
        }
        verbose(...a8) {
          return z("verbose", this._namespace, a8);
        }
      }
      function z(a8, b2, c2) {
        let d2 = w("diag");
        if (d2) return d2[a8](b2, ...c2);
      }
      (j = d || (d = {}))[j.NONE = 0] = "NONE", j[j.ERROR = 30] = "ERROR", j[j.WARN = 50] = "WARN", j[j.INFO = 60] = "INFO", j[j.DEBUG = 70] = "DEBUG", j[j.VERBOSE = 80] = "VERBOSE", j[j.ALL = 9999] = "ALL";
      class A {
        static instance() {
          return this._instance || (this._instance = new A()), this._instance;
        }
        constructor() {
          function a8(a9) {
            return function(...b3) {
              let c3 = w("diag");
              if (c3) return c3[a9](...b3);
            };
          }
          const b2 = this, c2 = (a9, c3 = { logLevel: d.INFO }) => {
            var e2, f2, g2;
            if (a9 === b2) {
              let a10 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
              return b2.error(null != (e2 = a10.stack) ? e2 : a10.message), false;
            }
            "number" == typeof c3 && (c3 = { logLevel: c3 });
            let h2 = w("diag"), i2 = (function(a10, b3) {
              function c4(c5, d2) {
                let e3 = b3[c5];
                return "function" == typeof e3 && a10 >= d2 ? e3.bind(b3) : function() {
                };
              }
              return a10 < d.NONE ? a10 = d.NONE : a10 > d.ALL && (a10 = d.ALL), b3 = b3 || {}, { error: c4("error", d.ERROR), warn: c4("warn", d.WARN), info: c4("info", d.INFO), debug: c4("debug", d.DEBUG), verbose: c4("verbose", d.VERBOSE) };
            })(null != (f2 = c3.logLevel) ? f2 : d.INFO, a9);
            if (h2 && !c3.suppressOverrideMessage) {
              let a10 = null != (g2 = Error().stack) ? g2 : "<failed to generate stacktrace>";
              h2.warn(`Current logger will be overwritten from ${a10}`), i2.warn(`Current logger will overwrite one already registered from ${a10}`);
            }
            return v("diag", i2, b2, true);
          };
          b2.setLogger = c2, b2.disable = () => {
            x("diag", b2);
          }, b2.createComponentLogger = (a9) => new y(a9), b2.verbose = a8("verbose"), b2.debug = a8("debug"), b2.info = a8("info"), b2.warn = a8("warn"), b2.error = a8("error");
        }
      }
      class B {
        constructor(a8) {
          this._entries = a8 ? new Map(a8) : /* @__PURE__ */ new Map();
        }
        getEntry(a8) {
          let b2 = this._entries.get(a8);
          if (b2) return Object.assign({}, b2);
        }
        getAllEntries() {
          return Array.from(this._entries.entries());
        }
        setEntry(a8, b2) {
          let c2 = new B(this._entries);
          return c2._entries.set(a8, b2), c2;
        }
        removeEntry(a8) {
          let b2 = new B(this._entries);
          return b2._entries.delete(a8), b2;
        }
        removeEntries(...a8) {
          let b2 = new B(this._entries);
          for (let c2 of a8) b2._entries.delete(c2);
          return b2;
        }
        clear() {
          return new B();
        }
      }
      let C = /* @__PURE__ */ Symbol("BaggageEntryMetadata"), D = A.instance();
      function E(a8 = {}) {
        return new B(new Map(Object.entries(a8)));
      }
      function F(a8) {
        return "string" != typeof a8 && (D.error(`Cannot create baggage metadata from unknown type: ${typeof a8}`), a8 = ""), { __TYPE__: C, toString: () => a8 };
      }
      function G(a8) {
        return Symbol.for(a8);
      }
      class H {
        constructor(a8) {
          const b2 = this;
          b2._currentContext = a8 ? new Map(a8) : /* @__PURE__ */ new Map(), b2.getValue = (a9) => b2._currentContext.get(a9), b2.setValue = (a9, c2) => {
            let d2 = new H(b2._currentContext);
            return d2._currentContext.set(a9, c2), d2;
          }, b2.deleteValue = (a9) => {
            let c2 = new H(b2._currentContext);
            return c2._currentContext.delete(a9), c2;
          };
        }
      }
      let I = new H(), J = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }], K = {};
      if ("u" > typeof console) for (let a8 of ["error", "warn", "info", "debug", "trace", "log"]) "function" == typeof console[a8] && (K[a8] = console[a8]);
      class L {
        constructor() {
          for (let a8 = 0; a8 < J.length; a8++) this[J[a8].n] = /* @__PURE__ */ (function(a9) {
            return function(...b2) {
              let c2 = K[a9];
              if ("function" != typeof c2 && (c2 = K.log), "function" != typeof c2 && console && "function" != typeof (c2 = console[a9]) && (c2 = console.log), "function" == typeof c2) return c2.apply(console, b2);
            };
          })(J[a8].c);
        }
      }
      class M {
        createGauge(a8, b2) {
          return Y;
        }
        createHistogram(a8, b2) {
          return Z;
        }
        createCounter(a8, b2) {
          return X;
        }
        createUpDownCounter(a8, b2) {
          return $;
        }
        createObservableGauge(a8, b2) {
          return aa;
        }
        createObservableCounter(a8, b2) {
          return _;
        }
        createObservableUpDownCounter(a8, b2) {
          return ab;
        }
        addBatchObservableCallback(a8, b2) {
        }
        removeBatchObservableCallback(a8) {
        }
      }
      class N {
      }
      class O extends N {
        add(a8, b2) {
        }
      }
      class P extends N {
        add(a8, b2) {
        }
      }
      class Q extends N {
        record(a8, b2) {
        }
      }
      class R extends N {
        record(a8, b2) {
        }
      }
      class S {
        addCallback(a8) {
        }
        removeCallback(a8) {
        }
      }
      class T extends S {
      }
      class U extends S {
      }
      class V extends S {
      }
      let W = new M(), X = new O(), Y = new Q(), Z = new R(), $ = new P(), _ = new T(), aa = new U(), ab = new V();
      function ac() {
        return W;
      }
      (k = e || (e = {}))[k.INT = 0] = "INT", k[k.DOUBLE = 1] = "DOUBLE";
      let ad = { get(a8, b2) {
        if (null != a8) return a8[b2];
      }, keys: (a8) => null == a8 ? [] : Object.keys(a8) }, ae = { set(a8, b2, c2) {
        null != a8 && (a8[b2] = c2);
      } };
      class af {
        active() {
          return I;
        }
        with(a8, b2, c2, ...d2) {
          return b2.call(c2, ...d2);
        }
        bind(a8, b2) {
          return b2;
        }
        enable() {
          return this;
        }
        disable() {
          return this;
        }
      }
      let ag = "context", ah = new af();
      class ai {
        static getInstance() {
          return this._instance || (this._instance = new ai()), this._instance;
        }
        setGlobalContextManager(a8) {
          return v(ag, a8, A.instance());
        }
        active() {
          return this._getContextManager().active();
        }
        with(a8, b2, c2, ...d2) {
          return this._getContextManager().with(a8, b2, c2, ...d2);
        }
        bind(a8, b2) {
          return this._getContextManager().bind(a8, b2);
        }
        _getContextManager() {
          return w(ag) || ah;
        }
        disable() {
          this._getContextManager().disable(), x(ag, A.instance());
        }
      }
      (l = f || (f = {}))[l.NONE = 0] = "NONE", l[l.SAMPLED = 1] = "SAMPLED";
      let aj = "0000000000000000", ak = "00000000000000000000000000000000", al = { traceId: ak, spanId: aj, traceFlags: f.NONE };
      class am {
        constructor(a8 = al) {
          this._spanContext = a8;
        }
        spanContext() {
          return this._spanContext;
        }
        setAttribute(a8, b2) {
          return this;
        }
        setAttributes(a8) {
          return this;
        }
        addEvent(a8, b2) {
          return this;
        }
        addLink(a8) {
          return this;
        }
        addLinks(a8) {
          return this;
        }
        setStatus(a8) {
          return this;
        }
        updateName(a8) {
          return this;
        }
        end(a8) {
        }
        isRecording() {
          return false;
        }
        recordException(a8, b2) {
        }
      }
      let an = G("OpenTelemetry Context Key SPAN");
      function ao(a8) {
        return a8.getValue(an) || void 0;
      }
      function ap() {
        return ao(ai.getInstance().active());
      }
      function aq(a8, b2) {
        return a8.setValue(an, b2);
      }
      function ar(a8) {
        return a8.deleteValue(an);
      }
      function as(a8, b2) {
        return aq(a8, new am(b2));
      }
      function at(a8) {
        var b2;
        return null == (b2 = ao(a8)) ? void 0 : b2.spanContext();
      }
      let au = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1]);
      function av(a8, b2) {
        if ("string" != typeof a8 || a8.length !== b2) return false;
        let c2 = 0;
        for (let b3 = 0; b3 < a8.length; b3 += 4) c2 += (0 | au[a8.charCodeAt(b3)]) + (0 | au[a8.charCodeAt(b3 + 1)]) + (0 | au[a8.charCodeAt(b3 + 2)]) + (0 | au[a8.charCodeAt(b3 + 3)]);
        return c2 === b2;
      }
      function aw(a8) {
        return av(a8, 32) && a8 !== ak;
      }
      function ax(a8) {
        return av(a8, 16) && a8 !== aj;
      }
      function ay(a8) {
        return aw(a8.traceId) && ax(a8.spanId);
      }
      function az(a8) {
        return new am(a8);
      }
      let aA = ai.getInstance();
      class aB {
        startSpan(a8, b2, c2 = aA.active()) {
          var d2;
          if (null == b2 ? void 0 : b2.root) return new am();
          let e2 = c2 && at(c2);
          return null !== (d2 = e2) && "object" == typeof d2 && "spanId" in d2 && "string" == typeof d2.spanId && "traceId" in d2 && "string" == typeof d2.traceId && "traceFlags" in d2 && "number" == typeof d2.traceFlags && ay(e2) ? new am(e2) : new am();
        }
        startActiveSpan(a8, b2, c2, d2) {
          let e2, f2, g2;
          if (arguments.length < 2) return;
          2 == arguments.length ? g2 = b2 : 3 == arguments.length ? (e2 = b2, g2 = c2) : (e2 = b2, f2 = c2, g2 = d2);
          let h2 = null != f2 ? f2 : aA.active(), i2 = this.startSpan(a8, e2, h2), j2 = aq(h2, i2);
          return aA.with(j2, g2, void 0, i2);
        }
      }
      let aC = new aB();
      class aD {
        constructor(a8, b2, c2, d2) {
          this._provider = a8, this.name = b2, this.version = c2, this.options = d2;
        }
        startSpan(a8, b2, c2) {
          return this._getTracer().startSpan(a8, b2, c2);
        }
        startActiveSpan(a8, b2, c2, d2) {
          let e2 = this._getTracer();
          return Reflect.apply(e2.startActiveSpan, e2, arguments);
        }
        _getTracer() {
          if (this._delegate) return this._delegate;
          let a8 = this._provider.getDelegateTracer(this.name, this.version, this.options);
          return a8 ? (this._delegate = a8, this._delegate) : aC;
        }
      }
      class aE {
        getTracer(a8, b2, c2) {
          return new aB();
        }
      }
      let aF = new aE();
      class aG {
        getTracer(a8, b2, c2) {
          var d2;
          return null != (d2 = this.getDelegateTracer(a8, b2, c2)) ? d2 : new aD(this, a8, b2, c2);
        }
        getDelegate() {
          var a8;
          return null != (a8 = this._delegate) ? a8 : aF;
        }
        setDelegate(a8) {
          this._delegate = a8;
        }
        getDelegateTracer(a8, b2, c2) {
          var d2;
          return null == (d2 = this._delegate) ? void 0 : d2.getTracer(a8, b2, c2);
        }
      }
      (m = g || (g = {}))[m.NOT_RECORD = 0] = "NOT_RECORD", m[m.RECORD = 1] = "RECORD", m[m.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED", (n = h || (h = {}))[n.INTERNAL = 0] = "INTERNAL", n[n.SERVER = 1] = "SERVER", n[n.CLIENT = 2] = "CLIENT", n[n.PRODUCER = 3] = "PRODUCER", n[n.CONSUMER = 4] = "CONSUMER", (o = i || (i = {}))[o.UNSET = 0] = "UNSET", o[o.OK = 1] = "OK", o[o.ERROR = 2] = "ERROR";
      let aH = "[_0-9a-z-*/]", aI = `[a-z]${aH}{0,255}`, aJ = `[a-z0-9]${aH}{0,240}@[a-z]${aH}{0,13}`, aK = RegExp(`^(?:${aI}|${aJ})$`), aL = /^[ -~]{0,255}[!-~]$/, aM = /,|=/;
      class aN {
        constructor(a8) {
          this._internalState = /* @__PURE__ */ new Map(), a8 && this._parse(a8);
        }
        set(a8, b2) {
          let c2 = this._clone();
          return c2._internalState.has(a8) && c2._internalState.delete(a8), c2._internalState.set(a8, b2), c2;
        }
        unset(a8) {
          let b2 = this._clone();
          return b2._internalState.delete(a8), b2;
        }
        get(a8) {
          return this._internalState.get(a8);
        }
        serialize() {
          return Array.from(this._internalState.keys()).reduceRight((a8, b2) => (a8.push(b2 + "=" + this.get(b2)), a8), []).join(",");
        }
        _parse(a8) {
          !(a8.length > 512) && (this._internalState = a8.split(",").reduceRight((a9, b2) => {
            let c2 = b2.trim(), d2 = c2.indexOf("=");
            if (-1 !== d2) {
              let e2 = c2.slice(0, d2), f2 = c2.slice(d2 + 1, b2.length);
              aK.test(e2) && aL.test(f2) && !aM.test(f2) && a9.set(e2, f2);
            }
            return a9;
          }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
        }
        _keys() {
          return Array.from(this._internalState.keys()).reverse();
        }
        _clone() {
          let a8 = new aN();
          return a8._internalState = new Map(this._internalState), a8;
        }
      }
      function aO(a8) {
        return new aN(a8);
      }
      let aP = ai.getInstance(), aQ = A.instance();
      class aR {
        getMeter(a8, b2, c2) {
          return W;
        }
      }
      let aS = new aR(), aT = "metrics";
      class aU {
        static getInstance() {
          return this._instance || (this._instance = new aU()), this._instance;
        }
        setGlobalMeterProvider(a8) {
          return v(aT, a8, A.instance());
        }
        getMeterProvider() {
          return w(aT) || aS;
        }
        getMeter(a8, b2, c2) {
          return this.getMeterProvider().getMeter(a8, b2, c2);
        }
        disable() {
          x(aT, A.instance());
        }
      }
      let aV = aU.getInstance();
      class aW {
        inject(a8, b2) {
        }
        extract(a8, b2) {
          return a8;
        }
        fields() {
          return [];
        }
      }
      let aX = G("OpenTelemetry Baggage Key");
      function aY(a8) {
        return a8.getValue(aX) || void 0;
      }
      function aZ() {
        return aY(ai.getInstance().active());
      }
      function a$(a8, b2) {
        return a8.setValue(aX, b2);
      }
      function a_(a8) {
        return a8.deleteValue(aX);
      }
      let a0 = "propagation", a1 = new aW();
      class a2 {
        constructor() {
          this.createBaggage = E, this.getBaggage = aY, this.getActiveBaggage = aZ, this.setBaggage = a$, this.deleteBaggage = a_;
        }
        static getInstance() {
          return this._instance || (this._instance = new a2()), this._instance;
        }
        setGlobalPropagator(a8) {
          return v(a0, a8, A.instance());
        }
        inject(a8, b2, c2 = ae) {
          return this._getGlobalPropagator().inject(a8, b2, c2);
        }
        extract(a8, b2, c2 = ad) {
          return this._getGlobalPropagator().extract(a8, b2, c2);
        }
        fields() {
          return this._getGlobalPropagator().fields();
        }
        disable() {
          x(a0, A.instance());
        }
        _getGlobalPropagator() {
          return w(a0) || a1;
        }
      }
      let a3 = a2.getInstance(), a4 = "trace";
      class a5 {
        constructor() {
          this._proxyTracerProvider = new aG(), this.wrapSpanContext = az, this.isSpanContextValid = ay, this.deleteSpan = ar, this.getSpan = ao, this.getActiveSpan = ap, this.getSpanContext = at, this.setSpan = aq, this.setSpanContext = as;
        }
        static getInstance() {
          return this._instance || (this._instance = new a5()), this._instance;
        }
        setGlobalTracerProvider(a8) {
          let b2 = v(a4, this._proxyTracerProvider, A.instance());
          return b2 && this._proxyTracerProvider.setDelegate(a8), b2;
        }
        getTracerProvider() {
          return w(a4) || this._proxyTracerProvider;
        }
        getTracer(a8, b2) {
          return this.getTracerProvider().getTracer(a8, b2);
        }
        disable() {
          x(a4, A.instance()), this._proxyTracerProvider = new aG();
        }
      }
      let a6 = a5.getInstance(), a7 = { context: aP, diag: aQ, metrics: aV, propagation: a3, trace: a6 };
    }, 232: (a) => {
      (() => {
        var b = { 993: (a2) => {
          var b2 = Object.prototype.hasOwnProperty, c2 = "~";
          function d2() {
          }
          function e2(a3, b3, c3) {
            this.fn = a3, this.context = b3, this.once = c3 || false;
          }
          function f(a3, b3, d3, f2, g2) {
            if ("function" != typeof d3) throw TypeError("The listener must be a function");
            var h2 = new e2(d3, f2 || a3, g2), i = c2 ? c2 + b3 : b3;
            return a3._events[i] ? a3._events[i].fn ? a3._events[i] = [a3._events[i], h2] : a3._events[i].push(h2) : (a3._events[i] = h2, a3._eventsCount++), a3;
          }
          function g(a3, b3) {
            0 == --a3._eventsCount ? a3._events = new d2() : delete a3._events[b3];
          }
          function h() {
            this._events = new d2(), this._eventsCount = 0;
          }
          Object.create && (d2.prototype = /* @__PURE__ */ Object.create(null), new d2().__proto__ || (c2 = false)), h.prototype.eventNames = function() {
            var a3, d3, e3 = [];
            if (0 === this._eventsCount) return e3;
            for (d3 in a3 = this._events) b2.call(a3, d3) && e3.push(c2 ? d3.slice(1) : d3);
            return Object.getOwnPropertySymbols ? e3.concat(Object.getOwnPropertySymbols(a3)) : e3;
          }, h.prototype.listeners = function(a3) {
            var b3 = c2 ? c2 + a3 : a3, d3 = this._events[b3];
            if (!d3) return [];
            if (d3.fn) return [d3.fn];
            for (var e3 = 0, f2 = d3.length, g2 = Array(f2); e3 < f2; e3++) g2[e3] = d3[e3].fn;
            return g2;
          }, h.prototype.listenerCount = function(a3) {
            var b3 = c2 ? c2 + a3 : a3, d3 = this._events[b3];
            return d3 ? d3.fn ? 1 : d3.length : 0;
          }, h.prototype.emit = function(a3, b3, d3, e3, f2, g2) {
            var h2 = c2 ? c2 + a3 : a3;
            if (!this._events[h2]) return false;
            var i, j, k = this._events[h2], l = arguments.length;
            if (k.fn) {
              switch (k.once && this.removeListener(a3, k.fn, void 0, true), l) {
                case 1:
                  return k.fn.call(k.context), true;
                case 2:
                  return k.fn.call(k.context, b3), true;
                case 3:
                  return k.fn.call(k.context, b3, d3), true;
                case 4:
                  return k.fn.call(k.context, b3, d3, e3), true;
                case 5:
                  return k.fn.call(k.context, b3, d3, e3, f2), true;
                case 6:
                  return k.fn.call(k.context, b3, d3, e3, f2, g2), true;
              }
              for (j = 1, i = Array(l - 1); j < l; j++) i[j - 1] = arguments[j];
              k.fn.apply(k.context, i);
            } else {
              var m, n = k.length;
              for (j = 0; j < n; j++) switch (k[j].once && this.removeListener(a3, k[j].fn, void 0, true), l) {
                case 1:
                  k[j].fn.call(k[j].context);
                  break;
                case 2:
                  k[j].fn.call(k[j].context, b3);
                  break;
                case 3:
                  k[j].fn.call(k[j].context, b3, d3);
                  break;
                case 4:
                  k[j].fn.call(k[j].context, b3, d3, e3);
                  break;
                default:
                  if (!i) for (m = 1, i = Array(l - 1); m < l; m++) i[m - 1] = arguments[m];
                  k[j].fn.apply(k[j].context, i);
              }
            }
            return true;
          }, h.prototype.on = function(a3, b3, c3) {
            return f(this, a3, b3, c3, false);
          }, h.prototype.once = function(a3, b3, c3) {
            return f(this, a3, b3, c3, true);
          }, h.prototype.removeListener = function(a3, b3, d3, e3) {
            var f2 = c2 ? c2 + a3 : a3;
            if (!this._events[f2]) return this;
            if (!b3) return g(this, f2), this;
            var h2 = this._events[f2];
            if (h2.fn) h2.fn !== b3 || e3 && !h2.once || d3 && h2.context !== d3 || g(this, f2);
            else {
              for (var i = 0, j = [], k = h2.length; i < k; i++) (h2[i].fn !== b3 || e3 && !h2[i].once || d3 && h2[i].context !== d3) && j.push(h2[i]);
              j.length ? this._events[f2] = 1 === j.length ? j[0] : j : g(this, f2);
            }
            return this;
          }, h.prototype.removeAllListeners = function(a3) {
            var b3;
            return a3 ? (b3 = c2 ? c2 + a3 : a3, this._events[b3] && g(this, b3)) : (this._events = new d2(), this._eventsCount = 0), this;
          }, h.prototype.off = h.prototype.removeListener, h.prototype.addListener = h.prototype.on, h.prefixed = c2, h.EventEmitter = h, a2.exports = h;
        }, 213: (a2) => {
          a2.exports = (a3, b2) => (b2 = b2 || (() => {
          }), a3.then((a4) => new Promise((a5) => {
            a5(b2());
          }).then(() => a4), (a4) => new Promise((a5) => {
            a5(b2());
          }).then(() => {
            throw a4;
          })));
        }, 574: (a2, b2) => {
          Object.defineProperty(b2, "__esModule", { value: true }), b2.default = function(a3, b3, c2) {
            let d2 = 0, e2 = a3.length;
            for (; e2 > 0; ) {
              let f = e2 / 2 | 0, g = d2 + f;
              0 >= c2(a3[g], b3) ? (d2 = ++g, e2 -= f + 1) : e2 = f;
            }
            return d2;
          };
        }, 821: (a2, b2, c2) => {
          Object.defineProperty(b2, "__esModule", { value: true });
          let d2 = c2(574);
          class e2 {
            constructor() {
              this._queue = [];
            }
            enqueue(a3, b3) {
              let c3 = { priority: (b3 = Object.assign({ priority: 0 }, b3)).priority, run: a3 };
              if (this.size && this._queue[this.size - 1].priority >= b3.priority) return void this._queue.push(c3);
              let e3 = d2.default(this._queue, c3, (a4, b4) => b4.priority - a4.priority);
              this._queue.splice(e3, 0, c3);
            }
            dequeue() {
              let a3 = this._queue.shift();
              return null == a3 ? void 0 : a3.run;
            }
            filter(a3) {
              return this._queue.filter((b3) => b3.priority === a3.priority).map((a4) => a4.run);
            }
            get size() {
              return this._queue.length;
            }
          }
          b2.default = e2;
        }, 816: (a2, b2, c2) => {
          let d2 = c2(213);
          class e2 extends Error {
            constructor(a3) {
              super(a3), this.name = "TimeoutError";
            }
          }
          let f = (a3, b3, c3) => new Promise((f2, g) => {
            if ("number" != typeof b3 || b3 < 0) throw TypeError("Expected `milliseconds` to be a positive number");
            if (b3 === 1 / 0) return void f2(a3);
            let h = setTimeout(() => {
              if ("function" == typeof c3) {
                try {
                  f2(c3());
                } catch (a4) {
                  g(a4);
                }
                return;
              }
              let d3 = "string" == typeof c3 ? c3 : `Promise timed out after ${b3} milliseconds`, h2 = c3 instanceof Error ? c3 : new e2(d3);
              "function" == typeof a3.cancel && a3.cancel(), g(h2);
            }, b3);
            d2(a3.then(f2, g), () => {
              clearTimeout(h);
            });
          });
          a2.exports = f, a2.exports.default = f, a2.exports.TimeoutError = e2;
        } }, c = {};
        function d(a2) {
          var e2 = c[a2];
          if (void 0 !== e2) return e2.exports;
          var f = c[a2] = { exports: {} }, g = true;
          try {
            b[a2](f, f.exports, d), g = false;
          } finally {
            g && delete c[a2];
          }
          return f.exports;
        }
        d.ab = "//";
        var e = {};
        (() => {
          Object.defineProperty(e, "__esModule", { value: true });
          let a2 = d(993), b2 = d(816), c2 = d(821), f = () => {
          }, g = new b2.TimeoutError();
          class h extends a2 {
            constructor(a3) {
              var b3, d2, e2, g2;
              if (super(), this._intervalCount = 0, this._intervalEnd = 0, this._pendingCount = 0, this._resolveEmpty = f, this._resolveIdle = f, !("number" == typeof (a3 = Object.assign({ carryoverConcurrencyCount: false, intervalCap: 1 / 0, interval: 0, concurrency: 1 / 0, autoStart: true, queueClass: c2.default }, a3)).intervalCap && a3.intervalCap >= 1)) throw TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null != (d2 = null == (b3 = a3.intervalCap) ? void 0 : b3.toString()) ? d2 : ""}\` (${typeof a3.intervalCap})`);
              if (void 0 === a3.interval || !(Number.isFinite(a3.interval) && a3.interval >= 0)) throw TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null != (g2 = null == (e2 = a3.interval) ? void 0 : e2.toString()) ? g2 : ""}\` (${typeof a3.interval})`);
              this._carryoverConcurrencyCount = a3.carryoverConcurrencyCount, this._isIntervalIgnored = a3.intervalCap === 1 / 0 || 0 === a3.interval, this._intervalCap = a3.intervalCap, this._interval = a3.interval, this._queue = new a3.queueClass(), this._queueClass = a3.queueClass, this.concurrency = a3.concurrency, this._timeout = a3.timeout, this._throwOnTimeout = true === a3.throwOnTimeout, this._isPaused = false === a3.autoStart;
            }
            get _doesIntervalAllowAnother() {
              return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
            }
            get _doesConcurrentAllowAnother() {
              return this._pendingCount < this._concurrency;
            }
            _next() {
              this._pendingCount--, this._tryToStartAnother(), this.emit("next");
            }
            _resolvePromises() {
              this._resolveEmpty(), this._resolveEmpty = f, 0 === this._pendingCount && (this._resolveIdle(), this._resolveIdle = f, this.emit("idle"));
            }
            _onResumeInterval() {
              this._onInterval(), this._initializeIntervalIfNeeded(), this._timeoutId = void 0;
            }
            _isIntervalPaused() {
              let a3 = Date.now();
              if (void 0 === this._intervalId) {
                let b3 = this._intervalEnd - a3;
                if (!(b3 < 0)) return void 0 === this._timeoutId && (this._timeoutId = setTimeout(() => {
                  this._onResumeInterval();
                }, b3)), true;
                this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
              }
              return false;
            }
            _tryToStartAnother() {
              if (0 === this._queue.size) return this._intervalId && clearInterval(this._intervalId), this._intervalId = void 0, this._resolvePromises(), false;
              if (!this._isPaused) {
                let a3 = !this._isIntervalPaused();
                if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                  let b3 = this._queue.dequeue();
                  return !!b3 && (this.emit("active"), b3(), a3 && this._initializeIntervalIfNeeded(), true);
                }
              }
              return false;
            }
            _initializeIntervalIfNeeded() {
              this._isIntervalIgnored || void 0 !== this._intervalId || (this._intervalId = setInterval(() => {
                this._onInterval();
              }, this._interval), this._intervalEnd = Date.now() + this._interval);
            }
            _onInterval() {
              0 === this._intervalCount && 0 === this._pendingCount && this._intervalId && (clearInterval(this._intervalId), this._intervalId = void 0), this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0, this._processQueue();
            }
            _processQueue() {
              for (; this._tryToStartAnother(); ) ;
            }
            get concurrency() {
              return this._concurrency;
            }
            set concurrency(a3) {
              if (!("number" == typeof a3 && a3 >= 1)) throw TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${a3}\` (${typeof a3})`);
              this._concurrency = a3, this._processQueue();
            }
            async add(a3, c3 = {}) {
              return new Promise((d2, e2) => {
                let f2 = async () => {
                  this._pendingCount++, this._intervalCount++;
                  try {
                    let f3 = void 0 === this._timeout && void 0 === c3.timeout ? a3() : b2.default(Promise.resolve(a3()), void 0 === c3.timeout ? this._timeout : c3.timeout, () => {
                      (void 0 === c3.throwOnTimeout ? this._throwOnTimeout : c3.throwOnTimeout) && e2(g);
                    });
                    d2(await f3);
                  } catch (a4) {
                    e2(a4);
                  }
                  this._next();
                };
                this._queue.enqueue(f2, c3), this._tryToStartAnother(), this.emit("add");
              });
            }
            async addAll(a3, b3) {
              return Promise.all(a3.map(async (a4) => this.add(a4, b3)));
            }
            start() {
              return this._isPaused && (this._isPaused = false, this._processQueue()), this;
            }
            pause() {
              this._isPaused = true;
            }
            clear() {
              this._queue = new this._queueClass();
            }
            async onEmpty() {
              if (0 !== this._queue.size) return new Promise((a3) => {
                let b3 = this._resolveEmpty;
                this._resolveEmpty = () => {
                  b3(), a3();
                };
              });
            }
            async onIdle() {
              if (0 !== this._pendingCount || 0 !== this._queue.size) return new Promise((a3) => {
                let b3 = this._resolveIdle;
                this._resolveIdle = () => {
                  b3(), a3();
                };
              });
            }
            get size() {
              return this._queue.size;
            }
            sizeBy(a3) {
              return this._queue.filter(a3).length;
            }
            get pending() {
              return this._pendingCount;
            }
            get isPaused() {
              return this._isPaused;
            }
            get timeout() {
              return this._timeout;
            }
            set timeout(a3) {
              this._timeout = a3;
            }
          }
          e.default = h;
        })(), a.exports = e;
      })();
    }, 259: (a) => {
      (() => {
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "//");
        var b = {};
        (() => {
          function a2(a3, b2) {
            void 0 === b2 && (b2 = {});
            for (var c2 = (function(a4) {
              for (var b3 = [], c3 = 0; c3 < a4.length; ) {
                var d3 = a4[c3];
                if ("*" === d3 || "+" === d3 || "?" === d3) {
                  b3.push({ type: "MODIFIER", index: c3, value: a4[c3++] });
                  continue;
                }
                if ("\\" === d3) {
                  b3.push({ type: "ESCAPED_CHAR", index: c3++, value: a4[c3++] });
                  continue;
                }
                if ("{" === d3) {
                  b3.push({ type: "OPEN", index: c3, value: a4[c3++] });
                  continue;
                }
                if ("}" === d3) {
                  b3.push({ type: "CLOSE", index: c3, value: a4[c3++] });
                  continue;
                }
                if (":" === d3) {
                  for (var e2 = "", f3 = c3 + 1; f3 < a4.length; ) {
                    var g3 = a4.charCodeAt(f3);
                    if (g3 >= 48 && g3 <= 57 || g3 >= 65 && g3 <= 90 || g3 >= 97 && g3 <= 122 || 95 === g3) {
                      e2 += a4[f3++];
                      continue;
                    }
                    break;
                  }
                  if (!e2) throw TypeError("Missing parameter name at ".concat(c3));
                  b3.push({ type: "NAME", index: c3, value: e2 }), c3 = f3;
                  continue;
                }
                if ("(" === d3) {
                  var h3 = 1, i2 = "", f3 = c3 + 1;
                  if ("?" === a4[f3]) throw TypeError('Pattern cannot start with "?" at '.concat(f3));
                  for (; f3 < a4.length; ) {
                    if ("\\" === a4[f3]) {
                      i2 += a4[f3++] + a4[f3++];
                      continue;
                    }
                    if (")" === a4[f3]) {
                      if (0 == --h3) {
                        f3++;
                        break;
                      }
                    } else if ("(" === a4[f3] && (h3++, "?" !== a4[f3 + 1])) throw TypeError("Capturing groups are not allowed at ".concat(f3));
                    i2 += a4[f3++];
                  }
                  if (h3) throw TypeError("Unbalanced pattern at ".concat(c3));
                  if (!i2) throw TypeError("Missing pattern at ".concat(c3));
                  b3.push({ type: "PATTERN", index: c3, value: i2 }), c3 = f3;
                  continue;
                }
                b3.push({ type: "CHAR", index: c3, value: a4[c3++] });
              }
              return b3.push({ type: "END", index: c3, value: "" }), b3;
            })(a3), d2 = b2.prefixes, f2 = void 0 === d2 ? "./" : d2, g2 = b2.delimiter, h2 = void 0 === g2 ? "/#?" : g2, i = [], j = 0, k = 0, l = "", m = function(a4) {
              if (k < c2.length && c2[k].type === a4) return c2[k++].value;
            }, n = function(a4) {
              var b3 = m(a4);
              if (void 0 !== b3) return b3;
              var d3 = c2[k], e2 = d3.type, f3 = d3.index;
              throw TypeError("Unexpected ".concat(e2, " at ").concat(f3, ", expected ").concat(a4));
            }, o = function() {
              for (var a4, b3 = ""; a4 = m("CHAR") || m("ESCAPED_CHAR"); ) b3 += a4;
              return b3;
            }, p = function(a4) {
              for (var b3 = 0; b3 < h2.length; b3++) {
                var c3 = h2[b3];
                if (a4.indexOf(c3) > -1) return true;
              }
              return false;
            }, q = function(a4) {
              var b3 = i[i.length - 1], c3 = a4 || (b3 && "string" == typeof b3 ? b3 : "");
              if (b3 && !c3) throw TypeError('Must have text between two parameters, missing text after "'.concat(b3.name, '"'));
              return !c3 || p(c3) ? "[^".concat(e(h2), "]+?") : "(?:(?!".concat(e(c3), ")[^").concat(e(h2), "])+?");
            }; k < c2.length; ) {
              var r = m("CHAR"), s = m("NAME"), t = m("PATTERN");
              if (s || t) {
                var u = r || "";
                -1 === f2.indexOf(u) && (l += u, u = ""), l && (i.push(l), l = ""), i.push({ name: s || j++, prefix: u, suffix: "", pattern: t || q(u), modifier: m("MODIFIER") || "" });
                continue;
              }
              var v = r || m("ESCAPED_CHAR");
              if (v) {
                l += v;
                continue;
              }
              if (l && (i.push(l), l = ""), m("OPEN")) {
                var u = o(), w = m("NAME") || "", x = m("PATTERN") || "", y = o();
                n("CLOSE"), i.push({ name: w || (x ? j++ : ""), pattern: w && !x ? q(u) : x, prefix: u, suffix: y, modifier: m("MODIFIER") || "" });
                continue;
              }
              n("END");
            }
            return i;
          }
          function c(a3, b2) {
            void 0 === b2 && (b2 = {});
            var c2 = f(b2), d2 = b2.encode, e2 = void 0 === d2 ? function(a4) {
              return a4;
            } : d2, g2 = b2.validate, h2 = void 0 === g2 || g2, i = a3.map(function(a4) {
              if ("object" == typeof a4) return new RegExp("^(?:".concat(a4.pattern, ")$"), c2);
            });
            return function(b3) {
              for (var c3 = "", d3 = 0; d3 < a3.length; d3++) {
                var f2 = a3[d3];
                if ("string" == typeof f2) {
                  c3 += f2;
                  continue;
                }
                var g3 = b3 ? b3[f2.name] : void 0, j = "?" === f2.modifier || "*" === f2.modifier, k = "*" === f2.modifier || "+" === f2.modifier;
                if (Array.isArray(g3)) {
                  if (!k) throw TypeError('Expected "'.concat(f2.name, '" to not repeat, but got an array'));
                  if (0 === g3.length) {
                    if (j) continue;
                    throw TypeError('Expected "'.concat(f2.name, '" to not be empty'));
                  }
                  for (var l = 0; l < g3.length; l++) {
                    var m = e2(g3[l], f2);
                    if (h2 && !i[d3].test(m)) throw TypeError('Expected all "'.concat(f2.name, '" to match "').concat(f2.pattern, '", but got "').concat(m, '"'));
                    c3 += f2.prefix + m + f2.suffix;
                  }
                  continue;
                }
                if ("string" == typeof g3 || "number" == typeof g3) {
                  var m = e2(String(g3), f2);
                  if (h2 && !i[d3].test(m)) throw TypeError('Expected "'.concat(f2.name, '" to match "').concat(f2.pattern, '", but got "').concat(m, '"'));
                  c3 += f2.prefix + m + f2.suffix;
                  continue;
                }
                if (!j) {
                  var n = k ? "an array" : "a string";
                  throw TypeError('Expected "'.concat(f2.name, '" to be ').concat(n));
                }
              }
              return c3;
            };
          }
          function d(a3, b2, c2) {
            void 0 === c2 && (c2 = {});
            var d2 = c2.decode, e2 = void 0 === d2 ? function(a4) {
              return a4;
            } : d2;
            return function(c3) {
              var d3 = a3.exec(c3);
              if (!d3) return false;
              for (var f2 = d3[0], g2 = d3.index, h2 = /* @__PURE__ */ Object.create(null), i = 1; i < d3.length; i++) !(function(a4) {
                if (void 0 !== d3[a4]) {
                  var c4 = b2[a4 - 1];
                  "*" === c4.modifier || "+" === c4.modifier ? h2[c4.name] = d3[a4].split(c4.prefix + c4.suffix).map(function(a5) {
                    return e2(a5, c4);
                  }) : h2[c4.name] = e2(d3[a4], c4);
                }
              })(i);
              return { path: f2, index: g2, params: h2 };
            };
          }
          function e(a3) {
            return a3.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
          }
          function f(a3) {
            return a3 && a3.sensitive ? "" : "i";
          }
          function g(a3, b2, c2) {
            void 0 === c2 && (c2 = {});
            for (var d2 = c2.strict, g2 = void 0 !== d2 && d2, h2 = c2.start, i = c2.end, j = c2.encode, k = void 0 === j ? function(a4) {
              return a4;
            } : j, l = c2.delimiter, m = c2.endsWith, n = "[".concat(e(void 0 === m ? "" : m), "]|$"), o = "[".concat(e(void 0 === l ? "/#?" : l), "]"), p = void 0 === h2 || h2 ? "^" : "", q = 0; q < a3.length; q++) {
              var r = a3[q];
              if ("string" == typeof r) p += e(k(r));
              else {
                var s = e(k(r.prefix)), t = e(k(r.suffix));
                if (r.pattern) if (b2 && b2.push(r), s || t) if ("+" === r.modifier || "*" === r.modifier) {
                  var u = "*" === r.modifier ? "?" : "";
                  p += "(?:".concat(s, "((?:").concat(r.pattern, ")(?:").concat(t).concat(s, "(?:").concat(r.pattern, "))*)").concat(t, ")").concat(u);
                } else p += "(?:".concat(s, "(").concat(r.pattern, ")").concat(t, ")").concat(r.modifier);
                else {
                  if ("+" === r.modifier || "*" === r.modifier) throw TypeError('Can not repeat "'.concat(r.name, '" without a prefix and suffix'));
                  p += "(".concat(r.pattern, ")").concat(r.modifier);
                }
                else p += "(?:".concat(s).concat(t, ")").concat(r.modifier);
              }
            }
            if (void 0 === i || i) g2 || (p += "".concat(o, "?")), p += c2.endsWith ? "(?=".concat(n, ")") : "$";
            else {
              var v = a3[a3.length - 1], w = "string" == typeof v ? o.indexOf(v[v.length - 1]) > -1 : void 0 === v;
              g2 || (p += "(?:".concat(o, "(?=").concat(n, "))?")), w || (p += "(?=".concat(o, "|").concat(n, ")"));
            }
            return new RegExp(p, f(c2));
          }
          function h(b2, c2, d2) {
            if (b2 instanceof RegExp) {
              var e2;
              if (!c2) return b2;
              for (var i = /\((?:\?<(.*?)>)?(?!\?)/g, j = 0, k = i.exec(b2.source); k; ) c2.push({ name: k[1] || j++, prefix: "", suffix: "", modifier: "", pattern: "" }), k = i.exec(b2.source);
              return b2;
            }
            return Array.isArray(b2) ? (e2 = b2.map(function(a3) {
              return h(a3, c2, d2).source;
            }), new RegExp("(?:".concat(e2.join("|"), ")"), f(d2))) : g(a2(b2, d2), c2, d2);
          }
          Object.defineProperty(b, "__esModule", { value: true }), b.pathToRegexp = b.tokensToRegexp = b.regexpToFunction = b.match = b.tokensToFunction = b.compile = b.parse = void 0, b.parse = a2, b.compile = function(b2, d2) {
            return c(a2(b2, d2), d2);
          }, b.tokensToFunction = c, b.match = function(a3, b2) {
            var c2 = [];
            return d(h(a3, c2, b2), c2, b2);
          }, b.regexpToFunction = d, b.tokensToRegexp = g, b.pathToRegexp = h;
        })(), a.exports = b;
      })();
    }, 318: (a, b, c) => {
      var d = c(356).Buffer;
      Object.defineProperty(b, "__esModule", { value: true });
      var e = { handleFetch: function() {
        return j;
      }, interceptFetch: function() {
        return k;
      }, reader: function() {
        return h;
      } };
      for (var f in e) Object.defineProperty(b, f, { enumerable: true, get: e[f] });
      let g = c(643), h = { url: (a2) => a2.url, header: (a2, b2) => a2.headers.get(b2) };
      async function i(a2, b2) {
        let { url: c2, method: e2, headers: f2, body: g2, cache: h2, credentials: i2, integrity: j2, mode: k2, redirect: l, referrer: m, referrerPolicy: n } = b2;
        return { testData: a2, api: "fetch", request: { url: c2, method: e2, headers: [...Array.from(f2), ["next-test-stack", (function() {
          let a3 = (Error().stack ?? "").split("\n");
          for (let b3 = 1; b3 < a3.length; b3++) if (a3[b3].length > 0) {
            a3 = a3.slice(b3);
            break;
          }
          return (a3 = (a3 = (a3 = a3.filter((a4) => !a4.includes("/next/dist/"))).slice(0, 5)).map((a4) => a4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        })()]], body: g2 ? d.from(await b2.arrayBuffer()).toString("base64") : null, cache: h2, credentials: i2, integrity: j2, mode: k2, redirect: l, referrer: m, referrerPolicy: n } };
      }
      async function j(a2, b2) {
        let c2 = (0, g.getTestReqInfo)(b2, h);
        if (!c2) return a2(b2);
        let { testData: e2, proxyPort: f2 } = c2, j2 = await i(e2, b2), k2 = await a2(`http://localhost:${f2}`, { method: "POST", body: JSON.stringify(j2), next: { internal: true } });
        if (!k2.ok) throw Object.defineProperty(Error(`Proxy request failed: ${k2.status}`), "__NEXT_ERROR_CODE", { value: "E146", enumerable: false, configurable: true });
        let l = await k2.json(), { api: m } = l;
        switch (m) {
          case "continue":
            return a2(b2);
          case "abort":
          case "unhandled":
            throw Object.defineProperty(Error(`Proxy request aborted [${b2.method} ${b2.url}]`), "__NEXT_ERROR_CODE", { value: "E145", enumerable: false, configurable: true });
          case "fetch":
            return (function(a3) {
              let { status: b3, headers: c3, body: e3 } = a3.response;
              return new Response(e3 ? d.from(e3, "base64") : null, { status: b3, headers: new Headers(c3) });
            })(l);
          default:
            return m;
        }
      }
      function k(a2) {
        return c.g.fetch = function(b2, c2) {
          var d2;
          return (null == c2 || null == (d2 = c2.next) ? void 0 : d2.internal) ? a2(b2, c2) : j(a2, new Request(b2, c2));
        }, () => {
          c.g.fetch = a2;
        };
      }
    }, 345: (a, b, c) => {
      a.exports = c(417);
    }, 356: (a) => {
      a.exports = (init_node_buffer(), __toCommonJS(node_buffer_exports));
    }, 389: (a) => {
      a.exports = d, a.exports.preferredLanguages = d;
      var b = /^\s*([^\s\-;]+)(?:-([^\s;]+))?\s*(?:;(.*))?$/;
      function c(a2, c2) {
        var d2 = b.exec(a2);
        if (!d2) return null;
        var e2 = d2[1], f2 = d2[2], g2 = e2;
        f2 && (g2 += "-" + f2);
        var h = 1;
        if (d2[3]) for (var i = d2[3].split(";"), j = 0; j < i.length; j++) {
          var k = i[j].split("=");
          "q" === k[0] && (h = parseFloat(k[1]));
        }
        return { prefix: e2, suffix: f2, q: h, i: c2, full: g2 };
      }
      function d(a2, b2) {
        var d2 = (function(a3) {
          for (var b3 = a3.split(","), d3 = 0, e2 = 0; d3 < b3.length; d3++) {
            var f2 = c(b3[d3].trim(), d3);
            f2 && (b3[e2++] = f2);
          }
          return b3.length = e2, b3;
        })(void 0 === a2 ? "*" : a2 || "");
        if (!b2) return d2.filter(g).sort(e).map(f);
        var h = b2.map(function(a3, b3) {
          for (var e2 = { o: -1, q: 0, s: 0 }, f2 = 0; f2 < d2.length; f2++) {
            var g2 = (function(a4, b4, d3) {
              var e3 = c(a4);
              if (!e3) return null;
              var f3 = 0;
              if (b4.full.toLowerCase() === e3.full.toLowerCase()) f3 |= 4;
              else if (b4.prefix.toLowerCase() === e3.full.toLowerCase()) f3 |= 2;
              else if (b4.full.toLowerCase() === e3.prefix.toLowerCase()) f3 |= 1;
              else if ("*" !== b4.full) return null;
              return { i: d3, o: b4.i, q: b4.q, s: f3 };
            })(a3, d2[f2], b3);
            g2 && 0 > (e2.s - g2.s || e2.q - g2.q || e2.o - g2.o) && (e2 = g2);
          }
          return e2;
        });
        return h.filter(g).sort(e).map(function(a3) {
          return b2[h.indexOf(a3)];
        });
      }
      function e(a2, b2) {
        return b2.q - a2.q || b2.s - a2.s || a2.o - b2.o || a2.i - b2.i || 0;
      }
      function f(a2) {
        return a2.full;
      }
      function g(a2) {
        return a2.q > 0;
      }
    }, 417: (a, b) => {
    }, 423: (a) => {
      a.exports = d, a.exports.preferredMediaTypes = d;
      var b = /^\s*([^\s\/;]+)\/([^;\s]+)\s*(?:;(.*))?$/;
      function c(a2, c2) {
        var d2 = b.exec(a2);
        if (!d2) return null;
        var e2 = /* @__PURE__ */ Object.create(null), f2 = 1, g2 = d2[2], j = d2[1];
        if (d2[3]) for (var k = (function(a3) {
          for (var b2 = a3.split(";"), c3 = 1, d3 = 0; c3 < b2.length; c3++) h(b2[d3]) % 2 == 0 ? b2[++d3] = b2[c3] : b2[d3] += ";" + b2[c3];
          b2.length = d3 + 1;
          for (var c3 = 0; c3 < b2.length; c3++) b2[c3] = b2[c3].trim();
          return b2;
        })(d2[3]).map(i), l = 0; l < k.length; l++) {
          var m = k[l], n = m[0].toLowerCase(), o = m[1], p = o && '"' === o[0] && '"' === o[o.length - 1] ? o.slice(1, -1) : o;
          if ("q" === n) {
            f2 = parseFloat(p);
            break;
          }
          e2[n] = p;
        }
        return { type: j, subtype: g2, params: e2, q: f2, i: c2 };
      }
      function d(a2, b2) {
        var d2 = (function(a3) {
          for (var b3 = (function(a4) {
            for (var b4 = a4.split(","), c2 = 1, d4 = 0; c2 < b4.length; c2++) h(b4[d4]) % 2 == 0 ? b4[++d4] = b4[c2] : b4[d4] += "," + b4[c2];
            return b4.length = d4 + 1, b4;
          })(a3), d3 = 0, e2 = 0; d3 < b3.length; d3++) {
            var f2 = c(b3[d3].trim(), d3);
            f2 && (b3[e2++] = f2);
          }
          return b3.length = e2, b3;
        })(void 0 === a2 ? "*/*" : a2 || "");
        if (!b2) return d2.filter(g).sort(e).map(f);
        var i2 = b2.map(function(a3, b3) {
          for (var e2 = { o: -1, q: 0, s: 0 }, f2 = 0; f2 < d2.length; f2++) {
            var g2 = (function(a4, b4, d3) {
              var e3 = c(a4), f3 = 0;
              if (!e3) return null;
              if (b4.type.toLowerCase() == e3.type.toLowerCase()) f3 |= 4;
              else if ("*" != b4.type) return null;
              if (b4.subtype.toLowerCase() == e3.subtype.toLowerCase()) f3 |= 2;
              else if ("*" != b4.subtype) return null;
              var g3 = Object.keys(b4.params);
              if (g3.length > 0) if (!g3.every(function(a5) {
                return "*" == b4.params[a5] || (b4.params[a5] || "").toLowerCase() == (e3.params[a5] || "").toLowerCase();
              })) return null;
              else f3 |= 1;
              return { i: d3, o: b4.i, q: b4.q, s: f3 };
            })(a3, d2[f2], b3);
            g2 && 0 > (e2.s - g2.s || e2.q - g2.q || e2.o - g2.o) && (e2 = g2);
          }
          return e2;
        });
        return i2.filter(g).sort(e).map(function(a3) {
          return b2[i2.indexOf(a3)];
        });
      }
      function e(a2, b2) {
        return b2.q - a2.q || b2.s - a2.s || a2.o - b2.o || a2.i - b2.i || 0;
      }
      function f(a2) {
        return a2.type + "/" + a2.subtype;
      }
      function g(a2) {
        return a2.q > 0;
      }
      function h(a2) {
        for (var b2 = 0, c2 = 0; -1 !== (c2 = a2.indexOf('"', c2)); ) b2++, c2++;
        return b2;
      }
      function i(a2) {
        var b2, c2, d2 = a2.indexOf("=");
        return -1 === d2 ? b2 = a2 : (b2 = a2.slice(0, d2), c2 = a2.slice(d2 + 1)), [b2, c2];
      }
    }, 464: (a) => {
      a.exports = d, a.exports.preferredEncodings = d;
      var b = /^\s*([^\s;]+)\s*(?:;(.*))?$/;
      function c(a2, b2, c2) {
        var d2 = 0;
        if (b2.encoding.toLowerCase() === a2.toLowerCase()) d2 |= 1;
        else if ("*" !== b2.encoding) return null;
        return { encoding: a2, i: c2, o: b2.i, q: b2.q, s: d2 };
      }
      function d(a2, d2, h) {
        var i = (function(a3) {
          for (var d3 = a3.split(","), e2 = false, f2 = 1, g2 = 0, h2 = 0; g2 < d3.length; g2++) {
            var i2 = (function(a4, c2) {
              var d4 = b.exec(a4);
              if (!d4) return null;
              var e3 = d4[1], f3 = 1;
              if (d4[2]) for (var g3 = d4[2].split(";"), h3 = 0; h3 < g3.length; h3++) {
                var i3 = g3[h3].trim().split("=");
                if ("q" === i3[0]) {
                  f3 = parseFloat(i3[1]);
                  break;
                }
              }
              return { encoding: e3, q: f3, i: c2 };
            })(d3[g2].trim(), g2);
            i2 && (d3[h2++] = i2, e2 = e2 || c("identity", i2), f2 = Math.min(f2, i2.q || 1));
          }
          return e2 || (d3[h2++] = { encoding: "identity", q: f2, i: g2 }), d3.length = h2, d3;
        })(a2 || ""), j = h ? function(a3, b2) {
          if (a3.q !== b2.q) return b2.q - a3.q;
          var c2 = h.indexOf(a3.encoding), d3 = h.indexOf(b2.encoding);
          return -1 === c2 && -1 === d3 ? b2.s - a3.s || a3.o - b2.o || a3.i - b2.i : -1 !== c2 && -1 !== d3 ? c2 - d3 : -1 === c2 ? 1 : -1;
        } : e;
        if (!d2) return i.filter(g).sort(j).map(f);
        var k = d2.map(function(a3, b2) {
          for (var d3 = { encoding: a3, o: -1, q: 0, s: 0 }, e2 = 0; e2 < i.length; e2++) {
            var f2 = c(a3, i[e2], b2);
            f2 && 0 > (d3.s - f2.s || d3.q - f2.q || d3.o - f2.o) && (d3 = f2);
          }
          return d3;
        });
        return k.filter(g).sort(j).map(function(a3) {
          return d2[k.indexOf(a3)];
        });
      }
      function e(a2, b2) {
        return b2.q - a2.q || b2.s - a2.s || a2.o - b2.o || a2.i - b2.i;
      }
      function f(a2) {
        return a2.encoding;
      }
      function g(a2) {
        return a2.q > 0;
      }
    }, 521: (a) => {
      a.exports = (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports));
    }, 536: (a, b) => {
      let c;
      b.qg = function(a2, b2) {
        let c2 = new i(), d2 = a2.length;
        if (d2 < 2) return c2;
        let e2 = b2?.decode || l, f2 = 0;
        do {
          let b3 = (function(a3, b4, c3) {
            let d3 = a3.indexOf("=", b4);
            return d3 < c3 ? d3 : -1;
          })(a2, f2, d2);
          if (-1 === b3) break;
          let g2 = (function(a3, b4, c3) {
            let d3 = a3.indexOf(";", b4);
            return -1 === d3 ? c3 : d3;
          })(a2, f2, d2);
          if (b3 > g2) {
            f2 = a2.lastIndexOf(";", b3 - 1) + 1;
            continue;
          }
          let h2 = k(a2, f2, b3);
          void 0 === c2[h2] && (c2[h2] = e2(k(a2, b3 + 1, g2))), f2 = g2 + 1;
        } while (f2 < d2);
        return c2;
      }, b.lK = j, b.lK = j;
      let d = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/, e = /^[\u0021-\u003A\u003C-\u007E]*$/, f = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i, g = /^[\u0020-\u003A\u003D-\u007E]*$/, h = Object.prototype.toString, i = ((c = function() {
      }).prototype = /* @__PURE__ */ Object.create(null), c);
      function j(a2, b2, c2) {
        let i2 = "object" == typeof a2 ? a2 : { ...c2, name: a2, value: String(b2) }, j2 = ("object" == typeof b2 ? b2 : c2)?.encode || encodeURIComponent;
        if (!d.test(i2.name)) throw TypeError(`argument name is invalid: ${i2.name}`);
        let k2 = i2.value ? j2(i2.value) : "";
        if (!e.test(k2)) throw TypeError(`argument val is invalid: ${i2.value}`);
        let l2 = i2.name + "=" + k2;
        if (void 0 !== i2.maxAge) {
          if (!Number.isInteger(i2.maxAge)) throw TypeError(`option maxAge is invalid: ${i2.maxAge}`);
          l2 += "; Max-Age=" + i2.maxAge;
        }
        if (i2.domain) {
          if (!f.test(i2.domain)) throw TypeError(`option domain is invalid: ${i2.domain}`);
          l2 += "; Domain=" + i2.domain;
        }
        if (i2.path) {
          if (!g.test(i2.path)) throw TypeError(`option path is invalid: ${i2.path}`);
          l2 += "; Path=" + i2.path;
        }
        if (i2.expires) {
          var m;
          if (m = i2.expires, "[object Date]" !== h.call(m) || !Number.isFinite(i2.expires.valueOf())) throw TypeError(`option expires is invalid: ${i2.expires}`);
          l2 += "; Expires=" + i2.expires.toUTCString();
        }
        if (i2.httpOnly && (l2 += "; HttpOnly"), i2.secure && (l2 += "; Secure"), i2.partitioned && (l2 += "; Partitioned"), i2.priority) switch ("string" == typeof i2.priority ? i2.priority.toLowerCase() : void 0) {
          case "low":
            l2 += "; Priority=Low";
            break;
          case "medium":
            l2 += "; Priority=Medium";
            break;
          case "high":
            l2 += "; Priority=High";
            break;
          default:
            throw TypeError(`option priority is invalid: ${i2.priority}`);
        }
        if (i2.sameSite) switch ("string" == typeof i2.sameSite ? i2.sameSite.toLowerCase() : i2.sameSite) {
          case true:
          case "strict":
            l2 += "; SameSite=Strict";
            break;
          case "lax":
            l2 += "; SameSite=Lax";
            break;
          case "none":
            l2 += "; SameSite=None";
            break;
          default:
            throw TypeError(`option sameSite is invalid: ${i2.sameSite}`);
        }
        return l2;
      }
      function k(a2, b2, c2) {
        let d2 = b2, e2 = c2;
        do {
          let b3 = a2.charCodeAt(d2);
          if (32 !== b3 && 9 !== b3) break;
        } while (++d2 < e2);
        for (; e2 > d2; ) {
          let b3 = a2.charCodeAt(e2 - 1);
          if (32 !== b3 && 9 !== b3) break;
          e2--;
        }
        return a2.slice(d2, e2);
      }
      function l(a2) {
        if (-1 === a2.indexOf("%")) return a2;
        try {
          return decodeURIComponent(a2);
        } catch (b2) {
          return a2;
        }
      }
    }, 579: (a, b, c) => {
      var d = c(11), e = c(464), f = c(389), g = c(423);
      function h(a2) {
        if (!(this instanceof h)) return new h(a2);
        this.request = a2;
      }
      a.exports = h, a.exports.Negotiator = h, h.prototype.charset = function(a2) {
        var b2 = this.charsets(a2);
        return b2 && b2[0];
      }, h.prototype.charsets = function(a2) {
        return d(this.request.headers["accept-charset"], a2);
      }, h.prototype.encoding = function(a2, b2) {
        var c2 = this.encodings(a2, b2);
        return c2 && c2[0];
      }, h.prototype.encodings = function(a2, b2) {
        return e(this.request.headers["accept-encoding"], a2, (b2 || {}).preferred);
      }, h.prototype.language = function(a2) {
        var b2 = this.languages(a2);
        return b2 && b2[0];
      }, h.prototype.languages = function(a2) {
        return f(this.request.headers["accept-language"], a2);
      }, h.prototype.mediaType = function(a2) {
        var b2 = this.mediaTypes(a2);
        return b2 && b2[0];
      }, h.prototype.mediaTypes = function(a2) {
        return g(this.request.headers.accept, a2);
      }, h.prototype.preferredCharset = h.prototype.charset, h.prototype.preferredCharsets = h.prototype.charsets, h.prototype.preferredEncoding = h.prototype.encoding, h.prototype.preferredEncodings = h.prototype.encodings, h.prototype.preferredLanguage = h.prototype.language, h.prototype.preferredLanguages = h.prototype.languages, h.prototype.preferredMediaType = h.prototype.mediaType, h.prototype.preferredMediaTypes = h.prototype.mediaTypes;
    }, 643: (a, b, c) => {
      Object.defineProperty(b, "__esModule", { value: true });
      var d = { getTestReqInfo: function() {
        return i;
      }, withRequest: function() {
        return h;
      } };
      for (var e in d) Object.defineProperty(b, e, { enumerable: true, get: d[e] });
      let f = new (c(521)).AsyncLocalStorage();
      function g(a2, b2) {
        let c2 = b2.header(a2, "next-test-proxy-port");
        if (!c2) return;
        let d2 = b2.url(a2);
        return { url: d2, proxyPort: Number(c2), testData: b2.header(a2, "next-test-data") || "" };
      }
      function h(a2, b2, c2) {
        let d2 = g(a2, b2);
        return d2 ? f.run(d2, c2) : c2();
      }
      function i(a2, b2) {
        let c2 = f.getStore();
        return c2 || (a2 && b2 ? g(a2, b2) : void 0);
      }
    }, 654: (a, b, c) => {
      a.exports = c(42);
    }, 852: (a) => {
      (() => {
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "//");
        var b, c, d, e, f = {};
        f.parse = function(a2, c2) {
          if ("string" != typeof a2) throw TypeError("argument str must be a string");
          for (var e2 = {}, f2 = a2.split(d), g = (c2 || {}).decode || b, h = 0; h < f2.length; h++) {
            var i = f2[h], j = i.indexOf("=");
            if (!(j < 0)) {
              var k = i.substr(0, j).trim(), l = i.substr(++j, i.length).trim();
              '"' == l[0] && (l = l.slice(1, -1)), void 0 == e2[k] && (e2[k] = (function(a3, b2) {
                try {
                  return b2(a3);
                } catch (b3) {
                  return a3;
                }
              })(l, g));
            }
          }
          return e2;
        }, f.serialize = function(a2, b2, d2) {
          var f2 = d2 || {}, g = f2.encode || c;
          if ("function" != typeof g) throw TypeError("option encode is invalid");
          if (!e.test(a2)) throw TypeError("argument name is invalid");
          var h = g(b2);
          if (h && !e.test(h)) throw TypeError("argument val is invalid");
          var i = a2 + "=" + h;
          if (null != f2.maxAge) {
            var j = f2.maxAge - 0;
            if (isNaN(j) || !isFinite(j)) throw TypeError("option maxAge is invalid");
            i += "; Max-Age=" + Math.floor(j);
          }
          if (f2.domain) {
            if (!e.test(f2.domain)) throw TypeError("option domain is invalid");
            i += "; Domain=" + f2.domain;
          }
          if (f2.path) {
            if (!e.test(f2.path)) throw TypeError("option path is invalid");
            i += "; Path=" + f2.path;
          }
          if (f2.expires) {
            if ("function" != typeof f2.expires.toUTCString) throw TypeError("option expires is invalid");
            i += "; Expires=" + f2.expires.toUTCString();
          }
          if (f2.httpOnly && (i += "; HttpOnly"), f2.secure && (i += "; Secure"), f2.sameSite) switch ("string" == typeof f2.sameSite ? f2.sameSite.toLowerCase() : f2.sameSite) {
            case true:
            case "strict":
              i += "; SameSite=Strict";
              break;
            case "lax":
              i += "; SameSite=Lax";
              break;
            case "none":
              i += "; SameSite=None";
              break;
            default:
              throw TypeError("option sameSite is invalid");
          }
          return i;
        }, b = decodeURIComponent, c = encodeURIComponent, d = /; */, e = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/, a.exports = f;
      })();
    }, 918: (a) => {
      var b = Object.defineProperty, c = Object.getOwnPropertyDescriptor, d = Object.getOwnPropertyNames, e = Object.prototype.hasOwnProperty, f = {}, g = { RequestCookies: () => n, ResponseCookies: () => o, parseCookie: () => j, parseSetCookie: () => k, stringifyCookie: () => i };
      for (var h in g) b(f, h, { get: g[h], enumerable: true });
      function i(a2) {
        var b2;
        let c2 = ["path" in a2 && a2.path && `Path=${a2.path}`, "expires" in a2 && (a2.expires || 0 === a2.expires) && `Expires=${("number" == typeof a2.expires ? new Date(a2.expires) : a2.expires).toUTCString()}`, "maxAge" in a2 && "number" == typeof a2.maxAge && `Max-Age=${a2.maxAge}`, "domain" in a2 && a2.domain && `Domain=${a2.domain}`, "secure" in a2 && a2.secure && "Secure", "httpOnly" in a2 && a2.httpOnly && "HttpOnly", "sameSite" in a2 && a2.sameSite && `SameSite=${a2.sameSite}`, "partitioned" in a2 && a2.partitioned && "Partitioned", "priority" in a2 && a2.priority && `Priority=${a2.priority}`].filter(Boolean), d2 = `${a2.name}=${encodeURIComponent(null != (b2 = a2.value) ? b2 : "")}`;
        return 0 === c2.length ? d2 : `${d2}; ${c2.join("; ")}`;
      }
      function j(a2) {
        let b2 = /* @__PURE__ */ new Map();
        for (let c2 of a2.split(/; */)) {
          if (!c2) continue;
          let a3 = c2.indexOf("=");
          if (-1 === a3) {
            b2.set(c2, "true");
            continue;
          }
          let [d2, e2] = [c2.slice(0, a3), c2.slice(a3 + 1)];
          try {
            b2.set(d2, decodeURIComponent(null != e2 ? e2 : "true"));
          } catch {
          }
        }
        return b2;
      }
      function k(a2) {
        if (!a2) return;
        let [[b2, c2], ...d2] = j(a2), { domain: e2, expires: f2, httponly: g2, maxage: h2, path: i2, samesite: k2, secure: n2, partitioned: o2, priority: p } = Object.fromEntries(d2.map(([a3, b3]) => [a3.toLowerCase().replace(/-/g, ""), b3]));
        {
          var q, r, s = { name: b2, value: decodeURIComponent(c2), domain: e2, ...f2 && { expires: new Date(f2) }, ...g2 && { httpOnly: true }, ..."string" == typeof h2 && { maxAge: Number(h2) }, path: i2, ...k2 && { sameSite: l.includes(q = (q = k2).toLowerCase()) ? q : void 0 }, ...n2 && { secure: true }, ...p && { priority: m.includes(r = (r = p).toLowerCase()) ? r : void 0 }, ...o2 && { partitioned: true } };
          let a3 = {};
          for (let b3 in s) s[b3] && (a3[b3] = s[b3]);
          return a3;
        }
      }
      a.exports = ((a2, f2, g2, h2) => {
        if (f2 && "object" == typeof f2 || "function" == typeof f2) for (let i2 of d(f2)) e.call(a2, i2) || i2 === g2 || b(a2, i2, { get: () => f2[i2], enumerable: !(h2 = c(f2, i2)) || h2.enumerable });
        return a2;
      })(b({}, "__esModule", { value: true }), f);
      var l = ["strict", "lax", "none"], m = ["low", "medium", "high"], n = class {
        constructor(a2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = a2;
          const b2 = a2.get("cookie");
          if (b2) for (const [a3, c2] of j(b2)) this._parsed.set(a3, { name: a3, value: c2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...a2) {
          let b2 = "string" == typeof a2[0] ? a2[0] : a2[0].name;
          return this._parsed.get(b2);
        }
        getAll(...a2) {
          var b2;
          let c2 = Array.from(this._parsed);
          if (!a2.length) return c2.map(([a3, b3]) => b3);
          let d2 = "string" == typeof a2[0] ? a2[0] : null == (b2 = a2[0]) ? void 0 : b2.name;
          return c2.filter(([a3]) => a3 === d2).map(([a3, b3]) => b3);
        }
        has(a2) {
          return this._parsed.has(a2);
        }
        set(...a2) {
          let [b2, c2] = 1 === a2.length ? [a2[0].name, a2[0].value] : a2, d2 = this._parsed;
          return d2.set(b2, { name: b2, value: c2 }), this._headers.set("cookie", Array.from(d2).map(([a3, b3]) => i(b3)).join("; ")), this;
        }
        delete(a2) {
          let b2 = this._parsed, c2 = Array.isArray(a2) ? a2.map((a3) => b2.delete(a3)) : b2.delete(a2);
          return this._headers.set("cookie", Array.from(b2).map(([a3, b3]) => i(b3)).join("; ")), c2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [/* @__PURE__ */ Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((a2) => `${a2.name}=${encodeURIComponent(a2.value)}`).join("; ");
        }
      }, o = class {
        constructor(a2) {
          var b2, c2, d2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = a2;
          const e2 = null != (d2 = null != (c2 = null == (b2 = a2.getSetCookie) ? void 0 : b2.call(a2)) ? c2 : a2.get("set-cookie")) ? d2 : [];
          for (const a3 of Array.isArray(e2) ? e2 : (function(a4) {
            if (!a4) return [];
            var b3, c3, d3, e3, f2, g2 = [], h2 = 0;
            function i2() {
              for (; h2 < a4.length && /\s/.test(a4.charAt(h2)); ) h2 += 1;
              return h2 < a4.length;
            }
            for (; h2 < a4.length; ) {
              for (b3 = h2, f2 = false; i2(); ) if ("," === (c3 = a4.charAt(h2))) {
                for (d3 = h2, h2 += 1, i2(), e3 = h2; h2 < a4.length && "=" !== (c3 = a4.charAt(h2)) && ";" !== c3 && "," !== c3; ) h2 += 1;
                h2 < a4.length && "=" === a4.charAt(h2) ? (f2 = true, h2 = e3, g2.push(a4.substring(b3, d3)), b3 = h2) : h2 = d3 + 1;
              } else h2 += 1;
              (!f2 || h2 >= a4.length) && g2.push(a4.substring(b3, a4.length));
            }
            return g2;
          })(e2)) {
            const b3 = k(a3);
            b3 && this._parsed.set(b3.name, b3);
          }
        }
        get(...a2) {
          let b2 = "string" == typeof a2[0] ? a2[0] : a2[0].name;
          return this._parsed.get(b2);
        }
        getAll(...a2) {
          var b2;
          let c2 = Array.from(this._parsed.values());
          if (!a2.length) return c2;
          let d2 = "string" == typeof a2[0] ? a2[0] : null == (b2 = a2[0]) ? void 0 : b2.name;
          return c2.filter((a3) => a3.name === d2);
        }
        has(a2) {
          return this._parsed.has(a2);
        }
        set(...a2) {
          let [b2, c2, d2] = 1 === a2.length ? [a2[0].name, a2[0].value, a2[0]] : a2, e2 = this._parsed;
          return e2.set(b2, (function(a3 = { name: "", value: "" }) {
            return "number" == typeof a3.expires && (a3.expires = new Date(a3.expires)), a3.maxAge && (a3.expires = new Date(Date.now() + 1e3 * a3.maxAge)), (null === a3.path || void 0 === a3.path) && (a3.path = "/"), a3;
          })({ name: b2, value: c2, ...d2 })), (function(a3, b3) {
            for (let [, c3] of (b3.delete("set-cookie"), a3)) {
              let a4 = i(c3);
              b3.append("set-cookie", a4);
            }
          })(e2, this._headers), this;
        }
        delete(...a2) {
          let [b2, c2] = "string" == typeof a2[0] ? [a2[0]] : [a2[0].name, a2[0]];
          return this.set({ ...c2, name: b2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [/* @__PURE__ */ Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(i).join("; ");
        }
      };
    }, 967: (a, b, c) => {
      let d, e, f, g, h, i, j, k, l;
      c.r(b), c.d(b, { default: () => g$, handler: () => gZ });
      var m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S = {};
      async function T() {
        return "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && await _ENTRIES.middleware_instrumentation;
      }
      c.r(S), c.d(S, { config: () => gT, default: () => gS });
      let U = null;
      async function V() {
        if ("phase-production-build" === process.env.NEXT_PHASE) return;
        U || (U = T());
        let a10 = await U;
        if (null == a10 ? void 0 : a10.register) try {
          await a10.register();
        } catch (a11) {
          throw a11.message = `An error occurred while loading instrumentation hook: ${a11.message}`, a11;
        }
      }
      async function W(...a10) {
        let b10 = await T();
        try {
          var c10;
          await (null == b10 || null == (c10 = b10.onRequestError) ? void 0 : c10.call(b10, ...a10));
        } catch (a11) {
          console.error("Error in instrumentation.onRequestError:", a11);
        }
      }
      let X = null;
      function Y() {
        return X || (X = V()), X;
      }
      function Z(a10) {
        return `The edge runtime does not support Node.js '${a10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== c.g.process && (process.env = c.g.process.env, c.g.process = process);
      try {
        Object.defineProperty(globalThis, "__import_unsupported", { value: function(a10) {
          let b10 = new Proxy(function() {
          }, { get(b11, c10) {
            if ("then" === c10) return {};
            throw Object.defineProperty(Error(Z(a10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, construct() {
            throw Object.defineProperty(Error(Z(a10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, apply(c10, d10, e10) {
            if ("function" == typeof e10[0]) return e10[0](b10);
            throw Object.defineProperty(Error(Z(a10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          } });
          return new Proxy({}, { get: () => b10 });
        }, enumerable: false, configurable: false });
      } catch {
      }
      Y();
      class $ extends Error {
        constructor({ page: a10 }) {
          super(`The middleware "${a10}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class _ extends Error {
        constructor() {
          super("The request.page has been deprecated in favour of `URLPattern`.\n  Read more: https://nextjs.org/docs/messages/middleware-request-page\n  ");
        }
      }
      class aa extends Error {
        constructor() {
          super("The request.ua has been removed in favour of `userAgent` function.\n  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent\n  ");
        }
      }
      let ab = "x-prerender-revalidate", ac = ".meta", ad = "x-next-cache-tags", ae = "x-next-revalidated-tags", af = "_N_T_";
      function ah(a10) {
        var b10, c10, d10, e10, f10, g2 = [], h2 = 0;
        function i2() {
          for (; h2 < a10.length && /\s/.test(a10.charAt(h2)); ) h2 += 1;
          return h2 < a10.length;
        }
        for (; h2 < a10.length; ) {
          for (b10 = h2, f10 = false; i2(); ) if ("," === (c10 = a10.charAt(h2))) {
            for (d10 = h2, h2 += 1, i2(), e10 = h2; h2 < a10.length && "=" !== (c10 = a10.charAt(h2)) && ";" !== c10 && "," !== c10; ) h2 += 1;
            h2 < a10.length && "=" === a10.charAt(h2) ? (f10 = true, h2 = e10, g2.push(a10.substring(b10, d10)), b10 = h2) : h2 = d10 + 1;
          } else h2 += 1;
          (!f10 || h2 >= a10.length) && g2.push(a10.substring(b10, a10.length));
        }
        return g2;
      }
      function ai(a10) {
        let b10 = {}, c10 = [];
        if (a10) for (let [d10, e10] of a10.entries()) "set-cookie" === d10.toLowerCase() ? (c10.push(...ah(e10)), b10[d10] = 1 === c10.length ? c10[0] : c10) : b10[d10] = e10;
        return b10;
      }
      function aj(a10) {
        try {
          return String(new URL(String(a10)));
        } catch (b10) {
          throw Object.defineProperty(Error(`URL is malformed "${String(a10)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: b10 }), "__NEXT_ERROR_CODE", { value: "E61", enumerable: false, configurable: true });
        }
      }
      let ak = /* @__PURE__ */ Symbol("response"), al = /* @__PURE__ */ Symbol("passThrough"), am = /* @__PURE__ */ Symbol("waitUntil");
      class an {
        constructor(a10, b10) {
          this[al] = false, this[am] = b10 ? { kind: "external", function: b10 } : { kind: "internal", promises: [] };
        }
        respondWith(a10) {
          this[ak] || (this[ak] = Promise.resolve(a10));
        }
        passThroughOnException() {
          this[al] = true;
        }
        waitUntil(a10) {
          if ("external" === this[am].kind) return (0, this[am].function)(a10);
          this[am].promises.push(a10);
        }
      }
      class ao extends an {
        constructor(a10) {
          var b10;
          super(a10.request, null == (b10 = a10.context) ? void 0 : b10.waitUntil), this.sourcePage = a10.page;
        }
        get request() {
          throw Object.defineProperty(new $({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new $({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      function ap(a10) {
        return a10.replace(/\/$/, "") || "/";
      }
      function aq(a10) {
        let b10 = a10.indexOf("#"), c10 = a10.indexOf("?"), d10 = c10 > -1 && (b10 < 0 || c10 < b10);
        return d10 || b10 > -1 ? { pathname: a10.substring(0, d10 ? c10 : b10), query: d10 ? a10.substring(c10, b10 > -1 ? b10 : void 0) : "", hash: b10 > -1 ? a10.slice(b10) : "" } : { pathname: a10, query: "", hash: "" };
      }
      function ar(a10, b10) {
        if (!a10.startsWith("/") || !b10) return a10;
        let { pathname: c10, query: d10, hash: e10 } = aq(a10);
        return `${b10}${c10}${d10}${e10}`;
      }
      function as(a10, b10) {
        if (!a10.startsWith("/") || !b10) return a10;
        let { pathname: c10, query: d10, hash: e10 } = aq(a10);
        return `${c10}${b10}${d10}${e10}`;
      }
      function at(a10, b10) {
        if ("string" != typeof a10) return false;
        let { pathname: c10 } = aq(a10);
        return c10 === b10 || c10.startsWith(b10 + "/");
      }
      let au = /* @__PURE__ */ new WeakMap();
      function av(a10, b10) {
        let c10;
        if (!b10) return { pathname: a10 };
        let d10 = au.get(b10);
        d10 || (d10 = b10.map((a11) => a11.toLowerCase()), au.set(b10, d10));
        let e10 = a10.split("/", 2);
        if (!e10[1]) return { pathname: a10 };
        let f10 = e10[1].toLowerCase(), g2 = d10.indexOf(f10);
        return g2 < 0 ? { pathname: a10 } : (c10 = b10[g2], { pathname: a10 = a10.slice(c10.length + 1) || "/", detectedLocale: c10 });
      }
      let aw = /^(?:127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)$/;
      function ax(a10, b10) {
        let c10 = new URL(String(a10), b10 && String(b10));
        return aw.test(c10.hostname) && (c10.hostname = "localhost"), c10;
      }
      let ay = /* @__PURE__ */ Symbol("NextURLInternal");
      class az {
        constructor(a10, b10, c10) {
          let d10, e10;
          "object" == typeof b10 && "pathname" in b10 || "string" == typeof b10 ? (d10 = b10, e10 = c10 || {}) : e10 = c10 || b10 || {}, this[ay] = { url: ax(a10, d10 ?? e10.base), options: e10, basePath: "" }, this.analyze();
        }
        analyze() {
          var a10, b10, c10, d10, e10;
          let f10 = (function(a11, b11) {
            let { basePath: c11, i18n: d11, trailingSlash: e11 } = b11.nextConfig ?? {}, f11 = { pathname: a11, trailingSlash: "/" !== a11 ? a11.endsWith("/") : e11 };
            c11 && at(f11.pathname, c11) && (f11.pathname = (function(a12, b12) {
              if (!at(a12, b12)) return a12;
              let c12 = a12.slice(b12.length);
              return c12.startsWith("/") ? c12 : `/${c12}`;
            })(f11.pathname, c11), f11.basePath = c11);
            let g3 = f11.pathname;
            if (f11.pathname.startsWith("/_next/data/") && f11.pathname.endsWith(".json")) {
              let a12 = f11.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
              f11.buildId = a12[0], g3 = "index" !== a12[1] ? `/${a12.slice(1).join("/")}` : "/", f11.pathname = g3;
            }
            if (d11) {
              let a12 = b11.i18nProvider ? b11.i18nProvider.analyze(f11.pathname) : av(f11.pathname, d11.locales);
              f11.locale = a12.detectedLocale, f11.pathname = a12.pathname ?? f11.pathname, !a12.detectedLocale && f11.buildId && (a12 = b11.i18nProvider ? b11.i18nProvider.analyze(g3) : av(g3, d11.locales)).detectedLocale && (f11.locale = a12.detectedLocale);
            }
            return f11;
          })(this[ay].url.pathname, { nextConfig: this[ay].options.nextConfig, i18nProvider: this[ay].options.i18nProvider }), g2 = (function(a11, b11) {
            let c11;
            if (b11?.host && !Array.isArray(b11.host)) c11 = b11.host.toString().split(":", 1)[0];
            else {
              if (!a11.hostname) return;
              c11 = a11.hostname;
            }
            return c11.toLowerCase();
          })(this[ay].url, this[ay].options.headers);
          this[ay].domainLocale = this[ay].options.i18nProvider ? this[ay].options.i18nProvider.detectDomainLocale(g2) : (function(a11, b11, c11) {
            if (a11) {
              for (let d11 of a11) if (b11 === d11.domain?.split(":", 1)[0].toLowerCase() || c11 === d11.defaultLocale.toLowerCase() || d11.locales?.some((a12) => a12.toLowerCase() === c11)) return d11;
            }
          })(null == (b10 = this[ay].options.nextConfig) || null == (a10 = b10.i18n) ? void 0 : a10.domains, g2);
          let h2 = (null == (c10 = this[ay].domainLocale) ? void 0 : c10.defaultLocale) || (null == (e10 = this[ay].options.nextConfig) || null == (d10 = e10.i18n) ? void 0 : d10.defaultLocale);
          this[ay].url.pathname = f10.pathname, this[ay].defaultLocale = h2, this[ay].basePath = f10.basePath ?? "", this[ay].buildId = f10.buildId, this[ay].locale = f10.locale ?? h2, this[ay].trailingSlash = f10.trailingSlash;
        }
        formatPathname() {
          var a10;
          let b10;
          return b10 = (function(a11, b11, c10, d10) {
            if (!b11 || b11 === c10) return a11;
            let e10 = a11.toLowerCase();
            return !d10 && (at(e10, "/api") || at(e10, `/${b11.toLowerCase()}`)) ? a11 : ar(a11, `/${b11}`);
          })((a10 = { basePath: this[ay].basePath, buildId: this[ay].buildId, defaultLocale: this[ay].options.forceLocale ? void 0 : this[ay].defaultLocale, locale: this[ay].locale, pathname: this[ay].url.pathname, trailingSlash: this[ay].trailingSlash }).pathname, a10.locale, a10.buildId ? void 0 : a10.defaultLocale, a10.ignorePrefix), (a10.buildId || !a10.trailingSlash) && (b10 = ap(b10)), a10.buildId && (b10 = as(ar(b10, `/_next/data/${a10.buildId}`), "/" === a10.pathname ? "index.json" : ".json")), b10 = ar(b10, a10.basePath), !a10.buildId && a10.trailingSlash ? b10.endsWith("/") ? b10 : as(b10, "/") : ap(b10);
        }
        formatSearch() {
          return this[ay].url.search;
        }
        get buildId() {
          return this[ay].buildId;
        }
        set buildId(a10) {
          this[ay].buildId = a10;
        }
        get locale() {
          return this[ay].locale ?? "";
        }
        set locale(a10) {
          var b10, c10;
          if (!this[ay].locale || !(null == (c10 = this[ay].options.nextConfig) || null == (b10 = c10.i18n) ? void 0 : b10.locales.includes(a10))) throw Object.defineProperty(TypeError(`The NextURL configuration includes no locale "${a10}"`), "__NEXT_ERROR_CODE", { value: "E597", enumerable: false, configurable: true });
          this[ay].locale = a10;
        }
        get defaultLocale() {
          return this[ay].defaultLocale;
        }
        get domainLocale() {
          return this[ay].domainLocale;
        }
        get searchParams() {
          return this[ay].url.searchParams;
        }
        get host() {
          return this[ay].url.host;
        }
        set host(a10) {
          this[ay].url.host = a10;
        }
        get hostname() {
          return this[ay].url.hostname;
        }
        set hostname(a10) {
          this[ay].url.hostname = a10;
        }
        get port() {
          return this[ay].url.port;
        }
        set port(a10) {
          this[ay].url.port = a10;
        }
        get protocol() {
          return this[ay].url.protocol;
        }
        set protocol(a10) {
          this[ay].url.protocol = a10;
        }
        get href() {
          let a10 = this.formatPathname(), b10 = this.formatSearch();
          return `${this.protocol}//${this.host}${a10}${b10}${this.hash}`;
        }
        set href(a10) {
          this[ay].url = ax(a10), this.analyze();
        }
        get origin() {
          return this[ay].url.origin;
        }
        get pathname() {
          return this[ay].url.pathname;
        }
        set pathname(a10) {
          this[ay].url.pathname = a10;
        }
        get hash() {
          return this[ay].url.hash;
        }
        set hash(a10) {
          this[ay].url.hash = a10;
        }
        get search() {
          return this[ay].url.search;
        }
        set search(a10) {
          this[ay].url.search = a10;
        }
        get password() {
          return this[ay].url.password;
        }
        set password(a10) {
          this[ay].url.password = a10;
        }
        get username() {
          return this[ay].url.username;
        }
        set username(a10) {
          this[ay].url.username = a10;
        }
        get basePath() {
          return this[ay].basePath;
        }
        set basePath(a10) {
          this[ay].basePath = a10.startsWith("/") ? a10 : `/${a10}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [/* @__PURE__ */ Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new az(String(this), this[ay].options);
        }
      }
      var aA = c(918);
      let aB = /* @__PURE__ */ Symbol("internal request");
      class aC extends Request {
        constructor(a10, b10 = {}) {
          const c10 = "string" != typeof a10 && "url" in a10 ? a10.url : String(a10);
          aj(c10), a10 instanceof Request ? super(a10, b10) : super(c10, b10);
          const d10 = new az(c10, { headers: ai(this.headers), nextConfig: b10.nextConfig });
          this[aB] = { cookies: new aA.RequestCookies(this.headers), nextUrl: d10, url: d10.toString() };
        }
        [/* @__PURE__ */ Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[aB].cookies;
        }
        get nextUrl() {
          return this[aB].nextUrl;
        }
        get page() {
          throw new _();
        }
        get ua() {
          throw new aa();
        }
        get url() {
          return this[aB].url;
        }
      }
      class aD {
        static get(a10, b10, c10) {
          let d10 = Reflect.get(a10, b10, c10);
          return "function" == typeof d10 ? d10.bind(a10) : d10;
        }
        static set(a10, b10, c10, d10) {
          return Reflect.set(a10, b10, c10, d10);
        }
        static has(a10, b10) {
          return Reflect.has(a10, b10);
        }
        static deleteProperty(a10, b10) {
          return Reflect.deleteProperty(a10, b10);
        }
      }
      let aE = /* @__PURE__ */ Symbol("internal response"), aF = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function aG(a10, b10) {
        var c10;
        if (null == a10 || null == (c10 = a10.request) ? void 0 : c10.headers) {
          if (!(a10.request.headers instanceof Headers)) throw Object.defineProperty(Error("request.headers must be an instance of Headers"), "__NEXT_ERROR_CODE", { value: "E119", enumerable: false, configurable: true });
          let c11 = [];
          for (let [d10, e10] of a10.request.headers) b10.set("x-middleware-request-" + d10, e10), c11.push(d10);
          b10.set("x-middleware-override-headers", c11.join(","));
        }
      }
      class aH extends Response {
        constructor(a10, b10 = {}) {
          super(a10, b10);
          const c10 = this.headers, d10 = new Proxy(new aA.ResponseCookies(c10), { get(a11, d11, e10) {
            switch (d11) {
              case "delete":
              case "set":
                return (...e11) => {
                  let f10 = Reflect.apply(a11[d11], a11, e11), g2 = new Headers(c10);
                  return f10 instanceof aA.ResponseCookies && c10.set("x-middleware-set-cookie", f10.getAll().map((a12) => (0, aA.stringifyCookie)(a12)).join(",")), aG(b10, g2), f10;
                };
              default:
                return aD.get(a11, d11, e10);
            }
          } });
          this[aE] = { cookies: d10, url: b10.url ? new az(b10.url, { headers: ai(c10), nextConfig: b10.nextConfig }) : void 0 };
        }
        [/* @__PURE__ */ Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[aE].cookies;
        }
        static json(a10, b10) {
          let c10 = Response.json(a10, b10);
          return new aH(c10.body, c10);
        }
        static redirect(a10, b10) {
          let c10 = "number" == typeof b10 ? b10 : (null == b10 ? void 0 : b10.status) ?? 307;
          if (!aF.has(c10)) throw Object.defineProperty(RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", { value: "E529", enumerable: false, configurable: true });
          let d10 = "object" == typeof b10 ? b10 : {}, e10 = new Headers(null == d10 ? void 0 : d10.headers);
          return e10.set("Location", aj(a10)), new aH(null, { ...d10, headers: e10, status: c10 });
        }
        static rewrite(a10, b10) {
          let c10 = new Headers(null == b10 ? void 0 : b10.headers);
          return c10.set("x-middleware-rewrite", aj(a10)), aG(b10, c10), new aH(null, { ...b10, headers: c10 });
        }
        static next(a10) {
          let b10 = new Headers(null == a10 ? void 0 : a10.headers);
          return b10.set("x-middleware-next", "1"), aG(a10, b10), new aH(null, { ...a10, headers: b10 });
        }
      }
      function aI(a10, b10) {
        let c10 = "string" == typeof b10 ? new URL(b10) : b10, d10 = new URL(a10, b10), e10 = d10.origin === c10.origin;
        return { url: e10 ? d10.toString().slice(c10.origin.length) : d10.toString(), isRelative: e10 };
      }
      let aJ = "next-router-prefetch", aK = ["rsc", "next-router-state-tree", aJ, "next-hmr-refresh", "next-router-segment-prefetch"], aL = "_rsc";
      function aM(a10) {
        return a10.startsWith("/") ? a10 : `/${a10}`;
      }
      function aN(a10) {
        return aM(a10.split("/").reduce((a11, b10, c10, d10) => b10 ? "(" === b10[0] && b10.endsWith(")") || "@" === b10[0] || ("page" === b10 || "route" === b10) && c10 === d10.length - 1 ? a11 : `${a11}/${b10}` : a11, ""));
      }
      class aO extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new aO();
        }
      }
      class aP extends Headers {
        constructor(a10) {
          super(), this.headers = new Proxy(a10, { get(b10, c10, d10) {
            if ("symbol" == typeof c10) return aD.get(b10, c10, d10);
            let e10 = c10.toLowerCase(), f10 = Object.keys(a10).find((a11) => a11.toLowerCase() === e10);
            if (void 0 !== f10) return aD.get(b10, f10, d10);
          }, set(b10, c10, d10, e10) {
            if ("symbol" == typeof c10) return aD.set(b10, c10, d10, e10);
            let f10 = c10.toLowerCase(), g2 = Object.keys(a10).find((a11) => a11.toLowerCase() === f10);
            return aD.set(b10, g2 ?? c10, d10, e10);
          }, has(b10, c10) {
            if ("symbol" == typeof c10) return aD.has(b10, c10);
            let d10 = c10.toLowerCase(), e10 = Object.keys(a10).find((a11) => a11.toLowerCase() === d10);
            return void 0 !== e10 && aD.has(b10, e10);
          }, deleteProperty(b10, c10) {
            if ("symbol" == typeof c10) return aD.deleteProperty(b10, c10);
            let d10 = c10.toLowerCase(), e10 = Object.keys(a10).find((a11) => a11.toLowerCase() === d10);
            return void 0 === e10 || aD.deleteProperty(b10, e10);
          } });
        }
        static seal(a10) {
          return new Proxy(a10, { get(a11, b10, c10) {
            switch (b10) {
              case "append":
              case "delete":
              case "set":
                return aO.callable;
              default:
                return aD.get(a11, b10, c10);
            }
          } });
        }
        merge(a10) {
          return Array.isArray(a10) ? a10.join(", ") : a10;
        }
        static from(a10) {
          return a10 instanceof Headers ? a10 : new aP(a10);
        }
        append(a10, b10) {
          let c10 = this.headers[a10];
          "string" == typeof c10 ? this.headers[a10] = [c10, b10] : Array.isArray(c10) ? c10.push(b10) : this.headers[a10] = b10;
        }
        delete(a10) {
          delete this.headers[a10];
        }
        get(a10) {
          let b10 = this.headers[a10];
          return void 0 !== b10 ? this.merge(b10) : null;
        }
        has(a10) {
          return void 0 !== this.headers[a10];
        }
        set(a10, b10) {
          this.headers[a10] = b10;
        }
        forEach(a10, b10) {
          for (let [c10, d10] of this.entries()) a10.call(b10, d10, c10, this);
        }
        *entries() {
          for (let a10 of Object.keys(this.headers)) {
            let b10 = a10.toLowerCase(), c10 = this.get(b10);
            yield [b10, c10];
          }
        }
        *keys() {
          for (let a10 of Object.keys(this.headers)) {
            let b10 = a10.toLowerCase();
            yield b10;
          }
        }
        *values() {
          for (let a10 of Object.keys(this.headers)) {
            let b10 = this.get(a10);
            yield b10;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      let aQ = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class aR {
        disable() {
          throw aQ;
        }
        getStore() {
        }
        run() {
          throw aQ;
        }
        exit() {
          throw aQ;
        }
        enterWith() {
          throw aQ;
        }
        static bind(a10) {
          return a10;
        }
      }
      let aS = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
      function aT() {
        return aS ? new aS() : new aR();
      }
      let aU = aT();
      class aV extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options");
        }
        static callable() {
          throw new aV();
        }
      }
      class aW {
        static seal(a10) {
          return new Proxy(a10, { get(a11, b10, c10) {
            switch (b10) {
              case "clear":
              case "delete":
              case "set":
                return aV.callable;
              default:
                return aD.get(a11, b10, c10);
            }
          } });
        }
      }
      let aX = /* @__PURE__ */ Symbol.for("next.mutated.cookies");
      class aY {
        static wrap(a10, b10) {
          let c10 = new aA.ResponseCookies(new Headers());
          for (let b11 of a10.getAll()) c10.set(b11);
          let d10 = [], e10 = /* @__PURE__ */ new Set(), f10 = () => {
            let a11 = aU.getStore();
            if (a11 && (a11.pathWasRevalidated = 1), d10 = c10.getAll().filter((a12) => e10.has(a12.name)), b10) {
              let a12 = [];
              for (let b11 of d10) {
                let c11 = new aA.ResponseCookies(new Headers());
                c11.set(b11), a12.push(c11.toString());
              }
              b10(a12);
            }
          }, g2 = new Proxy(c10, { get(a11, b11, c11) {
            switch (b11) {
              case aX:
                return d10;
              case "delete":
                return function(...b12) {
                  e10.add("string" == typeof b12[0] ? b12[0] : b12[0].name);
                  try {
                    return a11.delete(...b12), g2;
                  } finally {
                    f10();
                  }
                };
              case "set":
                return function(...b12) {
                  e10.add("string" == typeof b12[0] ? b12[0] : b12[0].name);
                  try {
                    return a11.set(...b12), g2;
                  } finally {
                    f10();
                  }
                };
              default:
                return aD.get(a11, b11, c11);
            }
          } });
          return g2;
        }
      }
      function aZ(a10, b10) {
        if ("action" !== a10.phase) throw new aV();
      }
      var a$ = ((m = a$ || {}).handleRequest = "BaseServer.handleRequest", m.run = "BaseServer.run", m.pipe = "BaseServer.pipe", m.getStaticHTML = "BaseServer.getStaticHTML", m.render = "BaseServer.render", m.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", m.renderToResponse = "BaseServer.renderToResponse", m.renderToHTML = "BaseServer.renderToHTML", m.renderError = "BaseServer.renderError", m.renderErrorToResponse = "BaseServer.renderErrorToResponse", m.renderErrorToHTML = "BaseServer.renderErrorToHTML", m.render404 = "BaseServer.render404", m), a_ = ((n = a_ || {}).loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", n.loadComponents = "LoadComponents.loadComponents", n), a0 = ((o = a0 || {}).getRequestHandler = "NextServer.getRequestHandler", o.getRequestHandlerWithMetadata = "NextServer.getRequestHandlerWithMetadata", o.getServer = "NextServer.getServer", o.getServerRequestHandler = "NextServer.getServerRequestHandler", o.createServer = "createServer.createServer", o), a1 = ((p = a1 || {}).compression = "NextNodeServer.compression", p.getBuildId = "NextNodeServer.getBuildId", p.createComponentTree = "NextNodeServer.createComponentTree", p.clientComponentLoading = "NextNodeServer.clientComponentLoading", p.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", p.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", p.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", p.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", p.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", p.sendRenderResult = "NextNodeServer.sendRenderResult", p.proxyRequest = "NextNodeServer.proxyRequest", p.runApi = "NextNodeServer.runApi", p.render = "NextNodeServer.render", p.renderHTML = "NextNodeServer.renderHTML", p.imageOptimizer = "NextNodeServer.imageOptimizer", p.getPagePath = "NextNodeServer.getPagePath", p.getRoutesManifest = "NextNodeServer.getRoutesManifest", p.findPageComponents = "NextNodeServer.findPageComponents", p.getFontManifest = "NextNodeServer.getFontManifest", p.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", p.getRequestHandler = "NextNodeServer.getRequestHandler", p.renderToHTML = "NextNodeServer.renderToHTML", p.renderError = "NextNodeServer.renderError", p.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", p.render404 = "NextNodeServer.render404", p.startResponse = "NextNodeServer.startResponse", p.route = "route", p.onProxyReq = "onProxyReq", p.apiResolver = "apiResolver", p.internalFetch = "internalFetch", p), a2 = ((q = a2 || {}).startServer = "startServer.startServer", q), a3 = ((r = a3 || {}).getServerSideProps = "Render.getServerSideProps", r.getStaticProps = "Render.getStaticProps", r.renderToString = "Render.renderToString", r.renderDocument = "Render.renderDocument", r.createBodyResult = "Render.createBodyResult", r), a4 = ((s = a4 || {}).renderToString = "AppRender.renderToString", s.renderToReadableStream = "AppRender.renderToReadableStream", s.getBodyResult = "AppRender.getBodyResult", s.fetch = "AppRender.fetch", s), a5 = ((t = a5 || {}).executeRoute = "Router.executeRoute", t), a6 = ((u = a6 || {}).runHandler = "Node.runHandler", u), a7 = ((v = a7 || {}).runHandler = "AppRouteRouteHandlers.runHandler", v), a8 = ((w = a8 || {}).generateMetadata = "ResolveMetadata.generateMetadata", w.generateViewport = "ResolveMetadata.generateViewport", w), a9 = ((x = a9 || {}).execute = "Middleware.execute", x);
      let ba = /* @__PURE__ */ new Set(["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"]), bb = /* @__PURE__ */ new Set(["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"]);
      function bc(a10) {
        return null !== a10 && "object" == typeof a10 && "then" in a10 && "function" == typeof a10.then;
      }
      let bd = process.env.NEXT_OTEL_PERFORMANCE_PREFIX, { context: be, propagation: bf, trace: bg, SpanStatusCode: bh, SpanKind: bi, ROOT_CONTEXT: bj } = d = c(116);
      class bk extends Error {
        constructor(a10, b10) {
          super(), this.bubble = a10, this.result = b10;
        }
      }
      let bl = (a10, b10) => {
        "object" == typeof b10 && null !== b10 && b10 instanceof bk && b10.bubble ? a10.setAttribute("next.bubble", true) : (b10 && (a10.recordException(b10), a10.setAttribute("error.type", b10.name)), a10.setStatus({ code: bh.ERROR, message: null == b10 ? void 0 : b10.message })), a10.end();
      }, bm = /* @__PURE__ */ new Map(), bn = d.createContextKey("next.rootSpanId"), bo = 0, bp = { set(a10, b10, c10) {
        a10.push({ key: b10, value: c10 });
      } };
      class bq {
        getTracerInstance() {
          return bg.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return be;
        }
        getTracePropagationData() {
          let a10 = be.active(), b10 = [];
          return bf.inject(a10, b10, bp), b10;
        }
        getActiveScopeSpan() {
          return bg.getSpan(null == be ? void 0 : be.active());
        }
        withPropagatedContext(a10, b10, c10, d10 = false) {
          let e10 = be.active();
          if (d10) {
            let d11 = bf.extract(bj, a10, c10);
            if (bg.getSpanContext(d11)) return be.with(d11, b10);
            let f11 = bf.extract(e10, a10, c10);
            return be.with(f11, b10);
          }
          if (bg.getSpanContext(e10)) return b10();
          let f10 = bf.extract(e10, a10, c10);
          return be.with(f10, b10);
        }
        trace(...a10) {
          let [b10, c10, d10] = a10, { fn: e10, options: f10 } = "function" == typeof c10 ? { fn: c10, options: {} } : { fn: d10, options: { ...c10 } }, g2 = f10.spanName ?? b10;
          if (!ba.has(b10) && "1" !== process.env.NEXT_OTEL_VERBOSE || f10.hideSpan) return e10();
          let h2 = this.getSpanContext((null == f10 ? void 0 : f10.parentSpan) ?? this.getActiveScopeSpan());
          h2 || (h2 = (null == be ? void 0 : be.active()) ?? bj);
          let i2 = h2.getValue(bn), j2 = "number" != typeof i2 || !bm.has(i2), k2 = bo++;
          return f10.attributes = { "next.span_name": g2, "next.span_type": b10, ...f10.attributes }, be.with(h2.setValue(bn, k2), () => this.getTracerInstance().startActiveSpan(g2, f10, (a11) => {
            let c11;
            bd && b10 && bb.has(b10) && (c11 = "performance" in globalThis && "measure" in performance ? globalThis.performance.now() : void 0);
            let d11 = false, g3 = () => {
              !d11 && (d11 = true, bm.delete(k2), c11 && performance.measure(`${bd}:next-${(b10.split(".").pop() || "").replace(/[A-Z]/g, (a12) => "-" + a12.toLowerCase())}`, { start: c11, end: performance.now() }));
            };
            if (j2 && bm.set(k2, new Map(Object.entries(f10.attributes ?? {}))), e10.length > 1) try {
              return e10(a11, (b11) => bl(a11, b11));
            } catch (b11) {
              throw bl(a11, b11), b11;
            } finally {
              g3();
            }
            try {
              let b11 = e10(a11);
              if (bc(b11)) return b11.then((b12) => (a11.end(), b12)).catch((b12) => {
                throw bl(a11, b12), b12;
              }).finally(g3);
              return a11.end(), g3(), b11;
            } catch (b11) {
              throw bl(a11, b11), g3(), b11;
            }
          }));
        }
        wrap(...a10) {
          let b10 = this, [c10, d10, e10] = 3 === a10.length ? a10 : [a10[0], {}, a10[1]];
          return ba.has(c10) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let a11 = d10;
            "function" == typeof a11 && "function" == typeof e10 && (a11 = a11.apply(this, arguments));
            let f10 = arguments.length - 1, g2 = arguments[f10];
            if ("function" != typeof g2) return b10.trace(c10, a11, () => e10.apply(this, arguments));
            {
              let d11 = b10.getContext().bind(be.active(), g2);
              return b10.trace(c10, a11, (a12, b11) => (arguments[f10] = function(a13) {
                return null == b11 || b11(a13), d11.apply(this, arguments);
              }, e10.apply(this, arguments)));
            }
          } : e10;
        }
        startSpan(...a10) {
          let [b10, c10] = a10, d10 = this.getSpanContext((null == c10 ? void 0 : c10.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(b10, c10, d10);
        }
        getSpanContext(a10) {
          return a10 ? bg.setSpan(be.active(), a10) : void 0;
        }
        getRootSpanAttributes() {
          let a10 = be.active().getValue(bn);
          return bm.get(a10);
        }
        setRootSpanAttribute(a10, b10) {
          let c10 = be.active().getValue(bn), d10 = bm.get(c10);
          d10 && !d10.has(a10) && d10.set(a10, b10);
        }
        withSpan(a10, b10) {
          let c10 = bg.setSpan(be.active(), a10);
          return be.with(c10, b10);
        }
      }
      let br = (i = new bq(), () => i), bs = "__prerender_bypass";
      class bt {
        constructor(a10, b10, c10, d10) {
          var e10;
          const f10 = a10 && (function(a11, b11) {
            let c11 = aP.from(a11.headers);
            return { isOnDemandRevalidate: c11.get(ab) === b11.previewModeId, revalidateOnlyGenerated: c11.has("x-prerender-revalidate-if-generated") };
          })(b10, a10).isOnDemandRevalidate, g2 = null == (e10 = c10.get(bs)) ? void 0 : e10.value;
          this._isEnabled = !!(!f10 && g2 && a10 && g2 === a10.previewModeId), this._previewModeId = null == a10 ? void 0 : a10.previewModeId, this._mutableCookies = d10;
        }
        get isEnabled() {
          return this._isEnabled;
        }
        enable() {
          if (!this._previewModeId) throw Object.defineProperty(Error("Invariant: previewProps missing previewModeId this should never happen"), "__NEXT_ERROR_CODE", { value: "E93", enumerable: false, configurable: true });
          this._mutableCookies.set({ name: bs, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" }), this._isEnabled = true;
        }
        disable() {
          this._mutableCookies.set({ name: bs, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) }), this._isEnabled = false;
        }
      }
      function bu(a10, b10) {
        if ("x-middleware-set-cookie" in a10.headers && "string" == typeof a10.headers["x-middleware-set-cookie"]) {
          let c10 = a10.headers["x-middleware-set-cookie"], d10 = new Headers();
          for (let a11 of ah(c10)) d10.append("set-cookie", a11);
          for (let a11 of new aA.ResponseCookies(d10).getAll()) b10.set(a11);
        }
      }
      let bv = aT();
      function bw(a10) {
        switch (a10.type) {
          case "prerender":
          case "prerender-runtime":
          case "prerender-ppr":
          case "prerender-client":
          case "validation-client":
            return a10.prerenderResumeDataCache;
          case "request":
            if (a10.prerenderResumeDataCache) return a10.prerenderResumeDataCache;
          case "prerender-legacy":
          case "cache":
          case "private-cache":
          case "unstable-cache":
          case "generate-static-params":
            return null;
          default:
            return a10;
        }
      }
      var bx = c(232), by = c.n(bx);
      class bz extends Error {
        constructor(a10, b10) {
          super(`Invariant: ${a10.endsWith(".") ? a10 : a10 + "."} This is a bug in Next.js.`, b10), this.name = "InvariantError";
        }
      }
      class bA {
        constructor(a10, b10, c10) {
          this.prev = null, this.next = null, this.key = a10, this.data = b10, this.size = c10;
        }
      }
      class bB {
        constructor() {
          this.prev = null, this.next = null;
        }
      }
      class bC {
        constructor(a10, b10, c10) {
          this.cache = /* @__PURE__ */ new Map(), this.totalSize = 0, this.maxSize = a10, this.calculateSize = b10, this.onEvict = c10, this.head = new bB(), this.tail = new bB(), this.head.next = this.tail, this.tail.prev = this.head;
        }
        addToHead(a10) {
          a10.prev = this.head, a10.next = this.head.next, this.head.next.prev = a10, this.head.next = a10;
        }
        removeNode(a10) {
          a10.prev.next = a10.next, a10.next.prev = a10.prev;
        }
        moveToHead(a10) {
          this.removeNode(a10), this.addToHead(a10);
        }
        removeTail() {
          let a10 = this.tail.prev;
          return this.removeNode(a10), a10;
        }
        set(a10, b10) {
          let c10 = (null == this.calculateSize ? void 0 : this.calculateSize.call(this, b10)) ?? 1;
          if (c10 <= 0) throw Object.defineProperty(Error(`LRUCache: calculateSize returned ${c10}, but size must be > 0. Items with size 0 would never be evicted, causing unbounded cache growth.`), "__NEXT_ERROR_CODE", { value: "E1045", enumerable: false, configurable: true });
          if (c10 > this.maxSize) return console.warn("Single item size exceeds maxSize"), false;
          let d10 = this.cache.get(a10);
          if (d10) d10.data = b10, this.totalSize = this.totalSize - d10.size + c10, d10.size = c10, this.moveToHead(d10);
          else {
            let d11 = new bA(a10, b10, c10);
            this.cache.set(a10, d11), this.addToHead(d11), this.totalSize += c10;
          }
          for (; this.totalSize > this.maxSize && this.cache.size > 0; ) {
            let a11 = this.removeTail();
            this.cache.delete(a11.key), this.totalSize -= a11.size, null == this.onEvict || this.onEvict.call(this, a11.key, a11.data);
          }
          return true;
        }
        has(a10) {
          return this.cache.has(a10);
        }
        get(a10) {
          let b10 = this.cache.get(a10);
          if (b10) return this.moveToHead(b10), b10.data;
        }
        *[Symbol.iterator]() {
          let a10 = this.head.next;
          for (; a10 && a10 !== this.tail; ) {
            let b10 = a10;
            yield [b10.key, b10.data], a10 = a10.next;
          }
        }
        remove(a10) {
          let b10 = this.cache.get(a10);
          b10 && (this.removeNode(b10), this.cache.delete(a10), this.totalSize -= b10.size);
        }
        get size() {
          return this.cache.size;
        }
        get currentSize() {
          return this.totalSize;
        }
      }
      let bD = /* @__PURE__ */ new Map(), bE = (a10, b10) => {
        for (let c10 of a10) {
          let a11 = bD.get(c10), d10 = null == a11 ? void 0 : a11.expired;
          if ("number" == typeof d10 && d10 <= Date.now() && d10 > b10) return true;
        }
        return false;
      }, bF = (a10, b10) => {
        for (let c10 of a10) {
          let a11 = bD.get(c10), d10 = (null == a11 ? void 0 : a11.stale) ?? 0;
          if ("number" == typeof d10 && d10 > b10) return true;
        }
        return false;
      };
      c(356).Buffer, process.env.NEXT_PRIVATE_DEBUG_CACHE;
      let bG = /* @__PURE__ */ Symbol.for("@next/cache-handlers-map"), bH = /* @__PURE__ */ Symbol.for("@next/cache-handlers-set"), bI = globalThis;
      function bJ() {
        if (bI[bG]) return bI[bG].entries();
      }
      async function bK(a10, b10) {
        if (!a10) return b10();
        let c10 = bL(a10);
        try {
          return await b10();
        } finally {
          var d10, e10, f10, g2;
          let b11, h2, i2, j2, k2 = (d10 = c10, e10 = bL(a10), b11 = new Set(d10.pendingRevalidatedTags.map((a11) => {
            let b12 = "object" == typeof a11.profile ? JSON.stringify(a11.profile) : a11.profile || "";
            return `${a11.tag}:${b12}`;
          })), h2 = new Set(d10.pendingRevalidateWrites), { pendingRevalidatedTags: e10.pendingRevalidatedTags.filter((a11) => {
            let c11 = "object" == typeof a11.profile ? JSON.stringify(a11.profile) : a11.profile || "";
            return !b11.has(`${a11.tag}:${c11}`);
          }), pendingRevalidates: Object.fromEntries(Object.entries(e10.pendingRevalidates).filter(([a11]) => !(a11 in d10.pendingRevalidates))), pendingRevalidateWrites: e10.pendingRevalidateWrites.filter((a11) => !h2.has(a11)) });
          await (f10 = a10, i2 = [], (j2 = (null == (g2 = k2) ? void 0 : g2.pendingRevalidatedTags) ?? f10.pendingRevalidatedTags ?? []).length > 0 && i2.push(bM(j2, f10.incrementalCache, f10)), i2.push(...Object.values((null == g2 ? void 0 : g2.pendingRevalidates) ?? f10.pendingRevalidates ?? {})), i2.push(...(null == g2 ? void 0 : g2.pendingRevalidateWrites) ?? f10.pendingRevalidateWrites ?? []), 0 !== i2.length && Promise.all(i2).then(() => void 0));
        }
      }
      function bL(a10) {
        return { pendingRevalidatedTags: a10.pendingRevalidatedTags ? [...a10.pendingRevalidatedTags] : [], pendingRevalidates: { ...a10.pendingRevalidates }, pendingRevalidateWrites: a10.pendingRevalidateWrites ? [...a10.pendingRevalidateWrites] : [] };
      }
      async function bM(a10, b10, c10) {
        if (0 === a10.length) return;
        let d10 = (function() {
          if (bI[bH]) return bI[bH].values();
        })(), e10 = [], f10 = /* @__PURE__ */ new Map();
        for (let b11 of a10) {
          let a11, c11 = b11.profile;
          for (let [b12] of f10) if ("string" == typeof b12 && "string" == typeof c11 && b12 === c11 || "object" == typeof b12 && "object" == typeof c11 && JSON.stringify(b12) === JSON.stringify(c11) || b12 === c11) {
            a11 = b12;
            break;
          }
          let d11 = a11 || c11;
          f10.has(d11) || f10.set(d11, []), f10.get(d11).push(b11.tag);
        }
        for (let [a11, h2] of f10) {
          let f11;
          if (a11) {
            let b11;
            if ("object" == typeof a11) b11 = a11;
            else if ("string" == typeof a11) {
              var g2;
              if (!(b11 = null == c10 || null == (g2 = c10.cacheLifeProfiles) ? void 0 : g2[a11])) throw Object.defineProperty(Error(`Invalid profile provided "${a11}" must be configured under cacheLife in next.config or be "max"`), "__NEXT_ERROR_CODE", { value: "E873", enumerable: false, configurable: true });
            }
            b11 && (f11 = { expire: b11.expire });
          }
          for (let b11 of d10 || []) a11 ? e10.push(null == b11.updateTags ? void 0 : b11.updateTags.call(b11, h2, f11)) : e10.push(null == b11.updateTags ? void 0 : b11.updateTags.call(b11, h2));
          b10 && e10.push(b10.revalidateTag(h2, f11));
        }
        await Promise.all(e10);
      }
      let bN = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class bO {
        disable() {
          throw bN;
        }
        getStore() {
        }
        run() {
          throw bN;
        }
        exit() {
          throw bN;
        }
        enterWith() {
          throw bN;
        }
        static bind(a10) {
          return a10;
        }
      }
      let bP = "u" > typeof globalThis && globalThis.AsyncLocalStorage, bQ = bP ? new bP() : new bO();
      class bR {
        constructor({ waitUntil: a10, onClose: b10, onTaskError: c10 }) {
          this.workUnitStores = /* @__PURE__ */ new Set(), this.waitUntil = a10, this.onClose = b10, this.onTaskError = c10, this.callbackQueue = new (by())(), this.callbackQueue.pause();
        }
        after(a10) {
          if (bc(a10)) this.waitUntil || bS(), this.waitUntil(a10.catch((a11) => this.reportTaskError("promise", a11)));
          else if ("function" == typeof a10) this.addCallback(a10);
          else throw Object.defineProperty(Error("`after()`: Argument must be a promise or a function"), "__NEXT_ERROR_CODE", { value: "E50", enumerable: false, configurable: true });
        }
        addCallback(a10) {
          var b10;
          this.waitUntil || bS();
          let c10 = bv.getStore();
          c10 && this.workUnitStores.add(c10);
          let d10 = bQ.getStore(), e10 = d10 ? d10.rootTaskSpawnPhase : null == c10 ? void 0 : c10.phase;
          this.runCallbacksOnClosePromise || (this.runCallbacksOnClosePromise = this.runCallbacksOnClose(), this.waitUntil(this.runCallbacksOnClosePromise));
          let f10 = (b10 = async () => {
            try {
              await bQ.run({ rootTaskSpawnPhase: e10 }, () => a10());
            } catch (a11) {
              this.reportTaskError("function", a11);
            }
          }, bP ? bP.bind(b10) : bO.bind(b10));
          this.callbackQueue.add(f10);
        }
        async runCallbacksOnClose() {
          return await new Promise((a10) => this.onClose(a10)), this.runCallbacks();
        }
        async runCallbacks() {
          if (0 === this.callbackQueue.size) return;
          for (let a11 of this.workUnitStores) a11.phase = "after";
          let a10 = aU.getStore();
          if (!a10) throw Object.defineProperty(new bz("Missing workStore in AfterContext.runCallbacks"), "__NEXT_ERROR_CODE", { value: "E547", enumerable: false, configurable: true });
          return bK(a10, () => (this.callbackQueue.start(), this.callbackQueue.onIdle()));
        }
        reportTaskError(a10, b10) {
          if (console.error("promise" === a10 ? "A promise passed to `after()` rejected:" : "An error occurred in a function passed to `after()`:", b10), this.onTaskError) try {
            null == this.onTaskError || this.onTaskError.call(this, b10);
          } catch (a11) {
            console.error(Object.defineProperty(new bz("`onTaskError` threw while handling an error thrown from an `after` task", { cause: a11 }), "__NEXT_ERROR_CODE", { value: "E569", enumerable: false, configurable: true }));
          }
        }
      }
      function bS() {
        throw Object.defineProperty(Error("`after()` will not work correctly, because `waitUntil` is not available in the current environment."), "__NEXT_ERROR_CODE", { value: "E91", enumerable: false, configurable: true });
      }
      function bT(a10) {
        let b10, c10 = { then: (d10, e10) => (b10 || (b10 = Promise.resolve(a10())), b10.then((a11) => {
          c10.value = a11;
        }).catch(() => {
        }), b10.then(d10, e10)) };
        return c10;
      }
      class bU {
        onClose(a10) {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot subscribe to a closed CloseController"), "__NEXT_ERROR_CODE", { value: "E365", enumerable: false, configurable: true });
          this.target.addEventListener("close", a10), this.listeners++;
        }
        dispatchClose() {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot close a CloseController multiple times"), "__NEXT_ERROR_CODE", { value: "E229", enumerable: false, configurable: true });
          this.listeners > 0 && this.target.dispatchEvent(new Event("close")), this.isClosed = true;
        }
        constructor() {
          this.target = new EventTarget(), this.listeners = 0, this.isClosed = false;
        }
      }
      function bV() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID || "", previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      let bW = /* @__PURE__ */ Symbol.for("@next/request-context");
      async function bX(a10, b10, c10) {
        let d10 = /* @__PURE__ */ new Set();
        for (let b11 of ((a11) => {
          let b12 = ["/layout"];
          if (a11.startsWith("/")) {
            let c11 = a11.split("/");
            for (let a12 = 1; a12 < c11.length + 1; a12++) {
              let d11 = c11.slice(0, a12).join("/");
              d11 && (d11.endsWith("/page") || d11.endsWith("/route") || (d11 = `${d11}${!d11.endsWith("/") ? "/" : ""}layout`), b12.push(d11));
            }
          }
          return b12;
        })(a10)) b11 = `${af}${b11}`, d10.add(b11);
        if (b10 && true) {
          let a11 = `${af}${b10}`;
          d10.add(a11);
        }
        d10.has(`${af}/`) && d10.add(`${af}/index`), d10.has(`${af}/index`) && d10.add(`${af}/`);
        let e10 = Array.from(d10);
        return { tags: e10, expirationsByCacheKind: (function(a11) {
          let b11 = /* @__PURE__ */ new Map(), c11 = bJ();
          if (c11) for (let [d11, e11] of c11) "getExpiration" in e11 && b11.set(d11, bT(async () => e11.getExpiration(a11)));
          return b11;
        })(e10) };
      }
      let bY = /* @__PURE__ */ Symbol.for("NextInternalRequestMeta");
      class bZ extends aC {
        constructor(a10) {
          super(a10.input, a10.init), this.sourcePage = a10.page;
        }
        get request() {
          throw Object.defineProperty(new $({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new $({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        waitUntil() {
          throw Object.defineProperty(new $({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      let b$ = { keys: (a10) => Array.from(a10.keys()), get: (a10, b10) => a10.get(b10) ?? void 0 }, b_ = (a10, b10) => br().withPropagatedContext(a10.headers, b10, b$), b0 = false;
      async function b1(a10) {
        var b10, d10, e10, f10, g2;
        let h2, i2, j2, k2, l2;
        !(function() {
          if (!b0 && (b0 = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
            let { interceptTestApis: a11, wrapRequestHandler: b11 } = c(987);
            a11(), b_ = b11(b_);
          }
        })(), await Y();
        let m2 = void 0 !== globalThis.__BUILD_MANIFEST;
        a10.request.url = a10.request.url.replace(/\.rsc($|\?)/, "$1");
        let n2 = a10.bypassNextUrl ? new URL(a10.request.url) : new az(a10.request.url, { headers: a10.request.headers, nextConfig: a10.request.nextConfig });
        for (let a11 of [...n2.searchParams.keys()]) {
          let b11 = n2.searchParams.getAll(a11), c10 = (function(a12) {
            for (let b12 of ["nxtP", "nxtI"]) if (a12 !== b12 && a12.startsWith(b12)) return a12.substring(b12.length);
            return null;
          })(a11);
          if (c10) {
            for (let a12 of (n2.searchParams.delete(c10), b11)) n2.searchParams.append(c10, a12);
            n2.searchParams.delete(a11);
          }
        }
        let o2 = process.env.__NEXT_BUILD_ID || "";
        "buildId" in n2 && (o2 = n2.buildId || "", n2.buildId = "");
        let p2 = (function(a11) {
          let b11 = new Headers();
          for (let [c10, d11] of Object.entries(a11)) for (let a12 of Array.isArray(d11) ? d11 : [d11]) void 0 !== a12 && ("number" == typeof a12 && (a12 = a12.toString()), b11.append(c10, a12));
          return b11;
        })(a10.request.headers), q2 = p2.has("x-nextjs-data"), r2 = "1" === p2.get("rsc");
        q2 && "/index" === n2.pathname && (n2.pathname = "/");
        let s2 = /* @__PURE__ */ new Map();
        if (!m2) for (let a11 of aK) {
          let b11 = p2.get(a11);
          null !== b11 && (s2.set(a11, b11), p2.delete(a11));
        }
        let t2 = n2.searchParams.get(aL), u2 = new bZ({ page: a10.page, input: ((k2 = (j2 = "string" == typeof n2) ? new URL(n2) : n2).searchParams.delete(aL), j2 ? k2.toString() : k2).toString(), init: { body: a10.request.body, headers: p2, method: a10.request.method, nextConfig: a10.request.nextConfig, signal: a10.request.signal } });
        a10.request.requestMeta && (g2 = a10.request.requestMeta, u2[bY] = g2), q2 && Object.defineProperty(u2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCacheShared && a10.IncrementalCache && (globalThis.__incrementalCache = new a10.IncrementalCache({ CurCacheHandler: a10.incrementalCacheHandler, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: a10.request.headers, getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: bV() }) }));
        let v2 = a10.request.waitUntil ?? (null == (b10 = null == (l2 = globalThis[bW]) ? void 0 : l2.get()) ? void 0 : b10.waitUntil), w2 = new ao({ request: u2, page: a10.page, context: v2 ? { waitUntil: v2 } : void 0 });
        if ((h2 = await b_(u2, () => {
          if ("/middleware" === a10.page || "/src/middleware" === a10.page || "/proxy" === a10.page || "/src/proxy" === a10.page) {
            let b11 = w2.waitUntil.bind(w2), c10 = new bU();
            return br().trace(a9.execute, { spanName: `middleware ${u2.method}`, attributes: { "http.target": u2.nextUrl.pathname, "http.method": u2.method } }, async () => {
              try {
                var d11, e11, f11, g3, h3, j3;
                let k3 = bV(), l3 = await bX("/", u2.nextUrl.pathname, null), m3 = (h3 = u2.nextUrl, j3 = (a11) => {
                  i2 = a11;
                }, (function(a11, b12, c11, d12, e12, f12, g4, h4, i3, j4) {
                  function k4(a12) {
                    c11 && c11.setHeader("Set-Cookie", a12);
                  }
                  let l4 = {};
                  return { type: "request", phase: a11, implicitTags: f12, url: { pathname: d12.pathname, search: d12.search ?? "" }, rootParams: e12, get headers() {
                    return l4.headers || (l4.headers = (function(a12) {
                      let b13 = aP.from(a12);
                      for (let a13 of aK) b13.delete(a13);
                      return aP.seal(b13);
                    })(b12.headers)), l4.headers;
                  }, get cookies() {
                    if (!l4.cookies) {
                      let a12 = new aA.RequestCookies(aP.from(b12.headers));
                      bu(b12, a12), l4.cookies = aW.seal(a12);
                    }
                    return l4.cookies;
                  }, set cookies(value) {
                    l4.cookies = value;
                  }, get mutableCookies() {
                    if (!l4.mutableCookies) {
                      var m4, n4;
                      let a12, d13 = (m4 = b12.headers, n4 = g4 || (c11 ? k4 : void 0), a12 = new aA.RequestCookies(aP.from(m4)), aY.wrap(a12, n4));
                      bu(b12, d13), l4.mutableCookies = d13;
                    }
                    return l4.mutableCookies;
                  }, get userspaceMutableCookies() {
                    if (!l4.userspaceMutableCookies) {
                      var o3;
                      let a12;
                      o3 = this, l4.userspaceMutableCookies = a12 = new Proxy(o3.mutableCookies, { get(b13, c12, d13) {
                        switch (c12) {
                          case "delete":
                            return function(...c13) {
                              return aZ(o3, "cookies().delete"), b13.delete(...c13), a12;
                            };
                          case "set":
                            return function(...c13) {
                              return aZ(o3, "cookies().set"), b13.set(...c13), a12;
                            };
                          default:
                            return aD.get(b13, c12, d13);
                        }
                      } });
                    }
                    return l4.userspaceMutableCookies;
                  }, get draftMode() {
                    return l4.draftMode || (l4.draftMode = new bt(h4, b12, this.cookies, this.mutableCookies)), l4.draftMode;
                  }, renderResumeDataCache: null, isHmrRefresh: i3, serverComponentsHmrCache: j4 || globalThis.__serverComponentsHmrCache, fallbackParams: null };
                })("action", u2, void 0, h3, {}, l3, j3, k3, false, void 0)), n3 = (function({ page: a11, renderOpts: b12, isPrefetchRequest: c11, buildId: d12, deploymentId: e12, previouslyRevalidatedTags: f12, nonce: g4 }) {
                  let h4 = !b12.shouldWaitOnAllReady && !b12.supportsDynamicResponse && !b12.isDraftMode && !b12.isPossibleServerAction, i3 = h4 && (!!process.env.NEXT_DEBUG_BUILD || "1" === process.env.NEXT_SSG_FETCH_METRICS), j4 = { isStaticGeneration: h4, page: a11, route: aN(a11), incrementalCache: b12.incrementalCache || globalThis.__incrementalCache, cacheLifeProfiles: b12.cacheLifeProfiles, isBuildTimePrerendering: b12.isBuildTimePrerendering, fetchCache: b12.fetchCache, isOnDemandRevalidate: b12.isOnDemandRevalidate, isDraftMode: b12.isDraftMode, isPrefetchRequest: c11, buildId: d12, deploymentId: e12, reactLoadableManifest: (null == b12 ? void 0 : b12.reactLoadableManifest) || {}, assetPrefix: (null == b12 ? void 0 : b12.assetPrefix) || "", nonce: g4, afterContext: (function(a12) {
                    let { waitUntil: b13, onClose: c12, onAfterTaskError: d13 } = a12;
                    return new bR({ waitUntil: b13, onClose: c12, onTaskError: d13 });
                  })(b12), cacheComponentsEnabled: b12.cacheComponents, previouslyRevalidatedTags: f12, refreshTagsByCacheKind: (function() {
                    let a12 = /* @__PURE__ */ new Map(), b13 = bJ();
                    if (b13) for (let [c12, d13] of b13) "refreshTags" in d13 && a12.set(c12, bT(async () => d13.refreshTags()));
                    return a12;
                  })(), runInCleanSnapshot: bP ? bP.snapshot() : function(a12, ...b13) {
                    return a12(...b13);
                  }, shouldTrackFetchMetrics: i3, reactServerErrorsByDigest: /* @__PURE__ */ new Map() };
                  return b12.store = j4, j4;
                })({ page: "/", renderOpts: { cacheLifeProfiles: null == (e11 = a10.request.nextConfig) || null == (d11 = e11.experimental) ? void 0 : d11.cacheLife, cacheComponents: false, experimental: { isRoutePPREnabled: false, authInterrupts: !!(null == (g3 = a10.request.nextConfig) || null == (f11 = g3.experimental) ? void 0 : f11.authInterrupts) }, supportsDynamicResponse: true, waitUntil: b11, onClose: c10.onClose.bind(c10), onAfterTaskError: void 0 }, isPrefetchRequest: "1" === u2.headers.get(aJ), buildId: o2 ?? "", deploymentId: false, previouslyRevalidatedTags: [] });
                return await aU.run(n3, () => bv.run(m3, a10.handler, u2, w2));
              } finally {
                setTimeout(() => {
                  c10.dispatchClose();
                }, 0);
              }
            });
          }
          return a10.handler(u2, w2);
        })) && !(h2 instanceof Response)) throw Object.defineProperty(TypeError("Expected an instance of Response to be returned"), "__NEXT_ERROR_CODE", { value: "E567", enumerable: false, configurable: true });
        h2 && i2 && h2.headers.set("set-cookie", i2);
        let x2 = null == h2 ? void 0 : h2.headers.get("x-middleware-rewrite");
        if (h2 && x2 && (r2 || !m2)) {
          let b11 = new az(x2, { forceLocale: true, headers: a10.request.headers, nextConfig: a10.request.nextConfig });
          m2 || b11.host !== u2.nextUrl.host || (b11.buildId = o2 || b11.buildId, h2.headers.set("x-middleware-rewrite", String(b11)));
          let { url: c10, isRelative: g3 } = aI(b11.toString(), n2.toString());
          !m2 && q2 && h2.headers.set("x-nextjs-rewrite", c10);
          let i3 = !g3 && (null == (f10 = a10.request.nextConfig) || null == (e10 = f10.experimental) || null == (d10 = e10.clientParamParsingOrigins) ? void 0 : d10.some((a11) => new RegExp(a11).test(b11.origin)));
          r2 && (g3 || i3) && (n2.pathname !== b11.pathname && h2.headers.set("x-nextjs-rewritten-path", b11.pathname), n2.search !== b11.search && h2.headers.set("x-nextjs-rewritten-query", b11.search.slice(1)));
        }
        if (h2 && x2 && r2 && t2) {
          let a11 = new URL(x2);
          a11.searchParams.has(aL) || (a11.searchParams.set(aL, t2), h2.headers.set("x-middleware-rewrite", a11.toString()));
        }
        let y2 = null == h2 ? void 0 : h2.headers.get("Location");
        if (h2 && y2 && !m2) {
          let b11 = new az(y2, { forceLocale: false, headers: a10.request.headers, nextConfig: a10.request.nextConfig });
          h2 = new Response(h2.body, h2), b11.host === n2.host && (b11.buildId = o2 || b11.buildId, h2.headers.set("Location", aI(b11, n2).url)), q2 && (h2.headers.delete("Location"), h2.headers.set("x-nextjs-redirect", aI(b11.toString(), n2.toString()).url));
        }
        let z2 = h2 || aH.next(), A2 = z2.headers.get("x-middleware-override-headers"), B2 = [];
        if (A2) {
          for (let [a11, b11] of s2) z2.headers.set(`x-middleware-request-${a11}`, b11), B2.push(a11);
          B2.length > 0 && z2.headers.set("x-middleware-override-headers", A2 + "," + B2.join(","));
        }
        return { response: z2, waitUntil: ("internal" === w2[am].kind ? Promise.all(w2[am].promises).then(() => {
        }) : void 0) ?? Promise.resolve(), fetchMetrics: u2.fetchMetrics };
      }
      let { env: b2, stdout: b3 } = (null == (L = globalThis) ? void 0 : L.process) ?? {}, b4 = b2 && !b2.NO_COLOR && (b2.FORCE_COLOR || (null == b3 ? void 0 : b3.isTTY) && !b2.CI && "dumb" !== b2.TERM), b5 = (a10, b10, c10, d10) => {
        let e10 = a10.substring(0, d10) + c10, f10 = a10.substring(d10 + b10.length), g2 = f10.indexOf(b10);
        return ~g2 ? e10 + b5(f10, b10, c10, g2) : e10 + f10;
      }, b6 = (a10, b10, c10 = a10) => b4 ? (d10) => {
        let e10 = "" + d10, f10 = e10.indexOf(b10, a10.length);
        return ~f10 ? a10 + b5(e10, b10, c10, f10) + b10 : a10 + e10 + b10;
      } : String, b7 = b6("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m");
      let b8 = b6("\x1B[31m", "\x1B[39m"), b9 = b6("\x1B[32m", "\x1B[39m"), ca = b6("\x1B[33m", "\x1B[39m");
      let cb = b6("\x1B[35m", "\x1B[39m");
      let cc = b6("\x1B[37m", "\x1B[39m");
      cc(b7("○")), b8(b7("⨯")), ca(b7("⚠")), cc(b7(" ")), b9(b7("✓")), cb(b7("»")), new bC(1e4, (a10) => a10.length), new bC(1e4, (a10) => a10.length);
      var cd = ((y = {}).APP_PAGE = "APP_PAGE", y.APP_ROUTE = "APP_ROUTE", y.PAGES = "PAGES", y.FETCH = "FETCH", y.REDIRECT = "REDIRECT", y.IMAGE = "IMAGE", y), ce = ((z = {}).APP_PAGE = "APP_PAGE", z.APP_ROUTE = "APP_ROUTE", z.PAGES = "PAGES", z.FETCH = "FETCH", z.IMAGE = "IMAGE", z);
      function cf() {
      }
      c(356).Buffer, new TextEncoder(), c(356).Buffer;
      let cg = new TextEncoder();
      function ch(a10) {
        return new ReadableStream({ start(b10) {
          b10.enqueue(cg.encode(a10)), b10.close();
        } });
      }
      function ci(a10) {
        return new ReadableStream({ start(b10) {
          b10.enqueue(a10), b10.close();
        } });
      }
      async function cj(a10, b10) {
        let c10 = new TextDecoder("utf-8", { fatal: true }), d10 = "";
        for await (let e10 of a10) {
          d10 += c10.decode(e10, { stream: true });
        }
        return d10 + c10.decode();
      }
      let ck = "ResponseAborted";
      class cl extends Error {
        constructor(...a10) {
          super(...a10), this.name = ck;
        }
      }
      class cm {
        constructor() {
          let a10, b10;
          this.promise = new Promise((c10, d10) => {
            a10 = c10, b10 = d10;
          }), this.resolve = a10, this.reject = b10;
        }
      }
      let cn = 0, co = 0, cp = 0;
      function cq(a10) {
        return (null == a10 ? void 0 : a10.name) === "AbortError" || (null == a10 ? void 0 : a10.name) === ck;
      }
      async function cr(a10, b10, c10) {
        try {
          let d10, { errored: e10, destroyed: f10 } = b10;
          if (e10 || f10) return;
          let g2 = (d10 = new AbortController(), b10.once("close", () => {
            b10.writableFinished || d10.abort(new cl());
          }), d10), h2 = (function(a11, b11) {
            let c11 = false, d11 = new cm();
            function e11() {
              d11.resolve();
            }
            a11.on("drain", e11), a11.once("close", () => {
              a11.off("drain", e11), d11.resolve();
            });
            let f11 = new cm();
            return a11.once("finish", () => {
              f11.resolve();
            }), new WritableStream({ write: async (b12) => {
              if (!c11) {
                if (c11 = true, "performance" in globalThis && process.env.NEXT_OTEL_PERFORMANCE_PREFIX) {
                  let a12 = (function(a13 = {}) {
                    let b13 = 0 === cn ? void 0 : { clientComponentLoadStart: cn, clientComponentLoadTimes: co, clientComponentLoadCount: cp };
                    return a13.reset && (cn = 0, co = 0, cp = 0), b13;
                  })();
                  a12 && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-client-component-loading`, { start: a12.clientComponentLoadStart, end: a12.clientComponentLoadStart + a12.clientComponentLoadTimes });
                }
                a11.flushHeaders(), br().trace(a1.startResponse, { spanName: "start response" }, () => void 0);
              }
              try {
                let c12 = a11.write(b12);
                "flush" in a11 && "function" == typeof a11.flush && a11.flush(), c12 || (await d11.promise, d11 = new cm());
              } catch (b13) {
                throw a11.end(), Object.defineProperty(Error("failed to write chunk to response", { cause: b13 }), "__NEXT_ERROR_CODE", { value: "E321", enumerable: false, configurable: true });
              }
            }, abort: (b12) => {
              a11.writableFinished || a11.destroy(b12);
            }, close: async () => {
              if (b11 && await b11, !a11.writableFinished) return a11.end(), f11.promise;
            } });
          })(b10, c10);
          await a10.pipeTo(h2, { signal: g2.signal });
        } catch (a11) {
          if (cq(a11)) return;
          throw Object.defineProperty(Error("failed to pipe response", { cause: a11 }), "__NEXT_ERROR_CODE", { value: "E180", enumerable: false, configurable: true });
        }
      }
      var cs = c(356).Buffer;
      class ct {
        static #a = this.EMPTY = new ct(null, { metadata: {}, contentType: null });
        static fromStatic(a10, b10) {
          return new ct(a10, { metadata: {}, contentType: b10 });
        }
        constructor(a10, { contentType: b10, waitUntil: c10, metadata: d10 }) {
          this.response = a10, this.contentType = b10, this.metadata = d10, this.waitUntil = c10;
        }
        assignMetadata(a10) {
          Object.assign(this.metadata, a10);
        }
        get isNull() {
          return null === this.response;
        }
        get isDynamic() {
          return "string" != typeof this.response;
        }
        toUnchunkedString(a10 = false) {
          if (null === this.response) return "";
          if ("string" != typeof this.response) {
            if (!a10) throw Object.defineProperty(new bz("dynamic responses cannot be unchunked. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E732", enumerable: false, configurable: true });
            return cj(this.readable);
          }
          return this.response;
        }
        get readable() {
          return null === this.response ? new ReadableStream({ start(a10) {
            a10.close();
          } }) : "string" == typeof this.response ? ch(this.response) : cs.isBuffer(this.response) ? ci(this.response) : Array.isArray(this.response) ? (function(...a10) {
            if (0 === a10.length) return new ReadableStream({ start(a11) {
              a11.close();
            } });
            if (1 === a10.length) return a10[0];
            let { readable: b10, writable: c10 } = new TransformStream(), d10 = a10[0].pipeTo(c10, { preventClose: true }), e10 = 1;
            for (; e10 < a10.length - 1; e10++) {
              let b11 = a10[e10];
              d10 = d10.then(() => b11.pipeTo(c10, { preventClose: true }));
            }
            let f10 = a10[e10];
            return (d10 = d10.then(() => f10.pipeTo(c10))).catch(cf), b10;
          })(...this.response) : this.response;
        }
        coerce() {
          return null === this.response ? [] : "string" == typeof this.response ? [ch(this.response)] : Array.isArray(this.response) ? this.response : cs.isBuffer(this.response) ? [ci(this.response)] : [this.response];
        }
        pipeThrough(a10) {
          this.response = this.readable.pipeThrough(a10);
        }
        unshift(a10) {
          this.response = this.coerce(), this.response.unshift(a10);
        }
        push(a10) {
          this.response = this.coerce(), this.response.push(a10);
        }
        async pipeTo(a10) {
          try {
            await this.readable.pipeTo(a10, { preventClose: true }), this.waitUntil && await this.waitUntil, await a10.close();
          } catch (b10) {
            if (cq(b10)) return void await a10.abort(b10);
            throw b10;
          }
        }
        async pipeToNodeResponse(a10) {
          await cr(this.readable, a10, this.waitUntil);
        }
      }
      function cu(a10, b10) {
        if (!a10) return b10;
        let c10 = parseInt(a10, 10);
        return Number.isFinite(c10) && c10 > 0 ? c10 : b10;
      }
      cu(process.env.NEXT_PRIVATE_RESPONSE_CACHE_TTL, 1e4), cu(process.env.NEXT_PRIVATE_RESPONSE_CACHE_MAX_SIZE, 150);
      var cv = c(654), cw = c.n(cv);
      class cx {
        constructor(a10) {
          this.fs = a10, this.tasks = [];
        }
        findOrCreateTask(a10) {
          for (let b11 of this.tasks) if (b11[0] === a10) return b11;
          let b10 = this.fs.mkdir(a10);
          b10.catch(() => {
          });
          let c10 = [a10, b10, []];
          return this.tasks.push(c10), c10;
        }
        append(a10, b10) {
          let c10 = this.findOrCreateTask(cw().dirname(a10)), d10 = c10[1].then(() => this.fs.writeFile(a10, b10));
          d10.catch(() => {
          }), c10[2].push(d10);
        }
        wait() {
          return Promise.all(this.tasks.flatMap((a10) => a10[2]));
        }
      }
      function cy(a10) {
        return (null == a10 ? void 0 : a10.length) || 0;
      }
      class cz {
        static #a = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor(a10) {
          this.fs = a10.fs, this.flushToDisk = a10.flushToDisk, this.serverDistDir = a10.serverDistDir, this.revalidatedTags = a10.revalidatedTags, a10.maxMemoryCacheSize ? cz.memoryCache ? cz.debug && console.log("FileSystemCache: memory store already initialized") : (cz.debug && console.log("FileSystemCache: using memory store for fetch cache"), cz.memoryCache = (function(a11) {
            return e || (e = new bC(a11, function({ value: a12 }) {
              var b10, c10;
              if (!a12) return 25;
              if (a12.kind === cd.REDIRECT) return JSON.stringify(a12.props).length;
              if (a12.kind === cd.IMAGE) throw Object.defineProperty(Error("invariant image should not be incremental-cache"), "__NEXT_ERROR_CODE", { value: "E501", enumerable: false, configurable: true });
              if (a12.kind === cd.FETCH) return JSON.stringify(a12.data || "").length;
              if (a12.kind === cd.APP_ROUTE) return a12.body.length;
              return a12.kind === cd.APP_PAGE ? Math.max(1, a12.html.length + cy(a12.rscData) + ((null == (c10 = a12.postponed) ? void 0 : c10.length) || 0) + (function(a13) {
                if (!a13) return 0;
                let b11 = 0;
                for (let [c11, d10] of a13) b11 += c11.length + cy(d10);
                return b11;
              })(a12.segmentData)) : a12.html.length + ((null == (b10 = JSON.stringify(a12.pageData)) ? void 0 : b10.length) || 0);
            })), e;
          })(a10.maxMemoryCacheSize)) : cz.debug && console.log("FileSystemCache: not using memory store for fetch cache");
        }
        resetRequestCache() {
        }
        async revalidateTag(a10, b10) {
          if (a10 = "string" == typeof a10 ? [a10] : a10, cz.debug && console.log("FileSystemCache: revalidateTag", a10, b10), 0 === a10.length) return;
          let c10 = Date.now();
          for (let d10 of a10) {
            let a11 = bD.get(d10) || {};
            if (b10) {
              let e10 = { ...a11 };
              e10.stale = c10, void 0 !== b10.expire && (e10.expired = c10 + 1e3 * b10.expire), bD.set(d10, e10);
            } else bD.set(d10, { ...a11, expired: c10 });
          }
        }
        async get(...a10) {
          var b10, c10, d10, e10, f10, g2;
          let [h2, i2] = a10, { kind: j2 } = i2, k2 = null == (b10 = cz.memoryCache) ? void 0 : b10.get(h2);
          if (cz.debug && (j2 === ce.FETCH ? console.log("FileSystemCache: get", h2, i2.tags, j2, !!k2) : console.log("FileSystemCache: get", h2, j2, !!k2)), (null == k2 || null == (c10 = k2.value) ? void 0 : c10.kind) === cd.APP_PAGE || (null == k2 || null == (d10 = k2.value) ? void 0 : d10.kind) === cd.APP_ROUTE || (null == k2 || null == (e10 = k2.value) ? void 0 : e10.kind) === cd.PAGES) {
            let a11 = null == (g2 = k2.value.headers) ? void 0 : g2[ad];
            if ("string" == typeof a11) {
              let b11 = a11.split(",");
              if (b11.length > 0 && bE(b11, k2.lastModified)) return cz.debug && console.log("FileSystemCache: expired tags", b11), null;
            }
          } else if ((null == k2 || null == (f10 = k2.value) ? void 0 : f10.kind) === cd.FETCH) {
            let a11 = i2.kind === ce.FETCH ? [...i2.tags || [], ...i2.softTags || []] : [];
            if (a11.some((a12) => this.revalidatedTags.includes(a12))) return cz.debug && console.log("FileSystemCache: was revalidated", a11), null;
            if (bE(a11, k2.lastModified)) return cz.debug && console.log("FileSystemCache: expired tags", a11), null;
          }
          return k2 ?? null;
        }
        async set(a10, b10, c10) {
          var d10;
          if (null == (d10 = cz.memoryCache) || d10.set(a10, { value: b10, lastModified: Date.now() }), cz.debug && console.log("FileSystemCache: set", a10), !this.flushToDisk || !b10) return;
          let e10 = new cx(this.fs);
          if (b10.kind === cd.APP_ROUTE) {
            let c11 = this.getFilePath(`${a10}.body`, ce.APP_ROUTE);
            e10.append(c11, b10.body);
            let d11 = { headers: b10.headers, status: b10.status, postponed: void 0, segmentPaths: void 0, prefetchHints: void 0 };
            e10.append(c11.replace(/\.body$/, ac), JSON.stringify(d11, null, 2));
          } else if (b10.kind === cd.PAGES || b10.kind === cd.APP_PAGE) {
            let d11 = b10.kind === cd.APP_PAGE, f10 = this.getFilePath(`${a10}.html`, d11 ? ce.APP_PAGE : ce.PAGES);
            if (e10.append(f10, b10.html), c10.fetchCache || c10.isFallback || c10.isRoutePPREnabled || e10.append(this.getFilePath(`${a10}${d11 ? ".rsc" : ".json"}`, d11 ? ce.APP_PAGE : ce.PAGES), d11 ? b10.rscData : JSON.stringify(b10.pageData)), (null == b10 ? void 0 : b10.kind) === cd.APP_PAGE) {
              let a11;
              if (b10.segmentData) {
                a11 = [];
                let c12 = f10.replace(/\.html$/, ".segments");
                for (let [d12, f11] of b10.segmentData) {
                  a11.push(d12);
                  let b11 = c12 + d12 + ".segment.rsc";
                  e10.append(b11, f11);
                }
              }
              let c11 = { headers: b10.headers, status: b10.status, postponed: b10.postponed, segmentPaths: a11, prefetchHints: void 0 };
              e10.append(f10.replace(/\.html$/, ac), JSON.stringify(c11));
            }
          } else if (b10.kind === cd.FETCH) {
            let d11 = this.getFilePath(a10, ce.FETCH);
            e10.append(d11, JSON.stringify({ ...b10, tags: c10.fetchCache ? c10.tags : [] }));
          }
          await e10.wait();
        }
        getFilePath(a10, b10) {
          switch (b10) {
            case ce.FETCH:
              return cw().join(this.serverDistDir, "..", "cache", "fetch-cache", a10);
            case ce.PAGES:
              return cw().join(this.serverDistDir, "pages", a10);
            case ce.IMAGE:
            case ce.APP_PAGE:
            case ce.APP_ROUTE:
              return cw().join(this.serverDistDir, "app", a10);
            default:
              throw Object.defineProperty(Error(`Unexpected file path kind: ${b10}`), "__NEXT_ERROR_CODE", { value: "E479", enumerable: false, configurable: true });
          }
        }
      }
      let cA = ["(..)(..)", "(.)", "(..)", "(...)"], cB = /\/[^/]*\[[^/]+\][^/]*(?=\/|$)/, cC = /\/\[[^/]+\](?=\/|$)/;
      function cD(a10) {
        return a10.replace(/(?:\/index)?\/?$/, "") || "/";
      }
      class cE {
        static #a = this.cacheControls = /* @__PURE__ */ new Map();
        constructor(a10) {
          this.prerenderManifest = a10;
        }
        get(a10) {
          let b10 = cE.cacheControls.get(a10);
          if (b10) return b10;
          let c10 = this.prerenderManifest.routes[a10];
          if (c10) {
            let { initialRevalidateSeconds: a11, initialExpireSeconds: b11 } = c10;
            if (void 0 !== a11) return { revalidate: a11, expire: b11 };
          }
          let d10 = this.prerenderManifest.dynamicRoutes[a10];
          if (d10) {
            let { fallbackRevalidate: a11, fallbackExpire: b11 } = d10;
            if (void 0 !== a11) return { revalidate: a11, expire: b11 };
          }
        }
        set(a10, b10) {
          cE.cacheControls.set(a10, b10);
        }
        clear() {
          cE.cacheControls.clear();
        }
      }
      c(259);
      class cF {
        static #a = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor({ fs: a10, dev: b10, flushToDisk: c10, minimalMode: d10, serverDistDir: e10, requestHeaders: f10, maxMemoryCacheSize: g2, getPrerenderManifest: h2, fetchCacheKeyPrefix: i2, CurCacheHandler: j2, allowedRevalidateHeaderKeys: k2 }) {
          var l2, m2, n2, o2;
          this.locks = /* @__PURE__ */ new Map(), this.hasCustomCacheHandler = !!j2;
          const p2 = /* @__PURE__ */ Symbol.for("@next/cache-handlers"), q2 = globalThis;
          if (j2) cF.debug && console.log("IncrementalCache: using custom cache handler", j2.name);
          else {
            const b11 = q2[p2];
            (null == b11 ? void 0 : b11.FetchCache) ? (j2 = b11.FetchCache, cF.debug && console.log("IncrementalCache: using global FetchCache cache handler")) : a10 && e10 && (cF.debug && console.log("IncrementalCache: using filesystem cache handler"), j2 = cz);
          }
          process.env.__NEXT_TEST_MAX_ISR_CACHE && (g2 = parseInt(process.env.__NEXT_TEST_MAX_ISR_CACHE, 10)), this.dev = b10, this.disableForTestmode = "true" === process.env.NEXT_PRIVATE_TEST_PROXY, this.minimalMode = d10, this.requestHeaders = f10, this.allowedRevalidateHeaderKeys = k2, this.prerenderManifest = h2(), this.cacheControls = new cE(this.prerenderManifest), this.fetchCacheKeyPrefix = i2;
          let r2 = [];
          f10[ab] === (null == (m2 = this.prerenderManifest) || null == (l2 = m2.preview) ? void 0 : l2.previewModeId) && (this.isOnDemandRevalidate = true), d10 && (r2 = this.revalidatedTags = (function(a11, b11) {
            return "string" == typeof a11[ae] && a11["x-next-revalidate-tag-token"] === b11 ? a11[ae].split(",") : [];
          })(f10, null == (o2 = this.prerenderManifest) || null == (n2 = o2.preview) ? void 0 : n2.previewModeId)), j2 && (this.cacheHandler = new j2({ dev: b10, fs: a10, flushToDisk: c10, serverDistDir: e10, revalidatedTags: r2, maxMemoryCacheSize: g2, _requestHeaders: f10, fetchCacheKeyPrefix: i2 }));
        }
        calculateRevalidate(a10, b10, c10, d10) {
          if (c10) return Math.floor(performance.timeOrigin + performance.now() - 1e3);
          let e10 = this.cacheControls.get(cD(a10)), f10 = e10 ? e10.revalidate : !d10 && 1;
          return "number" == typeof f10 ? 1e3 * f10 + b10 : f10;
        }
        _getPathname(a10, b10) {
          return b10 ? a10 : /^\/index(\/|$)/.test(a10) && !(function(a11, b11 = true) {
            return (void 0 !== a11.split("/").find((a12) => cA.find((b12) => a12.startsWith(b12))) && (a11 = (function(a12) {
              let b12, c10, d10;
              for (let e10 of a12.split("/")) if (c10 = cA.find((a13) => e10.startsWith(a13))) {
                [b12, d10] = a12.split(c10, 2);
                break;
              }
              if (!b12 || !c10 || !d10) throw Object.defineProperty(Error(`Invalid interception route: ${a12}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`), "__NEXT_ERROR_CODE", { value: "E269", enumerable: false, configurable: true });
              switch (b12 = aN(b12), c10) {
                case "(.)":
                  d10 = "/" === b12 ? `/${d10}` : b12 + "/" + d10;
                  break;
                case "(..)":
                  if ("/" === b12) throw Object.defineProperty(Error(`Invalid interception route: ${a12}. Cannot use (..) marker at the root level, use (.) instead.`), "__NEXT_ERROR_CODE", { value: "E207", enumerable: false, configurable: true });
                  d10 = b12.split("/").slice(0, -1).concat(d10).join("/");
                  break;
                case "(...)":
                  d10 = "/" + d10;
                  break;
                case "(..)(..)":
                  let e10 = b12.split("/");
                  if (e10.length <= 2) throw Object.defineProperty(Error(`Invalid interception route: ${a12}. Cannot use (..)(..) marker at the root level or one level up.`), "__NEXT_ERROR_CODE", { value: "E486", enumerable: false, configurable: true });
                  d10 = e10.slice(0, -2).concat(d10).join("/");
                  break;
                default:
                  throw Object.defineProperty(Error("Invariant: unexpected marker"), "__NEXT_ERROR_CODE", { value: "E112", enumerable: false, configurable: true });
              }
              return { interceptingRoute: b12, interceptedRoute: d10 };
            })(a11).interceptedRoute), b11) ? cC.test(a11) : cB.test(a11);
          })(a10) ? `/index${a10}` : "/" === a10 ? "/index" : aM(a10);
        }
        resetRequestCache() {
          var a10, b10;
          null == (b10 = this.cacheHandler) || null == (a10 = b10.resetRequestCache) || a10.call(b10);
        }
        async lock(a10) {
          for (; ; ) {
            let b11 = this.locks.get(a10);
            if (cF.debug && console.log("IncrementalCache: lock get", a10, !!b11), !b11) break;
            await b11;
          }
          let { resolve: b10, promise: c10 } = new cm();
          return cF.debug && console.log("IncrementalCache: successfully locked", a10), this.locks.set(a10, c10), () => {
            b10(), this.locks.delete(a10);
          };
        }
        async revalidateTag(a10, b10) {
          var c10;
          return null == (c10 = this.cacheHandler) ? void 0 : c10.revalidateTag(a10, b10);
        }
        async generateCacheKey(a10, b10 = {}) {
          let c10 = [], d10 = new TextEncoder(), e10 = new TextDecoder();
          if (b10.body) if (b10.body instanceof Uint8Array) c10.push(e10.decode(b10.body)), b10._ogBody = b10.body;
          else if ("function" == typeof b10.body.getReader) {
            let a11 = b10.body, f11 = [];
            try {
              await a11.pipeTo(new WritableStream({ write(a12) {
                "string" == typeof a12 ? (f11.push(d10.encode(a12)), c10.push(a12)) : (f11.push(a12), c10.push(e10.decode(a12, { stream: true })));
              } })), c10.push(e10.decode());
              let g3 = f11.reduce((a12, b11) => a12 + b11.length, 0), h3 = new Uint8Array(g3), i2 = 0;
              for (let a12 of f11) h3.set(a12, i2), i2 += a12.length;
              b10._ogBody = h3;
            } catch (a12) {
              console.error("Problem reading body", a12);
            }
          } else if ("function" == typeof b10.body.keys) {
            let a11 = b10.body;
            for (let d11 of (b10._ogBody = b10.body, /* @__PURE__ */ new Set([...a11.keys()]))) {
              let b11 = a11.getAll(d11);
              c10.push(`${d11}=${(await Promise.all(b11.map(async (a12) => "string" == typeof a12 ? a12 : await a12.text()))).join(",")}`);
            }
          } else if ("function" == typeof b10.body.arrayBuffer) {
            let a11 = b10.body, d11 = await a11.arrayBuffer();
            c10.push(await a11.text()), b10._ogBody = new Blob([d11], { type: a11.type });
          } else "string" == typeof b10.body && (c10.push(b10.body), b10._ogBody = b10.body);
          let f10 = "function" == typeof (b10.headers || {}).keys ? Object.fromEntries(b10.headers) : Object.assign({}, b10.headers);
          "traceparent" in f10 && delete f10.traceparent, "tracestate" in f10 && delete f10.tracestate;
          let g2 = JSON.stringify(["v3", this.fetchCacheKeyPrefix || "", a10, b10.method, f10, b10.mode, b10.redirect, b10.credentials, b10.referrer, b10.referrerPolicy, b10.integrity, b10.cache, c10]);
          {
            var h2;
            let a11 = d10.encode(g2);
            return h2 = await crypto.subtle.digest("SHA-256", a11), Array.prototype.map.call(new Uint8Array(h2), (a12) => a12.toString(16).padStart(2, "0")).join("");
          }
        }
        async get(a10, b10) {
          var c10, d10, e10, f10, g2, h2, i2;
          let j2, k2;
          if (b10.kind === ce.FETCH) {
            let c11 = bv.getStore(), d11 = c11 ? (function(a11) {
              switch (a11.type) {
                case "request":
                case "prerender":
                case "prerender-runtime":
                case "prerender-client":
                case "validation-client":
                  if (a11.renderResumeDataCache) return a11.renderResumeDataCache;
                case "prerender-ppr":
                  return a11.prerenderResumeDataCache ?? null;
                case "cache":
                case "private-cache":
                case "unstable-cache":
                case "prerender-legacy":
                case "generate-static-params":
                  return null;
                default:
                  return a11;
              }
            })(c11) : null;
            if (d11) {
              let c12 = d11.fetch.get(a10);
              if ((null == c12 ? void 0 : c12.kind) === cd.FETCH) {
                let d12 = aU.getStore();
                if (![...b10.tags || [], ...b10.softTags || []].some((a11) => {
                  var b11, c13;
                  return (null == (b11 = this.revalidatedTags) ? void 0 : b11.includes(a11)) || (null == d12 || null == (c13 = d12.pendingRevalidatedTags) ? void 0 : c13.some((b12) => b12.tag === a11));
                })) return cF.debug && console.log("IncrementalCache: rdc:hit", a10), { isStale: false, value: c12 };
                cF.debug && console.log("IncrementalCache: rdc:revalidated-tag", a10);
              } else cF.debug && console.log("IncrementalCache: rdc:miss", a10);
            } else cF.debug && console.log("IncrementalCache: rdc:no-resume-data");
          }
          if (this.disableForTestmode || this.dev && (b10.kind !== ce.FETCH || "no-cache" === this.requestHeaders["cache-control"])) return null;
          a10 = this._getPathname(a10, b10.kind === ce.FETCH);
          let l2 = await (null == (c10 = this.cacheHandler) ? void 0 : c10.get(a10, b10));
          if (b10.kind === ce.FETCH) {
            if (!l2) return null;
            if ((null == (e10 = l2.value) ? void 0 : e10.kind) !== cd.FETCH) throw Object.defineProperty(new bz(`Expected cached value for cache key ${JSON.stringify(a10)} to be a "FETCH" kind, got ${JSON.stringify(null == (f10 = l2.value) ? void 0 : f10.kind)} instead.`), "__NEXT_ERROR_CODE", { value: "E653", enumerable: false, configurable: true });
            let c11 = aU.getStore(), d11 = [...b10.tags || [], ...b10.softTags || []];
            if (d11.some((a11) => {
              var b11, d12;
              return (null == (b11 = this.revalidatedTags) ? void 0 : b11.includes(a11)) || (null == c11 || null == (d12 = c11.pendingRevalidatedTags) ? void 0 : d12.some((b12) => b12.tag === a11));
            })) return cF.debug && console.log("IncrementalCache: expired tag", a10), null;
            let g3 = bv.getStore();
            if (g3) {
              let b11 = bw(g3);
              b11 && (cF.debug && console.log("IncrementalCache: rdc:set", a10), b11.fetch.set(a10, l2.value));
            }
            let h3 = b10.revalidate || l2.value.revalidate, i3 = (performance.timeOrigin + performance.now() - (l2.lastModified || 0)) / 1e3 > h3, j3 = l2.value.data;
            return bE(d11, l2.lastModified) ? null : (bF(d11, l2.lastModified) && (i3 = true), { isStale: i3, value: { kind: cd.FETCH, data: j3, revalidate: h3 } });
          }
          if ((null == l2 || null == (d10 = l2.value) ? void 0 : d10.kind) === cd.FETCH) throw Object.defineProperty(new bz(`Expected cached value for cache key ${JSON.stringify(a10)} not to be a ${JSON.stringify(b10.kind)} kind, got "FETCH" instead.`), "__NEXT_ERROR_CODE", { value: "E652", enumerable: false, configurable: true });
          let m2 = null, { isFallback: n2 } = b10, o2 = this.cacheControls.get(cD(a10));
          if ((null == l2 ? void 0 : l2.lastModified) === -1) j2 = -1, k2 = -31536e6;
          else {
            let c11 = performance.timeOrigin + performance.now(), d11 = (null == l2 ? void 0 : l2.lastModified) || c11;
            if (void 0 === (j2 = false !== (k2 = this.calculateRevalidate(a10, d11, this.dev ?? false, b10.isFallback)) && k2 < c11 || void 0) && ((null == l2 || null == (g2 = l2.value) ? void 0 : g2.kind) === cd.APP_PAGE || (null == l2 || null == (h2 = l2.value) ? void 0 : h2.kind) === cd.APP_ROUTE)) {
              let a11 = null == (i2 = l2.value.headers) ? void 0 : i2[ad];
              if ("string" == typeof a11) {
                let b11 = a11.split(",");
                b11.length > 0 && (bE(b11, d11) ? j2 = -1 : bF(b11, d11) && (j2 = true));
              }
            }
          }
          return l2 && (m2 = { isStale: j2, cacheControl: o2, revalidateAfter: k2, value: l2.value, isFallback: n2 }), !l2 && this.prerenderManifest.notFoundRoutes.includes(a10) && (m2 = { isStale: j2, value: null, cacheControl: o2, revalidateAfter: k2, isFallback: n2 }, this.set(a10, m2.value, { ...b10, cacheControl: o2 })), m2;
        }
        async set(a10, b10, c10) {
          if ((null == b10 ? void 0 : b10.kind) === cd.FETCH) {
            let c11 = bv.getStore(), d11 = c11 ? bw(c11) : null;
            d11 && (cF.debug && console.log("IncrementalCache: rdc:set", a10), d11.fetch.set(a10, b10));
          }
          if (this.disableForTestmode || this.dev && !c10.fetchCache) return;
          a10 = this._getPathname(a10, c10.fetchCache);
          let d10 = JSON.stringify(b10).length;
          if (c10.fetchCache && d10 > 2097152 && !this.hasCustomCacheHandler && !c10.isImplicitBuildTimeCache) {
            let b11 = `Failed to set Next.js data cache for ${c10.fetchUrl || a10}, items over 2MB can not be cached (${d10} bytes)`;
            if (this.dev) throw Object.defineProperty(Error(b11), "__NEXT_ERROR_CODE", { value: "E1003", enumerable: false, configurable: true });
            console.warn(b11);
            return;
          }
          try {
            var e10;
            !c10.fetchCache && c10.cacheControl && this.cacheControls.set(cD(a10), c10.cacheControl), await (null == (e10 = this.cacheHandler) ? void 0 : e10.set(a10, b10, c10));
          } catch (b11) {
            console.warn("Failed to update prerender cache for", a10, b11);
          }
        }
      }
      c(990), "u" < typeof URLPattern || URLPattern;
      var cG = c(345);
      if (cG.unstable_postpone, false === ("Route %%% needs to bail out of prerendering at this point because it used ^^^. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error".includes("needs to bail out of prerendering at this point because it used") && "Route %%% needs to bail out of prerendering at this point because it used ^^^. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error".includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error"))) throw Object.defineProperty(Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E296", enumerable: false, configurable: true });
      function cH(a10, b10, c10) {
        return "string" == typeof a10 ? a10 : a10[b10] || c10;
      }
      function cI(a10) {
        let b10 = (function() {
          try {
            return "true" === process.env._next_intl_trailing_slash;
          } catch {
            return false;
          }
        })(), [c10, ...d10] = a10.split("#"), e10 = d10.join("#"), f10 = c10;
        if ("/" !== f10) {
          let a11 = f10.endsWith("/");
          b10 && !a11 ? f10 += "/" : !b10 && a11 && (f10 = f10.slice(0, -1));
        }
        return e10 && (f10 += "#" + e10), f10;
      }
      function cJ(a10, b10) {
        let c10 = cI(a10), d10 = cI(b10);
        return cL(c10).test(d10);
      }
      function cK(a10, b10) {
        return "never" !== b10.mode && b10.prefixes?.[a10] || "/" + a10;
      }
      function cL(a10) {
        let b10 = a10.replace(/\/\[\[(\.\.\.[^\]]+)\]\]/g, "(?:/(.*))?").replace(/\[\[(\.\.\.[^\]]+)\]\]/g, "(?:/(.*))?").replace(/\[(\.\.\.[^\]]+)\]/g, "(.+)").replace(/\[([^\]]+)\]/g, "([^/]+)");
        return RegExp(`^${b10}$`);
      }
      function cM(a10) {
        return a10.includes("[[...");
      }
      function cN(a10) {
        return a10.includes("[...");
      }
      function cO(a10) {
        return a10.includes("[");
      }
      function cP(a10, b10) {
        let c10 = a10.split("/"), d10 = b10.split("/"), e10 = Math.max(c10.length, d10.length);
        for (let a11 = 0; a11 < e10; a11++) {
          let b11 = c10[a11], e11 = d10[a11];
          if (!b11 && e11) return -1;
          if (b11 && !e11) return 1;
          if (b11 || e11) {
            if (!cO(b11) && cO(e11)) return -1;
            if (cO(b11) && !cO(e11)) return 1;
            if (!cN(b11) && cN(e11)) return -1;
            if (cN(b11) && !cN(e11)) return 1;
            if (!cM(b11) && cM(e11)) return -1;
            if (cM(b11) && !cM(e11)) return 1;
          }
        }
        return 0;
      }
      function cQ(a10, b10, c10, d10) {
        let e10 = "";
        return e10 += (function(a11, b11) {
          if (!b11) return a11;
          let c11 = a11 = a11.replace(/\[\[/g, "[").replace(/\]\]/g, "]");
          return Object.entries(b11).forEach(([a12, b12]) => {
            c11 = c11.replace(`[${a12}]`, b12);
          }), c11;
        })(c10, (function(a11, b11) {
          let c11 = cI(b11), d11 = cI(a11), e11 = cL(d11).exec(c11);
          if (!e11) return;
          let f10 = {}, g2 = d11.match(/\[([^\]]+)\]/g) ?? [];
          for (let a12 = 1; a12 < e11.length; a12++) {
            let b12 = g2[a12 - 1];
            if (!b12) continue;
            let c12 = b12.replace(/[[\]]/g, ""), d12 = e11[a12] ?? "";
            f10[c12] = d12;
          }
          return f10;
        })(b10, a10)), e10 = cI(e10);
      }
      function cR(a10, b10, c10) {
        a10.endsWith("/") || (a10 += "/");
        let d10 = cS(b10, c10), e10 = RegExp(`^(${d10.map(([, a11]) => a11.replaceAll("/", "\\/")).join("|")})/(.*)`, "i"), f10 = a10.match(e10), g2 = f10 ? "/" + f10[2] : a10;
        return "/" !== g2 && (g2 = cI(g2)), g2;
      }
      function cS(a10, b10, c10 = true) {
        let d10 = a10.map((a11) => [a11, cK(a11, b10)]);
        return c10 && d10.sort((a11, b11) => b11[1].length - a11[1].length), d10;
      }
      function cT(a10, b10, c10, d10) {
        let e10 = cS(b10, c10);
        for (let [b11, c11] of (d10 && e10.sort(([a11], [b12]) => {
          if (a11 === d10.defaultLocale) return -1;
          if (b12 === d10.defaultLocale) return 1;
          let c12 = d10.locales.includes(a11), e11 = d10.locales.includes(b12);
          return c12 && !e11 ? -1 : !c12 && e11 ? 1 : 0;
        }), e10)) {
          let d11, e11;
          if (a10 === c11 || a10.startsWith(c11 + "/")) d11 = e11 = true;
          else {
            let b12 = a10.toLowerCase(), f10 = c11.toLowerCase();
            (b12 === f10 || b12.startsWith(f10 + "/")) && (d11 = false, e11 = true);
          }
          if (e11) return { locale: b11, prefix: c11, matchedPrefix: a10.slice(0, c11.length), exact: d11 };
        }
      }
      function cU(a10, b10, c10) {
        var d10;
        let e10, f10 = a10;
        return b10 && (d10 = f10, e10 = b10, /^\/(\?.*)?$/.test(d10) && (d10 = d10.slice(1)), f10 = e10 += d10), c10 && (f10 += c10), f10;
      }
      function cV(a10) {
        return a10.get("x-forwarded-host") ?? a10.get("host") ?? void 0;
      }
      function cW(a10, b10) {
        return b10.defaultLocale === a10 || b10.locales.includes(a10);
      }
      function cX(a10, b10, c10) {
        let d10;
        return a10 && cW(b10, a10) && (d10 = a10), d10 || (d10 = c10.find((a11) => a11.defaultLocale === b10)), d10 || (d10 = c10.find((a11) => a11.locales.includes(b10))), d10;
      }
      function cY(a10, b10, c10, d10) {
        let e10 = null == d10 || "number" == typeof d10 || "boolean" == typeof d10 ? d10 : c10(d10), f10 = b10.get(e10);
        return void 0 === f10 && (f10 = a10.call(this, d10), b10.set(e10, f10)), f10;
      }
      function cZ(a10, b10, c10) {
        let d10 = Array.prototype.slice.call(arguments, 3), e10 = c10(d10), f10 = b10.get(e10);
        return void 0 === f10 && (f10 = a10.apply(this, d10), b10.set(e10, f10)), f10;
      }
      var c$ = class {
        constructor() {
          this.cache = /* @__PURE__ */ Object.create(null);
        }
        get(a10) {
          return this.cache[a10];
        }
        set(a10, b10) {
          this.cache[a10] = b10;
        }
      };
      let c_ = { "written-new": [{ paradigmLocales: { _locales: "en en_GB es es_419 pt_BR pt_PT" } }, { $enUS: { _value: "AS+CA+GU+MH+MP+PH+PR+UM+US+VI" } }, { $cnsar: { _value: "HK+MO" } }, { $americas: { _value: "019" } }, { $maghreb: { _value: "MA+DZ+TN+LY+MR+EH" } }, { no: { _desired: "nb", _distance: "1" } }, { bs: { _desired: "hr", _distance: "4" } }, { bs: { _desired: "sh", _distance: "4" } }, { hr: { _desired: "sh", _distance: "4" } }, { sr: { _desired: "sh", _distance: "4" } }, { aa: { _desired: "ssy", _distance: "4" } }, { de: { _desired: "gsw", _distance: "4", _oneway: "true" } }, { de: { _desired: "lb", _distance: "4", _oneway: "true" } }, { no: { _desired: "da", _distance: "8" } }, { nb: { _desired: "da", _distance: "8" } }, { ru: { _desired: "ab", _distance: "30", _oneway: "true" } }, { en: { _desired: "ach", _distance: "30", _oneway: "true" } }, { nl: { _desired: "af", _distance: "20", _oneway: "true" } }, { en: { _desired: "ak", _distance: "30", _oneway: "true" } }, { en: { _desired: "am", _distance: "30", _oneway: "true" } }, { es: { _desired: "ay", _distance: "20", _oneway: "true" } }, { ru: { _desired: "az", _distance: "30", _oneway: "true" } }, { ur: { _desired: "bal", _distance: "20", _oneway: "true" } }, { ru: { _desired: "be", _distance: "20", _oneway: "true" } }, { en: { _desired: "bem", _distance: "30", _oneway: "true" } }, { hi: { _desired: "bh", _distance: "30", _oneway: "true" } }, { en: { _desired: "bn", _distance: "30", _oneway: "true" } }, { zh: { _desired: "bo", _distance: "20", _oneway: "true" } }, { fr: { _desired: "br", _distance: "20", _oneway: "true" } }, { es: { _desired: "ca", _distance: "20", _oneway: "true" } }, { fil: { _desired: "ceb", _distance: "30", _oneway: "true" } }, { en: { _desired: "chr", _distance: "20", _oneway: "true" } }, { ar: { _desired: "ckb", _distance: "30", _oneway: "true" } }, { fr: { _desired: "co", _distance: "20", _oneway: "true" } }, { fr: { _desired: "crs", _distance: "20", _oneway: "true" } }, { sk: { _desired: "cs", _distance: "20" } }, { en: { _desired: "cy", _distance: "20", _oneway: "true" } }, { en: { _desired: "ee", _distance: "30", _oneway: "true" } }, { en: { _desired: "eo", _distance: "30", _oneway: "true" } }, { es: { _desired: "eu", _distance: "20", _oneway: "true" } }, { da: { _desired: "fo", _distance: "20", _oneway: "true" } }, { nl: { _desired: "fy", _distance: "20", _oneway: "true" } }, { en: { _desired: "ga", _distance: "20", _oneway: "true" } }, { en: { _desired: "gaa", _distance: "30", _oneway: "true" } }, { en: { _desired: "gd", _distance: "20", _oneway: "true" } }, { es: { _desired: "gl", _distance: "20", _oneway: "true" } }, { es: { _desired: "gn", _distance: "20", _oneway: "true" } }, { hi: { _desired: "gu", _distance: "30", _oneway: "true" } }, { en: { _desired: "ha", _distance: "30", _oneway: "true" } }, { en: { _desired: "haw", _distance: "20", _oneway: "true" } }, { fr: { _desired: "ht", _distance: "20", _oneway: "true" } }, { ru: { _desired: "hy", _distance: "30", _oneway: "true" } }, { en: { _desired: "ia", _distance: "30", _oneway: "true" } }, { en: { _desired: "ig", _distance: "30", _oneway: "true" } }, { en: { _desired: "is", _distance: "20", _oneway: "true" } }, { id: { _desired: "jv", _distance: "20", _oneway: "true" } }, { en: { _desired: "ka", _distance: "30", _oneway: "true" } }, { fr: { _desired: "kg", _distance: "30", _oneway: "true" } }, { ru: { _desired: "kk", _distance: "30", _oneway: "true" } }, { en: { _desired: "km", _distance: "30", _oneway: "true" } }, { en: { _desired: "kn", _distance: "30", _oneway: "true" } }, { en: { _desired: "kri", _distance: "30", _oneway: "true" } }, { tr: { _desired: "ku", _distance: "30", _oneway: "true" } }, { ru: { _desired: "ky", _distance: "30", _oneway: "true" } }, { it: { _desired: "la", _distance: "20", _oneway: "true" } }, { en: { _desired: "lg", _distance: "30", _oneway: "true" } }, { fr: { _desired: "ln", _distance: "30", _oneway: "true" } }, { en: { _desired: "lo", _distance: "30", _oneway: "true" } }, { en: { _desired: "loz", _distance: "30", _oneway: "true" } }, { fr: { _desired: "lua", _distance: "30", _oneway: "true" } }, { hi: { _desired: "mai", _distance: "20", _oneway: "true" } }, { en: { _desired: "mfe", _distance: "30", _oneway: "true" } }, { fr: { _desired: "mg", _distance: "30", _oneway: "true" } }, { en: { _desired: "mi", _distance: "20", _oneway: "true" } }, { en: { _desired: "ml", _distance: "30", _oneway: "true" } }, { ru: { _desired: "mn", _distance: "30", _oneway: "true" } }, { hi: { _desired: "mr", _distance: "30", _oneway: "true" } }, { id: { _desired: "ms", _distance: "30", _oneway: "true" } }, { en: { _desired: "mt", _distance: "30", _oneway: "true" } }, { en: { _desired: "my", _distance: "30", _oneway: "true" } }, { en: { _desired: "ne", _distance: "30", _oneway: "true" } }, { nb: { _desired: "nn", _distance: "20" } }, { no: { _desired: "nn", _distance: "20" } }, { en: { _desired: "nso", _distance: "30", _oneway: "true" } }, { en: { _desired: "ny", _distance: "30", _oneway: "true" } }, { en: { _desired: "nyn", _distance: "30", _oneway: "true" } }, { fr: { _desired: "oc", _distance: "20", _oneway: "true" } }, { en: { _desired: "om", _distance: "30", _oneway: "true" } }, { en: { _desired: "or", _distance: "30", _oneway: "true" } }, { en: { _desired: "pa", _distance: "30", _oneway: "true" } }, { en: { _desired: "pcm", _distance: "20", _oneway: "true" } }, { en: { _desired: "ps", _distance: "30", _oneway: "true" } }, { es: { _desired: "qu", _distance: "30", _oneway: "true" } }, { de: { _desired: "rm", _distance: "20", _oneway: "true" } }, { en: { _desired: "rn", _distance: "30", _oneway: "true" } }, { fr: { _desired: "rw", _distance: "30", _oneway: "true" } }, { hi: { _desired: "sa", _distance: "30", _oneway: "true" } }, { en: { _desired: "sd", _distance: "30", _oneway: "true" } }, { en: { _desired: "si", _distance: "30", _oneway: "true" } }, { en: { _desired: "sn", _distance: "30", _oneway: "true" } }, { en: { _desired: "so", _distance: "30", _oneway: "true" } }, { en: { _desired: "sq", _distance: "30", _oneway: "true" } }, { en: { _desired: "st", _distance: "30", _oneway: "true" } }, { id: { _desired: "su", _distance: "20", _oneway: "true" } }, { en: { _desired: "sw", _distance: "30", _oneway: "true" } }, { en: { _desired: "ta", _distance: "30", _oneway: "true" } }, { en: { _desired: "te", _distance: "30", _oneway: "true" } }, { ru: { _desired: "tg", _distance: "30", _oneway: "true" } }, { en: { _desired: "ti", _distance: "30", _oneway: "true" } }, { ru: { _desired: "tk", _distance: "30", _oneway: "true" } }, { en: { _desired: "tlh", _distance: "30", _oneway: "true" } }, { en: { _desired: "tn", _distance: "30", _oneway: "true" } }, { en: { _desired: "to", _distance: "30", _oneway: "true" } }, { ru: { _desired: "tt", _distance: "30", _oneway: "true" } }, { en: { _desired: "tum", _distance: "30", _oneway: "true" } }, { zh: { _desired: "ug", _distance: "20", _oneway: "true" } }, { ru: { _desired: "uk", _distance: "20", _oneway: "true" } }, { en: { _desired: "ur", _distance: "30", _oneway: "true" } }, { ru: { _desired: "uz", _distance: "30", _oneway: "true" } }, { fr: { _desired: "wo", _distance: "30", _oneway: "true" } }, { en: { _desired: "xh", _distance: "30", _oneway: "true" } }, { en: { _desired: "yi", _distance: "30", _oneway: "true" } }, { en: { _desired: "yo", _distance: "30", _oneway: "true" } }, { zh: { _desired: "za", _distance: "20", _oneway: "true" } }, { en: { _desired: "zu", _distance: "30", _oneway: "true" } }, { ar: { _desired: "aao", _distance: "10", _oneway: "true" } }, { ar: { _desired: "abh", _distance: "10", _oneway: "true" } }, { ar: { _desired: "abv", _distance: "10", _oneway: "true" } }, { ar: { _desired: "acm", _distance: "10", _oneway: "true" } }, { ar: { _desired: "acq", _distance: "10", _oneway: "true" } }, { ar: { _desired: "acw", _distance: "10", _oneway: "true" } }, { ar: { _desired: "acx", _distance: "10", _oneway: "true" } }, { ar: { _desired: "acy", _distance: "10", _oneway: "true" } }, { ar: { _desired: "adf", _distance: "10", _oneway: "true" } }, { ar: { _desired: "aeb", _distance: "10", _oneway: "true" } }, { ar: { _desired: "aec", _distance: "10", _oneway: "true" } }, { ar: { _desired: "afb", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ajp", _distance: "10", _oneway: "true" } }, { ar: { _desired: "apc", _distance: "10", _oneway: "true" } }, { ar: { _desired: "apd", _distance: "10", _oneway: "true" } }, { ar: { _desired: "arq", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ars", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ary", _distance: "10", _oneway: "true" } }, { ar: { _desired: "arz", _distance: "10", _oneway: "true" } }, { ar: { _desired: "auz", _distance: "10", _oneway: "true" } }, { ar: { _desired: "avl", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ayh", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ayl", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ayn", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ayp", _distance: "10", _oneway: "true" } }, { ar: { _desired: "bbz", _distance: "10", _oneway: "true" } }, { ar: { _desired: "pga", _distance: "10", _oneway: "true" } }, { ar: { _desired: "shu", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ssh", _distance: "10", _oneway: "true" } }, { az: { _desired: "azb", _distance: "10", _oneway: "true" } }, { et: { _desired: "vro", _distance: "10", _oneway: "true" } }, { ff: { _desired: "ffm", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fub", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fue", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fuf", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fuh", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fui", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fuq", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fuv", _distance: "10", _oneway: "true" } }, { gn: { _desired: "gnw", _distance: "10", _oneway: "true" } }, { gn: { _desired: "gui", _distance: "10", _oneway: "true" } }, { gn: { _desired: "gun", _distance: "10", _oneway: "true" } }, { gn: { _desired: "nhd", _distance: "10", _oneway: "true" } }, { iu: { _desired: "ikt", _distance: "10", _oneway: "true" } }, { kln: { _desired: "enb", _distance: "10", _oneway: "true" } }, { kln: { _desired: "eyo", _distance: "10", _oneway: "true" } }, { kln: { _desired: "niq", _distance: "10", _oneway: "true" } }, { kln: { _desired: "oki", _distance: "10", _oneway: "true" } }, { kln: { _desired: "pko", _distance: "10", _oneway: "true" } }, { kln: { _desired: "sgc", _distance: "10", _oneway: "true" } }, { kln: { _desired: "tec", _distance: "10", _oneway: "true" } }, { kln: { _desired: "tuy", _distance: "10", _oneway: "true" } }, { kok: { _desired: "gom", _distance: "10", _oneway: "true" } }, { kpe: { _desired: "gkp", _distance: "10", _oneway: "true" } }, { luy: { _desired: "ida", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lkb", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lko", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lks", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lri", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lrm", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lsm", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lto", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lts", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lwg", _distance: "10", _oneway: "true" } }, { luy: { _desired: "nle", _distance: "10", _oneway: "true" } }, { luy: { _desired: "nyd", _distance: "10", _oneway: "true" } }, { luy: { _desired: "rag", _distance: "10", _oneway: "true" } }, { lv: { _desired: "ltg", _distance: "10", _oneway: "true" } }, { mg: { _desired: "bhr", _distance: "10", _oneway: "true" } }, { mg: { _desired: "bjq", _distance: "10", _oneway: "true" } }, { mg: { _desired: "bmm", _distance: "10", _oneway: "true" } }, { mg: { _desired: "bzc", _distance: "10", _oneway: "true" } }, { mg: { _desired: "msh", _distance: "10", _oneway: "true" } }, { mg: { _desired: "skg", _distance: "10", _oneway: "true" } }, { mg: { _desired: "tdx", _distance: "10", _oneway: "true" } }, { mg: { _desired: "tkg", _distance: "10", _oneway: "true" } }, { mg: { _desired: "txy", _distance: "10", _oneway: "true" } }, { mg: { _desired: "xmv", _distance: "10", _oneway: "true" } }, { mg: { _desired: "xmw", _distance: "10", _oneway: "true" } }, { mn: { _desired: "mvf", _distance: "10", _oneway: "true" } }, { ms: { _desired: "bjn", _distance: "10", _oneway: "true" } }, { ms: { _desired: "btj", _distance: "10", _oneway: "true" } }, { ms: { _desired: "bve", _distance: "10", _oneway: "true" } }, { ms: { _desired: "bvu", _distance: "10", _oneway: "true" } }, { ms: { _desired: "coa", _distance: "10", _oneway: "true" } }, { ms: { _desired: "dup", _distance: "10", _oneway: "true" } }, { ms: { _desired: "hji", _distance: "10", _oneway: "true" } }, { ms: { _desired: "id", _distance: "10", _oneway: "true" } }, { ms: { _desired: "jak", _distance: "10", _oneway: "true" } }, { ms: { _desired: "jax", _distance: "10", _oneway: "true" } }, { ms: { _desired: "kvb", _distance: "10", _oneway: "true" } }, { ms: { _desired: "kvr", _distance: "10", _oneway: "true" } }, { ms: { _desired: "kxd", _distance: "10", _oneway: "true" } }, { ms: { _desired: "lce", _distance: "10", _oneway: "true" } }, { ms: { _desired: "lcf", _distance: "10", _oneway: "true" } }, { ms: { _desired: "liw", _distance: "10", _oneway: "true" } }, { ms: { _desired: "max", _distance: "10", _oneway: "true" } }, { ms: { _desired: "meo", _distance: "10", _oneway: "true" } }, { ms: { _desired: "mfa", _distance: "10", _oneway: "true" } }, { ms: { _desired: "mfb", _distance: "10", _oneway: "true" } }, { ms: { _desired: "min", _distance: "10", _oneway: "true" } }, { ms: { _desired: "mqg", _distance: "10", _oneway: "true" } }, { ms: { _desired: "msi", _distance: "10", _oneway: "true" } }, { ms: { _desired: "mui", _distance: "10", _oneway: "true" } }, { ms: { _desired: "orn", _distance: "10", _oneway: "true" } }, { ms: { _desired: "ors", _distance: "10", _oneway: "true" } }, { ms: { _desired: "pel", _distance: "10", _oneway: "true" } }, { ms: { _desired: "pse", _distance: "10", _oneway: "true" } }, { ms: { _desired: "tmw", _distance: "10", _oneway: "true" } }, { ms: { _desired: "urk", _distance: "10", _oneway: "true" } }, { ms: { _desired: "vkk", _distance: "10", _oneway: "true" } }, { ms: { _desired: "vkt", _distance: "10", _oneway: "true" } }, { ms: { _desired: "xmm", _distance: "10", _oneway: "true" } }, { ms: { _desired: "zlm", _distance: "10", _oneway: "true" } }, { ms: { _desired: "zmi", _distance: "10", _oneway: "true" } }, { ne: { _desired: "dty", _distance: "10", _oneway: "true" } }, { om: { _desired: "gax", _distance: "10", _oneway: "true" } }, { om: { _desired: "hae", _distance: "10", _oneway: "true" } }, { om: { _desired: "orc", _distance: "10", _oneway: "true" } }, { or: { _desired: "spv", _distance: "10", _oneway: "true" } }, { ps: { _desired: "pbt", _distance: "10", _oneway: "true" } }, { ps: { _desired: "pst", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qub", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qud", _distance: "10", _oneway: "true" } }, { qu: { _desired: "quf", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qug", _distance: "10", _oneway: "true" } }, { qu: { _desired: "quh", _distance: "10", _oneway: "true" } }, { qu: { _desired: "quk", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qul", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qup", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qur", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qus", _distance: "10", _oneway: "true" } }, { qu: { _desired: "quw", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qux", _distance: "10", _oneway: "true" } }, { qu: { _desired: "quy", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qva", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvc", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qve", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvh", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvi", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvj", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvl", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvm", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvn", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvo", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvp", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvs", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvw", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvz", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qwa", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qwc", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qwh", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qws", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxa", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxc", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxh", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxl", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxn", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxo", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxp", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxr", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxt", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxu", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxw", _distance: "10", _oneway: "true" } }, { sc: { _desired: "sdc", _distance: "10", _oneway: "true" } }, { sc: { _desired: "sdn", _distance: "10", _oneway: "true" } }, { sc: { _desired: "sro", _distance: "10", _oneway: "true" } }, { sq: { _desired: "aae", _distance: "10", _oneway: "true" } }, { sq: { _desired: "aat", _distance: "10", _oneway: "true" } }, { sq: { _desired: "aln", _distance: "10", _oneway: "true" } }, { syr: { _desired: "aii", _distance: "10", _oneway: "true" } }, { uz: { _desired: "uzs", _distance: "10", _oneway: "true" } }, { yi: { _desired: "yih", _distance: "10", _oneway: "true" } }, { zh: { _desired: "cdo", _distance: "10", _oneway: "true" } }, { zh: { _desired: "cjy", _distance: "10", _oneway: "true" } }, { zh: { _desired: "cpx", _distance: "10", _oneway: "true" } }, { zh: { _desired: "czh", _distance: "10", _oneway: "true" } }, { zh: { _desired: "czo", _distance: "10", _oneway: "true" } }, { zh: { _desired: "gan", _distance: "10", _oneway: "true" } }, { zh: { _desired: "hak", _distance: "10", _oneway: "true" } }, { zh: { _desired: "hsn", _distance: "10", _oneway: "true" } }, { zh: { _desired: "lzh", _distance: "10", _oneway: "true" } }, { zh: { _desired: "mnp", _distance: "10", _oneway: "true" } }, { zh: { _desired: "nan", _distance: "10", _oneway: "true" } }, { zh: { _desired: "wuu", _distance: "10", _oneway: "true" } }, { zh: { _desired: "yue", _distance: "10", _oneway: "true" } }, { "*": { _desired: "*", _distance: "80" } }, { "en-Latn": { _desired: "am-Ethi", _distance: "10", _oneway: "true" } }, { "ru-Cyrl": { _desired: "az-Latn", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "bn-Beng", _distance: "10", _oneway: "true" } }, { "zh-Hans": { _desired: "bo-Tibt", _distance: "10", _oneway: "true" } }, { "ru-Cyrl": { _desired: "hy-Armn", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ka-Geor", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "km-Khmr", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "kn-Knda", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "lo-Laoo", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ml-Mlym", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "my-Mymr", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ne-Deva", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "or-Orya", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "pa-Guru", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ps-Arab", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "sd-Arab", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "si-Sinh", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ta-Taml", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "te-Telu", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ti-Ethi", _distance: "10", _oneway: "true" } }, { "ru-Cyrl": { _desired: "tk-Latn", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ur-Arab", _distance: "10", _oneway: "true" } }, { "ru-Cyrl": { _desired: "uz-Latn", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "yi-Hebr", _distance: "10", _oneway: "true" } }, { "sr-Cyrl": { _desired: "sr-Latn", _distance: "5" } }, { "zh-Hans": { _desired: "za-Latn", _distance: "10", _oneway: "true" } }, { "zh-Hans": { _desired: "zh-Hani", _distance: "20", _oneway: "true" } }, { "zh-Hant": { _desired: "zh-Hani", _distance: "20", _oneway: "true" } }, { "ar-Arab": { _desired: "ar-Latn", _distance: "20", _oneway: "true" } }, { "bn-Beng": { _desired: "bn-Latn", _distance: "20", _oneway: "true" } }, { "gu-Gujr": { _desired: "gu-Latn", _distance: "20", _oneway: "true" } }, { "hi-Deva": { _desired: "hi-Latn", _distance: "20", _oneway: "true" } }, { "kn-Knda": { _desired: "kn-Latn", _distance: "20", _oneway: "true" } }, { "ml-Mlym": { _desired: "ml-Latn", _distance: "20", _oneway: "true" } }, { "mr-Deva": { _desired: "mr-Latn", _distance: "20", _oneway: "true" } }, { "ta-Taml": { _desired: "ta-Latn", _distance: "20", _oneway: "true" } }, { "te-Telu": { _desired: "te-Latn", _distance: "20", _oneway: "true" } }, { "zh-Hans": { _desired: "zh-Latn", _distance: "20", _oneway: "true" } }, { "ja-Jpan": { _desired: "ja-Latn", _distance: "5", _oneway: "true" } }, { "ja-Jpan": { _desired: "ja-Hani", _distance: "5", _oneway: "true" } }, { "ja-Jpan": { _desired: "ja-Hira", _distance: "5", _oneway: "true" } }, { "ja-Jpan": { _desired: "ja-Kana", _distance: "5", _oneway: "true" } }, { "ja-Jpan": { _desired: "ja-Hrkt", _distance: "5", _oneway: "true" } }, { "ja-Hrkt": { _desired: "ja-Hira", _distance: "5", _oneway: "true" } }, { "ja-Hrkt": { _desired: "ja-Kana", _distance: "5", _oneway: "true" } }, { "ko-Kore": { _desired: "ko-Hani", _distance: "5", _oneway: "true" } }, { "ko-Kore": { _desired: "ko-Hang", _distance: "5", _oneway: "true" } }, { "ko-Kore": { _desired: "ko-Jamo", _distance: "5", _oneway: "true" } }, { "ko-Hang": { _desired: "ko-Jamo", _distance: "5", _oneway: "true" } }, { "*-*": { _desired: "*-*", _distance: "50" } }, { "ar-*-$maghreb": { _desired: "ar-*-$maghreb", _distance: "4" } }, { "ar-*-$!maghreb": { _desired: "ar-*-$!maghreb", _distance: "4" } }, { "ar-*-*": { _desired: "ar-*-*", _distance: "5" } }, { "en-*-$enUS": { _desired: "en-*-$enUS", _distance: "4" } }, { "en-*-GB": { _desired: "en-*-$!enUS", _distance: "3" } }, { "en-*-$!enUS": { _desired: "en-*-$!enUS", _distance: "4" } }, { "en-*-*": { _desired: "en-*-*", _distance: "5" } }, { "es-*-$americas": { _desired: "es-*-$americas", _distance: "4" } }, { "es-*-$!americas": { _desired: "es-*-$!americas", _distance: "4" } }, { "es-*-*": { _desired: "es-*-*", _distance: "5" } }, { "pt-*-$americas": { _desired: "pt-*-$americas", _distance: "4" } }, { "pt-*-$!americas": { _desired: "pt-*-$!americas", _distance: "4" } }, { "pt-*-*": { _desired: "pt-*-*", _distance: "5" } }, { "zh-Hant-$cnsar": { _desired: "zh-Hant-$cnsar", _distance: "4" } }, { "zh-Hant-$!cnsar": { _desired: "zh-Hant-$!cnsar", _distance: "4" } }, { "zh-Hant-*": { _desired: "zh-Hant-*", _distance: "5" } }, { "*-*-*": { _desired: "*-*-*", _distance: "4" } }] }, c0 = { "001": ["001", "001-status-grouping", "002", "005", "009", "011", "013", "014", "015", "017", "018", "019", "021", "029", "030", "034", "035", "039", "053", "054", "057", "061", "142", "143", "145", "150", "151", "154", "155", "AC", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CP", "CQ", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DG", "DJ", "DK", "DM", "DO", "DZ", "EA", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "EU", "EZ", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "IC", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "QO", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TA", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "UN", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW"], "002": ["002", "002-status-grouping", "011", "014", "015", "017", "018", "202", "AO", "BF", "BI", "BJ", "BW", "CD", "CF", "CG", "CI", "CM", "CV", "DJ", "DZ", "EA", "EG", "EH", "ER", "ET", "GA", "GH", "GM", "GN", "GQ", "GW", "IC", "IO", "KE", "KM", "LR", "LS", "LY", "MA", "MG", "ML", "MR", "MU", "MW", "MZ", "NA", "NE", "NG", "RE", "RW", "SC", "SD", "SH", "SL", "SN", "SO", "SS", "ST", "SZ", "TD", "TF", "TG", "TN", "TZ", "UG", "YT", "ZA", "ZM", "ZW"], "003": ["003", "013", "021", "029", "AG", "AI", "AW", "BB", "BL", "BM", "BQ", "BS", "BZ", "CA", "CR", "CU", "CW", "DM", "DO", "GD", "GL", "GP", "GT", "HN", "HT", "JM", "KN", "KY", "LC", "MF", "MQ", "MS", "MX", "NI", "PA", "PM", "PR", "SV", "SX", "TC", "TT", "US", "VC", "VG", "VI"], "005": ["005", "AR", "BO", "BR", "BV", "CL", "CO", "EC", "FK", "GF", "GS", "GY", "PE", "PY", "SR", "UY", "VE"], "009": ["009", "053", "054", "057", "061", "AC", "AQ", "AS", "AU", "CC", "CK", "CP", "CX", "DG", "FJ", "FM", "GU", "HM", "KI", "MH", "MP", "NC", "NF", "NR", "NU", "NZ", "PF", "PG", "PN", "PW", "QO", "SB", "TA", "TK", "TO", "TV", "UM", "VU", "WF", "WS"], "011": ["011", "BF", "BJ", "CI", "CV", "GH", "GM", "GN", "GW", "LR", "ML", "MR", "NE", "NG", "SH", "SL", "SN", "TG"], "013": ["013", "BZ", "CR", "GT", "HN", "MX", "NI", "PA", "SV"], "014": ["014", "BI", "DJ", "ER", "ET", "IO", "KE", "KM", "MG", "MU", "MW", "MZ", "RE", "RW", "SC", "SO", "SS", "TF", "TZ", "UG", "YT", "ZM", "ZW"], "015": ["015", "DZ", "EA", "EG", "EH", "IC", "LY", "MA", "SD", "TN"], "017": ["017", "AO", "CD", "CF", "CG", "CM", "GA", "GQ", "ST", "TD"], "018": ["018", "BW", "LS", "NA", "SZ", "ZA"], "019": ["003", "005", "013", "019", "019-status-grouping", "021", "029", "419", "AG", "AI", "AR", "AW", "BB", "BL", "BM", "BO", "BQ", "BR", "BS", "BV", "BZ", "CA", "CL", "CO", "CR", "CU", "CW", "DM", "DO", "EC", "FK", "GD", "GF", "GL", "GP", "GS", "GT", "GY", "HN", "HT", "JM", "KN", "KY", "LC", "MF", "MQ", "MS", "MX", "NI", "PA", "PE", "PM", "PR", "PY", "SR", "SV", "SX", "TC", "TT", "US", "UY", "VC", "VE", "VG", "VI"], "021": ["021", "BM", "CA", "GL", "PM", "US"], "029": ["029", "AG", "AI", "AW", "BB", "BL", "BQ", "BS", "CU", "CW", "DM", "DO", "GD", "GP", "HT", "JM", "KN", "KY", "LC", "MF", "MQ", "MS", "PR", "SX", "TC", "TT", "VC", "VG", "VI"], "030": ["030", "CN", "HK", "JP", "KP", "KR", "MN", "MO", "TW"], "034": ["034", "AF", "BD", "BT", "IN", "IR", "LK", "MV", "NP", "PK"], "035": ["035", "BN", "ID", "KH", "LA", "MM", "MY", "PH", "SG", "TH", "TL", "VN"], "039": ["039", "AD", "AL", "BA", "ES", "GI", "GR", "HR", "IT", "ME", "MK", "MT", "PT", "RS", "SI", "SM", "VA", "XK"], "053": ["053", "AU", "CC", "CX", "HM", "NF", "NZ"], "054": ["054", "FJ", "NC", "PG", "SB", "VU"], "057": ["057", "FM", "GU", "KI", "MH", "MP", "NR", "PW", "UM"], "061": ["061", "AS", "CK", "NU", "PF", "PN", "TK", "TO", "TV", "WF", "WS"], 142: ["030", "034", "035", "142", "143", "145", "AE", "AF", "AM", "AZ", "BD", "BH", "BN", "BT", "CN", "CY", "GE", "HK", "ID", "IL", "IN", "IQ", "IR", "JO", "JP", "KG", "KH", "KP", "KR", "KW", "KZ", "LA", "LB", "LK", "MM", "MN", "MO", "MV", "MY", "NP", "OM", "PH", "PK", "PS", "QA", "SA", "SG", "SY", "TH", "TJ", "TL", "TM", "TR", "TW", "UZ", "VN", "YE"], 143: ["143", "KG", "KZ", "TJ", "TM", "UZ"], 145: ["145", "AE", "AM", "AZ", "BH", "CY", "GE", "IL", "IQ", "JO", "KW", "LB", "OM", "PS", "QA", "SA", "SY", "TR", "YE"], 150: ["039", "150", "151", "154", "155", "AD", "AL", "AT", "AX", "BA", "BE", "BG", "BY", "CH", "CQ", "CZ", "DE", "DK", "EE", "ES", "FI", "FO", "FR", "GB", "GG", "GI", "GR", "HR", "HU", "IE", "IM", "IS", "IT", "JE", "LI", "LT", "LU", "LV", "MC", "MD", "ME", "MK", "MT", "NL", "NO", "PL", "PT", "RO", "RS", "RU", "SE", "SI", "SJ", "SK", "SM", "UA", "VA", "XK"], 151: ["151", "BG", "BY", "CZ", "HU", "MD", "PL", "RO", "RU", "SK", "UA"], 154: ["154", "AX", "CQ", "DK", "EE", "FI", "FO", "GB", "GG", "IE", "IM", "IS", "JE", "LT", "LV", "NO", "SE", "SJ"], 155: ["155", "AT", "BE", "CH", "DE", "FR", "LI", "LU", "MC", "NL"], 202: ["011", "014", "017", "018", "202", "AO", "BF", "BI", "BJ", "BW", "CD", "CF", "CG", "CI", "CM", "CV", "DJ", "ER", "ET", "GA", "GH", "GM", "GN", "GQ", "GW", "IO", "KE", "KM", "LR", "LS", "MG", "ML", "MR", "MU", "MW", "MZ", "NA", "NE", "NG", "RE", "RW", "SC", "SH", "SL", "SN", "SO", "SS", "ST", "SZ", "TD", "TF", "TG", "TZ", "UG", "YT", "ZA", "ZM", "ZW"], 419: ["005", "013", "029", "419", "AG", "AI", "AR", "AW", "BB", "BL", "BO", "BQ", "BR", "BS", "BV", "BZ", "CL", "CO", "CR", "CU", "CW", "DM", "DO", "EC", "FK", "GD", "GF", "GP", "GS", "GT", "GY", "HN", "HT", "JM", "KN", "KY", "LC", "MF", "MQ", "MS", "MX", "NI", "PA", "PE", "PR", "PY", "SR", "SV", "SX", "TC", "TT", "UY", "VC", "VE", "VG", "VI"], EU: ["AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "EU", "FI", "FR", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK"], EZ: ["AT", "BE", "CY", "DE", "EE", "ES", "EZ", "FI", "FR", "GR", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK"], QO: ["AC", "AQ", "CP", "DG", "QO", "TA"], UN: ["AD", "AE", "AF", "AG", "AL", "AM", "AO", "AR", "AT", "AU", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BN", "BO", "BR", "BS", "BT", "BW", "BY", "BZ", "CA", "CD", "CF", "CG", "CH", "CI", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "ER", "ES", "ET", "FI", "FJ", "FM", "FR", "GA", "GB", "GD", "GE", "GH", "GM", "GN", "GQ", "GR", "GT", "GW", "GY", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IN", "IQ", "IR", "IS", "IT", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MG", "MH", "MK", "ML", "MM", "MN", "MR", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NE", "NG", "NI", "NL", "NO", "NP", "NR", "NZ", "OM", "PA", "PE", "PG", "PH", "PK", "PL", "PT", "PW", "PY", "QA", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SI", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SY", "SZ", "TD", "TG", "TH", "TJ", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TZ", "UA", "UG", "UN", "US", "UY", "UZ", "VC", "VE", "VN", "VU", "WS", "YE", "ZA", "ZM", "ZW"] }, c1 = /-u(?:-[0-9a-z]{2,8})+/gi;
      function c2(a10, b10, c10 = Error) {
        if (!a10) throw new c10(b10);
      }
      function c3(a10, b10, c10) {
        let [d10, e10, f10] = b10.split("-"), g2 = true;
        if (f10 && "$" === f10[0]) {
          let b11 = "!" !== f10[1], d11 = (b11 ? c10[f10.slice(1)] : c10[f10.slice(2)]).map((a11) => c0[a11] || [a11]).reduce((a11, b12) => [...a11, ...b12], []);
          g2 &&= d11.indexOf(a10.region || "") > -1 == b11;
        } else g2 &&= !a10.region || "*" === f10 || f10 === a10.region;
        return g2 &&= !a10.script || "*" === e10 || e10 === a10.script, g2 &&= !a10.language || "*" === d10 || d10 === a10.language;
      }
      function c4(a10) {
        return [a10.language, a10.script, a10.region].filter(Boolean).join("-");
      }
      function c5(a10, b10, c10) {
        for (let d10 of c10.matches) {
          let e10 = c3(a10, d10.desired, c10.matchVariables) && c3(b10, d10.supported, c10.matchVariables);
          if (d10.oneway || e10 || (e10 = c3(a10, d10.supported, c10.matchVariables) && c3(b10, d10.desired, c10.matchVariables)), e10) {
            let e11 = 10 * d10.distance;
            if (c10.paradigmLocales.indexOf(c4(a10)) > -1 != c10.paradigmLocales.indexOf(c4(b10)) > -1) return e11 - 1;
            return e11;
          }
        }
        throw Error("No matching distance found");
      }
      let c6 = (A = function(a10, b10) {
        let c10 = new Intl.Locale(a10).maximize(), d10 = new Intl.Locale(b10).maximize(), e10 = { language: c10.language, script: c10.script || "", region: c10.region || "" }, g2 = { language: d10.language, script: d10.script || "", region: d10.region || "" }, h2 = 0, i2 = (function() {
          if (!f) {
            let a11 = c_["written-new"][0]?.paradigmLocales?._locales.split(" "), b11 = c_["written-new"].slice(1, 5);
            f = { matches: c_["written-new"].slice(5).map((a12) => {
              let b12 = Object.keys(a12)[0], c11 = a12[b12];
              return { supported: b12, desired: c11._desired, distance: +c11._distance, oneway: "true" === c11.oneway };
            }, {}), matchVariables: b11.reduce((a12, b12) => {
              let c11 = Object.keys(b12)[0], d11 = b12[c11];
              return a12[c11.slice(1)] = d11._value.split("+"), a12;
            }, {}), paradigmLocales: [...a11, ...a11.map((a12) => new Intl.Locale(a12.replace(/_/g, "-")).maximize().toString())] };
          }
          return f;
        })();
        return e10.language !== g2.language && (h2 += c5({ language: c10.language, script: "", region: "" }, { language: d10.language, script: "", region: "" }, i2)), e10.script !== g2.script && (h2 += c5({ language: c10.language, script: e10.script, region: "" }, { language: d10.language, script: g2.script, region: "" }, i2)), e10.region !== g2.region && (h2 += c5(e10, g2, i2)), h2;
      }, j = (B = { serializer: (a10) => `${a10[0]}|${a10[1]}` }).cache ? B.cache : { create: function() {
        return new c$();
      } }, k = B && B.serializer ? B.serializer : function() {
        return JSON.stringify(arguments);
      }, (B && B.strategy ? B.strategy : function(a10, b10) {
        var c10, d10;
        let e10 = 1 === a10.length ? cY : cZ;
        return c10 = b10.cache.create(), d10 = b10.serializer, e10.bind(this, a10, c10, d10);
      })(A, { cache: j, serializer: k })), c7 = /* @__PURE__ */ new WeakMap();
      function c8(a10) {
        return Intl.getCanonicalLocales(a10)[0];
      }
      let c9 = /* @__PURE__ */ new WeakMap();
      var da = c(579);
      function db(a10, b10, c10) {
        let d10, e10 = new da({ headers: { "accept-language": a10.get("accept-language") || void 0 } }).languages();
        try {
          var f10;
          let a11 = b10.slice().sort((a12, b11) => b11.length - a12.length);
          f10 = (function(a12, b11, c11, d11, e11, f11) {
            let g2, h2;
            if ("lookup" === c11.localeMatcher) g2 = (function(a13, b12, c12) {
              let d12 = { locale: "" };
              for (let c13 of b12) {
                let b13 = c13.replace(c1, ""), e12 = (function(a14, b14) {
                  let c14 = c9.get(a14);
                  c14 || (c14 = new Set(a14), c9.set(a14, c14));
                  let d13 = b14;
                  for (; ; ) {
                    if (c14.has(d13)) return d13;
                    let a15 = d13.lastIndexOf("-");
                    if (!~a15) return;
                    a15 >= 2 && "-" === d13[a15 - 2] && (a15 -= 2), d13 = d13.slice(0, a15);
                  }
                })(a13, b13);
                if (e12) return d12.locale = e12, c13 !== b13 && (d12.extension = c13.slice(b13.length, c13.length)), d12;
              }
              return d12.locale = c12(), d12;
            })(Array.from(a12), b11, f11);
            else {
              var i2;
              let c12, d12, e12, h3, j3;
              i2 = Array.from(a12), e12 = [], h3 = b11.reduce((a13, b12) => {
                let c13 = b12.replace(c1, "");
                return e12.push(c13), a13[c13] = b12, a13;
              }, {}), (j3 = (function(a13, b12, c13 = 838) {
                let d13 = 1 / 0, e13 = { matchedDesiredLocale: "", distances: {} }, f12 = c7.get(b12);
                f12 || (f12 = b12.map((a14) => {
                  try {
                    return Intl.getCanonicalLocales([a14])[0] || a14;
                  } catch {
                    return a14;
                  }
                }), c7.set(b12, f12));
                let g3 = new Set(f12);
                for (let b13 = 0; b13 < a13.length; b13++) {
                  let c14 = a13[b13];
                  if (g3.has(c14)) {
                    let a14 = 0 + 40 * b13;
                    if (e13.distances[c14] = { [c14]: a14 }, a14 < d13 && (d13 = a14, e13.matchedDesiredLocale = c14, e13.matchedSupportedLocale = c14), 0 === b13) return e13;
                  }
                }
                for (let b13 = 0; b13 < a13.length; b13++) {
                  let c14 = a13[b13];
                  try {
                    let a14 = new Intl.Locale(c14).maximize().toString();
                    if (a14 !== c14) {
                      let f13 = (function(a15) {
                        let b14 = [], c15 = a15;
                        for (; c15; ) {
                          b14.push(c15);
                          let a16 = c15.lastIndexOf("-");
                          if (-1 === a16) break;
                          c15 = c15.substring(0, a16);
                        }
                        return b14;
                      })(a14);
                      for (let h4 = 0; h4 < f13.length; h4++) {
                        let i3 = f13[h4];
                        if (i3 !== c14 && g3.has(i3)) {
                          let f14;
                          try {
                            f14 = new Intl.Locale(i3).maximize().toString() === a14 ? 0 + 40 * b13 : 10 * h4 + 40 * b13;
                          } catch {
                            f14 = 10 * h4 + 40 * b13;
                          }
                          e13.distances[c14] || (e13.distances[c14] = {}), e13.distances[c14][i3] = f14, f14 < d13 && (d13 = f14, e13.matchedDesiredLocale = c14, e13.matchedSupportedLocale = i3);
                          break;
                        }
                      }
                    }
                  } catch {
                  }
                }
                return e13.matchedSupportedLocale && 0 === d13 || (d13 = 1 / 0, a13.forEach((a14, c14) => {
                  e13.distances[a14] || (e13.distances[a14] = {}), f12.forEach((f13, g4) => {
                    let h4 = b12[g4], i3 = c6(a14, f13) + 0 + 40 * c14;
                    e13.distances[a14][h4] = i3, i3 < d13 && (d13 = i3, e13.matchedDesiredLocale = a14, e13.matchedSupportedLocale = h4);
                  });
                }), d13 >= c13 && (e13.matchedDesiredLocale = void 0, e13.matchedSupportedLocale = void 0)), e13;
              })(e12, i2)).matchedSupportedLocale && j3.matchedDesiredLocale && (c12 = j3.matchedSupportedLocale, d12 = h3[j3.matchedDesiredLocale].slice(j3.matchedDesiredLocale.length) || void 0), g2 = c12 ? { locale: c12, extension: d12 } : { locale: f11() };
            }
            null == g2 && (g2 = { locale: f11(), extension: "" });
            let j2 = g2.locale, k2 = e11[j2], l2 = { locale: "en", dataLocale: j2 };
            h2 = g2.extension ? (function(a13) {
              let b12;
              c2(a13 === a13.toLowerCase(), "Expected extension to be lowercase"), c2("-u-" === a13.slice(0, 3), "Expected extension to be a Unicode locale extension");
              let c12 = [], d12 = [], e12 = a13.length, f12 = 3;
              for (; f12 < e12; ) {
                let g3, h3 = a13.indexOf("-", f12);
                g3 = -1 === h3 ? e12 - f12 : h3 - f12;
                let i3 = a13.slice(f12, f12 + g3);
                c2(g3 >= 2, "Expected a subtag to have at least 2 characters"), void 0 === b12 && 2 != g3 ? -1 === c12.indexOf(i3) && c12.push(i3) : 2 === g3 ? (b12 = { key: i3, value: "" }, void 0 === d12.find((a14) => a14.key === b12?.key) && d12.push(b12)) : b12?.value === "" ? b12.value = i3 : (c2(void 0 !== b12, "Expected keyword to be defined"), b12.value += "-" + i3), f12 += g3 + 1;
              }
              return { attributes: c12, keywords: d12 };
            })(g2.extension).keywords : [];
            let m2 = [];
            for (let a13 of d11) {
              let b12, d12 = k2?.[a13] ?? [];
              c2(Array.isArray(d12), `keyLocaleData for ${a13} must be an array`);
              let e12 = d12[0];
              c2(void 0 === e12 || "string" == typeof e12, "value must be a string or undefined");
              let f12 = h2.find((b13) => b13.key === a13);
              if (f12) {
                let c12 = f12.value;
                "" !== c12 ? d12.indexOf(c12) > -1 && (b12 = { key: a13, value: e12 = c12 }) : d12.indexOf("true") > -1 && (b12 = { key: a13, value: e12 = "true" });
              }
              let g3 = c11[a13];
              c2(null == g3 || "string" == typeof g3, "optionsValue must be a string or undefined"), "string" == typeof g3 && "" === (g3 = (function(a14, b13) {
                let c12 = b13.toLowerCase();
                return c2(void 0 !== a14, "ukey must be defined"), c12;
              })(a13.toLowerCase(), g3)) && (g3 = "true"), g3 !== e12 && d12.indexOf(g3) > -1 && (e12 = g3, b12 = void 0), b12 && m2.push(b12), l2[a13] = e12;
            }
            return m2.length > 0 && (j2 = (function(a13, b12, c12) {
              c2(-1 === a13.indexOf("-u-"), "Expected locale to not have a Unicode locale extension");
              let d12 = "-u";
              for (let a14 of b12) d12 += `-${a14}`;
              for (let a14 of c12) {
                let { key: b13, value: c13 } = a14;
                d12 += `-${b13}`, "" !== c13 && (d12 += `-${c13}`);
              }
              if ("-u" === d12) return c8(a13);
              let e12 = a13.indexOf("-x-");
              return c8(-1 === e12 ? a13 + d12 : a13.slice(0, e12) + d12 + a13.slice(e12));
            })(j2, [], m2)), l2.locale = j2, l2;
          })(a11, Intl.getCanonicalLocales(e10), { localeMatcher: "best fit" }, [], {}, () => c10).locale, d10 = b10.find((a12) => a12.toLowerCase() === f10.toLowerCase());
        } catch {
        }
        return d10;
      }
      function dc(a10, b10) {
        if (a10.localeCookie && b10.has(a10.localeCookie.name)) {
          let c10 = b10.get(a10.localeCookie.name)?.value;
          if (c10 && a10.locales.includes(c10)) return c10;
        }
      }
      function dd(a10, b10, c10, d10) {
        let e10;
        return d10 && (e10 = cT(d10, a10.locales, a10.localePrefix)?.locale), !e10 && a10.localeDetection && (e10 = dc(a10, c10)), !e10 && a10.localeDetection && (e10 = db(b10, a10.locales, a10.defaultLocale)), e10 || (e10 = a10.defaultLocale), e10;
      }
      function de(a10, b10) {
        var c10 = {};
        for (var d10 in a10) Object.prototype.hasOwnProperty.call(a10, d10) && 0 > b10.indexOf(d10) && (c10[d10] = a10[d10]);
        if (null != a10 && "function" == typeof Object.getOwnPropertySymbols) for (var e10 = 0, d10 = Object.getOwnPropertySymbols(a10); e10 < d10.length; e10++) 0 > b10.indexOf(d10[e10]) && Object.prototype.propertyIsEnumerable.call(a10, d10[e10]) && (c10[d10[e10]] = a10[d10[e10]]);
        return c10;
      }
      "function" == typeof SuppressedError && SuppressedError;
      class df extends Error {
        constructor(a10, b10 = "FunctionsError", c10) {
          super(a10), this.name = b10, this.context = c10;
        }
        toJSON() {
          return { name: this.name, message: this.message, context: this.context };
        }
      }
      class dg extends df {
        constructor(a10) {
          super("Failed to send a request to the Edge Function", "FunctionsFetchError", a10);
        }
      }
      class dh extends df {
        constructor(a10) {
          super("Relay Error invoking the Edge Function", "FunctionsRelayError", a10);
        }
      }
      class di extends df {
        constructor(a10) {
          super("Edge Function returned a non-2xx status code", "FunctionsHttpError", a10);
        }
      }
      (C = M || (M = {})).Any = "any", C.ApNortheast1 = "ap-northeast-1", C.ApNortheast2 = "ap-northeast-2", C.ApSouth1 = "ap-south-1", C.ApSoutheast1 = "ap-southeast-1", C.ApSoutheast2 = "ap-southeast-2", C.CaCentral1 = "ca-central-1", C.EuCentral1 = "eu-central-1", C.EuWest1 = "eu-west-1", C.EuWest2 = "eu-west-2", C.EuWest3 = "eu-west-3", C.SaEast1 = "sa-east-1", C.UsEast1 = "us-east-1", C.UsWest1 = "us-west-1", C.UsWest2 = "us-west-2";
      class dj {
        constructor(a10, { headers: b10 = {}, customFetch: c10, region: d10 = M.Any } = {}) {
          this.url = a10, this.headers = b10, this.region = d10, this.fetch = /* @__PURE__ */ ((a11) => a11 ? (...b11) => a11(...b11) : (...a12) => fetch(...a12))(c10);
        }
        setAuth(a10) {
          this.headers.Authorization = `Bearer ${a10}`;
        }
        invoke(a10) {
          var b10, c10, d10, e10;
          return b10 = this, c10 = arguments, d10 = void 0, e10 = function* (a11, b11 = {}) {
            var c11;
            let d11, e11;
            try {
              let f10, { headers: g2, method: h2, body: i2, signal: j2, timeout: k2 } = b11, l2 = {}, { region: m2 } = b11;
              m2 || (m2 = this.region);
              let n2 = new URL(`${this.url}/${a11}`);
              m2 && "any" !== m2 && (l2["x-region"] = m2, n2.searchParams.set("forceFunctionRegion", m2)), i2 && (g2 && !Object.prototype.hasOwnProperty.call(g2, "Content-Type") || !g2) ? "u" > typeof Blob && i2 instanceof Blob || i2 instanceof ArrayBuffer ? (l2["Content-Type"] = "application/octet-stream", f10 = i2) : "string" == typeof i2 ? (l2["Content-Type"] = "text/plain", f10 = i2) : "u" > typeof FormData && i2 instanceof FormData ? f10 = i2 : (l2["Content-Type"] = "application/json", f10 = JSON.stringify(i2)) : f10 = !i2 || "string" == typeof i2 || "u" > typeof Blob && i2 instanceof Blob || i2 instanceof ArrayBuffer || "u" > typeof FormData && i2 instanceof FormData ? i2 : JSON.stringify(i2);
              let o2 = j2;
              k2 && (e11 = new AbortController(), d11 = setTimeout(() => e11.abort(), k2), j2 ? (o2 = e11.signal, j2.addEventListener("abort", () => e11.abort())) : o2 = e11.signal);
              let p2 = yield this.fetch(n2.toString(), { method: h2 || "POST", headers: Object.assign(Object.assign(Object.assign({}, l2), this.headers), g2), body: f10, signal: o2 }).catch((a12) => {
                throw new dg(a12);
              }), q2 = p2.headers.get("x-relay-error");
              if (q2 && "true" === q2) throw new dh(p2);
              if (!p2.ok) throw new di(p2);
              let r2 = (null != (c11 = p2.headers.get("Content-Type")) ? c11 : "text/plain").split(";")[0].trim();
              return { data: "application/json" === r2 ? yield p2.json() : "application/octet-stream" === r2 || "application/pdf" === r2 ? yield p2.blob() : "text/event-stream" === r2 ? p2 : "multipart/form-data" === r2 ? yield p2.formData() : yield p2.text(), error: null, response: p2 };
            } catch (a12) {
              return { data: null, error: a12, response: a12 instanceof di || a12 instanceof dh ? a12.context : void 0 };
            } finally {
              d11 && clearTimeout(d11);
            }
          }, new (d10 || (d10 = Promise))(function(a11, f10) {
            function g2(a12) {
              try {
                i2(e10.next(a12));
              } catch (a13) {
                f10(a13);
              }
            }
            function h2(a12) {
              try {
                i2(e10.throw(a12));
              } catch (a13) {
                f10(a13);
              }
            }
            function i2(b11) {
              var c11;
              b11.done ? a11(b11.value) : ((c11 = b11.value) instanceof d10 ? c11 : new d10(function(a12) {
                a12(c11);
              })).then(g2, h2);
            }
            i2((e10 = e10.apply(b10, c10 || [])).next());
          });
        }
      }
      let dk = (a10) => Math.min(1e3 * 2 ** a10, 3e4), dl = [520, 503], dm = ["GET", "HEAD", "OPTIONS"];
      var dn = class extends Error {
        constructor(a10) {
          super(a10.message), this.name = "PostgrestError", this.details = a10.details, this.hint = a10.hint, this.code = a10.code;
        }
        toJSON() {
          return { name: this.name, message: this.message, details: this.details, hint: this.hint, code: this.code };
        }
      };
      function dp(a10, b10) {
        return new Promise((c10) => {
          if (null == b10 ? void 0 : b10.aborted) return void c10();
          let d10 = setTimeout(() => {
            null == b10 || b10.removeEventListener("abort", e10), c10();
          }, a10);
          function e10() {
            clearTimeout(d10), c10();
          }
          null == b10 || b10.addEventListener("abort", e10);
        });
      }
      var dq = class {
        constructor(a10) {
          var b10, c10, d10, e10, f10;
          this.shouldThrowOnError = false, this.retryEnabled = true, this.method = a10.method, this.url = a10.url, this.headers = new Headers(a10.headers), this.schema = a10.schema, this.body = a10.body, this.shouldThrowOnError = null != (b10 = a10.shouldThrowOnError) && b10, this.signal = a10.signal, this.isMaybeSingle = null != (c10 = a10.isMaybeSingle) && c10, this.shouldStripNulls = null != (d10 = a10.shouldStripNulls) && d10, this.urlLengthLimit = null != (e10 = a10.urlLengthLimit) ? e10 : 8e3, this.retryEnabled = null == (f10 = a10.retry) || f10, a10.fetch ? this.fetch = a10.fetch : this.fetch = fetch;
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        stripNulls() {
          if ("text/csv" === this.headers.get("Accept")) throw Error("stripNulls() cannot be used with csv()");
          return this.shouldStripNulls = true, this;
        }
        setHeader(a10, b10) {
          return this.headers = new Headers(this.headers), this.headers.set(a10, b10), this;
        }
        retry(a10) {
          return this.retryEnabled = a10, this;
        }
        then(a10, b10) {
          var c10 = this;
          if (void 0 === this.schema || (["GET", "HEAD"].includes(this.method) ? this.headers.set("Accept-Profile", this.schema) : this.headers.set("Content-Profile", this.schema)), "GET" !== this.method && "HEAD" !== this.method && this.headers.set("Content-Type", "application/json"), this.shouldStripNulls) {
            let a11 = this.headers.get("Accept");
            "application/vnd.pgrst.object+json" === a11 ? this.headers.set("Accept", "application/vnd.pgrst.object+json;nulls=stripped") : a11 && "application/json" !== a11 || this.headers.set("Accept", "application/vnd.pgrst.array+json;nulls=stripped");
          }
          let d10 = this.fetch, e10 = (async () => {
            let a11 = 0;
            for (; ; ) {
              var b11, e11, f10, g2, h2;
              let i2, j2 = new Headers(c10.headers);
              a11 > 0 && j2.set("X-Retry-Count", String(a11));
              try {
                i2 = await d10(c10.url.toString(), { method: c10.method, headers: j2, body: JSON.stringify(c10.body, (a12, b12) => "bigint" == typeof b12 ? b12.toString() : b12), signal: c10.signal });
              } catch (b12) {
                if ((null == b12 ? void 0 : b12.name) === "AbortError" || (null == b12 ? void 0 : b12.code) === "ABORT_ERR" || !dm.includes(c10.method)) throw b12;
                if (c10.retryEnabled && a11 < 3) {
                  let b13 = dk(a11);
                  a11++, await dp(b13, c10.signal);
                  continue;
                }
                throw b12;
              }
              if (b11 = c10.method, e11 = i2.status, f10 = a11, c10.retryEnabled && !(f10 >= 3) && dm.includes(b11) && dl.includes(e11) && 1) {
                let b12 = null != (g2 = null == (h2 = i2.headers) ? void 0 : h2.get("Retry-After")) ? g2 : null, d11 = null !== b12 ? 1e3 * Math.max(0, parseInt(b12, 10) || 0) : dk(a11);
                await i2.text(), a11++, await dp(d11, c10.signal);
                continue;
              }
              return await c10.processResponse(i2);
            }
          })();
          return this.shouldThrowOnError || (e10 = e10.catch((a11) => {
            var b11, c11, d11, e11, f10, g2;
            let h2 = "", i2 = "", j2 = "", k2 = null == a11 ? void 0 : a11.cause;
            if (k2) {
              let b12 = null != (c11 = null == k2 ? void 0 : k2.message) ? c11 : "", g3 = null != (d11 = null == k2 ? void 0 : k2.code) ? d11 : "";
              h2 = `${null != (e11 = null == a11 ? void 0 : a11.name) ? e11 : "FetchError"}: ${null == a11 ? void 0 : a11.message}

Caused by: ${null != (f10 = null == k2 ? void 0 : k2.name) ? f10 : "Error"}: ${b12}`, g3 && (h2 += ` (${g3})`), (null == k2 ? void 0 : k2.stack) && (h2 += `
${k2.stack}`);
            } else h2 = null != (g2 = null == a11 ? void 0 : a11.stack) ? g2 : "";
            let l2 = this.url.toString().length;
            return (null == a11 ? void 0 : a11.name) === "AbortError" || (null == a11 ? void 0 : a11.code) === "ABORT_ERR" ? (j2 = "", i2 = "Request was aborted (timeout or manual cancellation)", l2 > this.urlLengthLimit && (i2 += `. Note: Your request URL is ${l2} characters, which may exceed server limits. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [many IDs])), consider using an RPC function to pass values server-side.`)) : ((null == k2 ? void 0 : k2.name) === "HeadersOverflowError" || (null == k2 ? void 0 : k2.code) === "UND_ERR_HEADERS_OVERFLOW") && (j2 = "", i2 = "HTTP headers exceeded server limits (typically 16KB)", l2 > this.urlLengthLimit && (i2 += `. Your request URL is ${l2} characters. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [200+ IDs])), consider using an RPC function instead.`)), { success: false, error: { message: `${null != (b11 = null == a11 ? void 0 : a11.name) ? b11 : "FetchError"}: ${null == a11 ? void 0 : a11.message}`, details: h2, hint: i2, code: j2 }, data: null, count: null, status: 0, statusText: "" };
          })), e10.then(a10, b10);
        }
        async processResponse(a10) {
          var b10, c10, d10;
          let e10 = null, f10 = null, g2 = null, h2 = a10.status, i2 = a10.statusText;
          if (a10.ok) {
            if ("HEAD" !== this.method) {
              let b11 = await a10.text();
              "" === b11 || (f10 = "text/csv" === this.headers.get("Accept") || this.headers.get("Accept") && (null == (d10 = this.headers.get("Accept")) ? void 0 : d10.includes("application/vnd.pgrst.plan+text")) ? b11 : JSON.parse(b11));
            }
            let j2 = null == (b10 = this.headers.get("Prefer")) ? void 0 : b10.match(/count=(exact|planned|estimated)/), k2 = null == (c10 = a10.headers.get("content-range")) ? void 0 : c10.split("/");
            j2 && k2 && k2.length > 1 && (g2 = parseInt(k2[1])), this.isMaybeSingle && Array.isArray(f10) && (f10.length > 1 ? (e10 = { code: "PGRST116", details: `Results contain ${f10.length} rows, application/vnd.pgrst.object+json requires 1 row`, hint: null, message: "JSON object requested, multiple (or no) rows returned" }, f10 = null, g2 = null, h2 = 406, i2 = "Not Acceptable") : f10 = 1 === f10.length ? f10[0] : null);
          } else {
            let b11 = await a10.text();
            try {
              e10 = JSON.parse(b11), Array.isArray(e10) && 404 === a10.status && (f10 = [], e10 = null, h2 = 200, i2 = "OK");
            } catch (c11) {
              404 === a10.status && "" === b11 ? (h2 = 204, i2 = "No Content") : e10 = { message: b11 };
            }
            if (e10 && this.shouldThrowOnError) throw new dn(e10);
          }
          return { success: null === e10, error: e10, data: f10, count: g2, status: h2, statusText: i2 };
        }
        returns() {
          return this;
        }
        overrideTypes() {
          return this;
        }
      }, dr = class extends dq {
        select(a10) {
          let b10 = false, c10 = (null != a10 ? a10 : "*").split("").map((a11) => /\s/.test(a11) && !b10 ? "" : ('"' === a11 && (b10 = !b10), a11)).join("");
          return this.url.searchParams.set("select", c10), this.headers.append("Prefer", "return=representation"), this;
        }
        order(a10, { ascending: b10 = true, nullsFirst: c10, foreignTable: d10, referencedTable: e10 = d10 } = {}) {
          let f10 = e10 ? `${e10}.order` : "order", g2 = this.url.searchParams.get(f10);
          return this.url.searchParams.set(f10, `${g2 ? `${g2},` : ""}${a10}.${b10 ? "asc" : "desc"}${void 0 === c10 ? "" : c10 ? ".nullsfirst" : ".nullslast"}`), this;
        }
        limit(a10, { foreignTable: b10, referencedTable: c10 = b10 } = {}) {
          let d10 = void 0 === c10 ? "limit" : `${c10}.limit`;
          return this.url.searchParams.set(d10, `${a10}`), this;
        }
        range(a10, b10, { foreignTable: c10, referencedTable: d10 = c10 } = {}) {
          let e10 = void 0 === d10 ? "offset" : `${d10}.offset`, f10 = void 0 === d10 ? "limit" : `${d10}.limit`;
          return this.url.searchParams.set(e10, `${a10}`), this.url.searchParams.set(f10, `${b10 - a10 + 1}`), this;
        }
        abortSignal(a10) {
          return this.signal = a10, this;
        }
        single() {
          return this.headers.set("Accept", "application/vnd.pgrst.object+json"), this;
        }
        maybeSingle() {
          return this.isMaybeSingle = true, this;
        }
        csv() {
          return this.headers.set("Accept", "text/csv"), this;
        }
        geojson() {
          return this.headers.set("Accept", "application/geo+json"), this;
        }
        explain({ analyze: a10 = false, verbose: b10 = false, settings: c10 = false, buffers: d10 = false, wal: e10 = false, format: f10 = "text" } = {}) {
          var g2;
          let h2 = [a10 ? "analyze" : null, b10 ? "verbose" : null, c10 ? "settings" : null, d10 ? "buffers" : null, e10 ? "wal" : null].filter(Boolean).join("|"), i2 = null != (g2 = this.headers.get("Accept")) ? g2 : "application/json";
          return this.headers.set("Accept", `application/vnd.pgrst.plan+${f10}; for="${i2}"; options=${h2};`), this;
        }
        rollback() {
          return this.headers.append("Prefer", "tx=rollback"), this;
        }
        returns() {
          return this;
        }
        maxAffected(a10) {
          return this.headers.append("Prefer", "handling=strict"), this.headers.append("Prefer", `max-affected=${a10}`), this;
        }
      };
      let ds = RegExp("[,()]");
      var dt = class extends dr {
        eq(a10, b10) {
          return this.url.searchParams.append(a10, `eq.${b10}`), this;
        }
        neq(a10, b10) {
          return this.url.searchParams.append(a10, `neq.${b10}`), this;
        }
        gt(a10, b10) {
          return this.url.searchParams.append(a10, `gt.${b10}`), this;
        }
        gte(a10, b10) {
          return this.url.searchParams.append(a10, `gte.${b10}`), this;
        }
        lt(a10, b10) {
          return this.url.searchParams.append(a10, `lt.${b10}`), this;
        }
        lte(a10, b10) {
          return this.url.searchParams.append(a10, `lte.${b10}`), this;
        }
        like(a10, b10) {
          return this.url.searchParams.append(a10, `like.${b10}`), this;
        }
        likeAllOf(a10, b10) {
          return this.url.searchParams.append(a10, `like(all).{${b10.join(",")}}`), this;
        }
        likeAnyOf(a10, b10) {
          return this.url.searchParams.append(a10, `like(any).{${b10.join(",")}}`), this;
        }
        ilike(a10, b10) {
          return this.url.searchParams.append(a10, `ilike.${b10}`), this;
        }
        ilikeAllOf(a10, b10) {
          return this.url.searchParams.append(a10, `ilike(all).{${b10.join(",")}}`), this;
        }
        ilikeAnyOf(a10, b10) {
          return this.url.searchParams.append(a10, `ilike(any).{${b10.join(",")}}`), this;
        }
        regexMatch(a10, b10) {
          return this.url.searchParams.append(a10, `match.${b10}`), this;
        }
        regexIMatch(a10, b10) {
          return this.url.searchParams.append(a10, `imatch.${b10}`), this;
        }
        is(a10, b10) {
          return this.url.searchParams.append(a10, `is.${b10}`), this;
        }
        isDistinct(a10, b10) {
          return this.url.searchParams.append(a10, `isdistinct.${b10}`), this;
        }
        in(a10, b10) {
          let c10 = Array.from(new Set(b10)).map((a11) => "string" == typeof a11 && ds.test(a11) ? `"${a11}"` : `${a11}`).join(",");
          return this.url.searchParams.append(a10, `in.(${c10})`), this;
        }
        notIn(a10, b10) {
          let c10 = Array.from(new Set(b10)).map((a11) => "string" == typeof a11 && ds.test(a11) ? `"${a11}"` : `${a11}`).join(",");
          return this.url.searchParams.append(a10, `not.in.(${c10})`), this;
        }
        contains(a10, b10) {
          return "string" == typeof b10 ? this.url.searchParams.append(a10, `cs.${b10}`) : Array.isArray(b10) ? this.url.searchParams.append(a10, `cs.{${b10.join(",")}}`) : this.url.searchParams.append(a10, `cs.${JSON.stringify(b10)}`), this;
        }
        containedBy(a10, b10) {
          return "string" == typeof b10 ? this.url.searchParams.append(a10, `cd.${b10}`) : Array.isArray(b10) ? this.url.searchParams.append(a10, `cd.{${b10.join(",")}}`) : this.url.searchParams.append(a10, `cd.${JSON.stringify(b10)}`), this;
        }
        rangeGt(a10, b10) {
          return this.url.searchParams.append(a10, `sr.${b10}`), this;
        }
        rangeGte(a10, b10) {
          return this.url.searchParams.append(a10, `nxl.${b10}`), this;
        }
        rangeLt(a10, b10) {
          return this.url.searchParams.append(a10, `sl.${b10}`), this;
        }
        rangeLte(a10, b10) {
          return this.url.searchParams.append(a10, `nxr.${b10}`), this;
        }
        rangeAdjacent(a10, b10) {
          return this.url.searchParams.append(a10, `adj.${b10}`), this;
        }
        overlaps(a10, b10) {
          return "string" == typeof b10 ? this.url.searchParams.append(a10, `ov.${b10}`) : this.url.searchParams.append(a10, `ov.{${b10.join(",")}}`), this;
        }
        textSearch(a10, b10, { config: c10, type: d10 } = {}) {
          let e10 = "";
          "plain" === d10 ? e10 = "pl" : "phrase" === d10 ? e10 = "ph" : "websearch" === d10 && (e10 = "w");
          let f10 = void 0 === c10 ? "" : `(${c10})`;
          return this.url.searchParams.append(a10, `${e10}fts${f10}.${b10}`), this;
        }
        match(a10) {
          return Object.entries(a10).filter(([a11, b10]) => void 0 !== b10).forEach(([a11, b10]) => {
            this.url.searchParams.append(a11, `eq.${b10}`);
          }), this;
        }
        not(a10, b10, c10) {
          return this.url.searchParams.append(a10, `not.${b10}.${c10}`), this;
        }
        or(a10, { foreignTable: b10, referencedTable: c10 = b10 } = {}) {
          let d10 = c10 ? `${c10}.or` : "or";
          return this.url.searchParams.append(d10, `(${a10})`), this;
        }
        filter(a10, b10, c10) {
          return this.url.searchParams.append(a10, `${b10}.${c10}`), this;
        }
      }, du = class {
        constructor(a10, { headers: b10 = {}, schema: c10, fetch: d10, urlLengthLimit: e10 = 8e3, retry: f10 }) {
          this.url = a10, this.headers = new Headers(b10), this.schema = c10, this.fetch = d10, this.urlLengthLimit = e10, this.retry = f10;
        }
        cloneRequestState() {
          return { url: new URL(this.url.toString()), headers: new Headers(this.headers) };
        }
        select(a10, b10) {
          let { head: c10 = false, count: d10 } = null != b10 ? b10 : {}, e10 = false, f10 = (null != a10 ? a10 : "*").split("").map((a11) => /\s/.test(a11) && !e10 ? "" : ('"' === a11 && (e10 = !e10), a11)).join(""), { url: g2, headers: h2 } = this.cloneRequestState();
          return g2.searchParams.set("select", f10), d10 && h2.append("Prefer", `count=${d10}`), new dt({ method: c10 ? "HEAD" : "GET", url: g2, headers: h2, schema: this.schema, fetch: this.fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
        insert(a10, { count: b10, defaultToNull: c10 = true } = {}) {
          var d10;
          let { url: e10, headers: f10 } = this.cloneRequestState();
          if (b10 && f10.append("Prefer", `count=${b10}`), c10 || f10.append("Prefer", "missing=default"), Array.isArray(a10)) {
            let b11 = a10.reduce((a11, b12) => a11.concat(Object.keys(b12)), []);
            if (b11.length > 0) {
              let a11 = [...new Set(b11)].map((a12) => `"${a12}"`);
              e10.searchParams.set("columns", a11.join(","));
            }
          }
          return new dt({ method: "POST", url: e10, headers: f10, schema: this.schema, body: a10, fetch: null != (d10 = this.fetch) ? d10 : fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
        upsert(a10, { onConflict: b10, ignoreDuplicates: c10 = false, count: d10, defaultToNull: e10 = true } = {}) {
          var f10;
          let { url: g2, headers: h2 } = this.cloneRequestState();
          if (h2.append("Prefer", `resolution=${c10 ? "ignore" : "merge"}-duplicates`), void 0 !== b10 && g2.searchParams.set("on_conflict", b10), d10 && h2.append("Prefer", `count=${d10}`), e10 || h2.append("Prefer", "missing=default"), Array.isArray(a10)) {
            let b11 = a10.reduce((a11, b12) => a11.concat(Object.keys(b12)), []);
            if (b11.length > 0) {
              let a11 = [...new Set(b11)].map((a12) => `"${a12}"`);
              g2.searchParams.set("columns", a11.join(","));
            }
          }
          return new dt({ method: "POST", url: g2, headers: h2, schema: this.schema, body: a10, fetch: null != (f10 = this.fetch) ? f10 : fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
        update(a10, { count: b10 } = {}) {
          var c10;
          let { url: d10, headers: e10 } = this.cloneRequestState();
          return b10 && e10.append("Prefer", `count=${b10}`), new dt({ method: "PATCH", url: d10, headers: e10, schema: this.schema, body: a10, fetch: null != (c10 = this.fetch) ? c10 : fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
        delete({ count: a10 } = {}) {
          var b10;
          let { url: c10, headers: d10 } = this.cloneRequestState();
          return a10 && d10.append("Prefer", `count=${a10}`), new dt({ method: "DELETE", url: c10, headers: d10, schema: this.schema, fetch: null != (b10 = this.fetch) ? b10 : fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
      };
      function dv(a10) {
        return (dv = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(a11) {
          return typeof a11;
        } : function(a11) {
          return a11 && "function" == typeof Symbol && a11.constructor === Symbol && a11 !== Symbol.prototype ? "symbol" : typeof a11;
        })(a10);
      }
      function dw(a10, b10) {
        var c10 = Object.keys(a10);
        if (Object.getOwnPropertySymbols) {
          var d10 = Object.getOwnPropertySymbols(a10);
          b10 && (d10 = d10.filter(function(b11) {
            return Object.getOwnPropertyDescriptor(a10, b11).enumerable;
          })), c10.push.apply(c10, d10);
        }
        return c10;
      }
      function dx(a10) {
        for (var b10 = 1; b10 < arguments.length; b10++) {
          var c10 = null != arguments[b10] ? arguments[b10] : {};
          b10 % 2 ? dw(Object(c10), true).forEach(function(b11) {
            !(function(a11, b12, c11) {
              var d10;
              (d10 = (function(a12, b13) {
                if ("object" != dv(a12) || !a12) return a12;
                var c12 = a12[Symbol.toPrimitive];
                if (void 0 !== c12) {
                  var d11 = c12.call(a12, b13);
                  if ("object" != dv(d11)) return d11;
                  throw TypeError("@@toPrimitive must return a primitive value.");
                }
                return ("string" === b13 ? String : Number)(a12);
              })(b12, "string"), (b12 = "symbol" == dv(d10) ? d10 : d10 + "") in a11) ? Object.defineProperty(a11, b12, { value: c11, enumerable: true, configurable: true, writable: true }) : a11[b12] = c11;
            })(a10, b11, c10[b11]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(a10, Object.getOwnPropertyDescriptors(c10)) : dw(Object(c10)).forEach(function(b11) {
            Object.defineProperty(a10, b11, Object.getOwnPropertyDescriptor(c10, b11));
          });
        }
        return a10;
      }
      var dy = class a10 {
        constructor(a11, { headers: b10 = {}, schema: c10, fetch: d10, timeout: e10, urlLengthLimit: f10 = 8e3, retry: g2 } = {}) {
          this.url = a11, this.headers = new Headers(b10), this.schemaName = c10, this.urlLengthLimit = f10;
          const h2 = null != d10 ? d10 : globalThis.fetch;
          void 0 !== e10 && e10 > 0 ? this.fetch = (a12, b11) => {
            let c11 = new AbortController(), d11 = setTimeout(() => c11.abort(), e10), f11 = null == b11 ? void 0 : b11.signal;
            if (f11) {
              if (f11.aborted) return clearTimeout(d11), h2(a12, b11);
              let e11 = () => {
                clearTimeout(d11), c11.abort();
              };
              return f11.addEventListener("abort", e11, { once: true }), h2(a12, dx(dx({}, b11), {}, { signal: c11.signal })).finally(() => {
                clearTimeout(d11), f11.removeEventListener("abort", e11);
              });
            }
            return h2(a12, dx(dx({}, b11), {}, { signal: c11.signal })).finally(() => clearTimeout(d11));
          } : this.fetch = h2, this.retry = g2;
        }
        from(a11) {
          if (!a11 || "string" != typeof a11 || "" === a11.trim()) throw Error("Invalid relation name: relation must be a non-empty string.");
          return new du(new URL(`${this.url}/${a11}`), { headers: new Headers(this.headers), schema: this.schemaName, fetch: this.fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
        schema(b10) {
          return new a10(this.url, { headers: this.headers, schema: b10, fetch: this.fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
        rpc(a11, b10 = {}, { head: c10 = false, get: d10 = false, count: e10 } = {}) {
          var f10;
          let g2, h2, i2 = new URL(`${this.url}/rpc/${a11}`), j2 = (a12) => null !== a12 && "object" == typeof a12 && (!Array.isArray(a12) || a12.some(j2)), k2 = c10 && Object.values(b10).some(j2);
          k2 ? (g2 = "POST", h2 = b10) : c10 || d10 ? (g2 = c10 ? "HEAD" : "GET", Object.entries(b10).filter(([a12, b11]) => void 0 !== b11).map(([a12, b11]) => [a12, Array.isArray(b11) ? `{${b11.join(",")}}` : `${b11}`]).forEach(([a12, b11]) => {
            i2.searchParams.append(a12, b11);
          })) : (g2 = "POST", h2 = b10);
          let l2 = new Headers(this.headers);
          return k2 ? l2.set("Prefer", e10 ? `count=${e10},return=minimal` : "return=minimal") : e10 && l2.set("Prefer", `count=${e10}`), new dt({ method: g2, url: i2, headers: l2, schema: this.schemaName, body: h2, fetch: null != (f10 = this.fetch) ? f10 : fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
      };
      class dz {
        static detectEnvironment() {
          var a10;
          if ("u" > typeof WebSocket) return { type: "native", wsConstructor: WebSocket };
          let b10 = globalThis;
          if ("u" > typeof globalThis && void 0 !== b10.WebSocket) return { type: "native", wsConstructor: b10.WebSocket };
          let d10 = void 0 !== c.g ? c.g : void 0;
          if (d10 && void 0 !== d10.WebSocket) return { type: "native", wsConstructor: d10.WebSocket };
          if ("u" > typeof globalThis && void 0 !== b10.WebSocketPair && void 0 === globalThis.WebSocket) return { type: "cloudflare", error: "Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.", workaround: "Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime." };
          if ("u" > typeof globalThis && b10.EdgeRuntime || "u" > typeof navigator && (null == (a10 = navigator.userAgent) ? void 0 : a10.includes("Vercel-Edge"))) return { type: "unsupported", error: "Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.", workaround: "Use serverless functions or a different deployment target for WebSocket functionality." };
          let e10 = globalThis.process;
          if (e10) {
            let a11 = e10.versions;
            if (a11 && a11.node) {
              let b11 = parseInt(a11.node.replace(/^v/, "").split(".")[0]);
              return b11 >= 22 ? void 0 !== globalThis.WebSocket ? { type: "native", wsConstructor: globalThis.WebSocket } : { type: "unsupported", error: `Node.js ${b11} detected but native WebSocket not found.`, workaround: "Provide a WebSocket implementation via the transport option." } : { type: "unsupported", error: `Node.js ${b11} detected without native WebSocket support.`, workaround: 'For Node.js < 22, install "ws" package and provide it via the transport option:\nimport ws from "ws"\nnew RealtimeClient(url, { transport: ws })' };
            }
          }
          return { type: "unsupported", error: "Unknown JavaScript runtime without WebSocket support.", workaround: "Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation." };
        }
        static getWebSocketConstructor() {
          let a10 = this.detectEnvironment();
          if (a10.wsConstructor) return a10.wsConstructor;
          let b10 = a10.error || "WebSocket not supported in this environment.";
          throw a10.workaround && (b10 += `

Suggested solution: ${a10.workaround}`), Error(b10);
        }
        static isWebSocketSupported() {
          try {
            let a10 = this.detectEnvironment();
            return "native" === a10.type || "ws" === a10.type;
          } catch (a10) {
            return false;
          }
        }
      }
      let dA = "2.0.0", dB = "errored", dC = "joined", dD = { close: "phx_close", error: "phx_error", join: "phx_join", leave: "phx_leave", access_token: "access_token" };
      class dE {
        constructor(a10) {
          this.HEADER_LENGTH = 1, this.USER_BROADCAST_PUSH_META_LENGTH = 6, this.KINDS = { userBroadcastPush: 3, userBroadcast: 4 }, this.BINARY_ENCODING = 0, this.JSON_ENCODING = 1, this.BROADCAST_EVENT = "broadcast", this.allowedMetadataKeys = [], this.allowedMetadataKeys = null != a10 ? a10 : [];
        }
        encode(a10, b10) {
          return a10.event !== this.BROADCAST_EVENT || a10.payload instanceof ArrayBuffer || "string" != typeof a10.payload.event ? b10(JSON.stringify([a10.join_ref, a10.ref, a10.topic, a10.event, a10.payload])) : b10(this._binaryEncodeUserBroadcastPush(a10));
        }
        _binaryEncodeUserBroadcastPush(a10) {
          var b10;
          return this._isArrayBuffer(null == (b10 = a10.payload) ? void 0 : b10.payload) ? this._encodeBinaryUserBroadcastPush(a10) : this._encodeJsonUserBroadcastPush(a10);
        }
        _encodeBinaryUserBroadcastPush(a10) {
          var b10, c10;
          let d10 = null != (c10 = null == (b10 = a10.payload) ? void 0 : b10.payload) ? c10 : new ArrayBuffer(0);
          return this._encodeUserBroadcastPush(a10, this.BINARY_ENCODING, d10);
        }
        _encodeJsonUserBroadcastPush(a10) {
          var b10, c10;
          let d10 = null != (c10 = null == (b10 = a10.payload) ? void 0 : b10.payload) ? c10 : {}, e10 = new TextEncoder().encode(JSON.stringify(d10)).buffer;
          return this._encodeUserBroadcastPush(a10, this.JSON_ENCODING, e10);
        }
        _encodeUserBroadcastPush(a10, b10, c10) {
          let d10 = a10.topic, e10 = null != (n2 = a10.ref) ? n2 : "", f10 = null != (o2 = a10.join_ref) ? o2 : "", g2 = a10.payload.event, h2 = this.allowedMetadataKeys ? this._pick(a10.payload, this.allowedMetadataKeys) : {}, i2 = 0 === Object.keys(h2).length ? "" : JSON.stringify(h2);
          if (f10.length > 255) throw Error(`joinRef length ${f10.length} exceeds maximum of 255`);
          if (e10.length > 255) throw Error(`ref length ${e10.length} exceeds maximum of 255`);
          if (d10.length > 255) throw Error(`topic length ${d10.length} exceeds maximum of 255`);
          if (g2.length > 255) throw Error(`userEvent length ${g2.length} exceeds maximum of 255`);
          if (i2.length > 255) throw Error(`metadata length ${i2.length} exceeds maximum of 255`);
          let j2 = this.USER_BROADCAST_PUSH_META_LENGTH + f10.length + e10.length + d10.length + g2.length + i2.length, k2 = new ArrayBuffer(this.HEADER_LENGTH + j2), l2 = new DataView(k2), m2 = 0;
          l2.setUint8(m2++, this.KINDS.userBroadcastPush), l2.setUint8(m2++, f10.length), l2.setUint8(m2++, e10.length), l2.setUint8(m2++, d10.length), l2.setUint8(m2++, g2.length), l2.setUint8(m2++, i2.length), l2.setUint8(m2++, b10), Array.from(f10, (a11) => l2.setUint8(m2++, a11.charCodeAt(0))), Array.from(e10, (a11) => l2.setUint8(m2++, a11.charCodeAt(0))), Array.from(d10, (a11) => l2.setUint8(m2++, a11.charCodeAt(0))), Array.from(g2, (a11) => l2.setUint8(m2++, a11.charCodeAt(0))), Array.from(i2, (a11) => l2.setUint8(m2++, a11.charCodeAt(0)));
          var n2, o2, p2 = new Uint8Array(k2.byteLength + c10.byteLength);
          return p2.set(new Uint8Array(k2), 0), p2.set(new Uint8Array(c10), k2.byteLength), p2.buffer;
        }
        decode(a10, b10) {
          if (this._isArrayBuffer(a10)) return b10(this._binaryDecode(a10));
          if ("string" == typeof a10) {
            let [c10, d10, e10, f10, g2] = JSON.parse(a10);
            return b10({ join_ref: c10, ref: d10, topic: e10, event: f10, payload: g2 });
          }
          return b10({});
        }
        _binaryDecode(a10) {
          let b10 = new DataView(a10), c10 = b10.getUint8(0), d10 = new TextDecoder();
          if (c10 === this.KINDS.userBroadcast) return this._decodeUserBroadcast(a10, b10, d10);
        }
        _decodeUserBroadcast(a10, b10, c10) {
          let d10 = b10.getUint8(1), e10 = b10.getUint8(2), f10 = b10.getUint8(3), g2 = b10.getUint8(4), h2 = this.HEADER_LENGTH + 4, i2 = c10.decode(a10.slice(h2, h2 + d10));
          h2 += d10;
          let j2 = c10.decode(a10.slice(h2, h2 + e10));
          h2 += e10;
          let k2 = c10.decode(a10.slice(h2, h2 + f10));
          h2 += f10;
          let l2 = a10.slice(h2, a10.byteLength), m2 = g2 === this.JSON_ENCODING ? JSON.parse(c10.decode(l2)) : l2, n2 = { type: this.BROADCAST_EVENT, event: j2, payload: m2 };
          return f10 > 0 && (n2.meta = JSON.parse(k2)), { join_ref: null, ref: null, topic: i2, event: this.BROADCAST_EVENT, payload: n2 };
        }
        _isArrayBuffer(a10) {
          var b10;
          return a10 instanceof ArrayBuffer || (null == (b10 = null == a10 ? void 0 : a10.constructor) ? void 0 : b10.name) === "ArrayBuffer";
        }
        _pick(a10, b10) {
          return a10 && "object" == typeof a10 ? Object.fromEntries(Object.entries(a10).filter(([a11]) => b10.includes(a11))) : {};
        }
      }
      (D = N || (N = {})).abstime = "abstime", D.bool = "bool", D.date = "date", D.daterange = "daterange", D.float4 = "float4", D.float8 = "float8", D.int2 = "int2", D.int4 = "int4", D.int4range = "int4range", D.int8 = "int8", D.int8range = "int8range", D.json = "json", D.jsonb = "jsonb", D.money = "money", D.numeric = "numeric", D.oid = "oid", D.reltime = "reltime", D.text = "text", D.time = "time", D.timestamp = "timestamp", D.timestamptz = "timestamptz", D.timetz = "timetz", D.tsrange = "tsrange", D.tstzrange = "tstzrange";
      let dF = (a10, b10, c10 = {}) => {
        var d10;
        let e10 = null != (d10 = c10.skipTypes) ? d10 : [];
        return b10 ? Object.keys(b10).reduce((c11, d11) => (c11[d11] = dG(d11, a10, b10, e10), c11), {}) : {};
      }, dG = (a10, b10, c10, d10) => {
        let e10 = b10.find((b11) => b11.name === a10), f10 = null == e10 ? void 0 : e10.type, g2 = c10[a10];
        return f10 && !d10.includes(f10) ? dH(f10, g2) : dI(g2);
      }, dH = (a10, b10) => {
        if ("_" === a10.charAt(0)) return dM(b10, a10.slice(1, a10.length));
        switch (a10) {
          case N.bool:
            return dJ(b10);
          case N.float4:
          case N.float8:
          case N.int2:
          case N.int4:
          case N.int8:
          case N.numeric:
          case N.oid:
            return dK(b10);
          case N.json:
          case N.jsonb:
            return dL(b10);
          case N.timestamp:
            return dN(b10);
          case N.abstime:
          case N.date:
          case N.daterange:
          case N.int4range:
          case N.int8range:
          case N.money:
          case N.reltime:
          case N.text:
          case N.time:
          case N.timestamptz:
          case N.timetz:
          case N.tsrange:
          case N.tstzrange:
          default:
            return dI(b10);
        }
      }, dI = (a10) => a10, dJ = (a10) => {
        switch (a10) {
          case "t":
            return true;
          case "f":
            return false;
          default:
            return a10;
        }
      }, dK = (a10) => {
        if ("string" == typeof a10) {
          let b10 = parseFloat(a10);
          if (!Number.isNaN(b10)) return b10;
        }
        return a10;
      }, dL = (a10) => {
        if ("string" == typeof a10) try {
          return JSON.parse(a10);
        } catch (a11) {
        }
        return a10;
      }, dM = (a10, b10) => {
        if ("string" != typeof a10) return a10;
        let c10 = a10.length - 1, d10 = a10[c10];
        if ("{" === a10[0] && "}" === d10) {
          let d11, e10 = a10.slice(1, c10);
          try {
            d11 = JSON.parse("[" + e10 + "]");
          } catch (a11) {
            d11 = e10 ? e10.split(",") : [];
          }
          return d11.map((a11) => dH(b10, a11));
        }
        return a10;
      }, dN = (a10) => "string" == typeof a10 ? a10.replace(" ", "T") : a10, dO = (a10) => {
        let b10 = new URL(a10);
        return b10.protocol = b10.protocol.replace(/^ws/i, "http"), b10.pathname = b10.pathname.replace(/\/+$/, "").replace(/\/socket\/websocket$/i, "").replace(/\/socket$/i, "").replace(/\/websocket$/i, ""), "" === b10.pathname || "/" === b10.pathname ? b10.pathname = "/api/broadcast" : b10.pathname = b10.pathname + "/api/broadcast", b10.href;
      };
      var dP = (a10) => "function" == typeof a10 ? a10 : function() {
        return a10;
      }, dQ = "u" > typeof window ? window : null, dR = ("u" > typeof self ? self : null) || dQ || globalThis, dS = "closed", dT = "errored", dU = "joined", dV = "joining", dW = "leaving", dX = "phx_close", dY = "phx_error", dZ = "phx_reply", d$ = "phx_leave", d_ = "websocket", d0 = "base64url.bearer.phx.", d1 = class {
        constructor(a10, b10, c10, d10) {
          this.channel = a10, this.event = b10, this.payload = c10 || function() {
            return {};
          }, this.receivedResp = null, this.timeout = d10, this.timeoutTimer = null, this.recHooks = [], this.sent = false, this.ref = void 0;
        }
        resend(a10) {
          this.timeout = a10, this.reset(), this.send();
        }
        send() {
          this.hasReceived("timeout") || (this.startTimeout(), this.sent = true, this.channel.socket.push({ topic: this.channel.topic, event: this.event, payload: this.payload(), ref: this.ref, join_ref: this.channel.joinRef() }));
        }
        receive(a10, b10) {
          return this.hasReceived(a10) && b10(this.receivedResp.response), this.recHooks.push({ status: a10, callback: b10 }), this;
        }
        reset() {
          this.cancelRefEvent(), this.ref = null, this.refEvent = null, this.receivedResp = null, this.sent = false;
        }
        destroy() {
          this.cancelRefEvent(), this.cancelTimeout();
        }
        matchReceive({ status: a10, response: b10, _ref: c10 }) {
          this.recHooks.filter((b11) => b11.status === a10).forEach((a11) => a11.callback(b10));
        }
        cancelRefEvent() {
          this.refEvent && this.channel.off(this.refEvent);
        }
        cancelTimeout() {
          clearTimeout(this.timeoutTimer), this.timeoutTimer = null;
        }
        startTimeout() {
          this.timeoutTimer && this.cancelTimeout(), this.ref = this.channel.socket.makeRef(), this.refEvent = this.channel.replyEventName(this.ref), this.channel.on(this.refEvent, (a10) => {
            this.cancelRefEvent(), this.cancelTimeout(), this.receivedResp = a10, this.matchReceive(a10);
          }), this.timeoutTimer = setTimeout(() => {
            this.trigger("timeout", {});
          }, this.timeout);
        }
        hasReceived(a10) {
          return this.receivedResp && this.receivedResp.status === a10;
        }
        trigger(a10, b10) {
          this.channel.trigger(this.refEvent, { status: a10, response: b10 });
        }
      }, d2 = class {
        constructor(a10, b10) {
          this.callback = a10, this.timerCalc = b10, this.timer = void 0, this.tries = 0;
        }
        reset() {
          this.tries = 0, clearTimeout(this.timer);
        }
        scheduleTimeout() {
          clearTimeout(this.timer), this.timer = setTimeout(() => {
            this.tries = this.tries + 1, this.callback();
          }, this.timerCalc(this.tries + 1));
        }
      }, d3 = class {
        constructor(a10, b10, c10) {
          this.state = dS, this.topic = a10, this.params = dP(b10 || {}), this.socket = c10, this.bindings = [], this.bindingRef = 0, this.timeout = this.socket.timeout, this.joinedOnce = false, this.joinPush = new d1(this, "phx_join", this.params, this.timeout), this.pushBuffer = [], this.stateChangeRefs = [], this.rejoinTimer = new d2(() => {
            this.socket.isConnected() && this.rejoin();
          }, this.socket.rejoinAfterMs), this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset())), this.stateChangeRefs.push(this.socket.onOpen(() => {
            this.rejoinTimer.reset(), this.isErrored() && this.rejoin();
          })), this.joinPush.receive("ok", () => {
            this.state = dU, this.rejoinTimer.reset(), this.pushBuffer.forEach((a11) => a11.send()), this.pushBuffer = [];
          }), this.joinPush.receive("error", (a11) => {
            this.state = dT, this.socket.hasLogger() && this.socket.log("channel", `error ${this.topic}`, a11), this.socket.isConnected() && this.rejoinTimer.scheduleTimeout();
          }), this.onClose(() => {
            this.rejoinTimer.reset(), this.socket.hasLogger() && this.socket.log("channel", `close ${this.topic}`), this.state = dS, this.socket.remove(this);
          }), this.onError((a11) => {
            this.socket.hasLogger() && this.socket.log("channel", `error ${this.topic}`, a11), this.isJoining() && this.joinPush.reset(), this.state = dT, this.socket.isConnected() && this.rejoinTimer.scheduleTimeout();
          }), this.joinPush.receive("timeout", () => {
            this.socket.hasLogger() && this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout), new d1(this, d$, dP({}), this.timeout).send(), this.state = dT, this.joinPush.reset(), this.socket.isConnected() && this.rejoinTimer.scheduleTimeout();
          }), this.on(dZ, (a11, b11) => {
            this.trigger(this.replyEventName(b11), a11);
          });
        }
        join(a10 = this.timeout) {
          if (!this.joinedOnce) return this.timeout = a10, this.joinedOnce = true, this.rejoin(), this.joinPush;
          throw Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
        }
        teardown() {
          this.pushBuffer.forEach((a10) => a10.destroy()), this.pushBuffer = [], this.rejoinTimer.reset(), this.joinPush.destroy(), this.state = dS, this.bindings = [];
        }
        onClose(a10) {
          this.on(dX, a10);
        }
        onError(a10) {
          return this.on(dY, (b10) => a10(b10));
        }
        on(a10, b10) {
          let c10 = this.bindingRef++;
          return this.bindings.push({ event: a10, ref: c10, callback: b10 }), c10;
        }
        off(a10, b10) {
          this.bindings = this.bindings.filter((c10) => c10.event !== a10 || void 0 !== b10 && b10 !== c10.ref);
        }
        canPush() {
          return this.socket.isConnected() && this.isJoined();
        }
        push(a10, b10, c10 = this.timeout) {
          if (b10 = b10 || {}, !this.joinedOnce) throw Error(`tried to push '${a10}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
          let d10 = new d1(this, a10, function() {
            return b10;
          }, c10);
          return this.canPush() ? d10.send() : (d10.startTimeout(), this.pushBuffer.push(d10)), d10;
        }
        leave(a10 = this.timeout) {
          this.rejoinTimer.reset(), this.joinPush.cancelTimeout(), this.state = dW;
          let b10 = () => {
            this.socket.hasLogger() && this.socket.log("channel", `leave ${this.topic}`), this.trigger(dX, "leave");
          }, c10 = new d1(this, d$, dP({}), a10);
          return c10.receive("ok", () => b10()).receive("timeout", () => b10()), c10.send(), this.canPush() || c10.trigger("ok", {}), c10;
        }
        onMessage(a10, b10, c10) {
          return b10;
        }
        filterBindings(a10, b10, c10) {
          return true;
        }
        isMember(a10, b10, c10, d10) {
          return this.topic === a10 && (!d10 || d10 === this.joinRef() || (this.socket.hasLogger() && this.socket.log("channel", "dropping outdated message", { topic: a10, event: b10, payload: c10, joinRef: d10 }), false));
        }
        joinRef() {
          return this.joinPush.ref;
        }
        rejoin(a10 = this.timeout) {
          this.isLeaving() || (this.socket.leaveOpenTopic(this.topic), this.state = dV, this.joinPush.resend(a10));
        }
        trigger(a10, b10, c10, d10) {
          let e10 = this.onMessage(a10, b10, c10, d10);
          if (b10 && !e10) throw Error("channel onMessage callbacks must return the payload, modified or unmodified");
          let f10 = this.bindings.filter((d11) => d11.event === a10 && this.filterBindings(d11, b10, c10));
          for (let a11 = 0; a11 < f10.length; a11++) f10[a11].callback(e10, c10, d10 || this.joinRef());
        }
        replyEventName(a10) {
          return `chan_reply_${a10}`;
        }
        isClosed() {
          return this.state === dS;
        }
        isErrored() {
          return this.state === dT;
        }
        isJoined() {
          return this.state === dU;
        }
        isJoining() {
          return this.state === dV;
        }
        isLeaving() {
          return this.state === dW;
        }
      }, d4 = class {
        static request(a10, b10, c10, d10, e10, f10, g2) {
          if (dR.XDomainRequest) {
            let c11 = new dR.XDomainRequest();
            return this.xdomainRequest(c11, a10, b10, d10, e10, f10, g2);
          }
          if (dR.XMLHttpRequest) {
            let h2 = new dR.XMLHttpRequest();
            return this.xhrRequest(h2, a10, b10, c10, d10, e10, f10, g2);
          }
          if (dR.fetch && dR.AbortController) return this.fetchRequest(a10, b10, c10, d10, e10, f10, g2);
          throw Error("No suitable XMLHttpRequest implementation found");
        }
        static fetchRequest(a10, b10, c10, d10, e10, f10, g2) {
          let h2 = { method: a10, headers: c10, body: d10 }, i2 = null;
          return e10 && (i2 = new AbortController(), setTimeout(() => i2.abort(), e10), h2.signal = i2.signal), dR.fetch(b10, h2).then((a11) => a11.text()).then((a11) => this.parseJSON(a11)).then((a11) => g2 && g2(a11)).catch((a11) => {
            "AbortError" === a11.name && f10 ? f10() : g2 && g2(null);
          }), i2;
        }
        static xdomainRequest(a10, b10, c10, d10, e10, f10, g2) {
          return a10.timeout = e10, a10.open(b10, c10), a10.onload = () => {
            let b11 = this.parseJSON(a10.responseText);
            g2 && g2(b11);
          }, f10 && (a10.ontimeout = f10), a10.onprogress = () => {
          }, a10.send(d10), a10;
        }
        static xhrRequest(a10, b10, c10, d10, e10, f10, g2, h2) {
          for (let [e11, g3] of (a10.open(b10, c10, true), a10.timeout = f10, Object.entries(d10))) a10.setRequestHeader(e11, g3);
          return a10.onerror = () => h2 && h2(null), a10.onreadystatechange = () => {
            4 === a10.readyState && h2 && h2(this.parseJSON(a10.responseText));
          }, g2 && (a10.ontimeout = g2), a10.send(e10), a10;
        }
        static parseJSON(a10) {
          if (!a10 || "" === a10) return null;
          try {
            return JSON.parse(a10);
          } catch {
            return console && console.log("failed to parse JSON response", a10), null;
          }
        }
        static serialize(a10, b10) {
          let c10 = [];
          for (var d10 in a10) {
            if (!Object.prototype.hasOwnProperty.call(a10, d10)) continue;
            let e10 = b10 ? `${b10}[${d10}]` : d10, f10 = a10[d10];
            "object" == typeof f10 ? c10.push(this.serialize(f10, e10)) : c10.push(encodeURIComponent(e10) + "=" + encodeURIComponent(f10));
          }
          return c10.join("&");
        }
        static appendParams(a10, b10) {
          if (0 === Object.keys(b10).length) return a10;
          let c10 = a10.match(/\?/) ? "&" : "?";
          return `${a10}${c10}${this.serialize(b10)}`;
        }
      }, d5 = class {
        constructor(a10, b10) {
          b10 && 2 === b10.length && b10[1].startsWith(d0) && (this.authToken = atob(b10[1].slice(d0.length))), this.endPoint = null, this.token = null, this.skipHeartbeat = true, this.reqs = /* @__PURE__ */ new Set(), this.awaitingBatchAck = false, this.currentBatch = null, this.currentBatchTimer = null, this.batchBuffer = [], this.onopen = function() {
          }, this.onerror = function() {
          }, this.onmessage = function() {
          }, this.onclose = function() {
          }, this.pollEndpoint = this.normalizeEndpoint(a10), this.readyState = 0, setTimeout(() => this.poll(), 0);
        }
        normalizeEndpoint(a10) {
          return a10.replace("ws://", "http://").replace("wss://", "https://").replace(RegExp("(.*)/" + d_), "$1/longpoll");
        }
        endpointURL() {
          return d4.appendParams(this.pollEndpoint, { token: this.token });
        }
        closeAndRetry(a10, b10, c10) {
          this.close(a10, b10, c10), this.readyState = 0;
        }
        ontimeout() {
          this.onerror("timeout"), this.closeAndRetry(1005, "timeout", false);
        }
        isActive() {
          return 1 === this.readyState || 0 === this.readyState;
        }
        poll() {
          let a10 = { Accept: "application/json" };
          this.authToken && (a10["X-Phoenix-AuthToken"] = this.authToken), this.ajax("GET", a10, null, () => this.ontimeout(), (a11) => {
            if (a11) {
              var { status: b10, token: c10, messages: d10 } = a11;
              if (410 === b10 && null !== this.token) {
                this.onerror(410), this.closeAndRetry(3410, "session_gone", false);
                return;
              }
              this.token = c10;
            } else b10 = 0;
            switch (b10) {
              case 200:
                d10.forEach((a12) => {
                  setTimeout(() => this.onmessage({ data: a12 }), 0);
                }), this.poll();
                break;
              case 204:
                this.poll();
                break;
              case 410:
                this.readyState = 1, this.onopen({}), this.poll();
                break;
              case 403:
                this.onerror(403), this.close(1008, "forbidden", false);
                break;
              case 0:
              case 500:
                this.onerror(500), this.closeAndRetry(1011, "internal server error", 500);
                break;
              default:
                throw Error(`unhandled poll status ${b10}`);
            }
          });
        }
        send(a10) {
          "string" != typeof a10 && (a10 = ((a11) => {
            let b10 = "", c10 = new Uint8Array(a11), d10 = c10.byteLength;
            for (let a12 = 0; a12 < d10; a12++) b10 += String.fromCharCode(c10[a12]);
            return btoa(b10);
          })(a10)), this.currentBatch ? this.currentBatch.push(a10) : this.awaitingBatchAck ? this.batchBuffer.push(a10) : (this.currentBatch = [a10], this.currentBatchTimer = setTimeout(() => {
            this.batchSend(this.currentBatch), this.currentBatch = null;
          }, 0));
        }
        batchSend(a10) {
          this.awaitingBatchAck = true, this.ajax("POST", { "Content-Type": "application/x-ndjson" }, a10.join("\n"), () => this.onerror("timeout"), (a11) => {
            this.awaitingBatchAck = false, a11 && 200 === a11.status ? this.batchBuffer.length > 0 && (this.batchSend(this.batchBuffer), this.batchBuffer = []) : (this.onerror(a11 && a11.status), this.closeAndRetry(1011, "internal server error", false));
          });
        }
        close(a10, b10, c10) {
          for (let a11 of this.reqs) a11.abort();
          this.readyState = 3;
          let d10 = Object.assign({ code: 1e3, reason: void 0, wasClean: true }, { code: a10, reason: b10, wasClean: c10 });
          this.batchBuffer = [], clearTimeout(this.currentBatchTimer), this.currentBatchTimer = null, "u" > typeof CloseEvent ? this.onclose(new CloseEvent("close", d10)) : this.onclose(d10);
        }
        ajax(a10, b10, c10, d10, e10) {
          let f10, g2 = () => {
            this.reqs.delete(f10), d10();
          };
          f10 = d4.request(a10, this.endpointURL(), b10, c10, this.timeout, g2, (a11) => {
            this.reqs.delete(f10), this.isActive() && e10(a11);
          }), this.reqs.add(f10);
        }
      }, d6 = class a10 {
        constructor(b10, c10 = {}) {
          let d10 = c10.events || { state: "presence_state", diff: "presence_diff" };
          this.state = {}, this.pendingDiffs = [], this.channel = b10, this.joinRef = null, this.caller = { onJoin: function() {
          }, onLeave: function() {
          }, onSync: function() {
          } }, this.channel.on(d10.state, (b11) => {
            let { onJoin: c11, onLeave: d11, onSync: e10 } = this.caller;
            this.joinRef = this.channel.joinRef(), this.state = a10.syncState(this.state, b11, c11, d11), this.pendingDiffs.forEach((b12) => {
              this.state = a10.syncDiff(this.state, b12, c11, d11);
            }), this.pendingDiffs = [], e10();
          }), this.channel.on(d10.diff, (b11) => {
            let { onJoin: c11, onLeave: d11, onSync: e10 } = this.caller;
            this.inPendingSyncState() ? this.pendingDiffs.push(b11) : (this.state = a10.syncDiff(this.state, b11, c11, d11), e10());
          });
        }
        onJoin(a11) {
          this.caller.onJoin = a11;
        }
        onLeave(a11) {
          this.caller.onLeave = a11;
        }
        onSync(a11) {
          this.caller.onSync = a11;
        }
        list(b10) {
          return a10.list(this.state, b10);
        }
        inPendingSyncState() {
          return !this.joinRef || this.joinRef !== this.channel.joinRef();
        }
        static syncState(a11, b10, c10, d10) {
          let e10 = this.clone(a11), f10 = {}, g2 = {};
          return this.map(e10, (a12, c11) => {
            b10[a12] || (g2[a12] = c11);
          }), this.map(b10, (a12, b11) => {
            let c11 = e10[a12];
            if (c11) {
              let d11 = b11.metas.map((a13) => a13.phx_ref), e11 = c11.metas.map((a13) => a13.phx_ref), h2 = b11.metas.filter((a13) => 0 > e11.indexOf(a13.phx_ref)), i2 = c11.metas.filter((a13) => 0 > d11.indexOf(a13.phx_ref));
              h2.length > 0 && (f10[a12] = b11, f10[a12].metas = h2), i2.length > 0 && (g2[a12] = this.clone(c11), g2[a12].metas = i2);
            } else f10[a12] = b11;
          }), this.syncDiff(e10, { joins: f10, leaves: g2 }, c10, d10);
        }
        static syncDiff(a11, b10, c10, d10) {
          let { joins: e10, leaves: f10 } = this.clone(b10);
          return c10 || (c10 = function() {
          }), d10 || (d10 = function() {
          }), this.map(e10, (b11, d11) => {
            let e11 = a11[b11];
            if (a11[b11] = this.clone(d11), e11) {
              let c11 = a11[b11].metas.map((a12) => a12.phx_ref), d12 = e11.metas.filter((a12) => 0 > c11.indexOf(a12.phx_ref));
              a11[b11].metas.unshift(...d12);
            }
            c10(b11, e11, d11);
          }), this.map(f10, (b11, c11) => {
            let e11 = a11[b11];
            if (!e11) return;
            let f11 = c11.metas.map((a12) => a12.phx_ref);
            e11.metas = e11.metas.filter((a12) => 0 > f11.indexOf(a12.phx_ref)), d10(b11, e11, c11), 0 === e11.metas.length && delete a11[b11];
          }), a11;
        }
        static list(a11, b10) {
          return b10 || (b10 = function(a12, b11) {
            return b11;
          }), this.map(a11, (a12, c10) => b10(a12, c10));
        }
        static map(a11, b10) {
          return Object.getOwnPropertyNames(a11).map((c10) => b10(c10, a11[c10]));
        }
        static clone(a11) {
          return JSON.parse(JSON.stringify(a11));
        }
      }, d7 = { HEADER_LENGTH: 1, META_LENGTH: 4, KINDS: { push: 0, reply: 1, broadcast: 2 }, encode(a10, b10) {
        return a10.payload.constructor === ArrayBuffer ? b10(this.binaryEncode(a10)) : b10(JSON.stringify([a10.join_ref, a10.ref, a10.topic, a10.event, a10.payload]));
      }, decode(a10, b10) {
        if (a10.constructor === ArrayBuffer) return b10(this.binaryDecode(a10));
        {
          let [c10, d10, e10, f10, g2] = JSON.parse(a10);
          return b10({ join_ref: c10, ref: d10, topic: e10, event: f10, payload: g2 });
        }
      }, binaryEncode(a10) {
        let { join_ref: b10, ref: c10, event: d10, topic: e10, payload: f10 } = a10, g2 = this.META_LENGTH + b10.length + c10.length + e10.length + d10.length, h2 = new ArrayBuffer(this.HEADER_LENGTH + g2), i2 = new DataView(h2), j2 = 0;
        i2.setUint8(j2++, this.KINDS.push), i2.setUint8(j2++, b10.length), i2.setUint8(j2++, c10.length), i2.setUint8(j2++, e10.length), i2.setUint8(j2++, d10.length), Array.from(b10, (a11) => i2.setUint8(j2++, a11.charCodeAt(0))), Array.from(c10, (a11) => i2.setUint8(j2++, a11.charCodeAt(0))), Array.from(e10, (a11) => i2.setUint8(j2++, a11.charCodeAt(0))), Array.from(d10, (a11) => i2.setUint8(j2++, a11.charCodeAt(0)));
        var k2 = new Uint8Array(h2.byteLength + f10.byteLength);
        return k2.set(new Uint8Array(h2), 0), k2.set(new Uint8Array(f10), h2.byteLength), k2.buffer;
      }, binaryDecode(a10) {
        let b10 = new DataView(a10), c10 = b10.getUint8(0), d10 = new TextDecoder();
        switch (c10) {
          case this.KINDS.push:
            return this.decodePush(a10, b10, d10);
          case this.KINDS.reply:
            return this.decodeReply(a10, b10, d10);
          case this.KINDS.broadcast:
            return this.decodeBroadcast(a10, b10, d10);
        }
      }, decodePush(a10, b10, c10) {
        let d10 = b10.getUint8(1), e10 = b10.getUint8(2), f10 = b10.getUint8(3), g2 = this.HEADER_LENGTH + this.META_LENGTH - 1, h2 = c10.decode(a10.slice(g2, g2 + d10));
        g2 += d10;
        let i2 = c10.decode(a10.slice(g2, g2 + e10));
        g2 += e10;
        let j2 = c10.decode(a10.slice(g2, g2 + f10));
        return g2 += f10, { join_ref: h2, ref: null, topic: i2, event: j2, payload: a10.slice(g2, a10.byteLength) };
      }, decodeReply(a10, b10, c10) {
        let d10 = b10.getUint8(1), e10 = b10.getUint8(2), f10 = b10.getUint8(3), g2 = b10.getUint8(4), h2 = this.HEADER_LENGTH + this.META_LENGTH, i2 = c10.decode(a10.slice(h2, h2 + d10));
        h2 += d10;
        let j2 = c10.decode(a10.slice(h2, h2 + e10));
        h2 += e10;
        let k2 = c10.decode(a10.slice(h2, h2 + f10));
        h2 += f10;
        let l2 = c10.decode(a10.slice(h2, h2 + g2));
        return h2 += g2, { join_ref: i2, ref: j2, topic: k2, event: dZ, payload: { status: l2, response: a10.slice(h2, a10.byteLength) } };
      }, decodeBroadcast(a10, b10, c10) {
        let d10 = b10.getUint8(1), e10 = b10.getUint8(2), f10 = this.HEADER_LENGTH + 2, g2 = c10.decode(a10.slice(f10, f10 + d10));
        f10 += d10;
        let h2 = c10.decode(a10.slice(f10, f10 + e10));
        return f10 += e10, { join_ref: null, ref: null, topic: g2, event: h2, payload: a10.slice(f10, a10.byteLength) };
      } }, d8 = class {
        constructor(a10, b10 = {}) {
          this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] }, this.channels = [], this.sendBuffer = [], this.ref = 0, this.fallbackRef = null, this.timeout = b10.timeout || 1e4, this.transport = b10.transport || dR.WebSocket || d5, this.conn = void 0, this.primaryPassedHealthCheck = false, this.longPollFallbackMs = b10.longPollFallbackMs, this.fallbackTimer = null;
          let c10 = null;
          try {
            c10 = dR && dR.sessionStorage;
          } catch {
          }
          this.sessionStore = b10.sessionStorage || c10, this.establishedConnections = 0, this.defaultEncoder = d7.encode.bind(d7), this.defaultDecoder = d7.decode.bind(d7), this.closeWasClean = true, this.disconnecting = false, this.binaryType = b10.binaryType || "arraybuffer", this.connectClock = 1, this.pageHidden = false, this.encode = void 0, this.decode = void 0, this.transport !== d5 ? (this.encode = b10.encode || this.defaultEncoder, this.decode = b10.decode || this.defaultDecoder) : (this.encode = this.defaultEncoder, this.decode = this.defaultDecoder);
          let d10 = null;
          dQ && dQ.addEventListener && (dQ.addEventListener("pagehide", (a11) => {
            this.conn && (this.disconnect(), d10 = this.connectClock);
          }), dQ.addEventListener("pageshow", (a11) => {
            d10 === this.connectClock && (d10 = null, this.connect());
          }), dQ.addEventListener("visibilitychange", () => {
            "hidden" === document.visibilityState ? this.pageHidden = true : (this.pageHidden = false, this.isConnected() || this.closeWasClean || this.teardown(() => this.connect()));
          })), this.heartbeatIntervalMs = b10.heartbeatIntervalMs || 3e4, this.autoSendHeartbeat = b10.autoSendHeartbeat ?? true, this.heartbeatCallback = b10.heartbeatCallback ?? (() => {
          }), this.rejoinAfterMs = (a11) => b10.rejoinAfterMs ? b10.rejoinAfterMs(a11) : [1e3, 2e3, 5e3][a11 - 1] || 1e4, this.reconnectAfterMs = (a11) => b10.reconnectAfterMs ? b10.reconnectAfterMs(a11) : [10, 50, 100, 150, 200, 250, 500, 1e3, 2e3][a11 - 1] || 5e3, this.logger = b10.logger || null, !this.logger && b10.debug && (this.logger = (a11, b11, c11) => {
            console.log(`${a11}: ${b11}`, c11);
          }), this.longpollerTimeout = b10.longpollerTimeout || 2e4, this.params = dP(b10.params || {}), this.endPoint = `${a10}/${d_}`, this.vsn = b10.vsn || "2.0.0", this.heartbeatTimeoutTimer = null, this.heartbeatTimer = null, this.heartbeatSentAt = null, this.pendingHeartbeatRef = null, this.reconnectTimer = new d2(() => {
            if (this.pageHidden) {
              this.log("Not reconnecting as page is hidden!"), this.teardown();
              return;
            }
            this.teardown(async () => {
              b10.beforeReconnect && await b10.beforeReconnect(), this.connect();
            });
          }, this.reconnectAfterMs), this.authToken = b10.authToken;
        }
        getLongPollTransport() {
          return d5;
        }
        replaceTransport(a10) {
          this.connectClock++, this.closeWasClean = true, clearTimeout(this.fallbackTimer), this.reconnectTimer.reset(), this.conn && (this.conn.close(), this.conn = null), this.transport = a10;
        }
        protocol() {
          return location.protocol.match(/^https/) ? "wss" : "ws";
        }
        endPointURL() {
          let a10 = d4.appendParams(d4.appendParams(this.endPoint, this.params()), { vsn: this.vsn });
          return "/" !== a10.charAt(0) ? a10 : "/" === a10.charAt(1) ? `${this.protocol()}:${a10}` : `${this.protocol()}://${location.host}${a10}`;
        }
        disconnect(a10, b10, c10) {
          this.connectClock++, this.disconnecting = true, this.closeWasClean = true, clearTimeout(this.fallbackTimer), this.reconnectTimer.reset(), this.teardown(() => {
            this.disconnecting = false, a10 && a10();
          }, b10, c10);
        }
        connect(a10) {
          a10 && (console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor"), this.params = dP(a10)), (!this.conn || this.disconnecting) && (this.longPollFallbackMs && this.transport !== d5 ? this.connectWithFallback(d5, this.longPollFallbackMs) : this.transportConnect());
        }
        log(a10, b10, c10) {
          this.logger && this.logger(a10, b10, c10);
        }
        hasLogger() {
          return null !== this.logger;
        }
        onOpen(a10) {
          let b10 = this.makeRef();
          return this.stateChangeCallbacks.open.push([b10, a10]), b10;
        }
        onClose(a10) {
          let b10 = this.makeRef();
          return this.stateChangeCallbacks.close.push([b10, a10]), b10;
        }
        onError(a10) {
          let b10 = this.makeRef();
          return this.stateChangeCallbacks.error.push([b10, a10]), b10;
        }
        onMessage(a10) {
          let b10 = this.makeRef();
          return this.stateChangeCallbacks.message.push([b10, a10]), b10;
        }
        onHeartbeat(a10) {
          this.heartbeatCallback = a10;
        }
        ping(a10) {
          if (!this.isConnected()) return false;
          let b10 = this.makeRef(), c10 = Date.now();
          this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: b10 });
          let d10 = this.onMessage((e10) => {
            e10.ref === b10 && (this.off([d10]), a10(Date.now() - c10));
          });
          return true;
        }
        transportName(a10) {
          return a10 === d5 ? "LongPoll" : a10.name;
        }
        transportConnect() {
          let a10;
          this.connectClock++, this.closeWasClean = false, this.authToken && (a10 = ["phoenix", `${d0}${btoa(this.authToken).replace(/=/g, "")}`]), this.conn = new this.transport(this.endPointURL(), a10), this.conn.binaryType = this.binaryType, this.conn.timeout = this.longpollerTimeout, this.conn.onopen = () => this.onConnOpen(), this.conn.onerror = (a11) => this.onConnError(a11), this.conn.onmessage = (a11) => this.onConnMessage(a11), this.conn.onclose = (a11) => this.onConnClose(a11);
        }
        getSession(a10) {
          return this.sessionStore && this.sessionStore.getItem(a10);
        }
        storeSession(a10, b10) {
          this.sessionStore && this.sessionStore.setItem(a10, b10);
        }
        connectWithFallback(a10, b10 = 2500) {
          let c10, d10;
          clearTimeout(this.fallbackTimer);
          let e10 = false, f10 = true, g2 = this.transportName(a10), h2 = (b11) => {
            this.log("transport", `falling back to ${g2}...`, b11), this.off([c10, d10]), f10 = false, this.replaceTransport(a10), this.transportConnect();
          };
          if (this.getSession(`phx:fallback:${g2}`)) return h2("memorized");
          this.fallbackTimer = setTimeout(h2, b10), d10 = this.onError((a11) => {
            this.log("transport", "error", a11), f10 && !e10 && (clearTimeout(this.fallbackTimer), h2(a11));
          }), this.fallbackRef && this.off([this.fallbackRef]), this.fallbackRef = this.onOpen(() => {
            if (e10 = true, !f10) {
              let b11 = this.transportName(a10);
              return this.primaryPassedHealthCheck || this.storeSession(`phx:fallback:${b11}`, "true"), this.log("transport", `established ${b11} fallback`);
            }
            clearTimeout(this.fallbackTimer), this.fallbackTimer = setTimeout(h2, b10), this.ping((a11) => {
              this.log("transport", "connected to primary after", a11), this.primaryPassedHealthCheck = true, clearTimeout(this.fallbackTimer);
            });
          }), this.transportConnect();
        }
        clearHeartbeats() {
          clearTimeout(this.heartbeatTimer), clearTimeout(this.heartbeatTimeoutTimer);
        }
        onConnOpen() {
          this.hasLogger() && this.log("transport", `connected to ${this.endPointURL()}`), this.closeWasClean = false, this.disconnecting = false, this.establishedConnections++, this.flushSendBuffer(), this.reconnectTimer.reset(), this.autoSendHeartbeat && this.resetHeartbeat(), this.triggerStateCallbacks("open");
        }
        heartbeatTimeout() {
          if (this.pendingHeartbeatRef) {
            this.pendingHeartbeatRef = null, this.heartbeatSentAt = null, this.hasLogger() && this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
            try {
              this.heartbeatCallback("timeout");
            } catch (a10) {
              this.log("error", "error in heartbeat callback", a10);
            }
            this.triggerChanError(Error("heartbeat timeout")), this.closeWasClean = false, this.teardown(() => this.reconnectTimer.scheduleTimeout(), 1e3, "heartbeat timeout");
          }
        }
        resetHeartbeat() {
          this.conn && this.conn.skipHeartbeat || (this.pendingHeartbeatRef = null, this.clearHeartbeats(), this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs));
        }
        teardown(a10, b10, c10) {
          if (!this.conn) return a10 && a10();
          let d10 = this.conn;
          this.waitForBufferDone(d10, () => {
            b10 ? d10.close(b10, c10 || "") : d10.close(), this.waitForSocketClosed(d10, () => {
              this.conn === d10 && (this.conn.onopen = function() {
              }, this.conn.onerror = function() {
              }, this.conn.onmessage = function() {
              }, this.conn.onclose = function() {
              }, this.conn = null), a10 && a10();
            });
          });
        }
        waitForBufferDone(a10, b10, c10 = 1) {
          5 !== c10 && a10.bufferedAmount ? setTimeout(() => {
            this.waitForBufferDone(a10, b10, c10 + 1);
          }, 150 * c10) : b10();
        }
        waitForSocketClosed(a10, b10, c10 = 1) {
          5 === c10 || 3 === a10.readyState ? b10() : setTimeout(() => {
            this.waitForSocketClosed(a10, b10, c10 + 1);
          }, 150 * c10);
        }
        onConnClose(a10) {
          this.conn && (this.conn.onclose = () => {
          }), this.hasLogger() && this.log("transport", "close", a10), this.triggerChanError(a10), this.clearHeartbeats(), this.closeWasClean || this.reconnectTimer.scheduleTimeout(), this.triggerStateCallbacks("close", a10);
        }
        onConnError(a10) {
          this.hasLogger() && this.log("transport", "error", a10);
          let b10 = this.transport, c10 = this.establishedConnections;
          this.triggerStateCallbacks("error", a10, b10, c10), (b10 === this.transport || c10 > 0) && this.triggerChanError(a10);
        }
        triggerChanError(a10) {
          this.channels.forEach((b10) => {
            b10.isErrored() || b10.isLeaving() || b10.isClosed() || b10.trigger(dY, a10);
          });
        }
        connectionState() {
          switch (this.conn && this.conn.readyState) {
            case 0:
              return "connecting";
            case 1:
              return "open";
            case 2:
              return "closing";
            default:
              return "closed";
          }
        }
        isConnected() {
          return "open" === this.connectionState();
        }
        remove(a10) {
          this.off(a10.stateChangeRefs), this.channels = this.channels.filter((b10) => b10 !== a10);
        }
        off(a10) {
          for (let b10 in this.stateChangeCallbacks) this.stateChangeCallbacks[b10] = this.stateChangeCallbacks[b10].filter(([b11]) => -1 === a10.indexOf(b11));
        }
        channel(a10, b10 = {}) {
          let c10 = new d3(a10, b10, this);
          return this.channels.push(c10), c10;
        }
        push(a10) {
          if (this.hasLogger()) {
            let { topic: b10, event: c10, payload: d10, ref: e10, join_ref: f10 } = a10;
            this.log("push", `${b10} ${c10} (${f10}, ${e10})`, d10);
          }
          this.isConnected() ? this.encode(a10, (a11) => this.conn.send(a11)) : this.sendBuffer.push(() => this.encode(a10, (a11) => this.conn.send(a11)));
        }
        makeRef() {
          let a10 = this.ref + 1;
          return a10 === this.ref ? this.ref = 0 : this.ref = a10, this.ref.toString();
        }
        sendHeartbeat() {
          if (!this.isConnected()) {
            try {
              this.heartbeatCallback("disconnected");
            } catch (a10) {
              this.log("error", "error in heartbeat callback", a10);
            }
            return;
          }
          if (this.pendingHeartbeatRef) return void this.heartbeatTimeout();
          this.pendingHeartbeatRef = this.makeRef(), this.heartbeatSentAt = Date.now(), this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
          try {
            this.heartbeatCallback("sent");
          } catch (a10) {
            this.log("error", "error in heartbeat callback", a10);
          }
          this.heartbeatTimeoutTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs);
        }
        flushSendBuffer() {
          this.isConnected() && this.sendBuffer.length > 0 && (this.sendBuffer.forEach((a10) => a10()), this.sendBuffer = []);
        }
        onConnMessage(a10) {
          this.decode(a10.data, (a11) => {
            let { topic: b10, event: c10, payload: d10, ref: e10, join_ref: f10 } = a11;
            if (e10 && e10 === this.pendingHeartbeatRef) {
              let a12 = this.heartbeatSentAt ? Date.now() - this.heartbeatSentAt : void 0;
              this.clearHeartbeats();
              try {
                this.heartbeatCallback("ok" === d10.status ? "ok" : "error", a12);
              } catch (a13) {
                this.log("error", "error in heartbeat callback", a13);
              }
              this.pendingHeartbeatRef = null, this.heartbeatSentAt = null, this.autoSendHeartbeat && (this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs));
            }
            this.hasLogger() && this.log("receive", `${d10.status || ""} ${b10} ${c10} ${e10 && "(" + e10 + ")" || ""}`.trim(), d10);
            for (let a12 = 0; a12 < this.channels.length; a12++) {
              let g2 = this.channels[a12];
              g2.isMember(b10, c10, d10, f10) && g2.trigger(c10, d10, e10, f10);
            }
            this.triggerStateCallbacks("message", a11);
          });
        }
        triggerStateCallbacks(a10, ...b10) {
          try {
            this.stateChangeCallbacks[a10].forEach(([c10, d10]) => {
              try {
                d10(...b10);
              } catch (b11) {
                this.log("error", `error in ${a10} callback`, b11);
              }
            });
          } catch (b11) {
            this.log("error", `error triggering ${a10} callbacks`, b11);
          }
        }
        leaveOpenTopic(a10) {
          let b10 = this.channels.find((b11) => b11.topic === a10 && (b11.isJoined() || b11.isJoining()));
          b10 && (this.hasLogger() && this.log("transport", `leaving duplicate topic "${a10}"`), b10.leave());
        }
      };
      class d9 {
        constructor(a10, b10) {
          const c10 = (function(a11) {
            return (null == a11 ? void 0 : a11.events) && { events: a11.events };
          })(b10);
          this.presence = new d6(a10.getChannel(), c10), this.presence.onJoin((b11, c11, d10) => {
            let e10 = d9.onJoinPayload(b11, c11, d10);
            a10.getChannel().trigger("presence", e10);
          }), this.presence.onLeave((b11, c11, d10) => {
            let e10 = d9.onLeavePayload(b11, c11, d10);
            a10.getChannel().trigger("presence", e10);
          }), this.presence.onSync(() => {
            a10.getChannel().trigger("presence", { event: "sync" });
          });
        }
        get state() {
          return d9.transformState(this.presence.state);
        }
        static transformState(a10) {
          return Object.getOwnPropertyNames(a10 = JSON.parse(JSON.stringify(a10))).reduce((b10, c10) => {
            let d10 = a10[c10];
            return b10[c10] = ea(d10), b10;
          }, {});
        }
        static onJoinPayload(a10, b10, c10) {
          return { event: "join", key: a10, currentPresences: eb(b10), newPresences: ea(c10) };
        }
        static onLeavePayload(a10, b10, c10) {
          return { event: "leave", key: a10, currentPresences: eb(b10), leftPresences: ea(c10) };
        }
      }
      function ea(a10) {
        return a10.metas.map((a11) => (a11.presence_ref = a11.phx_ref, delete a11.phx_ref, delete a11.phx_ref_prev, a11));
      }
      function eb(a10) {
        return (null == a10 ? void 0 : a10.metas) ? ea(a10) : [];
      }
      (E = O || (O = {})).SYNC = "sync", E.JOIN = "join", E.LEAVE = "leave";
      class ec {
        get state() {
          return this.presenceAdapter.state;
        }
        constructor(a10, b10) {
          this.channel = a10, this.presenceAdapter = new d9(this.channel.channelAdapter, b10);
        }
      }
      class ed {
        constructor(a10, b10, c10) {
          const d10 = (function(a11) {
            return { config: Object.assign({ broadcast: { ack: false, self: false }, presence: { key: "", enabled: false }, private: false }, a11.config) };
          })(c10);
          this.channel = a10.getSocket().channel(b10, d10), this.socket = a10;
        }
        get state() {
          return this.channel.state;
        }
        set state(a10) {
          this.channel.state = a10;
        }
        get joinedOnce() {
          return this.channel.joinedOnce;
        }
        get joinPush() {
          return this.channel.joinPush;
        }
        get rejoinTimer() {
          return this.channel.rejoinTimer;
        }
        on(a10, b10) {
          return this.channel.on(a10, b10);
        }
        off(a10, b10) {
          this.channel.off(a10, b10);
        }
        subscribe(a10) {
          return this.channel.join(a10);
        }
        unsubscribe(a10) {
          return this.channel.leave(a10);
        }
        teardown() {
          this.channel.teardown();
        }
        onClose(a10) {
          this.channel.onClose(a10);
        }
        onError(a10) {
          return this.channel.onError(a10);
        }
        push(a10, b10, c10) {
          let d10;
          try {
            d10 = this.channel.push(a10, b10, c10);
          } catch (b11) {
            throw Error(`tried to push '${a10}' to '${this.channel.topic}' before joining. Use channel.subscribe() before pushing events`);
          }
          if (this.channel.pushBuffer.length > 100) {
            let a11 = this.channel.pushBuffer.shift();
            a11.cancelTimeout(), this.socket.log("channel", `discarded push due to buffer overflow: ${a11.event}`, a11.payload());
          }
          return d10;
        }
        updateJoinPayload(a10) {
          let b10 = this.channel.joinPush.payload();
          this.channel.joinPush.payload = () => Object.assign(Object.assign({}, b10), a10);
        }
        canPush() {
          return this.socket.isConnected() && this.state === dC;
        }
        isJoined() {
          return this.state === dC;
        }
        isJoining() {
          return "joining" === this.state;
        }
        isClosed() {
          return "closed" === this.state;
        }
        isLeaving() {
          return "leaving" === this.state;
        }
        updateFilterBindings(a10) {
          this.channel.filterBindings = a10;
        }
        updatePayloadTransform(a10) {
          this.channel.onMessage = a10;
        }
        getChannel() {
          return this.channel;
        }
      }
      (F = P || (P = {})).ALL = "*", F.INSERT = "INSERT", F.UPDATE = "UPDATE", F.DELETE = "DELETE", (G = Q || (Q = {})).BROADCAST = "broadcast", G.PRESENCE = "presence", G.POSTGRES_CHANGES = "postgres_changes", G.SYSTEM = "system", (H = R || (R = {})).SUBSCRIBED = "SUBSCRIBED", H.TIMED_OUT = "TIMED_OUT", H.CLOSED = "CLOSED", H.CHANNEL_ERROR = "CHANNEL_ERROR";
      class ee {
        get state() {
          return this.channelAdapter.state;
        }
        set state(a10) {
          this.channelAdapter.state = a10;
        }
        get joinedOnce() {
          return this.channelAdapter.joinedOnce;
        }
        get timeout() {
          return this.socket.timeout;
        }
        get joinPush() {
          return this.channelAdapter.joinPush;
        }
        get rejoinTimer() {
          return this.channelAdapter.rejoinTimer;
        }
        constructor(a10, b10 = { config: {} }, c10) {
          var d10, e10;
          if (this.topic = a10, this.params = b10, this.socket = c10, this.bindings = {}, this.subTopic = a10.replace(/^realtime:/i, ""), this.params.config = Object.assign({ broadcast: { ack: false, self: false }, presence: { key: "", enabled: false }, private: false }, b10.config), this.channelAdapter = new ed(this.socket.socketAdapter, a10, this.params), this.presence = new ec(this), this._onClose(() => {
            this.socket._remove(this);
          }), this._updateFilterTransform(), this.broadcastEndpointURL = dO(this.socket.socketAdapter.endPointURL()), this.private = this.params.config.private || false, !this.private && (null == (e10 = null == (d10 = this.params.config) ? void 0 : d10.broadcast) ? void 0 : e10.replay)) throw Error(`tried to use replay on public channel '${this.topic}'. It must be a private channel.`);
        }
        subscribe(a10, b10 = this.timeout) {
          var c10, d10, e10;
          if (this.socket.isConnected() || this.socket.connect(), this.channelAdapter.isClosed()) {
            let { config: { broadcast: f10, presence: g2, private: h2 } } = this.params, i2 = null != (d10 = null == (c10 = this.bindings.postgres_changes) ? void 0 : c10.map((a11) => a11.filter)) ? d10 : [], j2 = !!this.bindings[Q.PRESENCE] && this.bindings[Q.PRESENCE].length > 0 || (null == (e10 = this.params.config.presence) ? void 0 : e10.enabled) === true, k2 = {}, l2 = { broadcast: f10, presence: Object.assign(Object.assign({}, g2), { enabled: j2 }), postgres_changes: i2, private: h2 };
            this.socket.accessTokenValue && (k2.access_token = this.socket.accessTokenValue), this._onError((b11) => {
              null == a10 || a10(R.CHANNEL_ERROR, (function(a11) {
                if (a11 instanceof Error) return a11;
                if ("string" == typeof a11) return Error(a11);
                if (a11 && "object" == typeof a11) {
                  if ("number" == typeof a11.code) {
                    let b12 = "string" == typeof a11.reason && a11.reason ? ` (${a11.reason})` : "";
                    return Error(`socket closed: ${a11.code}${b12}`, { cause: a11 });
                  }
                  return Error("channel error: transport failure", { cause: a11 });
                }
                return Error("channel error: connection lost");
              })(b11));
            }), this._onClose(() => null == a10 ? void 0 : a10(R.CLOSED)), this.updateJoinPayload(Object.assign({ config: l2 }, k2)), this._updateFilterMessage(), this.channelAdapter.subscribe(b10).receive("ok", async ({ postgres_changes: b11 }) => {
              if (this.socket._isManualToken() || this.socket.setAuth(), void 0 === b11) {
                null == a10 || a10(R.SUBSCRIBED);
                return;
              }
              this._updatePostgresBindings(b11, a10);
            }).receive("error", (b11) => {
              this.state = dB;
              let c11 = Object.values(b11).join(", ") || "error";
              null == a10 || a10(R.CHANNEL_ERROR, Error(c11, { cause: b11 }));
            }).receive("timeout", () => {
              null == a10 || a10(R.TIMED_OUT);
            });
          }
          return this;
        }
        _updatePostgresBindings(a10, b10) {
          var c10;
          let d10 = this.bindings.postgres_changes, e10 = null != (c10 = null == d10 ? void 0 : d10.length) ? c10 : 0, f10 = [];
          for (let c11 = 0; c11 < e10; c11++) {
            let e11 = d10[c11], { filter: { event: g2, schema: h2, table: i2, filter: j2 } } = e11, k2 = a10 && a10[c11];
            if (k2 && k2.event === g2 && ee.isFilterValueEqual(k2.schema, h2) && ee.isFilterValueEqual(k2.table, i2) && ee.isFilterValueEqual(k2.filter, j2)) f10.push(Object.assign(Object.assign({}, e11), { id: k2.id }));
            else {
              this.unsubscribe(), this.state = dB, null == b10 || b10(R.CHANNEL_ERROR, Error("mismatch between server and client bindings for postgres changes"));
              return;
            }
          }
          this.bindings.postgres_changes = f10, this.state != dB && b10 && b10(R.SUBSCRIBED);
        }
        presenceState() {
          return this.presence.state;
        }
        async track(a10, b10 = {}) {
          return await this.send({ type: "presence", event: "track", payload: a10 }, b10.timeout || this.timeout);
        }
        async untrack(a10 = {}) {
          return await this.send({ type: "presence", event: "untrack" }, a10);
        }
        on(a10, b10, c10) {
          let d10 = this.channelAdapter.isJoined() || this.channelAdapter.isJoining(), e10 = a10 === Q.PRESENCE || a10 === Q.POSTGRES_CHANGES;
          if (d10 && e10) throw this.socket.log("channel", `cannot add \`${a10}\` callbacks for ${this.topic} after \`subscribe()\`.`), Error(`cannot add \`${a10}\` callbacks for ${this.topic} after \`subscribe()\`.`);
          return this._on(a10, b10, c10);
        }
        async httpSend(a10, b10, c10 = {}) {
          var d10;
          if (null == b10) return Promise.reject(Error("Payload is required for httpSend()"));
          let e10 = { apikey: this.socket.apiKey ? this.socket.apiKey : "", "Content-Type": "application/json" };
          this.socket.accessTokenValue && (e10.Authorization = `Bearer ${this.socket.accessTokenValue}`);
          let f10 = { method: "POST", headers: e10, body: JSON.stringify({ messages: [{ topic: this.subTopic, event: a10, payload: b10, private: this.private }] }) }, g2 = await this._fetchWithTimeout(this.broadcastEndpointURL, f10, null != (d10 = c10.timeout) ? d10 : this.timeout);
          if (202 === g2.status) return { success: true };
          let h2 = g2.statusText;
          try {
            let a11 = await g2.json();
            h2 = a11.error || a11.message || h2;
          } catch (a11) {
          }
          return Promise.reject(Error(h2));
        }
        async send(a10, b10 = {}) {
          var c10, d10;
          if (this.channelAdapter.canPush() || "broadcast" !== a10.type) return new Promise((c11) => {
            var d11, e10, f10;
            let g2 = this.channelAdapter.push(a10.type, a10, b10.timeout || this.timeout);
            "broadcast" !== a10.type || (null == (f10 = null == (e10 = null == (d11 = this.params) ? void 0 : d11.config) ? void 0 : e10.broadcast) ? void 0 : f10.ack) || c11("ok"), g2.receive("ok", () => c11("ok")), g2.receive("error", () => c11("error")), g2.receive("timeout", () => c11("timed out"));
          });
          {
            console.warn("Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.");
            let { event: e10, payload: f10 } = a10, g2 = { apikey: this.socket.apiKey ? this.socket.apiKey : "", "Content-Type": "application/json" };
            this.socket.accessTokenValue && (g2.Authorization = `Bearer ${this.socket.accessTokenValue}`);
            let h2 = { method: "POST", headers: g2, body: JSON.stringify({ messages: [{ topic: this.subTopic, event: e10, payload: f10, private: this.private }] }) };
            try {
              let a11 = await this._fetchWithTimeout(this.broadcastEndpointURL, h2, null != (c10 = b10.timeout) ? c10 : this.timeout);
              return await (null == (d10 = a11.body) ? void 0 : d10.cancel()), a11.ok ? "ok" : "error";
            } catch (a11) {
              if (a11 instanceof Error && "AbortError" === a11.name) return "timed out";
              return "error";
            }
          }
        }
        updateJoinPayload(a10) {
          this.channelAdapter.updateJoinPayload(a10);
        }
        async unsubscribe(a10 = this.timeout) {
          return new Promise((b10) => {
            this.channelAdapter.unsubscribe(a10).receive("ok", () => b10("ok")).receive("timeout", () => b10("timed out")).receive("error", () => b10("error"));
          });
        }
        teardown() {
          this.channelAdapter.teardown();
        }
        async _fetchWithTimeout(a10, b10, c10) {
          let d10 = new AbortController(), e10 = setTimeout(() => d10.abort(), c10), f10 = await this.socket.fetch(a10, Object.assign(Object.assign({}, b10), { signal: d10.signal }));
          return clearTimeout(e10), f10;
        }
        _on(a10, b10, c10) {
          let d10 = a10.toLocaleLowerCase(), e10 = this.channelAdapter.on(a10, c10), f10 = { type: d10, filter: b10, callback: c10, ref: e10 };
          return this.bindings[d10] ? this.bindings[d10].push(f10) : this.bindings[d10] = [f10], this._updateFilterMessage(), this;
        }
        _onClose(a10) {
          this.channelAdapter.onClose(a10);
        }
        _onError(a10) {
          this.channelAdapter.onError(a10);
        }
        _updateFilterMessage() {
          this.channelAdapter.updateFilterBindings((a10, b10, c10) => {
            var d10, e10, f10, g2, h2, i2, j2;
            let k2 = a10.event.toLocaleLowerCase();
            if (this._notThisChannelEvent(k2, c10)) return false;
            let l2 = null == (d10 = this.bindings[k2]) ? void 0 : d10.find((b11) => b11.ref === a10.ref);
            if (!l2) return true;
            if (!["broadcast", "presence", "postgres_changes"].includes(k2)) return l2.type.toLocaleLowerCase() === k2;
            if ("id" in l2) {
              let a11 = l2.id, c11 = null == (e10 = l2.filter) ? void 0 : e10.event;
              return a11 && (null == (f10 = b10.ids) ? void 0 : f10.includes(a11)) && ("*" === c11 || (null == c11 ? void 0 : c11.toLocaleLowerCase()) === (null == (g2 = b10.data) ? void 0 : g2.type.toLocaleLowerCase()));
            }
            {
              let a11 = null == (i2 = null == (h2 = null == l2 ? void 0 : l2.filter) ? void 0 : h2.event) ? void 0 : i2.toLocaleLowerCase();
              return "*" === a11 || a11 === (null == (j2 = null == b10 ? void 0 : b10.event) ? void 0 : j2.toLocaleLowerCase());
            }
          });
        }
        _notThisChannelEvent(a10, b10) {
          let { close: c10, error: d10, leave: e10, join: f10 } = dD;
          return b10 && [c10, d10, e10, f10].includes(a10) && b10 !== this.joinPush.ref;
        }
        _updateFilterTransform() {
          this.channelAdapter.updatePayloadTransform((a10, b10, c10) => {
            if ("object" == typeof b10 && "ids" in b10) {
              let a11 = b10.data, { schema: c11, table: d10, commit_timestamp: e10, type: f10, errors: g2 } = a11;
              return Object.assign(Object.assign({}, { schema: c11, table: d10, commit_timestamp: e10, eventType: f10, new: {}, old: {}, errors: g2 }), this._getPayloadRecords(a11));
            }
            return b10;
          });
        }
        copyBindings(a10) {
          if (this.joinedOnce) throw Error("cannot copy bindings into joined channel");
          for (let b10 in a10.bindings) for (let c10 of a10.bindings[b10]) this._on(c10.type, c10.filter, c10.callback);
        }
        static isFilterValueEqual(a10, b10) {
          return (null != a10 ? a10 : void 0) === (null != b10 ? b10 : void 0);
        }
        _getPayloadRecords(a10) {
          let b10 = { new: {}, old: {} };
          return ("INSERT" === a10.type || "UPDATE" === a10.type) && (b10.new = dF(a10.columns, a10.record)), ("UPDATE" === a10.type || "DELETE" === a10.type) && (b10.old = dF(a10.columns, a10.old_record)), b10;
        }
      }
      class ef {
        constructor(a10, b10) {
          this.socket = new d8(a10, b10);
        }
        get timeout() {
          return this.socket.timeout;
        }
        get endPoint() {
          return this.socket.endPoint;
        }
        get transport() {
          return this.socket.transport;
        }
        get heartbeatIntervalMs() {
          return this.socket.heartbeatIntervalMs;
        }
        get heartbeatCallback() {
          return this.socket.heartbeatCallback;
        }
        set heartbeatCallback(a10) {
          this.socket.heartbeatCallback = a10;
        }
        get heartbeatTimer() {
          return this.socket.heartbeatTimer;
        }
        get pendingHeartbeatRef() {
          return this.socket.pendingHeartbeatRef;
        }
        get reconnectTimer() {
          return this.socket.reconnectTimer;
        }
        get vsn() {
          return this.socket.vsn;
        }
        get encode() {
          return this.socket.encode;
        }
        get decode() {
          return this.socket.decode;
        }
        get reconnectAfterMs() {
          return this.socket.reconnectAfterMs;
        }
        get sendBuffer() {
          return this.socket.sendBuffer;
        }
        get stateChangeCallbacks() {
          return this.socket.stateChangeCallbacks;
        }
        connect() {
          this.socket.connect();
        }
        disconnect(a10, b10, c10, d10 = 1e4) {
          return new Promise((e10) => {
            setTimeout(() => e10("timeout"), d10), this.socket.disconnect(() => {
              a10(), e10("ok");
            }, b10, c10);
          });
        }
        push(a10) {
          this.socket.push(a10);
        }
        log(a10, b10, c10) {
          this.socket.log(a10, b10, c10);
        }
        makeRef() {
          return this.socket.makeRef();
        }
        onOpen(a10) {
          this.socket.onOpen(a10);
        }
        onClose(a10) {
          this.socket.onClose(a10);
        }
        onError(a10) {
          this.socket.onError(a10);
        }
        onMessage(a10) {
          this.socket.onMessage(a10);
        }
        isConnected() {
          return this.socket.isConnected();
        }
        isConnecting() {
          return "connecting" == this.socket.connectionState();
        }
        isDisconnecting() {
          return "closing" == this.socket.connectionState();
        }
        connectionState() {
          return this.socket.connectionState();
        }
        endPointURL() {
          return this.socket.endPointURL();
        }
        sendHeartbeat() {
          this.socket.sendHeartbeat();
        }
        getSocket() {
          return this.socket;
        }
      }
      let eg = [1e3, 2e3, 5e3, 1e4], eh = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
      class ei {
        get endPoint() {
          return this.socketAdapter.endPoint;
        }
        get timeout() {
          return this.socketAdapter.timeout;
        }
        get transport() {
          return this.socketAdapter.transport;
        }
        get heartbeatCallback() {
          return this.socketAdapter.heartbeatCallback;
        }
        get heartbeatIntervalMs() {
          return this.socketAdapter.heartbeatIntervalMs;
        }
        get heartbeatTimer() {
          return this.worker ? this._workerHeartbeatTimer : this.socketAdapter.heartbeatTimer;
        }
        get pendingHeartbeatRef() {
          return this.worker ? this._pendingWorkerHeartbeatRef : this.socketAdapter.pendingHeartbeatRef;
        }
        get reconnectTimer() {
          return this.socketAdapter.reconnectTimer;
        }
        get vsn() {
          return this.socketAdapter.vsn;
        }
        get encode() {
          return this.socketAdapter.encode;
        }
        get decode() {
          return this.socketAdapter.decode;
        }
        get reconnectAfterMs() {
          return this.socketAdapter.reconnectAfterMs;
        }
        get sendBuffer() {
          return this.socketAdapter.sendBuffer;
        }
        get stateChangeCallbacks() {
          return this.socketAdapter.stateChangeCallbacks;
        }
        constructor(a10, b10) {
          var c10;
          if (this.channels = [], this.accessTokenValue = null, this.accessToken = null, this.apiKey = null, this.httpEndpoint = "", this.headers = {}, this.params = {}, this.ref = 0, this.serializer = new dE(), this._manuallySetToken = false, this._authPromise = null, this._workerHeartbeatTimer = void 0, this._pendingWorkerHeartbeatRef = null, this._pendingDisconnectTimer = null, this._disconnectOnEmptyChannelsAfterMs = 0, this._resolveFetch = (a11) => a11 ? (...b11) => a11(...b11) : (...a12) => fetch(...a12), !(null == (c10 = null == b10 ? void 0 : b10.params) ? void 0 : c10.apikey)) throw Error("API key is required to connect to Realtime");
          this.apiKey = b10.params.apikey;
          const d10 = this._initializeOptions(b10);
          this.socketAdapter = new ef(a10, d10), this.httpEndpoint = dO(a10), this.fetch = this._resolveFetch(null == b10 ? void 0 : b10.fetch);
        }
        connect() {
          if (!(this.isConnecting() || this.isDisconnecting() || this.isConnected())) {
            this.accessToken && !this._authPromise && this._setAuthSafely("connect"), this._setupConnectionHandlers();
            try {
              this.socketAdapter.connect();
            } catch (b10) {
              let a10 = b10.message;
              if (a10.includes("Node.js")) throw Error(`${a10}

To use Realtime in Node.js, you need to provide a WebSocket implementation:

Option 1: Use Node.js 22+ which has native WebSocket support
Option 2: Install and provide the "ws" package:

  npm install ws

  import ws from "ws"
  const client = new RealtimeClient(url, {
    ...options,
    transport: ws
  })`);
              throw Error(`WebSocket not available: ${a10}`);
            }
            this._handleNodeJsRaceCondition();
          }
        }
        endpointURL() {
          return this.socketAdapter.endPointURL();
        }
        async disconnect(a10, b10) {
          return (this._cancelPendingDisconnect(), this.isDisconnecting()) ? "ok" : await this.socketAdapter.disconnect(() => {
            clearInterval(this._workerHeartbeatTimer), this._terminateWorker();
          }, a10, b10);
        }
        getChannels() {
          return this.channels;
        }
        async removeChannel(a10) {
          let b10 = await a10.unsubscribe();
          return "ok" === b10 && a10.teardown(), b10;
        }
        async removeAllChannels() {
          let a10 = this.channels.map(async (a11) => {
            let b11 = await a11.unsubscribe();
            return a11.teardown(), b11;
          }), b10 = await Promise.all(a10);
          return await this.disconnect(), b10;
        }
        log(a10, b10, c10) {
          this.socketAdapter.log(a10, b10, c10);
        }
        connectionState() {
          return this.socketAdapter.connectionState() || "closed";
        }
        isConnected() {
          return this.socketAdapter.isConnected();
        }
        isConnecting() {
          return this.socketAdapter.isConnecting();
        }
        isDisconnecting() {
          return this.socketAdapter.isDisconnecting();
        }
        channel(a10, b10 = { config: {} }) {
          let c10 = `realtime:${a10}`, d10 = this.getChannels().find((a11) => a11.topic === c10);
          if (d10) return d10;
          {
            let c11 = new ee(`realtime:${a10}`, b10, this);
            return this._cancelPendingDisconnect(), this.channels.push(c11), c11;
          }
        }
        push(a10) {
          this.socketAdapter.push(a10);
        }
        async setAuth(a10 = null) {
          this._authPromise = this._performAuth(a10);
          try {
            await this._authPromise;
          } finally {
            this._authPromise = null;
          }
        }
        _isManualToken() {
          return this._manuallySetToken;
        }
        async sendHeartbeat() {
          this.socketAdapter.sendHeartbeat();
        }
        onHeartbeat(a10) {
          this.socketAdapter.heartbeatCallback = this._wrapHeartbeatCallback(a10);
        }
        _makeRef() {
          return this.socketAdapter.makeRef();
        }
        _remove(a10) {
          this.channels = this.channels.filter((b10) => b10.topic !== a10.topic), 0 === this.channels.length && (this.log("transport", "no channels remaining, scheduling disconnect"), this._schedulePendingDisconnect());
        }
        _schedulePendingDisconnect() {
          if (this._cancelPendingDisconnect(), 0 === this._disconnectOnEmptyChannelsAfterMs) {
            this.log("transport", "disconnecting immediately - no channels"), this.disconnect();
            return;
          }
          this._pendingDisconnectTimer = setTimeout(() => {
            this._pendingDisconnectTimer = null, 0 === this.channels.length && (this.log("transport", "deferred disconnect fired - no channels, disconnecting"), this.disconnect());
          }, this._disconnectOnEmptyChannelsAfterMs), this.log("transport", `deferred disconnect scheduled in ${this._disconnectOnEmptyChannelsAfterMs}ms`);
        }
        _cancelPendingDisconnect() {
          null !== this._pendingDisconnectTimer && (this.log("transport", "pending disconnect cancelled - channel activity detected"), clearTimeout(this._pendingDisconnectTimer), this._pendingDisconnectTimer = null);
        }
        async _performAuth(a10 = null) {
          let b10, c10 = false;
          if (a10) b10 = a10, c10 = true;
          else if (this.accessToken) try {
            b10 = await this.accessToken();
          } catch (a11) {
            this.log("error", "Error fetching access token from callback", a11), b10 = this.accessTokenValue;
          }
          else b10 = this.accessTokenValue;
          c10 ? this._manuallySetToken = true : this.accessToken && (this._manuallySetToken = false), this.accessTokenValue != b10 && (this.accessTokenValue = b10, this.channels.forEach((a11) => {
            let c11 = { access_token: b10, version: "realtime-js/2.106.1" };
            b10 && a11.updateJoinPayload(c11), a11.joinedOnce && a11.channelAdapter.isJoined() && a11.channelAdapter.push(dD.access_token, { access_token: b10 });
          }));
        }
        async _waitForAuthIfNeeded() {
          this._authPromise && await this._authPromise;
        }
        _setAuthSafely(a10 = "general") {
          this._isManualToken() || this.setAuth().catch((b10) => {
            this.log("error", `Error setting auth in ${a10}`, b10);
          });
        }
        _setupConnectionHandlers() {
          this.socketAdapter.onOpen(() => {
            (this._authPromise || (this.accessToken && !this.accessTokenValue ? this.setAuth() : Promise.resolve())).catch((a10) => {
              this.log("error", "error waiting for auth on connect", a10);
            }), this.worker && !this.workerRef && this._startWorkerHeartbeat();
          }), this.socketAdapter.onClose(() => {
            this.worker && this.workerRef && this._terminateWorker();
          }), this.socketAdapter.onMessage((a10) => {
            a10.ref && a10.ref === this._pendingWorkerHeartbeatRef && (this._pendingWorkerHeartbeatRef = null);
          });
        }
        _handleNodeJsRaceCondition() {
          this.socketAdapter.isConnected() && this.socketAdapter.getSocket().onConnOpen();
        }
        _wrapHeartbeatCallback(a10) {
          return (b10, c10) => {
            "sent" == b10 && this._setAuthSafely(), a10 && a10(b10, c10);
          };
        }
        _startWorkerHeartbeat() {
          this.workerUrl ? this.log("worker", `starting worker for from ${this.workerUrl}`) : this.log("worker", "starting default worker");
          let a10 = this._workerObjectUrl(this.workerUrl);
          this.workerRef = new Worker(a10), this.workerRef.onerror = (a11) => {
            this.log("worker", "worker error", a11.message), this._terminateWorker(), this.disconnect();
          }, this.workerRef.onmessage = (a11) => {
            "keepAlive" === a11.data.event && this.sendHeartbeat();
          }, this.workerRef.postMessage({ event: "start", interval: this.heartbeatIntervalMs });
        }
        _terminateWorker() {
          this.workerRef && (this.log("worker", "terminating worker"), this.workerRef.terminate(), this.workerRef = void 0);
        }
        _workerObjectUrl(a10) {
          let b10;
          if (a10) b10 = a10;
          else {
            let a11 = new Blob([eh], { type: "application/javascript" });
            b10 = URL.createObjectURL(a11);
          }
          return b10;
        }
        _initializeOptions(a10) {
          var b10, c10, d10, e10, f10, g2, h2, i2, j2, k2, l2, m2;
          let n2, o2;
          this.worker = null != (b10 = null == a10 ? void 0 : a10.worker) && b10, this.accessToken = null != (c10 = null == a10 ? void 0 : a10.accessToken) ? c10 : null;
          let p2 = {};
          p2.timeout = null != (d10 = null == a10 ? void 0 : a10.timeout) ? d10 : 1e4, p2.heartbeatIntervalMs = null != (e10 = null == a10 ? void 0 : a10.heartbeatIntervalMs) ? e10 : 25e3, this._disconnectOnEmptyChannelsAfterMs = null != (f10 = null == a10 ? void 0 : a10.disconnectOnEmptyChannelsAfterMs) ? f10 : 2 * (null != (g2 = null == a10 ? void 0 : a10.heartbeatIntervalMs) ? g2 : 25e3), p2.transport = null != (h2 = null == a10 ? void 0 : a10.transport) ? h2 : dz.getWebSocketConstructor(), p2.params = null == a10 ? void 0 : a10.params, p2.logger = null == a10 ? void 0 : a10.logger, p2.heartbeatCallback = this._wrapHeartbeatCallback(null == a10 ? void 0 : a10.heartbeatCallback), p2.sessionStorage = null != (i2 = null == a10 ? void 0 : a10.sessionStorage) ? i2 : (function() {
            let a11;
            try {
              if ("u" > typeof globalThis && globalThis.sessionStorage) return globalThis.sessionStorage;
            } catch (a12) {
            }
            return a11 = /* @__PURE__ */ new Map(), { get length() {
              return a11.size;
            }, clear() {
              a11.clear();
            }, getItem: (b11) => a11.has(b11) ? a11.get(b11) : null, key(b11) {
              var c11;
              return null != (c11 = Array.from(a11.keys())[b11]) ? c11 : null;
            }, removeItem(b11) {
              a11.delete(b11);
            }, setItem(b11, c11) {
              a11.set(b11, String(c11));
            } };
          })(), p2.reconnectAfterMs = null != (j2 = null == a10 ? void 0 : a10.reconnectAfterMs) ? j2 : (a11) => eg[a11 - 1] || 1e4;
          let q2 = null != (k2 = null == a10 ? void 0 : a10.vsn) ? k2 : dA;
          switch (q2) {
            case "1.0.0":
              n2 = (a11, b11) => b11(JSON.stringify(a11)), o2 = (a11, b11) => b11(JSON.parse(a11));
              break;
            case dA:
              n2 = this.serializer.encode.bind(this.serializer), o2 = this.serializer.decode.bind(this.serializer);
              break;
            default:
              throw Error(`Unsupported serializer version: ${p2.vsn}`);
          }
          if (p2.vsn = q2, p2.encode = null != (l2 = null == a10 ? void 0 : a10.encode) ? l2 : n2, p2.decode = null != (m2 = null == a10 ? void 0 : a10.decode) ? m2 : o2, p2.beforeReconnect = this._reconnectAuth.bind(this), ((null == a10 ? void 0 : a10.logLevel) || (null == a10 ? void 0 : a10.log_level)) && (this.logLevel = a10.logLevel || a10.log_level, p2.params = Object.assign(Object.assign({}, p2.params), { log_level: this.logLevel })), this.worker) {
            if ("u" > typeof window && !window.Worker) throw Error("Web Worker is not supported");
            this.workerUrl = null == a10 ? void 0 : a10.workerUrl, p2.autoSendHeartbeat = !this.worker;
          }
          return p2;
        }
        async _reconnectAuth() {
          await this._waitForAuthIfNeeded(), this.isConnected() || this.connect();
        }
      }
      var ej = class extends Error {
        constructor(a10, b10) {
          super(a10), this.name = "IcebergError", this.status = b10.status, this.icebergType = b10.icebergType, this.icebergCode = b10.icebergCode, this.details = b10.details, this.isCommitStateUnknown = "CommitStateUnknownException" === b10.icebergType || [500, 502, 504].includes(b10.status) && b10.icebergType?.includes("CommitState") === true;
        }
        isNotFound() {
          return 404 === this.status;
        }
        isConflict() {
          return 409 === this.status;
        }
        isAuthenticationTimeout() {
          return 419 === this.status;
        }
      };
      async function ek(a10) {
        return a10 && "none" !== a10.type ? "bearer" === a10.type ? { Authorization: `Bearer ${a10.token}` } : "header" === a10.type ? { [a10.name]: a10.value } : "custom" === a10.type ? await a10.getHeaders() : {} : {};
      }
      function el(a10) {
        return a10.join("");
      }
      var em = class {
        constructor(a10, b10 = "") {
          this.client = a10, this.prefix = b10;
        }
        async listNamespaces(a10) {
          let b10 = a10 ? { parent: el(a10.namespace) } : void 0;
          return (await this.client.request({ method: "GET", path: `${this.prefix}/namespaces`, query: b10 })).data.namespaces.map((a11) => ({ namespace: a11 }));
        }
        async createNamespace(a10, b10) {
          let c10 = { namespace: a10.namespace, properties: b10?.properties };
          return (await this.client.request({ method: "POST", path: `${this.prefix}/namespaces`, body: c10 })).data;
        }
        async dropNamespace(a10) {
          await this.client.request({ method: "DELETE", path: `${this.prefix}/namespaces/${el(a10.namespace)}` });
        }
        async loadNamespaceMetadata(a10) {
          return { properties: (await this.client.request({ method: "GET", path: `${this.prefix}/namespaces/${el(a10.namespace)}` })).data.properties };
        }
        async namespaceExists(a10) {
          try {
            return await this.client.request({ method: "HEAD", path: `${this.prefix}/namespaces/${el(a10.namespace)}` }), true;
          } catch (a11) {
            if (a11 instanceof ej && 404 === a11.status) return false;
            throw a11;
          }
        }
        async createNamespaceIfNotExists(a10, b10) {
          try {
            return await this.createNamespace(a10, b10);
          } catch (a11) {
            if (a11 instanceof ej && 409 === a11.status) return;
            throw a11;
          }
        }
      };
      function en(a10) {
        return a10.join("");
      }
      var eo = class {
        constructor(a10, b10 = "", c10) {
          this.client = a10, this.prefix = b10, this.accessDelegation = c10;
        }
        async listTables(a10) {
          return (await this.client.request({ method: "GET", path: `${this.prefix}/namespaces/${en(a10.namespace)}/tables` })).data.identifiers;
        }
        async createTable(a10, b10) {
          let c10 = {};
          return this.accessDelegation && (c10["X-Iceberg-Access-Delegation"] = this.accessDelegation), (await this.client.request({ method: "POST", path: `${this.prefix}/namespaces/${en(a10.namespace)}/tables`, body: b10, headers: c10 })).data.metadata;
        }
        async updateTable(a10, b10) {
          let c10 = await this.client.request({ method: "POST", path: `${this.prefix}/namespaces/${en(a10.namespace)}/tables/${a10.name}`, body: b10 });
          return { "metadata-location": c10.data["metadata-location"], metadata: c10.data.metadata };
        }
        async dropTable(a10, b10) {
          await this.client.request({ method: "DELETE", path: `${this.prefix}/namespaces/${en(a10.namespace)}/tables/${a10.name}`, query: { purgeRequested: String(b10?.purge ?? false) } });
        }
        async loadTable(a10) {
          let b10 = {};
          return this.accessDelegation && (b10["X-Iceberg-Access-Delegation"] = this.accessDelegation), (await this.client.request({ method: "GET", path: `${this.prefix}/namespaces/${en(a10.namespace)}/tables/${a10.name}`, headers: b10 })).data.metadata;
        }
        async tableExists(a10) {
          let b10 = {};
          this.accessDelegation && (b10["X-Iceberg-Access-Delegation"] = this.accessDelegation);
          try {
            return await this.client.request({ method: "HEAD", path: `${this.prefix}/namespaces/${en(a10.namespace)}/tables/${a10.name}`, headers: b10 }), true;
          } catch (a11) {
            if (a11 instanceof ej && 404 === a11.status) return false;
            throw a11;
          }
        }
        async createTableIfNotExists(a10, b10) {
          try {
            return await this.createTable(a10, b10);
          } catch (c10) {
            if (c10 instanceof ej && 409 === c10.status) return await this.loadTable({ namespace: a10.namespace, name: b10.name });
            throw c10;
          }
        }
      }, ep = class {
        constructor(a10) {
          let b10 = "v1";
          a10.catalogName && (b10 += `/${a10.catalogName}`);
          const c10 = a10.baseUrl.endsWith("/") ? a10.baseUrl : `${a10.baseUrl}/`;
          this.client = (function(a11) {
            let b11 = a11.fetchImpl ?? globalThis.fetch;
            return { async request({ method: c11, path: d10, query: e10, body: f10, headers: g2 }) {
              let h2 = (function(a12, b12, c12) {
                let d11 = new URL(b12, a12);
                if (c12) for (let [a13, b13] of Object.entries(c12)) void 0 !== b13 && d11.searchParams.set(a13, b13);
                return d11.toString();
              })(a11.baseUrl, d10, e10), i2 = await ek(a11.auth), j2 = await b11(h2, { method: c11, headers: { ...f10 ? { "Content-Type": "application/json" } : {}, ...i2, ...g2 }, body: f10 ? JSON.stringify(f10) : void 0 }), k2 = await j2.text(), l2 = (j2.headers.get("content-type") || "").includes("application/json"), m2 = l2 && k2 ? JSON.parse(k2) : k2;
              if (!j2.ok) {
                let a12 = l2 ? m2 : void 0, b12 = a12?.error;
                throw new ej(b12?.message ?? `Request failed with status ${j2.status}`, { status: j2.status, icebergType: b12?.type, icebergCode: b12?.code, details: a12 });
              }
              return { status: j2.status, headers: j2.headers, data: m2 };
            } };
          })({ baseUrl: c10, auth: a10.auth, fetchImpl: a10.fetch }), this.accessDelegation = a10.accessDelegation?.join(","), this.namespaceOps = new em(this.client, b10), this.tableOps = new eo(this.client, b10, this.accessDelegation);
        }
        async listNamespaces(a10) {
          return this.namespaceOps.listNamespaces(a10);
        }
        async createNamespace(a10, b10) {
          return this.namespaceOps.createNamespace(a10, b10);
        }
        async dropNamespace(a10) {
          await this.namespaceOps.dropNamespace(a10);
        }
        async loadNamespaceMetadata(a10) {
          return this.namespaceOps.loadNamespaceMetadata(a10);
        }
        async listTables(a10) {
          return this.tableOps.listTables(a10);
        }
        async createTable(a10, b10) {
          return this.tableOps.createTable(a10, b10);
        }
        async updateTable(a10, b10) {
          return this.tableOps.updateTable(a10, b10);
        }
        async dropTable(a10, b10) {
          await this.tableOps.dropTable(a10, b10);
        }
        async loadTable(a10) {
          return this.tableOps.loadTable(a10);
        }
        async namespaceExists(a10) {
          return this.namespaceOps.namespaceExists(a10);
        }
        async tableExists(a10) {
          return this.tableOps.tableExists(a10);
        }
        async createNamespaceIfNotExists(a10, b10) {
          return this.namespaceOps.createNamespaceIfNotExists(a10, b10);
        }
        async createTableIfNotExists(a10, b10) {
          return this.tableOps.createTableIfNotExists(a10, b10);
        }
      }, eq = c(356).Buffer;
      function er(a10) {
        return (er = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(a11) {
          return typeof a11;
        } : function(a11) {
          return a11 && "function" == typeof Symbol && a11.constructor === Symbol && a11 !== Symbol.prototype ? "symbol" : typeof a11;
        })(a10);
      }
      function es(a10, b10) {
        var c10 = Object.keys(a10);
        if (Object.getOwnPropertySymbols) {
          var d10 = Object.getOwnPropertySymbols(a10);
          b10 && (d10 = d10.filter(function(b11) {
            return Object.getOwnPropertyDescriptor(a10, b11).enumerable;
          })), c10.push.apply(c10, d10);
        }
        return c10;
      }
      function et(a10) {
        for (var b10 = 1; b10 < arguments.length; b10++) {
          var c10 = null != arguments[b10] ? arguments[b10] : {};
          b10 % 2 ? es(Object(c10), true).forEach(function(b11) {
            !(function(a11, b12, c11) {
              var d10;
              (d10 = (function(a12, b13) {
                if ("object" != er(a12) || !a12) return a12;
                var c12 = a12[Symbol.toPrimitive];
                if (void 0 !== c12) {
                  var d11 = c12.call(a12, b13);
                  if ("object" != er(d11)) return d11;
                  throw TypeError("@@toPrimitive must return a primitive value.");
                }
                return ("string" === b13 ? String : Number)(a12);
              })(b12, "string"), (b12 = "symbol" == er(d10) ? d10 : d10 + "") in a11) ? Object.defineProperty(a11, b12, { value: c11, enumerable: true, configurable: true, writable: true }) : a11[b12] = c11;
            })(a10, b11, c10[b11]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(a10, Object.getOwnPropertyDescriptors(c10)) : es(Object(c10)).forEach(function(b11) {
            Object.defineProperty(a10, b11, Object.getOwnPropertyDescriptor(c10, b11));
          });
        }
        return a10;
      }
      var eu = class extends Error {
        constructor(a10, b10 = "storage", c10, d10) {
          super(a10), this.__isStorageError = true, this.namespace = b10, this.name = "vectors" === b10 ? "StorageVectorsError" : "StorageError", this.status = c10, this.statusCode = d10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, statusCode: this.statusCode };
        }
      };
      function ev(a10) {
        return "object" == typeof a10 && null !== a10 && "__isStorageError" in a10;
      }
      var ew = class extends eu {
        constructor(a10, b10, c10, d10 = "storage") {
          super(a10, d10, b10, c10), this.name = "vectors" === d10 ? "StorageVectorsApiError" : "StorageApiError", this.status = b10, this.statusCode = c10;
        }
        toJSON() {
          return et({}, super.toJSON());
        }
      }, ex = class extends eu {
        constructor(a10, b10, c10 = "storage") {
          super(a10, c10), this.name = "vectors" === c10 ? "StorageVectorsUnknownError" : "StorageUnknownError", this.originalError = b10;
        }
      };
      function ey(a10, b10, c10) {
        let d10 = et({}, a10), e10 = b10.toLowerCase();
        for (let a11 of Object.keys(d10)) a11.toLowerCase() === e10 && delete d10[a11];
        return d10[e10] = c10, d10;
      }
      let ez = (a10) => {
        if (Array.isArray(a10)) return a10.map((a11) => ez(a11));
        if ("function" == typeof a10 || a10 !== Object(a10)) return a10;
        let b10 = {};
        return Object.entries(a10).forEach(([a11, c10]) => {
          b10[a11.replace(/([-_][a-z])/gi, (a12) => a12.toUpperCase().replace(/[-_]/g, ""))] = ez(c10);
        }), b10;
      }, eA = (a10) => {
        if ("object" == typeof a10 && null !== a10) {
          if ("string" == typeof a10.msg) return a10.msg;
          if ("string" == typeof a10.message) return a10.message;
          if ("string" == typeof a10.error_description) return a10.error_description;
          if ("string" == typeof a10.error) return a10.error;
          if ("object" == typeof a10.error && null !== a10.error) {
            let b10 = a10.error;
            if ("string" == typeof b10.message) return b10.message;
          }
        }
        return JSON.stringify(a10);
      }, eB = async (a10, b10, c10, d10) => {
        if (null !== a10 && "object" == typeof a10 && "json" in a10 && "function" == typeof a10.json) {
          let c11 = parseInt(String(a10.status), 10);
          Number.isFinite(c11) || (c11 = 500), a10.json().then((a11) => {
            let e10 = (null == a11 ? void 0 : a11.statusCode) || (null == a11 ? void 0 : a11.code) || c11 + "";
            b10(new ew(eA(a11), c11, e10, d10));
          }).catch(() => {
            let e10 = c11 + "";
            b10(new ew(a10.statusText || `HTTP ${c11} error`, c11, e10, d10));
          });
        } else b10(new ex(eA(a10), a10, d10));
      };
      async function eC(a10, b10, c10, d10, e10, f10, g2) {
        return new Promise((h2, i2) => {
          a10(c10, ((a11, b11, c11, d11) => {
            let e11 = { method: a11, headers: (null == b11 ? void 0 : b11.headers) || {} };
            if ("GET" === a11 || "HEAD" === a11 || !d11) return et(et({}, e11), c11);
            if (((a12) => {
              if ("object" != typeof a12 || null === a12) return false;
              let b12 = Object.getPrototypeOf(a12);
              return (null === b12 || b12 === Object.prototype || null === Object.getPrototypeOf(b12)) && !(Symbol.toStringTag in a12) && !(Symbol.iterator in a12);
            })(d11)) {
              var f11;
              let a12, c12 = (null == b11 ? void 0 : b11.headers) || {};
              for (let [b12, d12] of Object.entries(c12)) "content-type" === b12.toLowerCase() && (a12 = d12);
              e11.headers = ey(c12, "Content-Type", null != (f11 = a12) ? f11 : "application/json"), e11.body = JSON.stringify(d11);
            } else e11.body = d11;
            return (null == b11 ? void 0 : b11.duplex) && (e11.duplex = b11.duplex), et(et({}, e11), c11);
          })(b10, d10, e10, f10)).then((a11) => {
            if (!a11.ok) throw a11;
            if (null == d10 ? void 0 : d10.noResolveJson) return a11;
            if ("vectors" === g2) {
              let b11 = a11.headers.get("content-type");
              if ("0" === a11.headers.get("content-length") || 204 === a11.status || !b11 || !b11.includes("application/json")) return {};
            }
            return a11.json();
          }).then((a11) => h2(a11)).catch((a11) => eB(a11, i2, d10, g2));
        });
      }
      function eD(a10 = "storage") {
        return { get: async (b10, c10, d10, e10) => eC(b10, "GET", c10, d10, e10, void 0, a10), post: async (b10, c10, d10, e10, f10) => eC(b10, "POST", c10, e10, f10, d10, a10), put: async (b10, c10, d10, e10, f10) => eC(b10, "PUT", c10, e10, f10, d10, a10), head: async (b10, c10, d10, e10) => eC(b10, "HEAD", c10, et(et({}, d10), {}, { noResolveJson: true }), e10, void 0, a10), remove: async (b10, c10, d10, e10, f10) => eC(b10, "DELETE", c10, e10, f10, d10, a10) };
      }
      let { get: eE, post: eF, put: eG, head: eH, remove: eI } = eD("storage"), eJ = eD("vectors");
      var eK = class {
        constructor(a10, b10 = {}, c10, d10 = "storage") {
          this.shouldThrowOnError = false, this.url = a10, this.headers = (function(a11) {
            let b11 = {};
            for (let [c11, d11] of Object.entries(a11)) b11[c11.toLowerCase()] = d11;
            return b11;
          })(b10), this.fetch = /* @__PURE__ */ ((a11) => a11 ? (...b11) => a11(...b11) : (...a12) => fetch(...a12))(c10), this.namespace = d10;
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        setHeader(a10, b10) {
          return this.headers = ey(this.headers, a10, b10), this;
        }
        async handleOperation(a10) {
          try {
            return { data: await a10(), error: null };
          } catch (a11) {
            if (this.shouldThrowOnError) throw a11;
            if (ev(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
      };
      g = Symbol.toStringTag;
      var eL = class {
        constructor(a10, b10) {
          this.downloadFn = a10, this.shouldThrowOnError = b10, this[g] = "StreamDownloadBuilder", this.promise = null;
        }
        then(a10, b10) {
          return this.getPromise().then(a10, b10);
        }
        catch(a10) {
          return this.getPromise().catch(a10);
        }
        finally(a10) {
          return this.getPromise().finally(a10);
        }
        getPromise() {
          return this.promise || (this.promise = this.execute()), this.promise;
        }
        async execute() {
          try {
            return { data: (await this.downloadFn()).body, error: null };
          } catch (a10) {
            if (this.shouldThrowOnError) throw a10;
            if (ev(a10)) return { data: null, error: a10 };
            throw a10;
          }
        }
      };
      h = Symbol.toStringTag;
      var eM = class {
        constructor(a10, b10) {
          this.downloadFn = a10, this.shouldThrowOnError = b10, this[h] = "BlobDownloadBuilder", this.promise = null;
        }
        asStream() {
          return new eL(this.downloadFn, this.shouldThrowOnError);
        }
        then(a10, b10) {
          return this.getPromise().then(a10, b10);
        }
        catch(a10) {
          return this.getPromise().catch(a10);
        }
        finally(a10) {
          return this.getPromise().finally(a10);
        }
        getPromise() {
          return this.promise || (this.promise = this.execute()), this.promise;
        }
        async execute() {
          try {
            return { data: await (await this.downloadFn()).blob(), error: null };
          } catch (a10) {
            if (this.shouldThrowOnError) throw a10;
            if (ev(a10)) return { data: null, error: a10 };
            throw a10;
          }
        }
      };
      let eN = { limit: 100, offset: 0, sortBy: { column: "name", order: "asc" } }, eO = { cacheControl: "3600", contentType: "text/plain;charset=UTF-8", upsert: false };
      var eP = class extends eK {
        constructor(a10, b10 = {}, c10, d10) {
          super(a10, b10, d10, "storage"), this.bucketId = c10;
        }
        async uploadOrUpdate(a10, b10, c10, d10) {
          var e10 = this;
          return e10.handleOperation(async () => {
            let f10, g2 = et(et({}, eO), d10), h2 = et(et({}, e10.headers), "POST" === a10 && { "x-upsert": String(g2.upsert) }), i2 = g2.metadata;
            if ("u" > typeof Blob && c10 instanceof Blob ? ((f10 = new FormData()).append("cacheControl", g2.cacheControl), i2 && f10.append("metadata", e10.encodeMetadata(i2)), f10.append("", c10)) : "u" > typeof FormData && c10 instanceof FormData ? ((f10 = c10).has("cacheControl") || f10.append("cacheControl", g2.cacheControl), i2 && !f10.has("metadata") && f10.append("metadata", e10.encodeMetadata(i2))) : (f10 = c10, h2["cache-control"] = `max-age=${g2.cacheControl}`, h2["content-type"] = g2.contentType, i2 && (h2["x-metadata"] = e10.toBase64(e10.encodeMetadata(i2))), ("u" > typeof ReadableStream && f10 instanceof ReadableStream || f10 && "object" == typeof f10 && "pipe" in f10 && "function" == typeof f10.pipe) && !g2.duplex && (g2.duplex = "half")), null == d10 ? void 0 : d10.headers) for (let [a11, b11] of Object.entries(d10.headers)) h2 = ey(h2, a11, b11);
            let j2 = e10._removeEmptyFolders(b10), k2 = e10._getFinalPath(j2), l2 = await ("PUT" == a10 ? eG : eF)(e10.fetch, `${e10.url}/object/${k2}`, f10, et({ headers: h2 }, (null == g2 ? void 0 : g2.duplex) ? { duplex: g2.duplex } : {}));
            return { path: j2, id: l2.Id, fullPath: l2.Key };
          });
        }
        async upload(a10, b10, c10) {
          return this.uploadOrUpdate("POST", a10, b10, c10);
        }
        async uploadToSignedUrl(a10, b10, c10, d10) {
          var e10 = this;
          let f10 = e10._removeEmptyFolders(a10), g2 = e10._getFinalPath(f10), h2 = new URL(e10.url + `/object/upload/sign/${g2}`);
          return h2.searchParams.set("token", b10), e10.handleOperation(async () => {
            let a11, b11 = et(et({}, eO), d10), g3 = et(et({}, e10.headers), { "x-upsert": String(b11.upsert) }), i2 = b11.metadata;
            if ("u" > typeof Blob && c10 instanceof Blob ? ((a11 = new FormData()).append("cacheControl", b11.cacheControl), i2 && a11.append("metadata", e10.encodeMetadata(i2)), a11.append("", c10)) : "u" > typeof FormData && c10 instanceof FormData ? ((a11 = c10).has("cacheControl") || a11.append("cacheControl", b11.cacheControl), i2 && !a11.has("metadata") && a11.append("metadata", e10.encodeMetadata(i2))) : (a11 = c10, g3["cache-control"] = `max-age=${b11.cacheControl}`, g3["content-type"] = b11.contentType, i2 && (g3["x-metadata"] = e10.toBase64(e10.encodeMetadata(i2))), ("u" > typeof ReadableStream && a11 instanceof ReadableStream || a11 && "object" == typeof a11 && "pipe" in a11 && "function" == typeof a11.pipe) && !b11.duplex && (b11.duplex = "half")), null == d10 ? void 0 : d10.headers) for (let [a12, b12] of Object.entries(d10.headers)) g3 = ey(g3, a12, b12);
            return { path: f10, fullPath: (await eG(e10.fetch, h2.toString(), a11, et({ headers: g3 }, (null == b11 ? void 0 : b11.duplex) ? { duplex: b11.duplex } : {}))).Key };
          });
        }
        async createSignedUploadUrl(a10, b10) {
          var c10 = this;
          return c10.handleOperation(async () => {
            let d10 = c10._getFinalPath(a10), e10 = et({}, c10.headers);
            (null == b10 ? void 0 : b10.upsert) && (e10["x-upsert"] = "true");
            let f10 = await eF(c10.fetch, `${c10.url}/object/upload/sign/${d10}`, {}, { headers: e10 }), g2 = new URL(c10.url + f10.url), h2 = g2.searchParams.get("token");
            if (!h2) throw new eu("No token returned by API");
            return { signedUrl: g2.toString(), path: a10, token: h2 };
          });
        }
        async update(a10, b10, c10) {
          return this.uploadOrUpdate("PUT", a10, b10, c10);
        }
        async move(a10, b10, c10) {
          var d10 = this;
          return d10.handleOperation(async () => await eF(d10.fetch, `${d10.url}/object/move`, { bucketId: d10.bucketId, sourceKey: a10, destinationKey: b10, destinationBucket: null == c10 ? void 0 : c10.destinationBucket }, { headers: d10.headers }));
        }
        async copy(a10, b10, c10) {
          var d10 = this;
          return d10.handleOperation(async () => ({ path: (await eF(d10.fetch, `${d10.url}/object/copy`, { bucketId: d10.bucketId, sourceKey: a10, destinationKey: b10, destinationBucket: null == c10 ? void 0 : c10.destinationBucket }, { headers: d10.headers })).Key }));
        }
        async createSignedUrl(a10, b10, c10) {
          var d10 = this;
          return d10.handleOperation(async () => {
            let e10 = d10._getFinalPath(a10), f10 = "object" == typeof (null == c10 ? void 0 : c10.transform) && null !== c10.transform && Object.keys(c10.transform).length > 0, g2 = await eF(d10.fetch, `${d10.url}/object/sign/${e10}`, et({ expiresIn: b10 }, f10 ? { transform: c10.transform } : {}), { headers: d10.headers }), h2 = new URLSearchParams();
            (null == c10 ? void 0 : c10.download) && h2.set("download", true === c10.download ? "" : c10.download), (null == c10 ? void 0 : c10.cacheNonce) != null && h2.set("cacheNonce", String(c10.cacheNonce));
            let i2 = h2.toString();
            return { signedUrl: encodeURI(`${d10.url}${g2.signedURL}${i2 ? `&${i2}` : ""}`) };
          });
        }
        async createSignedUrls(a10, b10, c10) {
          var d10 = this;
          return d10.handleOperation(async () => {
            let e10 = await eF(d10.fetch, `${d10.url}/object/sign/${d10.bucketId}`, { expiresIn: b10, paths: a10 }, { headers: d10.headers }), f10 = new URLSearchParams();
            (null == c10 ? void 0 : c10.download) && f10.set("download", true === c10.download ? "" : c10.download), (null == c10 ? void 0 : c10.cacheNonce) != null && f10.set("cacheNonce", String(c10.cacheNonce));
            let g2 = f10.toString();
            return e10.map((a11) => et(et({}, a11), {}, { signedUrl: a11.signedURL ? encodeURI(`${d10.url}${a11.signedURL}${g2 ? `&${g2}` : ""}`) : null }));
          });
        }
        download(a10, b10, c10) {
          let d10 = "object" == typeof (null == b10 ? void 0 : b10.transform) && null !== b10.transform && Object.keys(b10.transform).length > 0 ? "render/image/authenticated" : "object", e10 = new URLSearchParams();
          (null == b10 ? void 0 : b10.transform) && this.applyTransformOptsToQuery(e10, b10.transform), (null == b10 ? void 0 : b10.cacheNonce) != null && e10.set("cacheNonce", String(b10.cacheNonce));
          let f10 = e10.toString(), g2 = this._getFinalPath(a10);
          return new eM(() => eE(this.fetch, `${this.url}/${d10}/${g2}${f10 ? `?${f10}` : ""}`, { headers: this.headers, noResolveJson: true }, c10), this.shouldThrowOnError);
        }
        async info(a10) {
          var b10 = this;
          let c10 = b10._getFinalPath(a10);
          return b10.handleOperation(async () => ez(await eE(b10.fetch, `${b10.url}/object/info/${c10}`, { headers: b10.headers })));
        }
        async exists(a10) {
          var b10;
          let c10 = this._getFinalPath(a10);
          try {
            return await eH(this.fetch, `${this.url}/object/${c10}`, { headers: this.headers }), { data: true, error: null };
          } catch (a11) {
            if (this.shouldThrowOnError) throw a11;
            if (ev(a11)) {
              let c11 = a11 instanceof ew ? a11.status : a11 instanceof ex ? null == (b10 = a11.originalError) ? void 0 : b10.status : void 0;
              if (void 0 !== c11 && [400, 404].includes(c11)) return { data: false, error: a11 };
            }
            throw a11;
          }
        }
        getPublicUrl(a10, b10) {
          let c10 = this._getFinalPath(a10), d10 = new URLSearchParams();
          (null == b10 ? void 0 : b10.download) && d10.set("download", true === b10.download ? "" : b10.download), (null == b10 ? void 0 : b10.transform) && this.applyTransformOptsToQuery(d10, b10.transform), (null == b10 ? void 0 : b10.cacheNonce) != null && d10.set("cacheNonce", String(b10.cacheNonce));
          let e10 = d10.toString(), f10 = "object" == typeof (null == b10 ? void 0 : b10.transform) && null !== b10.transform && Object.keys(b10.transform).length > 0 ? "render/image" : "object";
          return { data: { publicUrl: encodeURI(`${this.url}/${f10}/public/${c10}`) + (e10 ? `?${e10}` : "") } };
        }
        async remove(a10) {
          var b10 = this;
          return b10.handleOperation(async () => await eI(b10.fetch, `${b10.url}/object/${b10.bucketId}`, { prefixes: a10 }, { headers: b10.headers }));
        }
        async list(a10, b10, c10) {
          var d10 = this;
          return d10.handleOperation(async () => {
            let e10 = et(et(et({}, eN), b10), {}, { prefix: a10 || "" });
            return await eF(d10.fetch, `${d10.url}/object/list/${d10.bucketId}`, e10, { headers: d10.headers }, c10);
          });
        }
        async listV2(a10, b10) {
          var c10 = this;
          return c10.handleOperation(async () => {
            let d10 = et({}, a10);
            return await eF(c10.fetch, `${c10.url}/object/list-v2/${c10.bucketId}`, d10, { headers: c10.headers }, b10);
          });
        }
        encodeMetadata(a10) {
          return JSON.stringify(a10);
        }
        toBase64(a10) {
          return void 0 !== eq ? eq.from(a10).toString("base64") : btoa(a10);
        }
        _getFinalPath(a10) {
          return `${this.bucketId}/${a10.replace(/^\/+/, "")}`;
        }
        _removeEmptyFolders(a10) {
          return a10.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
        }
        applyTransformOptsToQuery(a10, b10) {
          return b10.width && a10.set("width", b10.width.toString()), b10.height && a10.set("height", b10.height.toString()), b10.resize && a10.set("resize", b10.resize), b10.format && a10.set("format", b10.format), b10.quality && a10.set("quality", b10.quality.toString()), a10;
        }
      };
      let eQ = { "X-Client-Info": "storage-js/2.106.1" };
      var eR = class extends eK {
        constructor(a10, b10 = {}, c10, d10) {
          const e10 = new URL(a10);
          (null == d10 ? void 0 : d10.useNewHostname) && /supabase\.(co|in|red)$/.test(e10.hostname) && !e10.hostname.includes("storage.supabase.") && (e10.hostname = e10.hostname.replace("supabase.", "storage.supabase.")), super(e10.href.replace(/\/$/, ""), et(et({}, eQ), b10), c10, "storage");
        }
        async listBuckets(a10) {
          var b10 = this;
          return b10.handleOperation(async () => {
            let c10 = b10.listBucketOptionsToQueryString(a10);
            return await eE(b10.fetch, `${b10.url}/bucket${c10}`, { headers: b10.headers });
          });
        }
        async getBucket(a10) {
          var b10 = this;
          return b10.handleOperation(async () => await eE(b10.fetch, `${b10.url}/bucket/${a10}`, { headers: b10.headers }));
        }
        async createBucket(a10, b10 = { public: false }) {
          var c10 = this;
          return c10.handleOperation(async () => await eF(c10.fetch, `${c10.url}/bucket`, { id: a10, name: a10, type: b10.type, public: b10.public, file_size_limit: b10.fileSizeLimit, allowed_mime_types: b10.allowedMimeTypes }, { headers: c10.headers }));
        }
        async updateBucket(a10, b10) {
          var c10 = this;
          return c10.handleOperation(async () => await eG(c10.fetch, `${c10.url}/bucket/${a10}`, { id: a10, name: a10, public: b10.public, file_size_limit: b10.fileSizeLimit, allowed_mime_types: b10.allowedMimeTypes }, { headers: c10.headers }));
        }
        async emptyBucket(a10) {
          var b10 = this;
          return b10.handleOperation(async () => await eF(b10.fetch, `${b10.url}/bucket/${a10}/empty`, {}, { headers: b10.headers }));
        }
        async deleteBucket(a10) {
          var b10 = this;
          return b10.handleOperation(async () => await eI(b10.fetch, `${b10.url}/bucket/${a10}`, {}, { headers: b10.headers }));
        }
        listBucketOptionsToQueryString(a10) {
          let b10 = {};
          return a10 && ("limit" in a10 && (b10.limit = String(a10.limit)), "offset" in a10 && (b10.offset = String(a10.offset)), a10.search && (b10.search = a10.search), a10.sortColumn && (b10.sortColumn = a10.sortColumn), a10.sortOrder && (b10.sortOrder = a10.sortOrder)), Object.keys(b10).length > 0 ? "?" + new URLSearchParams(b10).toString() : "";
        }
      }, eS = class extends eK {
        constructor(a10, b10 = {}, c10) {
          super(a10.replace(/\/$/, ""), et(et({}, eQ), b10), c10, "storage");
        }
        async createBucket(a10) {
          var b10 = this;
          return b10.handleOperation(async () => await eF(b10.fetch, `${b10.url}/bucket`, { name: a10 }, { headers: b10.headers }));
        }
        async listBuckets(a10) {
          var b10 = this;
          return b10.handleOperation(async () => {
            let c10 = new URLSearchParams();
            (null == a10 ? void 0 : a10.limit) !== void 0 && c10.set("limit", a10.limit.toString()), (null == a10 ? void 0 : a10.offset) !== void 0 && c10.set("offset", a10.offset.toString()), (null == a10 ? void 0 : a10.sortColumn) && c10.set("sortColumn", a10.sortColumn), (null == a10 ? void 0 : a10.sortOrder) && c10.set("sortOrder", a10.sortOrder), (null == a10 ? void 0 : a10.search) && c10.set("search", a10.search);
            let d10 = c10.toString(), e10 = d10 ? `${b10.url}/bucket?${d10}` : `${b10.url}/bucket`;
            return await eE(b10.fetch, e10, { headers: b10.headers });
          });
        }
        async deleteBucket(a10) {
          var b10 = this;
          return b10.handleOperation(async () => await eI(b10.fetch, `${b10.url}/bucket/${a10}`, {}, { headers: b10.headers }));
        }
        from(a10) {
          var b10 = this;
          if (!(!(!a10 || "string" != typeof a10 || 0 === a10.length || a10.length > 100 || a10.trim() !== a10 || a10.includes("/") || a10.includes("\\")) && /^[\w!.\*'() &$@=;:+,?-]+$/.test(a10))) throw new eu("Invalid bucket name: File, folder, and bucket names must follow AWS object key naming guidelines and should avoid the use of any other characters.");
          let c10 = new ep({ baseUrl: this.url, catalogName: a10, auth: { type: "custom", getHeaders: async () => b10.headers }, fetch: this.fetch }), d10 = this.shouldThrowOnError;
          return new Proxy(c10, { get(a11, b11) {
            let c11 = a11[b11];
            return "function" != typeof c11 ? c11 : async (...b12) => {
              try {
                return { data: await c11.apply(a11, b12), error: null };
              } catch (a12) {
                if (d10) throw a12;
                return { data: null, error: a12 };
              }
            };
          } });
        }
      }, eT = class extends eK {
        constructor(a10, b10 = {}, c10) {
          super(a10.replace(/\/$/, ""), et(et({}, eQ), {}, { "Content-Type": "application/json" }, b10), c10, "vectors");
        }
        async createIndex(a10) {
          var b10 = this;
          return b10.handleOperation(async () => await eJ.post(b10.fetch, `${b10.url}/CreateIndex`, a10, { headers: b10.headers }) || {});
        }
        async getIndex(a10, b10) {
          var c10 = this;
          return c10.handleOperation(async () => await eJ.post(c10.fetch, `${c10.url}/GetIndex`, { vectorBucketName: a10, indexName: b10 }, { headers: c10.headers }));
        }
        async listIndexes(a10) {
          var b10 = this;
          return b10.handleOperation(async () => await eJ.post(b10.fetch, `${b10.url}/ListIndexes`, a10, { headers: b10.headers }));
        }
        async deleteIndex(a10, b10) {
          var c10 = this;
          return c10.handleOperation(async () => await eJ.post(c10.fetch, `${c10.url}/DeleteIndex`, { vectorBucketName: a10, indexName: b10 }, { headers: c10.headers }) || {});
        }
      }, eU = class extends eK {
        constructor(a10, b10 = {}, c10) {
          super(a10.replace(/\/$/, ""), et(et({}, eQ), {}, { "Content-Type": "application/json" }, b10), c10, "vectors");
        }
        async putVectors(a10) {
          var b10 = this;
          if (a10.vectors.length < 1 || a10.vectors.length > 500) throw Error("Vector batch size must be between 1 and 500 items");
          return b10.handleOperation(async () => await eJ.post(b10.fetch, `${b10.url}/PutVectors`, a10, { headers: b10.headers }) || {});
        }
        async getVectors(a10) {
          var b10 = this;
          return b10.handleOperation(async () => await eJ.post(b10.fetch, `${b10.url}/GetVectors`, a10, { headers: b10.headers }));
        }
        async listVectors(a10) {
          var b10 = this;
          if (void 0 !== a10.segmentCount) {
            if (a10.segmentCount < 1 || a10.segmentCount > 16) throw Error("segmentCount must be between 1 and 16");
            if (void 0 !== a10.segmentIndex && (a10.segmentIndex < 0 || a10.segmentIndex >= a10.segmentCount)) throw Error(`segmentIndex must be between 0 and ${a10.segmentCount - 1}`);
          }
          return b10.handleOperation(async () => await eJ.post(b10.fetch, `${b10.url}/ListVectors`, a10, { headers: b10.headers }));
        }
        async queryVectors(a10) {
          var b10 = this;
          return b10.handleOperation(async () => await eJ.post(b10.fetch, `${b10.url}/QueryVectors`, a10, { headers: b10.headers }));
        }
        async deleteVectors(a10) {
          var b10 = this;
          if (a10.keys.length < 1 || a10.keys.length > 500) throw Error("Keys batch size must be between 1 and 500 items");
          return b10.handleOperation(async () => await eJ.post(b10.fetch, `${b10.url}/DeleteVectors`, a10, { headers: b10.headers }) || {});
        }
      }, eV = class extends eK {
        constructor(a10, b10 = {}, c10) {
          super(a10.replace(/\/$/, ""), et(et({}, eQ), {}, { "Content-Type": "application/json" }, b10), c10, "vectors");
        }
        async createBucket(a10) {
          var b10 = this;
          return b10.handleOperation(async () => await eJ.post(b10.fetch, `${b10.url}/CreateVectorBucket`, { vectorBucketName: a10 }, { headers: b10.headers }) || {});
        }
        async getBucket(a10) {
          var b10 = this;
          return b10.handleOperation(async () => await eJ.post(b10.fetch, `${b10.url}/GetVectorBucket`, { vectorBucketName: a10 }, { headers: b10.headers }));
        }
        async listBuckets(a10 = {}) {
          var b10 = this;
          return b10.handleOperation(async () => await eJ.post(b10.fetch, `${b10.url}/ListVectorBuckets`, a10, { headers: b10.headers }));
        }
        async deleteBucket(a10) {
          var b10 = this;
          return b10.handleOperation(async () => await eJ.post(b10.fetch, `${b10.url}/DeleteVectorBucket`, { vectorBucketName: a10 }, { headers: b10.headers }) || {});
        }
      }, eW = class extends eV {
        constructor(a10, b10 = {}) {
          super(a10, b10.headers || {}, b10.fetch);
        }
        from(a10) {
          return new eX(this.url, this.headers, a10, this.fetch);
        }
        async createBucket(a10) {
          return super.createBucket.call(this, a10);
        }
        async getBucket(a10) {
          return super.getBucket.call(this, a10);
        }
        async listBuckets(a10 = {}) {
          return super.listBuckets.call(this, a10);
        }
        async deleteBucket(a10) {
          return super.deleteBucket.call(this, a10);
        }
      }, eX = class extends eT {
        constructor(a10, b10, c10, d10) {
          super(a10, b10, d10), this.vectorBucketName = c10;
        }
        async createIndex(a10) {
          return super.createIndex.call(this, et(et({}, a10), {}, { vectorBucketName: this.vectorBucketName }));
        }
        async listIndexes(a10 = {}) {
          return super.listIndexes.call(this, et(et({}, a10), {}, { vectorBucketName: this.vectorBucketName }));
        }
        async getIndex(a10) {
          return super.getIndex.call(this, this.vectorBucketName, a10);
        }
        async deleteIndex(a10) {
          return super.deleteIndex.call(this, this.vectorBucketName, a10);
        }
        index(a10) {
          return new eY(this.url, this.headers, this.vectorBucketName, a10, this.fetch);
        }
      }, eY = class extends eU {
        constructor(a10, b10, c10, d10, e10) {
          super(a10, b10, e10), this.vectorBucketName = c10, this.indexName = d10;
        }
        async putVectors(a10) {
          return super.putVectors.call(this, et(et({}, a10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
        async getVectors(a10) {
          return super.getVectors.call(this, et(et({}, a10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
        async listVectors(a10 = {}) {
          return super.listVectors.call(this, et(et({}, a10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
        async queryVectors(a10) {
          return super.queryVectors.call(this, et(et({}, a10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
        async deleteVectors(a10) {
          return super.deleteVectors.call(this, et(et({}, a10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
      }, eZ = class extends eR {
        constructor(a10, b10 = {}, c10, d10) {
          super(a10, b10, c10, d10);
        }
        from(a10) {
          return new eP(this.url, this.headers, a10, this.fetch);
        }
        get vectors() {
          return new eW(this.url + "/vector", { headers: this.headers, fetch: this.fetch });
        }
        get analytics() {
          return new eS(this.url + "/iceberg", this.headers, this.fetch);
        }
      };
      let e$ = "2.106.1", e_ = { "X-Client-Info": `gotrue-js/${e$}` }, e0 = "X-Supabase-Api-Version", e1 = { "2024-01-01": { timestamp: Date.parse("2024-01-01T00:00:00.0Z"), name: "2024-01-01" } }, e2 = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;
      class e3 extends Error {
        constructor(a10, b10, c10) {
          super(a10), this.__isAuthError = true, this.name = "AuthError", this.status = b10, this.code = c10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, code: this.code };
        }
      }
      function e4(a10) {
        return "object" == typeof a10 && null !== a10 && "__isAuthError" in a10;
      }
      class e5 extends e3 {
        constructor(a10, b10, c10) {
          super(a10, b10, c10), this.name = "AuthApiError", this.status = b10, this.code = c10;
        }
      }
      class e6 extends e3 {
        constructor(a10, b10) {
          super(a10), this.name = "AuthUnknownError", this.originalError = b10;
        }
      }
      class e7 extends e3 {
        constructor(a10, b10, c10, d10) {
          super(a10, c10, d10), this.name = b10, this.status = c10;
        }
      }
      class e8 extends e7 {
        constructor() {
          super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
        }
      }
      function e9(a10) {
        return e4(a10) && "AuthSessionMissingError" === a10.name;
      }
      class fa extends e7 {
        constructor() {
          super("Auth session or user missing", "AuthInvalidTokenResponseError", 500, void 0);
        }
      }
      class fb extends e7 {
        constructor(a10) {
          super(a10, "AuthInvalidCredentialsError", 400, void 0);
        }
      }
      class fc extends e7 {
        constructor(a10, b10 = null) {
          super(a10, "AuthImplicitGrantRedirectError", 500, void 0), this.details = null, this.details = b10;
        }
        toJSON() {
          return Object.assign(Object.assign({}, super.toJSON()), { details: this.details });
        }
      }
      class fd extends e7 {
        constructor(a10, b10 = null) {
          super(a10, "AuthPKCEGrantCodeExchangeError", 500, void 0), this.details = null, this.details = b10;
        }
        toJSON() {
          return Object.assign(Object.assign({}, super.toJSON()), { details: this.details });
        }
      }
      class fe extends e7 {
        constructor() {
          super("PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.", "AuthPKCECodeVerifierMissingError", 400, "pkce_code_verifier_not_found");
        }
      }
      class ff extends e7 {
        constructor(a10, b10) {
          super(a10, "AuthRetryableFetchError", b10, void 0);
        }
      }
      function fg(a10) {
        return e4(a10) && "AuthRetryableFetchError" === a10.name;
      }
      class fh extends e7 {
        constructor(a10, b10, c10) {
          super(a10, "AuthWeakPasswordError", b10, "weak_password"), this.reasons = c10;
        }
        toJSON() {
          return Object.assign(Object.assign({}, super.toJSON()), { reasons: this.reasons });
        }
      }
      class fi extends e7 {
        constructor(a10) {
          super(a10, "AuthInvalidJwtError", 400, "invalid_jwt");
        }
      }
      let fj = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""), fk = " 	\n\r=".split(""), fl = (() => {
        let a10 = Array(128);
        for (let b10 = 0; b10 < a10.length; b10 += 1) a10[b10] = -1;
        for (let b10 = 0; b10 < fk.length; b10 += 1) a10[fk[b10].charCodeAt(0)] = -2;
        for (let b10 = 0; b10 < fj.length; b10 += 1) a10[fj[b10].charCodeAt(0)] = b10;
        return a10;
      })();
      function fm(a10, b10, c10) {
        if (null !== a10) for (b10.queue = b10.queue << 8 | a10, b10.queuedBits += 8; b10.queuedBits >= 6; ) c10(fj[b10.queue >> b10.queuedBits - 6 & 63]), b10.queuedBits -= 6;
        else if (b10.queuedBits > 0) for (b10.queue = b10.queue << 6 - b10.queuedBits, b10.queuedBits = 6; b10.queuedBits >= 6; ) c10(fj[b10.queue >> b10.queuedBits - 6 & 63]), b10.queuedBits -= 6;
      }
      function fn(a10, b10, c10) {
        let d10 = fl[a10];
        if (d10 > -1) for (b10.queue = b10.queue << 6 | d10, b10.queuedBits += 6; b10.queuedBits >= 8; ) c10(b10.queue >> b10.queuedBits - 8 & 255), b10.queuedBits -= 8;
        else if (-2 === d10) return;
        else throw Error(`Invalid Base64-URL character "${String.fromCharCode(a10)}"`);
      }
      function fo(a10) {
        let b10 = [], c10 = (a11) => {
          b10.push(String.fromCodePoint(a11));
        }, d10 = { utf8seq: 0, codepoint: 0 }, e10 = { queue: 0, queuedBits: 0 }, f10 = (a11) => {
          !(function(a12, b11, c11) {
            if (0 === b11.utf8seq) {
              if (a12 <= 127) return c11(a12);
              for (let c12 = 1; c12 < 6; c12 += 1) if ((a12 >> 7 - c12 & 1) == 0) {
                b11.utf8seq = c12;
                break;
              }
              if (2 === b11.utf8seq) b11.codepoint = 31 & a12;
              else if (3 === b11.utf8seq) b11.codepoint = 15 & a12;
              else if (4 === b11.utf8seq) b11.codepoint = 7 & a12;
              else throw Error("Invalid UTF-8 sequence");
              b11.utf8seq -= 1;
            } else if (b11.utf8seq > 0) {
              if (a12 <= 127) throw Error("Invalid UTF-8 sequence");
              b11.codepoint = b11.codepoint << 6 | 63 & a12, b11.utf8seq -= 1, 0 === b11.utf8seq && c11(b11.codepoint);
            }
          })(a11, d10, c10);
        };
        for (let b11 = 0; b11 < a10.length; b11 += 1) fn(a10.charCodeAt(b11), e10, f10);
        return b10.join("");
      }
      function fp(a10) {
        let b10 = [], c10 = { queue: 0, queuedBits: 0 }, d10 = (a11) => {
          b10.push(a11);
        };
        for (let b11 = 0; b11 < a10.length; b11 += 1) fn(a10.charCodeAt(b11), c10, d10);
        return new Uint8Array(b10);
      }
      function fq(a10) {
        let b10 = [], c10 = { queue: 0, queuedBits: 0 }, d10 = (a11) => {
          b10.push(a11);
        };
        return a10.forEach((a11) => fm(a11, c10, d10)), fm(null, c10, d10), b10.join("");
      }
      let fr = () => "u" > typeof window && "u" > typeof document, fs = { tested: false, writable: false }, ft = () => {
        if (!fr()) return false;
        try {
          if ("object" != typeof globalThis.localStorage) return false;
        } catch (a11) {
          return false;
        }
        if (fs.tested) return fs.writable;
        let a10 = `lswt-${Math.random()}${Math.random()}`;
        try {
          globalThis.localStorage.setItem(a10, a10), globalThis.localStorage.removeItem(a10), fs.tested = true, fs.writable = true;
        } catch (a11) {
          fs.tested = true, fs.writable = false;
        }
        return fs.writable;
      }, fu = (a10) => a10 ? (...b10) => a10(...b10) : (...a11) => fetch(...a11), fv = async (a10, b10, c10) => {
        await a10.setItem(b10, JSON.stringify(c10));
      }, fw = async (a10, b10) => {
        let c10 = await a10.getItem(b10);
        if (!c10) return null;
        try {
          return JSON.parse(c10);
        } catch (a11) {
          return null;
        }
      }, fx = async (a10, b10) => {
        await a10.removeItem(b10);
      };
      class fy {
        constructor() {
          this.promise = new fy.promiseConstructor((a10, b10) => {
            this.resolve = a10, this.reject = b10;
          });
        }
      }
      function fz(a10) {
        let b10 = a10.split(".");
        if (3 !== b10.length) throw new fi("Invalid JWT structure");
        for (let a11 = 0; a11 < b10.length; a11++) if (!e2.test(b10[a11])) throw new fi("JWT not in base64url format");
        return { header: JSON.parse(fo(b10[0])), payload: JSON.parse(fo(b10[1])), signature: fp(b10[2]), raw: { header: b10[0], payload: b10[1] } };
      }
      async function fA(a10) {
        return await new Promise((b10) => {
          setTimeout(() => b10(null), a10);
        });
      }
      function fB(a10) {
        return ("0" + a10.toString(16)).substr(-2);
      }
      async function fC(a10) {
        let b10 = new TextEncoder().encode(a10);
        return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", b10))).map((a11) => String.fromCharCode(a11)).join("");
      }
      async function fD(a10) {
        return "u" > typeof crypto && void 0 !== crypto.subtle && "u" > typeof TextEncoder ? btoa(await fC(a10)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : (console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."), a10);
      }
      async function fE(a10, b10, c10 = false) {
        let d10 = (function() {
          let a11 = new Uint32Array(56);
          if ("u" < typeof crypto) {
            let a12 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~", b11 = a12.length, c11 = "";
            for (let d11 = 0; d11 < 56; d11++) c11 += a12.charAt(Math.floor(Math.random() * b11));
            return c11;
          }
          return crypto.getRandomValues(a11), Array.from(a11, fB).join("");
        })(), e10 = d10;
        c10 && (e10 += "/recovery"), await fv(a10, `${b10}-code-verifier`, e10);
        let f10 = await fD(d10), g2 = d10 === f10 ? "plain" : "s256";
        return [f10, g2];
      }
      fy.promiseConstructor = Promise;
      let fF = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i, fG = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
      function fH(a10) {
        if (!fG.test(a10)) throw Error("@supabase/auth-js: Expected parameter to be UUID but is not");
      }
      function fI(a10) {
        if (!a10.passkey) throw Error("@supabase/auth-js: the passkey API is experimental and disabled by default. Enable it by passing `auth: { experimental: { passkey: true } }` to createClient (or to the GoTrueClient constructor).");
      }
      function fJ() {
        return new Proxy({}, { get: (a10, b10) => {
          if ("__isUserNotAvailableProxy" === b10) return true;
          if ("symbol" == typeof b10) {
            let a11 = b10.toString();
            if ("Symbol(Symbol.toPrimitive)" === a11 || "Symbol(Symbol.toStringTag)" === a11 || "Symbol(util.inspect.custom)" === a11) return;
          }
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${b10}" property of the session object is not supported. Please use getUser() instead.`);
        }, set: (a10, b10) => {
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${b10}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
        }, deleteProperty: (a10, b10) => {
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${b10}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
        } });
      }
      function fK(a10) {
        return JSON.parse(JSON.stringify(a10));
      }
      let fL = (a10) => {
        if ("object" == typeof a10 && null !== a10) {
          if ("string" == typeof a10.msg) return a10.msg;
          if ("string" == typeof a10.message) return a10.message;
          if ("string" == typeof a10.error_description) return a10.error_description;
          if ("string" == typeof a10.error) return a10.error;
        }
        return JSON.stringify(a10);
      }, fM = [502, 503, 504, 520, 521, 522, 523, 524, 530];
      async function fN(a10) {
        var b10;
        let c10, d10;
        if (!("object" == typeof a10 && null !== a10 && "status" in a10 && "ok" in a10 && "json" in a10 && "function" == typeof a10.json)) throw new ff(fL(a10), 0);
        if (fM.includes(a10.status)) throw new ff(fL(a10), a10.status);
        try {
          c10 = await a10.json();
        } catch (a11) {
          throw new e6(fL(a11), a11);
        }
        let e10 = (function(a11) {
          let b11 = a11.headers.get(e0);
          if (!b11 || !b11.match(fF)) return null;
          try {
            return /* @__PURE__ */ new Date(`${b11}T00:00:00.0Z`);
          } catch (a12) {
            return null;
          }
        })(a10);
        if (e10 && e10.getTime() >= e1["2024-01-01"].timestamp && "object" == typeof c10 && c10 && "string" == typeof c10.code ? d10 = c10.code : "object" == typeof c10 && c10 && "string" == typeof c10.error_code && (d10 = c10.error_code), d10) {
          if ("weak_password" === d10) throw new fh(fL(c10), a10.status, (null == (b10 = c10.weak_password) ? void 0 : b10.reasons) || []);
          else if ("session_not_found" === d10) throw new e8();
        } else if ("object" == typeof c10 && c10 && "object" == typeof c10.weak_password && c10.weak_password && Array.isArray(c10.weak_password.reasons) && c10.weak_password.reasons.length && c10.weak_password.reasons.reduce((a11, b11) => a11 && "string" == typeof b11, true)) throw new fh(fL(c10), a10.status, c10.weak_password.reasons);
        throw new e5(fL(c10), a10.status || 500, d10);
      }
      async function fO(a10, b10, c10, d10) {
        var e10;
        let f10 = Object.assign({}, null == d10 ? void 0 : d10.headers);
        f10[e0] || (f10[e0] = e1["2024-01-01"].name), (null == d10 ? void 0 : d10.jwt) && (f10.Authorization = `Bearer ${d10.jwt}`);
        let g2 = null != (e10 = null == d10 ? void 0 : d10.query) ? e10 : {};
        (null == d10 ? void 0 : d10.redirectTo) && (g2.redirect_to = d10.redirectTo);
        let h2 = Object.keys(g2).length ? "?" + new URLSearchParams(g2).toString() : "", i2 = await fP(a10, b10, c10 + h2, { headers: f10, noResolveJson: null == d10 ? void 0 : d10.noResolveJson }, {}, null == d10 ? void 0 : d10.body);
        return (null == d10 ? void 0 : d10.xform) ? null == d10 ? void 0 : d10.xform(i2) : { data: Object.assign({}, i2), error: null };
      }
      async function fP(a10, b10, c10, d10, e10, f10) {
        let g2, h2, i2 = (h2 = { method: b10, headers: (null == d10 ? void 0 : d10.headers) || {} }, "GET" === b10 ? h2 : (h2.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, null == d10 ? void 0 : d10.headers), h2.body = JSON.stringify(f10), Object.assign(Object.assign({}, h2), e10)));
        try {
          g2 = await a10(c10, Object.assign({}, i2));
        } catch (a11) {
          throw console.error(a11), new ff(fL(a11), 0);
        }
        if (g2.ok || await fN(g2), null == d10 ? void 0 : d10.noResolveJson) return g2;
        try {
          return await g2.json();
        } catch (a11) {
          await fN(a11);
        }
      }
      function fQ(a10) {
        var b10, c10, d10;
        let e10 = null;
        (d10 = a10).access_token && d10.refresh_token && d10.expires_in && (e10 = Object.assign({}, a10), a10.expires_at || (e10.expires_at = (c10 = a10.expires_in, Math.round(Date.now() / 1e3) + c10)));
        return { data: { session: e10, user: null != (b10 = a10.user) ? b10 : null }, error: null };
      }
      function fR(a10) {
        let b10 = fQ(a10);
        return !b10.error && a10.weak_password && "object" == typeof a10.weak_password && Array.isArray(a10.weak_password.reasons) && a10.weak_password.reasons.length && a10.weak_password.message && "string" == typeof a10.weak_password.message && a10.weak_password.reasons.reduce((a11, b11) => a11 && "string" == typeof b11, true) && (b10.data.weak_password = a10.weak_password), b10;
      }
      function fS(a10) {
        var b10;
        return { data: { user: null != (b10 = a10.user) ? b10 : a10 }, error: null };
      }
      function fT(a10) {
        return { data: a10, error: null };
      }
      function fU(a10) {
        let { action_link: b10, email_otp: c10, hashed_token: d10, redirect_to: e10, verification_type: f10 } = a10;
        return { data: { properties: { action_link: b10, email_otp: c10, hashed_token: d10, redirect_to: e10, verification_type: f10 }, user: Object.assign({}, de(a10, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"])) }, error: null };
      }
      function fV(a10) {
        return a10;
      }
      let fW = ["global", "local", "others"];
      class fX {
        _encodePathSegment(a10) {
          if ("." === a10 || ".." === a10) throw new e3("Invalid path segment");
          return encodeURIComponent(a10);
        }
        constructor({ url: a10 = "", headers: b10 = {}, fetch: c10, experimental: d10 }) {
          this.url = a10, this.headers = b10, this.fetch = fu(c10), this.experimental = null != d10 ? d10 : {}, this.mfa = { listFactors: this._listFactors.bind(this), deleteFactor: this._deleteFactor.bind(this) }, this.oauth = { listClients: this._listOAuthClients.bind(this), createClient: this._createOAuthClient.bind(this), getClient: this._getOAuthClient.bind(this), updateClient: this._updateOAuthClient.bind(this), deleteClient: this._deleteOAuthClient.bind(this), regenerateClientSecret: this._regenerateOAuthClientSecret.bind(this) }, this.customProviders = { listProviders: this._listCustomProviders.bind(this), createProvider: this._createCustomProvider.bind(this), getProvider: this._getCustomProvider.bind(this), updateProvider: this._updateCustomProvider.bind(this), deleteProvider: this._deleteCustomProvider.bind(this) }, this.passkey = { listPasskeys: this._adminListPasskeys.bind(this), deletePasskey: this._adminDeletePasskey.bind(this) };
        }
        async signOut(a10, b10 = fW[0]) {
          if (0 > fW.indexOf(b10)) throw Error(`@supabase/auth-js: Parameter scope must be one of ${fW.join(", ")}`);
          try {
            return await fO(this.fetch, "POST", `${this.url}/logout?scope=${b10}`, { headers: this.headers, jwt: a10, noResolveJson: true }), { data: null, error: null };
          } catch (a11) {
            if (e4(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async inviteUserByEmail(a10, b10 = {}) {
          try {
            return await fO(this.fetch, "POST", `${this.url}/invite`, { body: { email: a10, data: b10.data }, headers: this.headers, redirectTo: b10.redirectTo, xform: fS });
          } catch (a11) {
            if (e4(a11)) return { data: { user: null }, error: a11 };
            throw a11;
          }
        }
        async generateLink(a10) {
          try {
            let { options: b10 } = a10, c10 = de(a10, ["options"]), d10 = Object.assign(Object.assign({}, c10), b10);
            return "newEmail" in c10 && (d10.new_email = null == c10 ? void 0 : c10.newEmail, delete d10.newEmail), await fO(this.fetch, "POST", `${this.url}/admin/generate_link`, { body: d10, headers: this.headers, xform: fU, redirectTo: null == b10 ? void 0 : b10.redirectTo });
          } catch (a11) {
            if (e4(a11)) return { data: { properties: null, user: null }, error: a11 };
            throw a11;
          }
        }
        async createUser(a10) {
          try {
            return await fO(this.fetch, "POST", `${this.url}/admin/users`, { body: a10, headers: this.headers, xform: fS });
          } catch (a11) {
            if (e4(a11)) return { data: { user: null }, error: a11 };
            throw a11;
          }
        }
        async listUsers(a10) {
          var b10, c10, d10, e10, f10, g2, h2;
          try {
            let i2 = { nextPage: null, lastPage: 0, total: 0 }, j2 = await fO(this.fetch, "GET", `${this.url}/admin/users`, { headers: this.headers, noResolveJson: true, query: { page: null != (c10 = null == (b10 = null == a10 ? void 0 : a10.page) ? void 0 : b10.toString()) ? c10 : "", per_page: null != (e10 = null == (d10 = null == a10 ? void 0 : a10.perPage) ? void 0 : d10.toString()) ? e10 : "" }, xform: fV });
            if (j2.error) throw j2.error;
            let k2 = await j2.json(), l2 = null != (f10 = j2.headers.get("x-total-count")) ? f10 : 0, m2 = null != (h2 = null == (g2 = j2.headers.get("link")) ? void 0 : g2.split(",")) ? h2 : [];
            return m2.length > 0 && (m2.forEach((a11) => {
              let b11 = parseInt(a11.split(";")[0].split("=")[1].substring(0, 1)), c11 = JSON.parse(a11.split(";")[1].split("=")[1]);
              i2[`${c11}Page`] = b11;
            }), i2.total = parseInt(l2)), { data: Object.assign(Object.assign({}, k2), i2), error: null };
          } catch (a11) {
            if (e4(a11)) return { data: { users: [] }, error: a11 };
            throw a11;
          }
        }
        async getUserById(a10) {
          fH(a10);
          try {
            return await fO(this.fetch, "GET", `${this.url}/admin/users/${a10}`, { headers: this.headers, xform: fS });
          } catch (a11) {
            if (e4(a11)) return { data: { user: null }, error: a11 };
            throw a11;
          }
        }
        async updateUserById(a10, b10) {
          fH(a10);
          try {
            return await fO(this.fetch, "PUT", `${this.url}/admin/users/${a10}`, { body: b10, headers: this.headers, xform: fS });
          } catch (a11) {
            if (e4(a11)) return { data: { user: null }, error: a11 };
            throw a11;
          }
        }
        async deleteUser(a10, b10 = false) {
          fH(a10);
          try {
            return await fO(this.fetch, "DELETE", `${this.url}/admin/users/${a10}`, { headers: this.headers, body: { should_soft_delete: b10 }, xform: fS });
          } catch (a11) {
            if (e4(a11)) return { data: { user: null }, error: a11 };
            throw a11;
          }
        }
        async _listFactors(a10) {
          fH(a10.userId);
          try {
            let { data: b10, error: c10 } = await fO(this.fetch, "GET", `${this.url}/admin/users/${a10.userId}/factors`, { headers: this.headers, xform: (a11) => ({ data: { factors: a11 }, error: null }) });
            return { data: b10, error: c10 };
          } catch (a11) {
            if (e4(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async _deleteFactor(a10) {
          fH(a10.userId), fH(a10.id);
          try {
            return { data: await fO(this.fetch, "DELETE", `${this.url}/admin/users/${a10.userId}/factors/${a10.id}`, { headers: this.headers }), error: null };
          } catch (a11) {
            if (e4(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async _listOAuthClients(a10) {
          var b10, c10, d10, e10, f10, g2, h2;
          try {
            let i2 = { nextPage: null, lastPage: 0, total: 0 }, j2 = await fO(this.fetch, "GET", `${this.url}/admin/oauth/clients`, { headers: this.headers, noResolveJson: true, query: { page: null != (c10 = null == (b10 = null == a10 ? void 0 : a10.page) ? void 0 : b10.toString()) ? c10 : "", per_page: null != (e10 = null == (d10 = null == a10 ? void 0 : a10.perPage) ? void 0 : d10.toString()) ? e10 : "" }, xform: fV });
            if (j2.error) throw j2.error;
            let k2 = await j2.json(), l2 = null != (f10 = j2.headers.get("x-total-count")) ? f10 : 0, m2 = null != (h2 = null == (g2 = j2.headers.get("link")) ? void 0 : g2.split(",")) ? h2 : [];
            return m2.length > 0 && (m2.forEach((a11) => {
              let b11 = parseInt(a11.split(";")[0].split("=")[1].substring(0, 1)), c11 = JSON.parse(a11.split(";")[1].split("=")[1]);
              i2[`${c11}Page`] = b11;
            }), i2.total = parseInt(l2)), { data: Object.assign(Object.assign({}, k2), i2), error: null };
          } catch (a11) {
            if (e4(a11)) return { data: { clients: [] }, error: a11 };
            throw a11;
          }
        }
        async _createOAuthClient(a10) {
          try {
            return await fO(this.fetch, "POST", `${this.url}/admin/oauth/clients`, { body: a10, headers: this.headers, xform: (a11) => ({ data: a11, error: null }) });
          } catch (a11) {
            if (e4(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async _getOAuthClient(a10) {
          try {
            let b10 = this._encodePathSegment(a10);
            return await fO(this.fetch, "GET", `${this.url}/admin/oauth/clients/${b10}`, { headers: this.headers, xform: (a11) => ({ data: a11, error: null }) });
          } catch (a11) {
            if (e4(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async _updateOAuthClient(a10, b10) {
          try {
            let c10 = this._encodePathSegment(a10);
            return await fO(this.fetch, "PUT", `${this.url}/admin/oauth/clients/${c10}`, { body: b10, headers: this.headers, xform: (a11) => ({ data: a11, error: null }) });
          } catch (a11) {
            if (e4(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async _deleteOAuthClient(a10) {
          try {
            let b10 = this._encodePathSegment(a10);
            return await fO(this.fetch, "DELETE", `${this.url}/admin/oauth/clients/${b10}`, { headers: this.headers, noResolveJson: true }), { data: null, error: null };
          } catch (a11) {
            if (e4(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async _regenerateOAuthClientSecret(a10) {
          try {
            let b10 = this._encodePathSegment(a10);
            return await fO(this.fetch, "POST", `${this.url}/admin/oauth/clients/${b10}/regenerate_secret`, { headers: this.headers, xform: (a11) => ({ data: a11, error: null }) });
          } catch (a11) {
            if (e4(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async _listCustomProviders(a10) {
          try {
            let b10 = {};
            return (null == a10 ? void 0 : a10.type) && (b10.type = a10.type), await fO(this.fetch, "GET", `${this.url}/admin/custom-providers`, { headers: this.headers, query: b10, xform: (a11) => {
              var b11;
              return { data: { providers: null != (b11 = null == a11 ? void 0 : a11.providers) ? b11 : [] }, error: null };
            } });
          } catch (a11) {
            if (e4(a11)) return { data: { providers: [] }, error: a11 };
            throw a11;
          }
        }
        async _createCustomProvider(a10) {
          try {
            return await fO(this.fetch, "POST", `${this.url}/admin/custom-providers`, { body: a10, headers: this.headers, xform: (a11) => ({ data: a11, error: null }) });
          } catch (a11) {
            if (e4(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async _getCustomProvider(a10) {
          try {
            let b10 = this._encodePathSegment(a10);
            return await fO(this.fetch, "GET", `${this.url}/admin/custom-providers/${b10}`, { headers: this.headers, xform: (a11) => ({ data: a11, error: null }) });
          } catch (a11) {
            if (e4(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async _updateCustomProvider(a10, b10) {
          try {
            let c10 = this._encodePathSegment(a10);
            return await fO(this.fetch, "PUT", `${this.url}/admin/custom-providers/${c10}`, { body: b10, headers: this.headers, xform: (a11) => ({ data: a11, error: null }) });
          } catch (a11) {
            if (e4(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async _deleteCustomProvider(a10) {
          try {
            let b10 = this._encodePathSegment(a10);
            return await fO(this.fetch, "DELETE", `${this.url}/admin/custom-providers/${b10}`, { headers: this.headers, noResolveJson: true }), { data: null, error: null };
          } catch (a11) {
            if (e4(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async _adminListPasskeys(a10) {
          fI(this.experimental), fH(a10.userId);
          try {
            return await fO(this.fetch, "GET", `${this.url}/admin/users/${a10.userId}/passkeys`, { headers: this.headers, xform: (a11) => ({ data: a11, error: null }) });
          } catch (a11) {
            if (e4(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async _adminDeletePasskey(a10) {
          fI(this.experimental), fH(a10.userId), fH(a10.passkeyId);
          try {
            return await fO(this.fetch, "DELETE", `${this.url}/admin/users/${a10.userId}/passkeys/${a10.passkeyId}`, { headers: this.headers, noResolveJson: true }), { data: null, error: null };
          } catch (a11) {
            if (e4(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
      }
      function fY(a10 = {}) {
        return { getItem: (b10) => a10[b10] || null, setItem: (b10, c10) => {
          a10[b10] = c10;
        }, removeItem: (b10) => {
          delete a10[b10];
        } };
      }
      let fZ = { debug: !!(globalThis && ft() && globalThis.localStorage && "true" === globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug")) };
      class f$ extends Error {
        constructor(a10) {
          super(a10), this.isAcquireTimeout = true;
        }
      }
      class f_ extends f$ {
      }
      async function f0(a10, b10, c10) {
        let d10;
        fZ.debug && console.log("@supabase/gotrue-js: navigatorLock: acquire lock", a10, b10);
        let e10 = new globalThis.AbortController();
        b10 > 0 && (d10 = setTimeout(() => {
          e10.abort(), fZ.debug && console.log("@supabase/gotrue-js: navigatorLock acquire timed out", a10);
        }, b10)), await Promise.resolve();
        try {
          return await globalThis.navigator.locks.request(a10, 0 === b10 ? { mode: "exclusive", ifAvailable: true } : { mode: "exclusive", signal: e10.signal }, async (e11) => {
            if (e11) {
              clearTimeout(d10), fZ.debug && console.log("@supabase/gotrue-js: navigatorLock: acquired", a10, e11.name);
              try {
                return await c10();
              } finally {
                fZ.debug && console.log("@supabase/gotrue-js: navigatorLock: released", a10, e11.name);
              }
            }
            if (0 === b10) throw fZ.debug && console.log("@supabase/gotrue-js: navigatorLock: not immediately available", a10), new f_(`Acquiring an exclusive Navigator LockManager lock "${a10}" immediately failed`);
            if (fZ.debug) try {
              let a11 = await globalThis.navigator.locks.query();
              console.log("@supabase/gotrue-js: Navigator LockManager state", JSON.stringify(a11, null, "  "));
            } catch (a11) {
              console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state", a11);
            }
            return console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request"), clearTimeout(d10), await c10();
          });
        } catch (f10) {
          if (b10 > 0 && clearTimeout(d10), null !== f10 && "object" == typeof f10 && "name" in f10 && "AbortError" === f10.name && b10 > 0) if (e10.signal.aborted) return fZ.debug && console.log("@supabase/gotrue-js: navigatorLock: acquire timeout, recovering by stealing lock", a10), console.warn(`@supabase/gotrue-js: Lock "${a10}" was not released within ${b10}ms. This may indicate an orphaned lock from a component unmount (e.g., React Strict Mode). Forcefully acquiring the lock to recover.`), await Promise.resolve().then(() => globalThis.navigator.locks.request(a10, { mode: "exclusive", steal: true }, async (b11) => {
            if (!b11) return console.warn("@supabase/gotrue-js: Navigator LockManager returned null lock even with steal: true"), await c10();
            fZ.debug && console.log("@supabase/gotrue-js: navigatorLock: recovered (stolen)", a10, b11.name);
            try {
              return await c10();
            } finally {
              fZ.debug && console.log("@supabase/gotrue-js: navigatorLock: released (stolen)", a10, b11.name);
            }
          }));
          else throw fZ.debug && console.log("@supabase/gotrue-js: navigatorLock: lock was stolen by another request", a10), new f_(`Lock "${a10}" was released because another request stole it`);
          throw f10;
        }
      }
      function f1(a10) {
        if (!/^0x[a-fA-F0-9]{40}$/.test(a10)) throw Error(`@supabase/auth-js: Address "${a10}" is invalid.`);
        return a10.toLowerCase();
      }
      class f2 extends Error {
        constructor({ message: a10, code: b10, cause: c10, name: d10 }) {
          var e10;
          super(a10, { cause: c10 }), this.__isWebAuthnError = true, this.name = null != (e10 = null != d10 ? d10 : c10 instanceof Error ? c10.name : void 0) ? e10 : "Unknown Error", this.code = b10;
        }
        toJSON() {
          return { name: this.name, message: this.message, code: this.code };
        }
      }
      class f3 extends f2 {
        constructor(a10, b10) {
          super({ code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: b10, message: a10 }), this.name = "WebAuthnUnknownError", this.originalError = b10;
        }
      }
      class f4 {
        createNewAbortSignal() {
          if (this.controller) {
            let a11 = Error("Cancelling existing WebAuthn API call for new one");
            a11.name = "AbortError", this.controller.abort(a11);
          }
          let a10 = new AbortController();
          return this.controller = a10, a10.signal;
        }
        cancelCeremony() {
          if (this.controller) {
            let a10 = Error("Manually cancelling existing WebAuthn API call");
            a10.name = "AbortError", this.controller.abort(a10), this.controller = void 0;
          }
        }
      }
      let f5 = new f4();
      function f6(a10) {
        if (!a10) throw Error("Credential creation options are required");
        if ("u" > typeof PublicKeyCredential && "parseCreationOptionsFromJSON" in PublicKeyCredential && "function" == typeof PublicKeyCredential.parseCreationOptionsFromJSON) return PublicKeyCredential.parseCreationOptionsFromJSON(a10);
        let { challenge: b10, user: c10, excludeCredentials: d10 } = a10, e10 = de(a10, ["challenge", "user", "excludeCredentials"]), f10 = fp(b10).buffer, g2 = Object.assign(Object.assign({}, c10), { id: fp(c10.id).buffer }), h2 = Object.assign(Object.assign({}, e10), { challenge: f10, user: g2 });
        if (d10 && d10.length > 0) {
          h2.excludeCredentials = Array(d10.length);
          for (let a11 = 0; a11 < d10.length; a11++) {
            let b11 = d10[a11];
            h2.excludeCredentials[a11] = Object.assign(Object.assign({}, b11), { id: fp(b11.id).buffer, type: b11.type || "public-key", transports: b11.transports });
          }
        }
        return h2;
      }
      function f7(a10) {
        if (!a10) throw Error("Credential request options are required");
        if ("u" > typeof PublicKeyCredential && "parseRequestOptionsFromJSON" in PublicKeyCredential && "function" == typeof PublicKeyCredential.parseRequestOptionsFromJSON) return PublicKeyCredential.parseRequestOptionsFromJSON(a10);
        let { challenge: b10, allowCredentials: c10 } = a10, d10 = de(a10, ["challenge", "allowCredentials"]), e10 = fp(b10).buffer, f10 = Object.assign(Object.assign({}, d10), { challenge: e10 });
        if (c10 && c10.length > 0) {
          f10.allowCredentials = Array(c10.length);
          for (let a11 = 0; a11 < c10.length; a11++) {
            let b11 = c10[a11];
            f10.allowCredentials[a11] = Object.assign(Object.assign({}, b11), { id: fp(b11.id).buffer, type: b11.type || "public-key", transports: b11.transports });
          }
        }
        return f10;
      }
      function f8(a10) {
        var b10;
        return "toJSON" in a10 && "function" == typeof a10.toJSON ? a10.toJSON() : { id: a10.id, rawId: a10.id, response: { attestationObject: fq(new Uint8Array(a10.response.attestationObject)), clientDataJSON: fq(new Uint8Array(a10.response.clientDataJSON)) }, type: "public-key", clientExtensionResults: a10.getClientExtensionResults(), authenticatorAttachment: null != (b10 = a10.authenticatorAttachment) ? b10 : void 0 };
      }
      function f9(a10) {
        var b10;
        if ("toJSON" in a10 && "function" == typeof a10.toJSON) return a10.toJSON();
        let c10 = a10.getClientExtensionResults(), d10 = a10.response;
        return { id: a10.id, rawId: a10.id, response: { authenticatorData: fq(new Uint8Array(d10.authenticatorData)), clientDataJSON: fq(new Uint8Array(d10.clientDataJSON)), signature: fq(new Uint8Array(d10.signature)), userHandle: d10.userHandle ? fq(new Uint8Array(d10.userHandle)) : void 0 }, type: "public-key", clientExtensionResults: c10, authenticatorAttachment: null != (b10 = a10.authenticatorAttachment) ? b10 : void 0 };
      }
      function ga(a10) {
        return "localhost" === a10 || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(a10);
      }
      function gb() {
        var a10, b10;
        return !!(fr() && "PublicKeyCredential" in window && window.PublicKeyCredential && "credentials" in navigator && "function" == typeof (null == (a10 = null == navigator ? void 0 : navigator.credentials) ? void 0 : a10.create) && "function" == typeof (null == (b10 = null == navigator ? void 0 : navigator.credentials) ? void 0 : b10.get));
      }
      async function gc(a10) {
        try {
          let b10 = await navigator.credentials.create(a10);
          if (!b10) return { data: null, error: new f3("Empty credential response", b10) };
          if (!(b10 instanceof PublicKeyCredential)) return { data: null, error: new f3("Browser returned unexpected credential type", b10) };
          return { data: b10, error: null };
        } catch (b10) {
          return { data: null, error: (function({ error: a11, options: b11 }) {
            var c10, d10, e10;
            let { publicKey: f10 } = b11;
            if (!f10) throw Error("options was missing required publicKey property");
            if ("AbortError" === a11.name) {
              if (b11.signal instanceof AbortSignal) return new f2({ message: "Registration ceremony was sent an abort signal", code: "ERROR_CEREMONY_ABORTED", cause: a11 });
            } else if ("ConstraintError" === a11.name) {
              if ((null == (c10 = f10.authenticatorSelection) ? void 0 : c10.requireResidentKey) === true) return new f2({ message: "Discoverable credentials were required but no available authenticator supported it", code: "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT", cause: a11 });
              else if ("conditional" === b11.mediation && (null == (d10 = f10.authenticatorSelection) ? void 0 : d10.userVerification) === "required") return new f2({ message: "User verification was required during automatic registration but it could not be performed", code: "ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE", cause: a11 });
              else if ((null == (e10 = f10.authenticatorSelection) ? void 0 : e10.userVerification) === "required") return new f2({ message: "User verification was required but no available authenticator supported it", code: "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT", cause: a11 });
            } else if ("InvalidStateError" === a11.name) return new f2({ message: "The authenticator was previously registered", code: "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED", cause: a11 });
            else if ("NotAllowedError" === a11.name) return new f2({ message: a11.message, code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: a11 });
            else if ("NotSupportedError" === a11.name) return new f2(0 === f10.pubKeyCredParams.filter((a12) => "public-key" === a12.type).length ? { message: 'No entry in pubKeyCredParams was of type "public-key"', code: "ERROR_MALFORMED_PUBKEYCREDPARAMS", cause: a11 } : { message: "No available authenticator supported any of the specified pubKeyCredParams algorithms", code: "ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG", cause: a11 });
            else if ("SecurityError" === a11.name) {
              let b12 = window.location.hostname;
              if (!ga(b12)) return new f2({ message: `${window.location.hostname} is an invalid domain`, code: "ERROR_INVALID_DOMAIN", cause: a11 });
              if (f10.rp.id !== b12) return new f2({ message: `The RP ID "${f10.rp.id}" is invalid for this domain`, code: "ERROR_INVALID_RP_ID", cause: a11 });
            } else if ("TypeError" === a11.name) {
              if (f10.user.id.byteLength < 1 || f10.user.id.byteLength > 64) return new f2({ message: "User ID was not between 1 and 64 characters", code: "ERROR_INVALID_USER_ID_LENGTH", cause: a11 });
            } else if ("UnknownError" === a11.name) return new f2({ message: "The authenticator was unable to process the specified options, or could not create a new credential", code: "ERROR_AUTHENTICATOR_GENERAL_ERROR", cause: a11 });
            return new f2({ message: "a Non-Webauthn related error has occurred", code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: a11 });
          })({ error: b10, options: a10 }) };
        }
      }
      async function gd(a10) {
        try {
          let b10 = await navigator.credentials.get(a10);
          if (!b10) return { data: null, error: new f3("Empty credential response", b10) };
          if (!(b10 instanceof PublicKeyCredential)) return { data: null, error: new f3("Browser returned unexpected credential type", b10) };
          return { data: b10, error: null };
        } catch (b10) {
          return { data: null, error: (function({ error: a11, options: b11 }) {
            let { publicKey: c10 } = b11;
            if (!c10) throw Error("options was missing required publicKey property");
            if ("AbortError" === a11.name) {
              if (b11.signal instanceof AbortSignal) return new f2({ message: "Authentication ceremony was sent an abort signal", code: "ERROR_CEREMONY_ABORTED", cause: a11 });
            } else if ("NotAllowedError" === a11.name) return new f2({ message: a11.message, code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: a11 });
            else if ("SecurityError" === a11.name) {
              let b12 = window.location.hostname;
              if (!ga(b12)) return new f2({ message: `${window.location.hostname} is an invalid domain`, code: "ERROR_INVALID_DOMAIN", cause: a11 });
              if (c10.rpId !== b12) return new f2({ message: `The RP ID "${c10.rpId}" is invalid for this domain`, code: "ERROR_INVALID_RP_ID", cause: a11 });
            } else if ("UnknownError" === a11.name) return new f2({ message: "The authenticator was unable to process the specified options, or could not create a new assertion signature", code: "ERROR_AUTHENTICATOR_GENERAL_ERROR", cause: a11 });
            return new f2({ message: "a Non-Webauthn related error has occurred", code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: a11 });
          })({ error: b10, options: a10 }) };
        }
      }
      let ge = { hints: ["security-key"], authenticatorSelection: { authenticatorAttachment: "cross-platform", requireResidentKey: false, userVerification: "preferred", residentKey: "discouraged" }, attestation: "direct" }, gf = { userVerification: "preferred", hints: ["security-key"], attestation: "direct" };
      function gg(...a10) {
        let b10 = (a11) => null !== a11 && "object" == typeof a11 && !Array.isArray(a11), c10 = (a11) => a11 instanceof ArrayBuffer || ArrayBuffer.isView(a11), d10 = {};
        for (let e10 of a10) if (e10) for (let a11 in e10) {
          let f10 = e10[a11];
          if (void 0 !== f10) if (Array.isArray(f10)) d10[a11] = f10;
          else if (c10(f10)) d10[a11] = f10;
          else if (b10(f10)) {
            let c11 = d10[a11];
            b10(c11) ? d10[a11] = gg(c11, f10) : d10[a11] = gg(f10);
          } else d10[a11] = f10;
        }
        return d10;
      }
      class gh {
        constructor(a10) {
          this.client = a10, this.enroll = this._enroll.bind(this), this.challenge = this._challenge.bind(this), this.verify = this._verify.bind(this), this.authenticate = this._authenticate.bind(this), this.register = this._register.bind(this);
        }
        async _enroll(a10) {
          return this.client.mfa.enroll(Object.assign(Object.assign({}, a10), { factorType: "webauthn" }));
        }
        async _challenge({ factorId: a10, webauthn: b10, friendlyName: c10, signal: d10 }, e10) {
          var f10, g2, h2, i2, j2;
          try {
            let { data: k2, error: l2 } = await this.client.mfa.challenge({ factorId: a10, webauthn: b10 });
            if (!k2) return { data: null, error: l2 };
            let m2 = null != d10 ? d10 : f5.createNewAbortSignal();
            if ("create" === k2.webauthn.type) {
              let { user: a11 } = k2.webauthn.credential_options.publicKey;
              if (!a11.name) if (c10) a11.name = `${a11.id}:${c10}`;
              else {
                let b11 = (await this.client.getUser()).data.user, c11 = (null == (f10 = null == b11 ? void 0 : b11.user_metadata) ? void 0 : f10.name) || (null == b11 ? void 0 : b11.email) || (null == b11 ? void 0 : b11.id) || "User";
                a11.name = `${a11.id}:${c11}`;
              }
              a11.displayName || (a11.displayName = a11.name);
            }
            switch (k2.webauthn.type) {
              case "create": {
                let b11 = (g2 = k2.webauthn.credential_options.publicKey, h2 = null == e10 ? void 0 : e10.create, gg(ge, g2, h2 || {})), { data: c11, error: d11 } = await gc({ publicKey: b11, signal: m2 });
                if (c11) return { data: { factorId: a10, challengeId: k2.id, webauthn: { type: k2.webauthn.type, credential_response: c11 } }, error: null };
                return { data: null, error: d11 };
              }
              case "request": {
                let b11 = (i2 = k2.webauthn.credential_options.publicKey, j2 = null == e10 ? void 0 : e10.request, gg(gf, i2, j2 || {})), { data: c11, error: d11 } = await gd(Object.assign(Object.assign({}, k2.webauthn.credential_options), { publicKey: b11, signal: m2 }));
                if (c11) return { data: { factorId: a10, challengeId: k2.id, webauthn: { type: k2.webauthn.type, credential_response: c11 } }, error: null };
                return { data: null, error: d11 };
              }
            }
          } catch (a11) {
            if (e4(a11)) return { data: null, error: a11 };
            return { data: null, error: new e6("Unexpected error in challenge", a11) };
          }
        }
        async _verify({ challengeId: a10, factorId: b10, webauthn: c10 }) {
          return this.client.mfa.verify({ factorId: b10, challengeId: a10, webauthn: c10 });
        }
        async _authenticate({ factorId: a10, webauthn: { rpId: b10 = "u" > typeof window ? window.location.hostname : void 0, rpOrigins: c10 = "u" > typeof window ? [window.location.origin] : void 0, signal: d10 } = {} }, e10) {
          if (!b10) return { data: null, error: new e3("rpId is required for WebAuthn authentication") };
          try {
            if (!gb()) return { data: null, error: new e6("Browser does not support WebAuthn", null) };
            let { data: f10, error: g2 } = await this.challenge({ factorId: a10, webauthn: { rpId: b10, rpOrigins: c10 }, signal: d10 }, { request: e10 });
            if (!f10) return { data: null, error: g2 };
            let { webauthn: h2 } = f10;
            return this._verify({ factorId: a10, challengeId: f10.challengeId, webauthn: { type: h2.type, rpId: b10, rpOrigins: c10, credential_response: h2.credential_response } });
          } catch (a11) {
            if (e4(a11)) return { data: null, error: a11 };
            return { data: null, error: new e6("Unexpected error in authenticate", a11) };
          }
        }
        async _register({ friendlyName: a10, webauthn: { rpId: b10 = "u" > typeof window ? window.location.hostname : void 0, rpOrigins: c10 = "u" > typeof window ? [window.location.origin] : void 0, signal: d10 } = {} }, e10) {
          if (!b10) return { data: null, error: new e3("rpId is required for WebAuthn registration") };
          try {
            if (!gb()) return { data: null, error: new e6("Browser does not support WebAuthn", null) };
            let { data: f10, error: g2 } = await this._enroll({ friendlyName: a10 });
            if (!f10) return await this.client.mfa.listFactors().then((b11) => {
              var c11;
              return null == (c11 = b11.data) ? void 0 : c11.all.find((b12) => "webauthn" === b12.factor_type && b12.friendly_name === a10 && "unverified" !== b12.status);
            }).then((a11) => a11 ? this.client.mfa.unenroll({ factorId: null == a11 ? void 0 : a11.id }) : void 0), { data: null, error: g2 };
            let { data: h2, error: i2 } = await this._challenge({ factorId: f10.id, friendlyName: f10.friendly_name, webauthn: { rpId: b10, rpOrigins: c10 }, signal: d10 }, { create: e10 });
            if (!h2) return { data: null, error: i2 };
            return this._verify({ factorId: f10.id, challengeId: h2.challengeId, webauthn: { rpId: b10, rpOrigins: c10, type: h2.webauthn.type, credential_response: h2.webauthn.credential_response } });
          } catch (a11) {
            if (e4(a11)) return { data: null, error: a11 };
            return { data: null, error: new e6("Unexpected error in register", a11) };
          }
        }
      }
      if ("object" != typeof globalThis) try {
        Object.defineProperty(Object.prototype, "__magic__", { get: function() {
          return this;
        }, configurable: true }), __magic__.globalThis = __magic__, delete Object.prototype.__magic__;
      } catch (a10) {
        "u" > typeof self && (self.globalThis = self);
      }
      let gi = { url: "http://localhost:9999", storageKey: "supabase.auth.token", autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, headers: e_, flowType: "implicit", debug: false, hasCustomAuthorizationHeader: false, throwOnError: false, lockAcquireTimeout: 5e3, skipAutoInitialize: false, experimental: {} };
      async function gj(a10, b10, c10) {
        return await c10();
      }
      let gk = {};
      class gl {
        get jwks() {
          var a10, b10;
          return null != (b10 = null == (a10 = gk[this.storageKey]) ? void 0 : a10.jwks) ? b10 : { keys: [] };
        }
        set jwks(a10) {
          gk[this.storageKey] = Object.assign(Object.assign({}, gk[this.storageKey]), { jwks: a10 });
        }
        get jwks_cached_at() {
          var a10, b10;
          return null != (b10 = null == (a10 = gk[this.storageKey]) ? void 0 : a10.cachedAt) ? b10 : Number.MIN_SAFE_INTEGER;
        }
        set jwks_cached_at(a10) {
          gk[this.storageKey] = Object.assign(Object.assign({}, gk[this.storageKey]), { cachedAt: a10 });
        }
        constructor(a10) {
          var b10, c10, d10, e10;
          this.userStorage = null, this.memoryStorage = null, this.stateChangeEmitters = /* @__PURE__ */ new Map(), this.autoRefreshTicker = null, this.autoRefreshTickTimeout = null, this.visibilityChangedCallback = null, this.refreshingDeferred = null, this.initializePromise = null, this.detectSessionInUrl = true, this.hasCustomAuthorizationHeader = false, this.suppressGetSessionWarning = false, this.lockAcquired = false, this.pendingInLock = [], this.broadcastChannel = null, this.logger = console.log;
          const f10 = Object.assign(Object.assign({}, gi), a10);
          if (this.storageKey = f10.storageKey, this.instanceID = null != (b10 = gl.nextInstanceID[this.storageKey]) ? b10 : 0, gl.nextInstanceID[this.storageKey] = this.instanceID + 1, this.logDebugMessages = !!f10.debug, "function" == typeof f10.debug && (this.logger = f10.debug), this.instanceID > 0 && fr()) {
            const a11 = `${this._logPrefix()} Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.`;
            console.warn(a11), this.logDebugMessages && console.trace(a11);
          }
          if (this.persistSession = f10.persistSession, this.autoRefreshToken = f10.autoRefreshToken, this.experimental = null != (c10 = f10.experimental) ? c10 : {}, this.admin = new fX({ url: f10.url, headers: f10.headers, fetch: f10.fetch, experimental: this.experimental }), this.url = f10.url, this.headers = f10.headers, this.fetch = fu(f10.fetch), this.lock = f10.lock || gj, this.detectSessionInUrl = f10.detectSessionInUrl, this.flowType = f10.flowType, this.hasCustomAuthorizationHeader = f10.hasCustomAuthorizationHeader, this.throwOnError = f10.throwOnError, this.lockAcquireTimeout = f10.lockAcquireTimeout, f10.lock ? this.lock = f10.lock : this.persistSession && fr() && (null == (d10 = null == globalThis ? void 0 : globalThis.navigator) ? void 0 : d10.locks) ? this.lock = f0 : this.lock = gj, this.jwks || (this.jwks = { keys: [] }, this.jwks_cached_at = Number.MIN_SAFE_INTEGER), this.mfa = { verify: this._verify.bind(this), enroll: this._enroll.bind(this), unenroll: this._unenroll.bind(this), challenge: this._challenge.bind(this), listFactors: this._listFactors.bind(this), challengeAndVerify: this._challengeAndVerify.bind(this), getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this), webauthn: new gh(this) }, this.oauth = { getAuthorizationDetails: this._getAuthorizationDetails.bind(this), approveAuthorization: this._approveAuthorization.bind(this), denyAuthorization: this._denyAuthorization.bind(this), listGrants: this._listOAuthGrants.bind(this), revokeGrant: this._revokeOAuthGrant.bind(this) }, this.passkey = { startRegistration: this._startPasskeyRegistration.bind(this), verifyRegistration: this._verifyPasskeyRegistration.bind(this), startAuthentication: this._startPasskeyAuthentication.bind(this), verifyAuthentication: this._verifyPasskeyAuthentication.bind(this), list: this._listPasskeys.bind(this), update: this._updatePasskey.bind(this), delete: this._deletePasskey.bind(this) }, this.persistSession ? (f10.storage ? this.storage = f10.storage : ft() ? this.storage = globalThis.localStorage : (this.memoryStorage = {}, this.storage = fY(this.memoryStorage)), f10.userStorage && (this.userStorage = f10.userStorage)) : (this.memoryStorage = {}, this.storage = fY(this.memoryStorage)), fr() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
            try {
              this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
            } catch (a11) {
              console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", a11);
            }
            null == (e10 = this.broadcastChannel) || e10.addEventListener("message", async (a11) => {
              this._debug("received broadcast notification from other tab or client", a11);
              try {
                await this._notifyAllSubscribers(a11.data.event, a11.data.session, false);
              } catch (a12) {
                this._debug("#broadcastChannel", "error", a12);
              }
            });
          }
          f10.skipAutoInitialize || this.initialize().catch((a11) => {
            this._debug("#initialize()", "error", a11);
          });
        }
        isThrowOnErrorEnabled() {
          return this.throwOnError;
        }
        _returnResult(a10) {
          if (this.throwOnError && a10 && a10.error) throw a10.error;
          return a10;
        }
        _logPrefix() {
          return `GoTrueClient@${this.storageKey}:${this.instanceID} (${e$}) ${(/* @__PURE__ */ new Date()).toISOString()}`;
        }
        _debug(...a10) {
          return this.logDebugMessages && this.logger(this._logPrefix(), ...a10), this;
        }
        async initialize() {
          return this.initializePromise || (this.initializePromise = (async () => await this._acquireLock(this.lockAcquireTimeout, async () => await this._initialize()))()), await this.initializePromise;
        }
        async _initialize() {
          var a10;
          try {
            let b10 = {}, c10 = "none";
            if (fr() && (b10 = (function(a11) {
              let b11 = {}, c11 = new URL(a11);
              if (c11.hash && "#" === c11.hash[0]) try {
                new URLSearchParams(c11.hash.substring(1)).forEach((a12, c12) => {
                  b11[c12] = a12;
                });
              } catch (a12) {
              }
              return c11.searchParams.forEach((a12, c12) => {
                b11[c12] = a12;
              }), b11;
            })(window.location.href), this._isImplicitGrantCallback(b10) ? c10 = "implicit" : await this._isPKCECallback(b10) && (c10 = "pkce")), fr() && this.detectSessionInUrl && "none" !== c10) {
              let { data: d10, error: e10 } = await this._getSessionFromURL(b10, c10);
              if (e10) {
                (this._debug("#_initialize()", "error detecting session from URL", e10), e4(e10) && "AuthImplicitGrantRedirectError" === e10.name) && (null == (a10 = e10.details) || a10.code);
                return { error: e10 };
              }
              let { session: f10, redirectType: g2 } = d10;
              return this._debug("#_initialize()", "detected session in URL", f10, "redirect type", g2), await this._saveSession(f10), setTimeout(async () => {
                "recovery" === g2 ? await this._notifyAllSubscribers("PASSWORD_RECOVERY", f10) : await this._notifyAllSubscribers("SIGNED_IN", f10);
              }, 0), { error: null };
            }
            return await this._recoverAndRefresh(), { error: null };
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ error: a11 });
            return this._returnResult({ error: new e6("Unexpected error during initialization", a11) });
          } finally {
            await this._handleVisibilityChange(), this._debug("#_initialize()", "end");
          }
        }
        async signInAnonymously(a10) {
          var b10, c10, d10;
          try {
            let { data: e10, error: f10 } = await fO(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, body: { data: null != (c10 = null == (b10 = null == a10 ? void 0 : a10.options) ? void 0 : b10.data) ? c10 : {}, gotrue_meta_security: { captcha_token: null == (d10 = null == a10 ? void 0 : a10.options) ? void 0 : d10.captchaToken } }, xform: fQ });
            if (f10 || !e10) return this._returnResult({ data: { user: null, session: null }, error: f10 });
            let g2 = e10.session, h2 = e10.user;
            return e10.session && (await this._saveSession(e10.session), await this._notifyAllSubscribers("SIGNED_IN", g2)), this._returnResult({ data: { user: h2, session: g2 }, error: null });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async signUp(a10) {
          var b10, c10, d10;
          try {
            let e10;
            if ("email" in a10) {
              let { email: c11, password: d11, options: f11 } = a10, g3 = null, h3 = null;
              "pkce" === this.flowType && ([g3, h3] = await fE(this.storage, this.storageKey)), e10 = await fO(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, redirectTo: null == f11 ? void 0 : f11.emailRedirectTo, body: { email: c11, password: d11, data: null != (b10 = null == f11 ? void 0 : f11.data) ? b10 : {}, gotrue_meta_security: { captcha_token: null == f11 ? void 0 : f11.captchaToken }, code_challenge: g3, code_challenge_method: h3 }, xform: fQ });
            } else if ("phone" in a10) {
              let { phone: b11, password: f11, options: g3 } = a10;
              e10 = await fO(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, body: { phone: b11, password: f11, data: null != (c10 = null == g3 ? void 0 : g3.data) ? c10 : {}, channel: null != (d10 = null == g3 ? void 0 : g3.channel) ? d10 : "sms", gotrue_meta_security: { captcha_token: null == g3 ? void 0 : g3.captchaToken } }, xform: fQ });
            } else throw new fb("You must provide either an email or phone number and a password");
            let { data: f10, error: g2 } = e10;
            if (g2 || !f10) return await fx(this.storage, `${this.storageKey}-code-verifier`), this._returnResult({ data: { user: null, session: null }, error: g2 });
            let h2 = f10.session, i2 = f10.user;
            return f10.session && (await this._saveSession(f10.session), await this._notifyAllSubscribers("SIGNED_IN", h2)), this._returnResult({ data: { user: i2, session: h2 }, error: null });
          } catch (a11) {
            if (await fx(this.storage, `${this.storageKey}-code-verifier`), e4(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async signInWithPassword(a10) {
          try {
            let b10;
            if ("email" in a10) {
              let { email: c11, password: d11, options: e10 } = a10;
              b10 = await fO(this.fetch, "POST", `${this.url}/token?grant_type=password`, { headers: this.headers, body: { email: c11, password: d11, gotrue_meta_security: { captcha_token: null == e10 ? void 0 : e10.captchaToken } }, xform: fR });
            } else if ("phone" in a10) {
              let { phone: c11, password: d11, options: e10 } = a10;
              b10 = await fO(this.fetch, "POST", `${this.url}/token?grant_type=password`, { headers: this.headers, body: { phone: c11, password: d11, gotrue_meta_security: { captcha_token: null == e10 ? void 0 : e10.captchaToken } }, xform: fR });
            } else throw new fb("You must provide either an email or phone number and a password");
            let { data: c10, error: d10 } = b10;
            if (d10) return this._returnResult({ data: { user: null, session: null }, error: d10 });
            if (!c10 || !c10.session || !c10.user) {
              let a11 = new fa();
              return this._returnResult({ data: { user: null, session: null }, error: a11 });
            }
            return c10.session && (await this._saveSession(c10.session), await this._notifyAllSubscribers("SIGNED_IN", c10.session)), this._returnResult({ data: Object.assign({ user: c10.user, session: c10.session }, c10.weak_password ? { weakPassword: c10.weak_password } : null), error: d10 });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async signInWithOAuth(a10) {
          var b10, c10, d10, e10;
          return await this._handleProviderSignIn(a10.provider, { redirectTo: null == (b10 = a10.options) ? void 0 : b10.redirectTo, scopes: null == (c10 = a10.options) ? void 0 : c10.scopes, queryParams: null == (d10 = a10.options) ? void 0 : d10.queryParams, skipBrowserRedirect: null == (e10 = a10.options) ? void 0 : e10.skipBrowserRedirect });
        }
        async exchangeCodeForSession(a10) {
          return await this.initializePromise, this._acquireLock(this.lockAcquireTimeout, async () => this._exchangeCodeForSession(a10));
        }
        async signInWithWeb3(a10) {
          let { chain: b10 } = a10;
          switch (b10) {
            case "ethereum":
              return await this.signInWithEthereum(a10);
            case "solana":
              return await this.signInWithSolana(a10);
            default:
              throw Error(`@supabase/auth-js: Unsupported chain "${b10}"`);
          }
        }
        async signInWithEthereum(a10) {
          var b10, c10, d10, e10, f10, g2, h2, i2, j2, k2, l2, m2;
          let n2, o2;
          if ("message" in a10) n2 = a10.message, o2 = a10.signature;
          else {
            let k3, { chain: l3, wallet: p2, statement: q2, options: r2 } = a10;
            if (fr()) if ("object" == typeof p2) k3 = p2;
            else {
              let a11 = window;
              if ("ethereum" in a11 && "object" == typeof a11.ethereum && "request" in a11.ethereum && "function" == typeof a11.ethereum.request) k3 = a11.ethereum;
              else throw Error("@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.");
            }
            else {
              if ("object" != typeof p2 || !(null == r2 ? void 0 : r2.url)) throw Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
              k3 = p2;
            }
            let s2 = new URL(null != (b10 = null == r2 ? void 0 : r2.url) ? b10 : window.location.href), t2 = await k3.request({ method: "eth_requestAccounts" }).then((a11) => a11).catch(() => {
              throw Error("@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid");
            });
            if (!t2 || 0 === t2.length) throw Error("@supabase/auth-js: No accounts available. Please ensure the wallet is connected.");
            let u2 = f1(t2[0]), v2 = null == (c10 = null == r2 ? void 0 : r2.signInWithEthereum) ? void 0 : c10.chainId;
            v2 || (v2 = parseInt(await k3.request({ method: "eth_chainId" }), 16)), n2 = (function(a11) {
              var b11;
              let { chainId: c11, domain: d11, expirationTime: e11, issuedAt: f11 = /* @__PURE__ */ new Date(), nonce: g3, notBefore: h3, requestId: i3, resources: j3, scheme: k4, uri: l4, version: m3 } = a11;
              if (!Number.isInteger(c11)) throw Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${c11}`);
              if (!d11) throw Error('@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.');
              if (g3 && g3.length < 8) throw Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${g3}`);
              if (!l4) throw Error('@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.');
              if ("1" !== m3) throw Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${m3}`);
              if (null == (b11 = a11.statement) ? void 0 : b11.includes("\n")) throw Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${a11.statement}`);
              let n3 = f1(a11.address), o3 = k4 ? `${k4}://${d11}` : d11, p3 = a11.statement ? `${a11.statement}
` : "", q3 = `${o3} wants you to sign in with your Ethereum account:
${n3}

${p3}`, r3 = `URI: ${l4}
Version: ${m3}
Chain ID: ${c11}${g3 ? `
Nonce: ${g3}` : ""}
Issued At: ${f11.toISOString()}`;
              if (e11 && (r3 += `
Expiration Time: ${e11.toISOString()}`), h3 && (r3 += `
Not Before: ${h3.toISOString()}`), i3 && (r3 += `
Request ID: ${i3}`), j3) {
                let a12 = "\nResources:";
                for (let b12 of j3) {
                  if (!b12 || "string" != typeof b12) throw Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${b12}`);
                  a12 += `
- ${b12}`;
                }
                r3 += a12;
              }
              return `${q3}
${r3}`;
            })({ domain: s2.host, address: u2, statement: q2, uri: s2.href, version: "1", chainId: v2, nonce: null == (d10 = null == r2 ? void 0 : r2.signInWithEthereum) ? void 0 : d10.nonce, issuedAt: null != (f10 = null == (e10 = null == r2 ? void 0 : r2.signInWithEthereum) ? void 0 : e10.issuedAt) ? f10 : /* @__PURE__ */ new Date(), expirationTime: null == (g2 = null == r2 ? void 0 : r2.signInWithEthereum) ? void 0 : g2.expirationTime, notBefore: null == (h2 = null == r2 ? void 0 : r2.signInWithEthereum) ? void 0 : h2.notBefore, requestId: null == (i2 = null == r2 ? void 0 : r2.signInWithEthereum) ? void 0 : i2.requestId, resources: null == (j2 = null == r2 ? void 0 : r2.signInWithEthereum) ? void 0 : j2.resources }), o2 = await k3.request({ method: "personal_sign", params: [(m2 = n2, "0x" + Array.from(new TextEncoder().encode(m2), (a11) => a11.toString(16).padStart(2, "0")).join("")), u2] });
          }
          try {
            let { data: b11, error: c11 } = await fO(this.fetch, "POST", `${this.url}/token?grant_type=web3`, { headers: this.headers, body: Object.assign({ chain: "ethereum", message: n2, signature: o2 }, (null == (k2 = a10.options) ? void 0 : k2.captchaToken) ? { gotrue_meta_security: { captcha_token: null == (l2 = a10.options) ? void 0 : l2.captchaToken } } : null), xform: fQ });
            if (c11) throw c11;
            if (!b11 || !b11.session || !b11.user) {
              let a11 = new fa();
              return this._returnResult({ data: { user: null, session: null }, error: a11 });
            }
            return b11.session && (await this._saveSession(b11.session), await this._notifyAllSubscribers("SIGNED_IN", b11.session)), this._returnResult({ data: Object.assign({}, b11), error: c11 });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async signInWithSolana(a10) {
          var b10, c10, d10, e10, f10, g2, h2, i2, j2, k2, l2, m2;
          let n2, o2;
          if ("message" in a10) n2 = a10.message, o2 = a10.signature;
          else {
            let l3, { chain: m3, wallet: p2, statement: q2, options: r2 } = a10;
            if (fr()) if ("object" == typeof p2) l3 = p2;
            else {
              let a11 = window;
              if ("solana" in a11 && "object" == typeof a11.solana && ("signIn" in a11.solana && "function" == typeof a11.solana.signIn || "signMessage" in a11.solana && "function" == typeof a11.solana.signMessage)) l3 = a11.solana;
              else throw Error("@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.");
            }
            else {
              if ("object" != typeof p2 || !(null == r2 ? void 0 : r2.url)) throw Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
              l3 = p2;
            }
            let s2 = new URL(null != (b10 = null == r2 ? void 0 : r2.url) ? b10 : window.location.href);
            if ("signIn" in l3 && l3.signIn) {
              let a11, b11 = await l3.signIn(Object.assign(Object.assign(Object.assign({ issuedAt: (/* @__PURE__ */ new Date()).toISOString() }, null == r2 ? void 0 : r2.signInWithSolana), { version: "1", domain: s2.host, uri: s2.href }), q2 ? { statement: q2 } : null));
              if (Array.isArray(b11) && b11[0] && "object" == typeof b11[0]) a11 = b11[0];
              else if (b11 && "object" == typeof b11 && "signedMessage" in b11 && "signature" in b11) a11 = b11;
              else throw Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");
              if ("signedMessage" in a11 && "signature" in a11 && ("string" == typeof a11.signedMessage || a11.signedMessage instanceof Uint8Array) && a11.signature instanceof Uint8Array) n2 = "string" == typeof a11.signedMessage ? a11.signedMessage : new TextDecoder().decode(a11.signedMessage), o2 = a11.signature;
              else throw Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields");
            } else {
              if (!("signMessage" in l3) || "function" != typeof l3.signMessage || !("publicKey" in l3) || "object" != typeof l3 || !l3.publicKey || !("toBase58" in l3.publicKey) || "function" != typeof l3.publicKey.toBase58) throw Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");
              n2 = [`${s2.host} wants you to sign in with your Solana account:`, l3.publicKey.toBase58(), ...q2 ? ["", q2, ""] : [""], "Version: 1", `URI: ${s2.href}`, `Issued At: ${null != (d10 = null == (c10 = null == r2 ? void 0 : r2.signInWithSolana) ? void 0 : c10.issuedAt) ? d10 : (/* @__PURE__ */ new Date()).toISOString()}`, ...(null == (e10 = null == r2 ? void 0 : r2.signInWithSolana) ? void 0 : e10.notBefore) ? [`Not Before: ${r2.signInWithSolana.notBefore}`] : [], ...(null == (f10 = null == r2 ? void 0 : r2.signInWithSolana) ? void 0 : f10.expirationTime) ? [`Expiration Time: ${r2.signInWithSolana.expirationTime}`] : [], ...(null == (g2 = null == r2 ? void 0 : r2.signInWithSolana) ? void 0 : g2.chainId) ? [`Chain ID: ${r2.signInWithSolana.chainId}`] : [], ...(null == (h2 = null == r2 ? void 0 : r2.signInWithSolana) ? void 0 : h2.nonce) ? [`Nonce: ${r2.signInWithSolana.nonce}`] : [], ...(null == (i2 = null == r2 ? void 0 : r2.signInWithSolana) ? void 0 : i2.requestId) ? [`Request ID: ${r2.signInWithSolana.requestId}`] : [], ...(null == (k2 = null == (j2 = null == r2 ? void 0 : r2.signInWithSolana) ? void 0 : j2.resources) ? void 0 : k2.length) ? ["Resources", ...r2.signInWithSolana.resources.map((a12) => `- ${a12}`)] : []].join("\n");
              let a11 = await l3.signMessage(new TextEncoder().encode(n2), "utf8");
              if (!a11 || !(a11 instanceof Uint8Array)) throw Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");
              o2 = a11;
            }
          }
          try {
            let { data: b11, error: c11 } = await fO(this.fetch, "POST", `${this.url}/token?grant_type=web3`, { headers: this.headers, body: Object.assign({ chain: "solana", message: n2, signature: fq(o2) }, (null == (l2 = a10.options) ? void 0 : l2.captchaToken) ? { gotrue_meta_security: { captcha_token: null == (m2 = a10.options) ? void 0 : m2.captchaToken } } : null), xform: fQ });
            if (c11) throw c11;
            if (!b11 || !b11.session || !b11.user) {
              let a11 = new fa();
              return this._returnResult({ data: { user: null, session: null }, error: a11 });
            }
            return b11.session && (await this._saveSession(b11.session), await this._notifyAllSubscribers("SIGNED_IN", b11.session)), this._returnResult({ data: Object.assign({}, b11), error: c11 });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async _exchangeCodeForSession(a10) {
          let b10 = await fw(this.storage, `${this.storageKey}-code-verifier`), [c10, d10] = (null != b10 ? b10 : "").split("/");
          try {
            if (!c10 && "pkce" === this.flowType) throw new fe();
            let { data: b11, error: e10 } = await fO(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, { headers: this.headers, body: { auth_code: a10, code_verifier: c10 }, xform: fQ });
            if (await fx(this.storage, `${this.storageKey}-code-verifier`), e10) throw e10;
            if (!b11 || !b11.session || !b11.user) {
              let a11 = new fa();
              return this._returnResult({ data: { user: null, session: null, redirectType: null }, error: a11 });
            }
            return b11.session && (await this._saveSession(b11.session), await this._notifyAllSubscribers("recovery" === d10 ? "PASSWORD_RECOVERY" : "SIGNED_IN", b11.session)), this._returnResult({ data: Object.assign(Object.assign({}, b11), { redirectType: null != d10 ? d10 : null }), error: e10 });
          } catch (a11) {
            if (await fx(this.storage, `${this.storageKey}-code-verifier`), e4(a11)) return this._returnResult({ data: { user: null, session: null, redirectType: null }, error: a11 });
            throw a11;
          }
        }
        async signInWithIdToken(a10) {
          try {
            let { options: b10, provider: c10, token: d10, access_token: e10, nonce: f10 } = a10, { data: g2, error: h2 } = await fO(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, { headers: this.headers, body: { provider: c10, id_token: d10, access_token: e10, nonce: f10, gotrue_meta_security: { captcha_token: null == b10 ? void 0 : b10.captchaToken } }, xform: fQ });
            if (h2) return this._returnResult({ data: { user: null, session: null }, error: h2 });
            if (!g2 || !g2.session || !g2.user) {
              let a11 = new fa();
              return this._returnResult({ data: { user: null, session: null }, error: a11 });
            }
            return g2.session && (await this._saveSession(g2.session), await this._notifyAllSubscribers("SIGNED_IN", g2.session)), this._returnResult({ data: g2, error: h2 });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async signInWithOtp(a10) {
          var b10, c10, d10, e10, f10;
          try {
            if ("email" in a10) {
              let { email: d11, options: e11 } = a10, f11 = null, g2 = null;
              "pkce" === this.flowType && ([f11, g2] = await fE(this.storage, this.storageKey));
              let { error: h2 } = await fO(this.fetch, "POST", `${this.url}/otp`, { headers: this.headers, body: { email: d11, data: null != (b10 = null == e11 ? void 0 : e11.data) ? b10 : {}, create_user: null == (c10 = null == e11 ? void 0 : e11.shouldCreateUser) || c10, gotrue_meta_security: { captcha_token: null == e11 ? void 0 : e11.captchaToken }, code_challenge: f11, code_challenge_method: g2 }, redirectTo: null == e11 ? void 0 : e11.emailRedirectTo });
              return this._returnResult({ data: { user: null, session: null }, error: h2 });
            }
            if ("phone" in a10) {
              let { phone: b11, options: c11 } = a10, { data: g2, error: h2 } = await fO(this.fetch, "POST", `${this.url}/otp`, { headers: this.headers, body: { phone: b11, data: null != (d10 = null == c11 ? void 0 : c11.data) ? d10 : {}, create_user: null == (e10 = null == c11 ? void 0 : c11.shouldCreateUser) || e10, gotrue_meta_security: { captcha_token: null == c11 ? void 0 : c11.captchaToken }, channel: null != (f10 = null == c11 ? void 0 : c11.channel) ? f10 : "sms" } });
              return this._returnResult({ data: { user: null, session: null, messageId: null == g2 ? void 0 : g2.message_id }, error: h2 });
            }
            throw new fb("You must provide either an email or phone number.");
          } catch (a11) {
            if (await fx(this.storage, `${this.storageKey}-code-verifier`), e4(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async verifyOtp(a10) {
          var b10, c10;
          try {
            let d10, e10;
            "options" in a10 && (d10 = null == (b10 = a10.options) ? void 0 : b10.redirectTo, e10 = null == (c10 = a10.options) ? void 0 : c10.captchaToken);
            let { data: f10, error: g2 } = await fO(this.fetch, "POST", `${this.url}/verify`, { headers: this.headers, body: Object.assign(Object.assign({}, a10), { gotrue_meta_security: { captcha_token: e10 } }), redirectTo: d10, xform: fQ });
            if (g2) throw g2;
            if (!f10) throw Error("An error occurred on token verification.");
            let h2 = f10.session, i2 = f10.user;
            return (null == h2 ? void 0 : h2.access_token) && (await this._saveSession(h2), await this._notifyAllSubscribers("recovery" == a10.type ? "PASSWORD_RECOVERY" : "SIGNED_IN", h2)), this._returnResult({ data: { user: i2, session: h2 }, error: null });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async signInWithSSO(a10) {
          var b10, c10, d10, e10, f10;
          try {
            let g2 = null, h2 = null;
            "pkce" === this.flowType && ([g2, h2] = await fE(this.storage, this.storageKey));
            let i2 = await fO(this.fetch, "POST", `${this.url}/sso`, { body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in a10 ? { provider_id: a10.providerId } : null), "domain" in a10 ? { domain: a10.domain } : null), { redirect_to: null != (c10 = null == (b10 = a10.options) ? void 0 : b10.redirectTo) ? c10 : void 0 }), (null == (d10 = null == a10 ? void 0 : a10.options) ? void 0 : d10.captchaToken) ? { gotrue_meta_security: { captcha_token: a10.options.captchaToken } } : null), { skip_http_redirect: true, code_challenge: g2, code_challenge_method: h2 }), headers: this.headers, xform: fT });
            return (null == (e10 = i2.data) ? void 0 : e10.url) && fr() && !(null == (f10 = a10.options) ? void 0 : f10.skipBrowserRedirect) && window.location.assign(i2.data.url), this._returnResult(i2);
          } catch (a11) {
            if (await fx(this.storage, `${this.storageKey}-code-verifier`), e4(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async reauthenticate() {
          return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._reauthenticate());
        }
        async _reauthenticate() {
          try {
            return await this._useSession(async (a10) => {
              let { data: { session: b10 }, error: c10 } = a10;
              if (c10) throw c10;
              if (!b10) throw new e8();
              let { error: d10 } = await fO(this.fetch, "GET", `${this.url}/reauthenticate`, { headers: this.headers, jwt: b10.access_token });
              return this._returnResult({ data: { user: null, session: null }, error: d10 });
            });
          } catch (a10) {
            if (e4(a10)) return this._returnResult({ data: { user: null, session: null }, error: a10 });
            throw a10;
          }
        }
        async resend(a10) {
          try {
            let b10 = `${this.url}/resend`;
            if ("email" in a10) {
              let { email: c10, type: d10, options: e10 } = a10, { error: f10 } = await fO(this.fetch, "POST", b10, { headers: this.headers, body: { email: c10, type: d10, gotrue_meta_security: { captcha_token: null == e10 ? void 0 : e10.captchaToken } }, redirectTo: null == e10 ? void 0 : e10.emailRedirectTo });
              return this._returnResult({ data: { user: null, session: null }, error: f10 });
            }
            if ("phone" in a10) {
              let { phone: c10, type: d10, options: e10 } = a10, { data: f10, error: g2 } = await fO(this.fetch, "POST", b10, { headers: this.headers, body: { phone: c10, type: d10, gotrue_meta_security: { captcha_token: null == e10 ? void 0 : e10.captchaToken } } });
              return this._returnResult({ data: { user: null, session: null, messageId: null == f10 ? void 0 : f10.message_id }, error: g2 });
            }
            throw new fb("You must provide either an email or phone number and a type");
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async getSession() {
          return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => this._useSession(async (a10) => a10));
        }
        async _acquireLock(a10, b10) {
          this._debug("#_acquireLock", "begin", a10);
          try {
            if (this.lockAcquired) {
              let a11 = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve(), c10 = (async () => (await a11, await b10()))();
              return this.pendingInLock.push((async () => {
                try {
                  await c10;
                } catch (a12) {
                }
              })()), c10;
            }
            return await this.lock(`lock:${this.storageKey}`, a10, async () => {
              this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
              try {
                this.lockAcquired = true;
                let a11 = b10();
                for (this.pendingInLock.push((async () => {
                  try {
                    await a11;
                  } catch (a12) {
                  }
                })()), await a11; this.pendingInLock.length; ) {
                  let a12 = [...this.pendingInLock];
                  await Promise.all(a12), this.pendingInLock.splice(0, a12.length);
                }
                return await a11;
              } finally {
                this._debug("#_acquireLock", "lock released for storage key", this.storageKey), this.lockAcquired = false;
              }
            });
          } finally {
            this._debug("#_acquireLock", "end");
          }
        }
        async _useSession(a10) {
          this._debug("#_useSession", "begin");
          try {
            let b10 = await this.__loadSession();
            return await a10(b10);
          } finally {
            this._debug("#_useSession", "end");
          }
        }
        async __loadSession() {
          this._debug("#__loadSession()", "begin"), this.lockAcquired || this._debug("#__loadSession()", "used outside of an acquired lock!", Error().stack);
          try {
            let b10 = null, c10 = await fw(this.storage, this.storageKey);
            if (this._debug("#getSession()", "session from storage", c10), null !== c10 && (this._isValidSession(c10) ? b10 = c10 : (this._debug("#getSession()", "session from storage is not valid"), await this._removeSession())), !b10) return { data: { session: null }, error: null };
            let d10 = !!b10.expires_at && 1e3 * b10.expires_at - Date.now() < 9e4;
            if (this._debug("#__loadSession()", `session has${d10 ? "" : " not"} expired`, "expires_at", b10.expires_at), !d10) {
              if (this.userStorage) {
                let a11 = await fw(this.userStorage, this.storageKey + "-user");
                (null == a11 ? void 0 : a11.user) ? b10.user = a11.user : b10.user = fJ();
              }
              if (this.storage.isServer && b10.user && !b10.user.__isUserNotAvailableProxy) {
                var a10;
                let c11 = { value: this.suppressGetSessionWarning };
                b10.user = (a10 = b10.user, new Proxy(a10, { get: (a11, b11, d11) => {
                  if ("__isInsecureUserWarningProxy" === b11) return true;
                  if ("symbol" == typeof b11) {
                    let c12 = b11.toString();
                    if ("Symbol(Symbol.toPrimitive)" === c12 || "Symbol(Symbol.toStringTag)" === c12 || "Symbol(util.inspect.custom)" === c12 || "Symbol(nodejs.util.inspect.custom)" === c12) return Reflect.get(a11, b11, d11);
                  }
                  return c11.value || "string" != typeof b11 || (console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server."), c11.value = true), Reflect.get(a11, b11, d11);
                } })), c11.value && (this.suppressGetSessionWarning = true);
              }
              return { data: { session: b10 }, error: null };
            }
            let { data: e10, error: f10 } = await this._callRefreshToken(b10.refresh_token);
            if (f10) return this._returnResult({ data: { session: null }, error: f10 });
            return this._returnResult({ data: { session: e10 }, error: null });
          } finally {
            this._debug("#__loadSession()", "end");
          }
        }
        async getUser(a10) {
          if (a10) return await this._getUser(a10);
          await this.initializePromise;
          let b10 = await this._acquireLock(this.lockAcquireTimeout, async () => await this._getUser());
          return b10.data.user && (this.suppressGetSessionWarning = true), b10;
        }
        async _getUser(a10) {
          try {
            if (a10) return await fO(this.fetch, "GET", `${this.url}/user`, { headers: this.headers, jwt: a10, xform: fS });
            return await this._useSession(async (a11) => {
              var b10, c10, d10;
              let { data: e10, error: f10 } = a11;
              if (f10) throw f10;
              return (null == (b10 = e10.session) ? void 0 : b10.access_token) || this.hasCustomAuthorizationHeader ? await fO(this.fetch, "GET", `${this.url}/user`, { headers: this.headers, jwt: null != (d10 = null == (c10 = e10.session) ? void 0 : c10.access_token) ? d10 : void 0, xform: fS }) : { data: { user: null }, error: new e8() };
            });
          } catch (a11) {
            if (e4(a11)) return e9(a11) && (await this._removeSession(), await fx(this.storage, `${this.storageKey}-code-verifier`)), this._returnResult({ data: { user: null }, error: a11 });
            throw a11;
          }
        }
        async updateUser(a10, b10 = {}) {
          return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._updateUser(a10, b10));
        }
        async _updateUser(a10, b10 = {}) {
          try {
            return await this._useSession(async (c10) => {
              let { data: d10, error: e10 } = c10;
              if (e10) throw e10;
              if (!d10.session) throw new e8();
              let f10 = d10.session, g2 = null, h2 = null;
              "pkce" === this.flowType && null != a10.email && ([g2, h2] = await fE(this.storage, this.storageKey));
              let { data: i2, error: j2 } = await fO(this.fetch, "PUT", `${this.url}/user`, { headers: this.headers, redirectTo: null == b10 ? void 0 : b10.emailRedirectTo, body: Object.assign(Object.assign({}, a10), { code_challenge: g2, code_challenge_method: h2 }), jwt: f10.access_token, xform: fS });
              if (j2) throw j2;
              return f10.user = i2.user, await this._saveSession(f10), await this._notifyAllSubscribers("USER_UPDATED", f10), this._returnResult({ data: { user: f10.user }, error: null });
            });
          } catch (a11) {
            if (await fx(this.storage, `${this.storageKey}-code-verifier`), e4(a11)) return this._returnResult({ data: { user: null }, error: a11 });
            throw a11;
          }
        }
        async setSession(a10) {
          return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._setSession(a10));
        }
        async _setSession(a10) {
          try {
            if (!a10.access_token || !a10.refresh_token) throw new e8();
            let b10 = Date.now() / 1e3, c10 = b10, d10 = true, e10 = null, { payload: f10 } = fz(a10.access_token);
            if (f10.exp && (d10 = (c10 = f10.exp) <= b10), d10) {
              let { data: b11, error: c11 } = await this._callRefreshToken(a10.refresh_token);
              if (c11) return this._returnResult({ data: { user: null, session: null }, error: c11 });
              if (!b11) return { data: { user: null, session: null }, error: null };
              e10 = b11;
            } else {
              let { data: d11, error: f11 } = await this._getUser(a10.access_token);
              if (f11) return this._returnResult({ data: { user: null, session: null }, error: f11 });
              e10 = { access_token: a10.access_token, refresh_token: a10.refresh_token, user: d11.user, token_type: "bearer", expires_in: c10 - b10, expires_at: c10 }, await this._saveSession(e10), await this._notifyAllSubscribers("SIGNED_IN", e10);
            }
            return this._returnResult({ data: { user: e10.user, session: e10 }, error: null });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: { session: null, user: null }, error: a11 });
            throw a11;
          }
        }
        async refreshSession(a10) {
          return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._refreshSession(a10));
        }
        async _refreshSession(a10) {
          try {
            return await this._useSession(async (b10) => {
              var c10;
              if (!a10) {
                let { data: d11, error: e11 } = b10;
                if (e11) throw e11;
                a10 = null != (c10 = d11.session) ? c10 : void 0;
              }
              if (!(null == a10 ? void 0 : a10.refresh_token)) throw new e8();
              let { data: d10, error: e10 } = await this._callRefreshToken(a10.refresh_token);
              return e10 ? this._returnResult({ data: { user: null, session: null }, error: e10 }) : d10 ? this._returnResult({ data: { user: d10.user, session: d10 }, error: null }) : this._returnResult({ data: { user: null, session: null }, error: null });
            });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async _getSessionFromURL(a10, b10) {
          var c10;
          try {
            if (!fr()) throw new fc("No browser detected.");
            if (a10.error || a10.error_description || a10.error_code) throw new fc(a10.error_description || "Error in URL with unspecified error_description", { error: a10.error || "unspecified_error", code: a10.error_code || "unspecified_code" });
            switch (b10) {
              case "implicit":
                if ("pkce" === this.flowType) throw new fd("Not a valid PKCE flow url.");
                break;
              case "pkce":
                if ("implicit" === this.flowType) throw new fc("Not a valid implicit grant flow url.");
            }
            if ("pkce" === b10) {
              if (this._debug("#_initialize()", "begin", "is PKCE flow", true), !a10.code) throw new fd("No code detected.");
              let { data: b11, error: d11 } = await this._exchangeCodeForSession(a10.code);
              if (d11) throw d11;
              let e11 = new URL(window.location.href);
              return e11.searchParams.delete("code"), window.history.replaceState(window.history.state, "", e11.toString()), { data: { session: b11.session, redirectType: null != (c10 = b11.redirectType) ? c10 : null }, error: null };
            }
            let { provider_token: d10, provider_refresh_token: e10, access_token: f10, refresh_token: g2, expires_in: h2, expires_at: i2, token_type: j2 } = a10;
            if (!f10 || !h2 || !g2 || !j2) throw new fc("No session defined in URL");
            let k2 = Math.round(Date.now() / 1e3), l2 = parseInt(h2), m2 = k2 + l2;
            i2 && (m2 = parseInt(i2));
            let n2 = m2 - k2;
            1e3 * n2 <= 3e4 && console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${n2}s, should have been closer to ${l2}s`);
            let o2 = m2 - l2;
            k2 - o2 >= 120 ? console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", o2, m2, k2) : k2 - o2 < 0 && console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew", o2, m2, k2);
            let { data: p2, error: q2 } = await this._getUser(f10);
            if (q2) throw q2;
            let r2 = { provider_token: d10, provider_refresh_token: e10, access_token: f10, expires_in: l2, expires_at: m2, refresh_token: g2, token_type: j2, user: p2.user };
            return window.location.hash = "", this._debug("#_getSessionFromURL()", "clearing window.location.hash"), this._returnResult({ data: { session: r2, redirectType: a10.type }, error: null });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: { session: null, redirectType: null }, error: a11 });
            throw a11;
          }
        }
        _isImplicitGrantCallback(a10) {
          return "function" == typeof this.detectSessionInUrl ? this.detectSessionInUrl(new URL(window.location.href), a10) : !!(a10.access_token || a10.error_description);
        }
        async _isPKCECallback(a10) {
          let b10 = await fw(this.storage, `${this.storageKey}-code-verifier`);
          return !!(a10.code && b10);
        }
        async signOut(a10 = { scope: "global" }) {
          return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._signOut(a10));
        }
        async _signOut({ scope: a10 } = { scope: "global" }) {
          return await this._useSession(async (b10) => {
            var c10;
            let { data: d10, error: e10 } = b10;
            if (e10 && !e9(e10)) return this._returnResult({ error: e10 });
            let f10 = null == (c10 = d10.session) ? void 0 : c10.access_token;
            if (f10) {
              let { error: b11 } = await this.admin.signOut(f10, a10);
              if (b11 && !(e4(b11) && "AuthApiError" === b11.name && (404 === b11.status || 401 === b11.status || 403 === b11.status) || e9(b11))) return this._returnResult({ error: b11 });
            }
            return "others" !== a10 && (await this._removeSession(), await fx(this.storage, `${this.storageKey}-code-verifier`)), this._returnResult({ error: null });
          });
        }
        onAuthStateChange(a10) {
          let b10 = /* @__PURE__ */ Symbol("auth-callback"), c10 = { id: b10, callback: a10, unsubscribe: () => {
            this._debug("#unsubscribe()", "state change callback with id removed", b10), this.stateChangeEmitters.delete(b10);
          } };
          return this._debug("#onAuthStateChange()", "registered callback with id", b10), this.stateChangeEmitters.set(b10, c10), (async () => {
            await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => {
              this._emitInitialSession(b10);
            });
          })(), { data: { subscription: c10 } };
        }
        async _emitInitialSession(a10) {
          return await this._useSession(async (b10) => {
            var c10, d10;
            try {
              let { data: { session: d11 }, error: e10 } = b10;
              if (e10) throw e10;
              await (null == (c10 = this.stateChangeEmitters.get(a10)) ? void 0 : c10.callback("INITIAL_SESSION", d11)), this._debug("INITIAL_SESSION", "callback id", a10, "session", d11);
            } catch (b11) {
              await (null == (d10 = this.stateChangeEmitters.get(a10)) ? void 0 : d10.callback("INITIAL_SESSION", null)), this._debug("INITIAL_SESSION", "callback id", a10, "error", b11), e9(b11) ? console.warn(b11) : console.error(b11);
            }
          });
        }
        async resetPasswordForEmail(a10, b10 = {}) {
          let c10 = null, d10 = null;
          "pkce" === this.flowType && ([c10, d10] = await fE(this.storage, this.storageKey, true));
          try {
            return await fO(this.fetch, "POST", `${this.url}/recover`, { body: { email: a10, code_challenge: c10, code_challenge_method: d10, gotrue_meta_security: { captcha_token: b10.captchaToken } }, headers: this.headers, redirectTo: b10.redirectTo });
          } catch (a11) {
            if (await fx(this.storage, `${this.storageKey}-code-verifier`), e4(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async getUserIdentities() {
          var a10;
          try {
            let { data: b10, error: c10 } = await this.getUser();
            if (c10) throw c10;
            return this._returnResult({ data: { identities: null != (a10 = b10.user.identities) ? a10 : [] }, error: null });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async linkIdentity(a10) {
          return "token" in a10 ? this.linkIdentityIdToken(a10) : this.linkIdentityOAuth(a10);
        }
        async linkIdentityOAuth(a10) {
          var b10;
          try {
            let { data: c10, error: d10 } = await this._useSession(async (b11) => {
              var c11, d11, e10, f10, g2;
              let { data: h2, error: i2 } = b11;
              if (i2) throw i2;
              let j2 = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, a10.provider, { redirectTo: null == (c11 = a10.options) ? void 0 : c11.redirectTo, scopes: null == (d11 = a10.options) ? void 0 : d11.scopes, queryParams: null == (e10 = a10.options) ? void 0 : e10.queryParams, skipBrowserRedirect: true });
              return await fO(this.fetch, "GET", j2, { headers: this.headers, jwt: null != (g2 = null == (f10 = h2.session) ? void 0 : f10.access_token) ? g2 : void 0 });
            });
            if (d10) throw d10;
            return !fr() || (null == (b10 = a10.options) ? void 0 : b10.skipBrowserRedirect) || window.location.assign(null == c10 ? void 0 : c10.url), this._returnResult({ data: { provider: a10.provider, url: null == c10 ? void 0 : c10.url }, error: null });
          } catch (b11) {
            if (e4(b11)) return this._returnResult({ data: { provider: a10.provider, url: null }, error: b11 });
            throw b11;
          }
        }
        async linkIdentityIdToken(a10) {
          return await this._useSession(async (b10) => {
            var c10;
            try {
              let { error: d10, data: { session: e10 } } = b10;
              if (d10) throw d10;
              let { options: f10, provider: g2, token: h2, access_token: i2, nonce: j2 } = a10, { data: k2, error: l2 } = await fO(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, { headers: this.headers, jwt: null != (c10 = null == e10 ? void 0 : e10.access_token) ? c10 : void 0, body: { provider: g2, id_token: h2, access_token: i2, nonce: j2, link_identity: true, gotrue_meta_security: { captcha_token: null == f10 ? void 0 : f10.captchaToken } }, xform: fQ });
              if (l2) return this._returnResult({ data: { user: null, session: null }, error: l2 });
              if (!k2 || !k2.session || !k2.user) return this._returnResult({ data: { user: null, session: null }, error: new fa() });
              return k2.session && (await this._saveSession(k2.session), await this._notifyAllSubscribers("USER_UPDATED", k2.session)), this._returnResult({ data: k2, error: l2 });
            } catch (a11) {
              if (await fx(this.storage, `${this.storageKey}-code-verifier`), e4(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
              throw a11;
            }
          });
        }
        async unlinkIdentity(a10) {
          try {
            return await this._useSession(async (b10) => {
              var c10, d10;
              let { data: e10, error: f10 } = b10;
              if (f10) throw f10;
              return await fO(this.fetch, "DELETE", `${this.url}/user/identities/${a10.identity_id}`, { headers: this.headers, jwt: null != (d10 = null == (c10 = e10.session) ? void 0 : c10.access_token) ? d10 : void 0 });
            });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async _refreshAccessToken(a10) {
          let b10 = `#_refreshAccessToken(${a10.substring(0, 5)}...)`;
          this._debug(b10, "begin");
          try {
            var c10, d10;
            let e10 = Date.now();
            return await (c10 = async (c11) => (c11 > 0 && await fA(200 * Math.pow(2, c11 - 1)), this._debug(b10, "refreshing attempt", c11), await fO(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, { body: { refresh_token: a10 }, headers: this.headers, xform: fQ })), d10 = (a11, b11) => {
              let c11 = 200 * Math.pow(2, a11);
              return b11 && fg(b11) && Date.now() + c11 - e10 < 3e4;
            }, new Promise((a11, b11) => {
              (async () => {
                for (let e11 = 0; e11 < 1 / 0; e11++) try {
                  let b12 = await c10(e11);
                  if (!d10(e11, null, b12)) return void a11(b12);
                } catch (a12) {
                  if (!d10(e11, a12)) return void b11(a12);
                }
              })();
            }));
          } catch (a11) {
            if (this._debug(b10, "error", a11), e4(a11)) return this._returnResult({ data: { session: null, user: null }, error: a11 });
            throw a11;
          } finally {
            this._debug(b10, "end");
          }
        }
        _isValidSession(a10) {
          return "object" == typeof a10 && null !== a10 && "access_token" in a10 && "refresh_token" in a10 && "expires_at" in a10;
        }
        async _handleProviderSignIn(a10, b10) {
          let c10 = await this._getUrlForProvider(`${this.url}/authorize`, a10, { redirectTo: b10.redirectTo, scopes: b10.scopes, queryParams: b10.queryParams });
          return this._debug("#_handleProviderSignIn()", "provider", a10, "options", b10, "url", c10), fr() && !b10.skipBrowserRedirect && window.location.assign(c10), { data: { provider: a10, url: c10 }, error: null };
        }
        async _recoverAndRefresh() {
          var a10, b10;
          let c10 = "#_recoverAndRefresh()";
          this._debug(c10, "begin");
          try {
            let d10 = await fw(this.storage, this.storageKey);
            if (d10 && this.userStorage) {
              let b11 = await fw(this.userStorage, this.storageKey + "-user");
              !this.storage.isServer && Object.is(this.storage, this.userStorage) && !b11 && (b11 = { user: d10.user }, await fv(this.userStorage, this.storageKey + "-user", b11)), d10.user = null != (a10 = null == b11 ? void 0 : b11.user) ? a10 : fJ();
            } else if (d10 && !d10.user && !d10.user) {
              let a11 = await fw(this.storage, this.storageKey + "-user");
              a11 && (null == a11 ? void 0 : a11.user) ? (d10.user = a11.user, await fx(this.storage, this.storageKey + "-user"), await fv(this.storage, this.storageKey, d10)) : d10.user = fJ();
            }
            if (this._debug(c10, "session from storage", d10), !this._isValidSession(d10)) {
              this._debug(c10, "session is not valid"), null !== d10 && await this._removeSession();
              return;
            }
            let e10 = (null != (b10 = d10.expires_at) ? b10 : 1 / 0) * 1e3 - Date.now() < 9e4;
            if (this._debug(c10, `session has${e10 ? "" : " not"} expired with margin of 90000s`), e10) {
              if (this.autoRefreshToken && d10.refresh_token) {
                let { error: a11 } = await this._callRefreshToken(d10.refresh_token);
                a11 && (console.error(a11), fg(a11) || (this._debug(c10, "refresh failed with a non-retryable error, removing the session", a11), await this._removeSession()));
              }
            } else if (d10.user && true === d10.user.__isUserNotAvailableProxy) try {
              let { data: a11, error: b11 } = await this._getUser(d10.access_token);
              !b11 && (null == a11 ? void 0 : a11.user) ? (d10.user = a11.user, await this._saveSession(d10), await this._notifyAllSubscribers("SIGNED_IN", d10)) : this._debug(c10, "could not get user data, skipping SIGNED_IN notification");
            } catch (a11) {
              console.error("Error getting user data:", a11), this._debug(c10, "error getting user data, skipping SIGNED_IN notification", a11);
            }
            else await this._notifyAllSubscribers("SIGNED_IN", d10);
          } catch (a11) {
            this._debug(c10, "error", a11), console.error(a11);
            return;
          } finally {
            this._debug(c10, "end");
          }
        }
        async _callRefreshToken(a10) {
          var b10, c10;
          if (!a10) throw new e8();
          if (this.refreshingDeferred) return this.refreshingDeferred.promise;
          let d10 = `#_callRefreshToken(${a10.substring(0, 5)}...)`;
          this._debug(d10, "begin");
          try {
            this.refreshingDeferred = new fy();
            let { data: b11, error: c11 } = await this._refreshAccessToken(a10);
            if (c11) throw c11;
            if (!b11.session) throw new e8();
            await this._saveSession(b11.session), await this._notifyAllSubscribers("TOKEN_REFRESHED", b11.session);
            let d11 = { data: b11.session, error: null };
            return this.refreshingDeferred.resolve(d11), d11;
          } catch (a11) {
            if (this._debug(d10, "error", a11), e4(a11)) {
              let c11 = { data: null, error: a11 };
              return fg(a11) || await this._removeSession(), null == (b10 = this.refreshingDeferred) || b10.resolve(c11), c11;
            }
            throw null == (c10 = this.refreshingDeferred) || c10.reject(a11), a11;
          } finally {
            this.refreshingDeferred = null, this._debug(d10, "end");
          }
        }
        async _notifyAllSubscribers(a10, b10, c10 = true) {
          let d10 = `#_notifyAllSubscribers(${a10})`;
          this._debug(d10, "begin", b10, `broadcast = ${c10}`);
          try {
            this.broadcastChannel && c10 && this.broadcastChannel.postMessage({ event: a10, session: b10 });
            let d11 = [], e10 = Array.from(this.stateChangeEmitters.values()).map(async (c11) => {
              try {
                await c11.callback(a10, b10);
              } catch (a11) {
                d11.push(a11);
              }
            });
            if (await Promise.all(e10), d11.length > 0) {
              for (let a11 = 0; a11 < d11.length; a11 += 1) console.error(d11[a11]);
              throw d11[0];
            }
          } finally {
            this._debug(d10, "end");
          }
        }
        async _saveSession(a10) {
          this._debug("#_saveSession()", a10), this.suppressGetSessionWarning = true, await fx(this.storage, `${this.storageKey}-code-verifier`);
          let b10 = Object.assign({}, a10), c10 = b10.user && true === b10.user.__isUserNotAvailableProxy;
          if (this.userStorage) {
            !c10 && b10.user && await fv(this.userStorage, this.storageKey + "-user", { user: b10.user });
            let a11 = Object.assign({}, b10);
            delete a11.user;
            let d10 = fK(a11);
            await fv(this.storage, this.storageKey, d10);
          } else {
            let a11 = fK(b10);
            await fv(this.storage, this.storageKey, a11);
          }
        }
        async _removeSession() {
          this._debug("#_removeSession()"), this.suppressGetSessionWarning = false, await fx(this.storage, this.storageKey), await fx(this.storage, this.storageKey + "-code-verifier"), await fx(this.storage, this.storageKey + "-user"), this.userStorage && await fx(this.userStorage, this.storageKey + "-user"), await this._notifyAllSubscribers("SIGNED_OUT", null);
        }
        _removeVisibilityChangedCallback() {
          this._debug("#_removeVisibilityChangedCallback()");
          let a10 = this.visibilityChangedCallback;
          this.visibilityChangedCallback = null;
          try {
            a10 && fr() && (null == window ? void 0 : window.removeEventListener) && window.removeEventListener("visibilitychange", a10);
          } catch (a11) {
            console.error("removing visibilitychange callback failed", a11);
          }
        }
        async _startAutoRefresh() {
          await this._stopAutoRefresh(), this._debug("#_startAutoRefresh()");
          let a10 = setInterval(() => this._autoRefreshTokenTick(), 3e4);
          this.autoRefreshTicker = a10, a10 && "object" == typeof a10 && "function" == typeof a10.unref ? a10.unref() : "u" > typeof Deno && "function" == typeof Deno.unrefTimer && Deno.unrefTimer(a10);
          let b10 = setTimeout(async () => {
            await this.initializePromise, await this._autoRefreshTokenTick();
          }, 0);
          this.autoRefreshTickTimeout = b10, b10 && "object" == typeof b10 && "function" == typeof b10.unref ? b10.unref() : "u" > typeof Deno && "function" == typeof Deno.unrefTimer && Deno.unrefTimer(b10);
        }
        async _stopAutoRefresh() {
          this._debug("#_stopAutoRefresh()");
          let a10 = this.autoRefreshTicker;
          this.autoRefreshTicker = null, a10 && clearInterval(a10);
          let b10 = this.autoRefreshTickTimeout;
          this.autoRefreshTickTimeout = null, b10 && clearTimeout(b10);
        }
        async startAutoRefresh() {
          this._removeVisibilityChangedCallback(), await this._startAutoRefresh();
        }
        async stopAutoRefresh() {
          this._removeVisibilityChangedCallback(), await this._stopAutoRefresh();
        }
        async _autoRefreshTokenTick() {
          this._debug("#_autoRefreshTokenTick()", "begin");
          try {
            await this._acquireLock(0, async () => {
              try {
                let a10 = Date.now();
                try {
                  return await this._useSession(async (b10) => {
                    let { data: { session: c10 } } = b10;
                    if (!c10 || !c10.refresh_token || !c10.expires_at) return void this._debug("#_autoRefreshTokenTick()", "no session");
                    let d10 = Math.floor((1e3 * c10.expires_at - a10) / 3e4);
                    this._debug("#_autoRefreshTokenTick()", `access token expires in ${d10} ticks, a tick lasts 30000ms, refresh threshold is 3 ticks`), d10 <= 3 && await this._callRefreshToken(c10.refresh_token);
                  });
                } catch (a11) {
                  console.error("Auto refresh tick failed with error. This is likely a transient error.", a11);
                }
              } finally {
                this._debug("#_autoRefreshTokenTick()", "end");
              }
            });
          } catch (a10) {
            if (a10 instanceof f$) this._debug("auto refresh token tick lock not available");
            else throw a10;
          }
        }
        async _handleVisibilityChange() {
          if (this._debug("#_handleVisibilityChange()"), !fr() || !(null == window ? void 0 : window.addEventListener)) return this.autoRefreshToken && this.startAutoRefresh(), false;
          try {
            this.visibilityChangedCallback = async () => {
              try {
                await this._onVisibilityChanged(false);
              } catch (a10) {
                this._debug("#visibilityChangedCallback", "error", a10);
              }
            }, null == window || window.addEventListener("visibilitychange", this.visibilityChangedCallback), await this._onVisibilityChanged(true);
          } catch (a10) {
            console.error("_handleVisibilityChange", a10);
          }
        }
        async _onVisibilityChanged(a10) {
          let b10 = `#_onVisibilityChanged(${a10})`;
          this._debug(b10, "visibilityState", document.visibilityState), "visible" === document.visibilityState ? (this.autoRefreshToken && this._startAutoRefresh(), a10 || (await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => {
            "visible" !== document.visibilityState ? this._debug(b10, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting") : await this._recoverAndRefresh();
          }))) : "hidden" === document.visibilityState && this.autoRefreshToken && this._stopAutoRefresh();
        }
        async _getUrlForProvider(a10, b10, c10) {
          let d10 = [`provider=${encodeURIComponent(b10)}`];
          if ((null == c10 ? void 0 : c10.redirectTo) && d10.push(`redirect_to=${encodeURIComponent(c10.redirectTo)}`), (null == c10 ? void 0 : c10.scopes) && d10.push(`scopes=${encodeURIComponent(c10.scopes)}`), "pkce" === this.flowType) {
            let [a11, b11] = await fE(this.storage, this.storageKey), c11 = new URLSearchParams({ code_challenge: `${encodeURIComponent(a11)}`, code_challenge_method: `${encodeURIComponent(b11)}` });
            d10.push(c11.toString());
          }
          if (null == c10 ? void 0 : c10.queryParams) {
            let a11 = new URLSearchParams(c10.queryParams);
            d10.push(a11.toString());
          }
          return (null == c10 ? void 0 : c10.skipBrowserRedirect) && d10.push(`skip_http_redirect=${c10.skipBrowserRedirect}`), `${a10}?${d10.join("&")}`;
        }
        async _unenroll(a10) {
          try {
            return await this._useSession(async (b10) => {
              var c10;
              let { data: d10, error: e10 } = b10;
              return e10 ? this._returnResult({ data: null, error: e10 }) : await fO(this.fetch, "DELETE", `${this.url}/factors/${a10.factorId}`, { headers: this.headers, jwt: null == (c10 = null == d10 ? void 0 : d10.session) ? void 0 : c10.access_token });
            });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async _enroll(a10) {
          try {
            return await this._useSession(async (b10) => {
              var c10, d10;
              let { data: e10, error: f10 } = b10;
              if (f10) return this._returnResult({ data: null, error: f10 });
              let g2 = Object.assign({ friendly_name: a10.friendlyName, factor_type: a10.factorType }, "phone" === a10.factorType ? { phone: a10.phone } : "totp" === a10.factorType ? { issuer: a10.issuer } : {}), { data: h2, error: i2 } = await fO(this.fetch, "POST", `${this.url}/factors`, { body: g2, headers: this.headers, jwt: null == (c10 = null == e10 ? void 0 : e10.session) ? void 0 : c10.access_token });
              return i2 ? this._returnResult({ data: null, error: i2 }) : ("totp" === a10.factorType && "totp" === h2.type && (null == (d10 = null == h2 ? void 0 : h2.totp) ? void 0 : d10.qr_code) && (h2.totp.qr_code = `data:image/svg+xml;utf-8,${h2.totp.qr_code}`), this._returnResult({ data: h2, error: null }));
            });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async _verify(a10) {
          return this._acquireLock(this.lockAcquireTimeout, async () => {
            try {
              return await this._useSession(async (b10) => {
                var c10;
                let { data: d10, error: e10 } = b10;
                if (e10) return this._returnResult({ data: null, error: e10 });
                let f10 = Object.assign({ challenge_id: a10.challengeId }, "webauthn" in a10 ? { webauthn: Object.assign(Object.assign({}, a10.webauthn), { credential_response: "create" === a10.webauthn.type ? f8(a10.webauthn.credential_response) : f9(a10.webauthn.credential_response) }) } : { code: a10.code }), { data: g2, error: h2 } = await fO(this.fetch, "POST", `${this.url}/factors/${a10.factorId}/verify`, { body: f10, headers: this.headers, jwt: null == (c10 = null == d10 ? void 0 : d10.session) ? void 0 : c10.access_token });
                return h2 ? this._returnResult({ data: null, error: h2 }) : (await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + g2.expires_in }, g2)), await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", g2), this._returnResult({ data: g2, error: h2 }));
              });
            } catch (a11) {
              if (e4(a11)) return this._returnResult({ data: null, error: a11 });
              throw a11;
            }
          });
        }
        async _challenge(a10) {
          return this._acquireLock(this.lockAcquireTimeout, async () => {
            try {
              return await this._useSession(async (b10) => {
                var c10;
                let { data: d10, error: e10 } = b10;
                if (e10) return this._returnResult({ data: null, error: e10 });
                let f10 = await fO(this.fetch, "POST", `${this.url}/factors/${a10.factorId}/challenge`, { body: a10, headers: this.headers, jwt: null == (c10 = null == d10 ? void 0 : d10.session) ? void 0 : c10.access_token });
                if (f10.error) return f10;
                let { data: g2 } = f10;
                if ("webauthn" !== g2.type) return { data: g2, error: null };
                switch (g2.webauthn.type) {
                  case "create":
                    return { data: Object.assign(Object.assign({}, g2), { webauthn: Object.assign(Object.assign({}, g2.webauthn), { credential_options: Object.assign(Object.assign({}, g2.webauthn.credential_options), { publicKey: f6(g2.webauthn.credential_options.publicKey) }) }) }), error: null };
                  case "request":
                    return { data: Object.assign(Object.assign({}, g2), { webauthn: Object.assign(Object.assign({}, g2.webauthn), { credential_options: Object.assign(Object.assign({}, g2.webauthn.credential_options), { publicKey: f7(g2.webauthn.credential_options.publicKey) }) }) }), error: null };
                }
              });
            } catch (a11) {
              if (e4(a11)) return this._returnResult({ data: null, error: a11 });
              throw a11;
            }
          });
        }
        async _challengeAndVerify(a10) {
          let { data: b10, error: c10 } = await this._challenge({ factorId: a10.factorId });
          return c10 ? this._returnResult({ data: null, error: c10 }) : await this._verify({ factorId: a10.factorId, challengeId: b10.id, code: a10.code });
        }
        async _listFactors() {
          var a10;
          let { data: { user: b10 }, error: c10 } = await this.getUser();
          if (c10) return { data: null, error: c10 };
          let d10 = { all: [], phone: [], totp: [], webauthn: [] };
          for (let c11 of null != (a10 = null == b10 ? void 0 : b10.factors) ? a10 : []) d10.all.push(c11), "verified" === c11.status && d10[c11.factor_type].push(c11);
          return { data: d10, error: null };
        }
        async _getAuthenticatorAssuranceLevel(a10) {
          var b10, c10, d10, e10;
          if (a10) try {
            let { payload: d11 } = fz(a10), e11 = null;
            d11.aal && (e11 = d11.aal);
            let f11 = e11, { data: { user: g3 }, error: h3 } = await this.getUser(a10);
            if (h3) return this._returnResult({ data: null, error: h3 });
            (null != (c10 = null == (b10 = null == g3 ? void 0 : g3.factors) ? void 0 : b10.filter((a11) => "verified" === a11.status)) ? c10 : []).length > 0 && (f11 = "aal2");
            let i3 = d11.amr || [];
            return { data: { currentLevel: e11, nextLevel: f11, currentAuthenticationMethods: i3 }, error: null };
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
          let { data: { session: f10 }, error: g2 } = await this.getSession();
          if (g2) return this._returnResult({ data: null, error: g2 });
          if (!f10) return { data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] }, error: null };
          let { payload: h2 } = fz(f10.access_token), i2 = null;
          h2.aal && (i2 = h2.aal);
          let j2 = i2;
          return (null != (e10 = null == (d10 = f10.user.factors) ? void 0 : d10.filter((a11) => "verified" === a11.status)) ? e10 : []).length > 0 && (j2 = "aal2"), { data: { currentLevel: i2, nextLevel: j2, currentAuthenticationMethods: h2.amr || [] }, error: null };
        }
        async _getAuthorizationDetails(a10) {
          try {
            return await this._useSession(async (b10) => {
              let { data: { session: c10 }, error: d10 } = b10;
              return d10 ? this._returnResult({ data: null, error: d10 }) : c10 ? await fO(this.fetch, "GET", `${this.url}/oauth/authorizations/${a10}`, { headers: this.headers, jwt: c10.access_token, xform: (a11) => ({ data: a11, error: null }) }) : this._returnResult({ data: null, error: new e8() });
            });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async _approveAuthorization(a10, b10) {
          try {
            return await this._useSession(async (c10) => {
              let { data: { session: d10 }, error: e10 } = c10;
              if (e10) return this._returnResult({ data: null, error: e10 });
              if (!d10) return this._returnResult({ data: null, error: new e8() });
              let f10 = await fO(this.fetch, "POST", `${this.url}/oauth/authorizations/${a10}/consent`, { headers: this.headers, jwt: d10.access_token, body: { action: "approve" }, xform: (a11) => ({ data: a11, error: null }) });
              return f10.data && f10.data.redirect_url && fr() && !(null == b10 ? void 0 : b10.skipBrowserRedirect) && window.location.assign(f10.data.redirect_url), f10;
            });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async _denyAuthorization(a10, b10) {
          try {
            return await this._useSession(async (c10) => {
              let { data: { session: d10 }, error: e10 } = c10;
              if (e10) return this._returnResult({ data: null, error: e10 });
              if (!d10) return this._returnResult({ data: null, error: new e8() });
              let f10 = await fO(this.fetch, "POST", `${this.url}/oauth/authorizations/${a10}/consent`, { headers: this.headers, jwt: d10.access_token, body: { action: "deny" }, xform: (a11) => ({ data: a11, error: null }) });
              return f10.data && f10.data.redirect_url && fr() && !(null == b10 ? void 0 : b10.skipBrowserRedirect) && window.location.assign(f10.data.redirect_url), f10;
            });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async _listOAuthGrants() {
          try {
            return await this._useSession(async (a10) => {
              let { data: { session: b10 }, error: c10 } = a10;
              return c10 ? this._returnResult({ data: null, error: c10 }) : b10 ? await fO(this.fetch, "GET", `${this.url}/user/oauth/grants`, { headers: this.headers, jwt: b10.access_token, xform: (a11) => ({ data: a11, error: null }) }) : this._returnResult({ data: null, error: new e8() });
            });
          } catch (a10) {
            if (e4(a10)) return this._returnResult({ data: null, error: a10 });
            throw a10;
          }
        }
        async _revokeOAuthGrant(a10) {
          try {
            return await this._useSession(async (b10) => {
              let { data: { session: c10 }, error: d10 } = b10;
              return d10 ? this._returnResult({ data: null, error: d10 }) : c10 ? (await fO(this.fetch, "DELETE", `${this.url}/user/oauth/grants`, { headers: this.headers, jwt: c10.access_token, query: { client_id: a10.clientId }, noResolveJson: true }), { data: {}, error: null }) : this._returnResult({ data: null, error: new e8() });
            });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async fetchJwk(a10, b10 = { keys: [] }) {
          let c10 = b10.keys.find((b11) => b11.kid === a10);
          if (c10) return c10;
          let d10 = Date.now();
          if ((c10 = this.jwks.keys.find((b11) => b11.kid === a10)) && this.jwks_cached_at + 6e5 > d10) return c10;
          let { data: e10, error: f10 } = await fO(this.fetch, "GET", `${this.url}/.well-known/jwks.json`, { headers: this.headers });
          if (f10) throw f10;
          return e10.keys && 0 !== e10.keys.length && (this.jwks = e10, this.jwks_cached_at = d10, c10 = e10.keys.find((b11) => b11.kid === a10)) ? c10 : null;
        }
        async getClaims(a10, b10 = {}) {
          try {
            var c10;
            let d10, e10 = a10;
            if (!e10) {
              let { data: a11, error: b11 } = await this.getSession();
              if (b11 || !a11.session) return this._returnResult({ data: null, error: b11 });
              e10 = a11.session.access_token;
            }
            let { header: f10, payload: g2, signature: h2, raw: { header: i2, payload: j2 } } = fz(e10);
            (null == b10 ? void 0 : b10.allowExpired) || (function(a11) {
              if (!a11) throw Error("Missing exp claim");
              if (a11 <= Math.floor(Date.now() / 1e3)) throw Error("JWT has expired");
            })(g2.exp);
            let k2 = !f10.alg || f10.alg.startsWith("HS") || !f10.kid || !("crypto" in globalThis && "subtle" in globalThis.crypto) ? null : await this.fetchJwk(f10.kid, (null == b10 ? void 0 : b10.keys) ? { keys: b10.keys } : null == b10 ? void 0 : b10.jwks);
            if (!k2) {
              let { error: a11 } = await this.getUser(e10);
              if (a11) throw a11;
              return { data: { claims: g2, header: f10, signature: h2 }, error: null };
            }
            let l2 = (function(a11) {
              switch (a11) {
                case "RS256":
                  return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
                case "ES256":
                  return { name: "ECDSA", namedCurve: "P-256", hash: { name: "SHA-256" } };
                default:
                  throw Error("Invalid alg claim");
              }
            })(f10.alg), m2 = await crypto.subtle.importKey("jwk", k2, l2, true, ["verify"]);
            if (!await crypto.subtle.verify(l2, m2, h2, (c10 = `${i2}.${j2}`, d10 = [], !(function(a11, b11) {
              for (let c11 = 0; c11 < a11.length; c11 += 1) {
                let d11 = a11.charCodeAt(c11);
                if (d11 > 55295 && d11 <= 56319) {
                  let b12 = (d11 - 55296) * 1024 & 65535;
                  d11 = (a11.charCodeAt(c11 + 1) - 56320 & 65535 | b12) + 65536, c11 += 1;
                }
                !(function(a12, b12) {
                  if (a12 <= 127) return b12(a12);
                  if (a12 <= 2047) {
                    b12(192 | a12 >> 6), b12(128 | 63 & a12);
                    return;
                  }
                  if (a12 <= 65535) {
                    b12(224 | a12 >> 12), b12(128 | a12 >> 6 & 63), b12(128 | 63 & a12);
                    return;
                  }
                  if (a12 <= 1114111) {
                    b12(240 | a12 >> 18), b12(128 | a12 >> 12 & 63), b12(128 | a12 >> 6 & 63), b12(128 | 63 & a12);
                    return;
                  }
                  throw Error(`Unrecognized Unicode codepoint: ${a12.toString(16)}`);
                })(d11, b11);
              }
            })(c10, (a11) => d10.push(a11)), new Uint8Array(d10)))) throw new fi("Invalid JWT signature");
            return { data: { claims: g2, header: f10, signature: h2 }, error: null };
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async signInWithPasskey(a10) {
          var b10, c10, d10;
          fI(this.experimental);
          try {
            if (!gb()) return this._returnResult({ data: null, error: new e6("Browser does not support WebAuthn", null) });
            let { data: e10, error: f10 } = await this._startPasskeyAuthentication({ options: { captchaToken: null == (b10 = null == a10 ? void 0 : a10.options) ? void 0 : b10.captchaToken } });
            if (f10 || !e10) return this._returnResult({ data: null, error: f10 });
            let g2 = f7(e10.options), h2 = null != (d10 = null == (c10 = null == a10 ? void 0 : a10.options) ? void 0 : c10.signal) ? d10 : f5.createNewAbortSignal(), { data: i2, error: j2 } = await gd({ publicKey: g2, signal: h2 });
            if (j2 || !i2) return this._returnResult({ data: null, error: null != j2 ? j2 : new e6("WebAuthn ceremony failed", null) });
            let k2 = f9(i2);
            return this._verifyPasskeyAuthentication({ challengeId: e10.challenge_id, credential: k2 });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async registerPasskey(a10) {
          var b10, c10;
          fI(this.experimental);
          try {
            if (!gb()) return this._returnResult({ data: null, error: new e6("Browser does not support WebAuthn", null) });
            let { data: d10, error: e10 } = await this._startPasskeyRegistration();
            if (e10 || !d10) return this._returnResult({ data: null, error: e10 });
            let f10 = f6(d10.options), g2 = null != (c10 = null == (b10 = null == a10 ? void 0 : a10.options) ? void 0 : b10.signal) ? c10 : f5.createNewAbortSignal(), { data: h2, error: i2 } = await gc({ publicKey: f10, signal: g2 });
            if (i2 || !h2) return this._returnResult({ data: null, error: null != i2 ? i2 : new e6("WebAuthn ceremony failed", null) });
            let j2 = f8(h2);
            return this._verifyPasskeyRegistration({ challengeId: d10.challenge_id, credential: j2 });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async _startPasskeyRegistration() {
          fI(this.experimental);
          try {
            return await this._useSession(async (a10) => {
              let { data: { session: b10 }, error: c10 } = a10;
              if (c10) return this._returnResult({ data: null, error: c10 });
              if (!b10) return this._returnResult({ data: null, error: new e8() });
              let { data: d10, error: e10 } = await fO(this.fetch, "POST", `${this.url}/passkeys/registration/options`, { headers: this.headers, jwt: b10.access_token, body: {} });
              return e10 ? this._returnResult({ data: null, error: e10 }) : this._returnResult({ data: d10, error: null });
            });
          } catch (a10) {
            if (e4(a10)) return this._returnResult({ data: null, error: a10 });
            throw a10;
          }
        }
        async _verifyPasskeyRegistration(a10) {
          fI(this.experimental);
          try {
            return await this._useSession(async (b10) => {
              let { data: { session: c10 }, error: d10 } = b10;
              if (d10) return this._returnResult({ data: null, error: d10 });
              if (!c10) return this._returnResult({ data: null, error: new e8() });
              let { data: e10, error: f10 } = await fO(this.fetch, "POST", `${this.url}/passkeys/registration/verify`, { headers: this.headers, jwt: c10.access_token, body: { challenge_id: a10.challengeId, credential: a10.credential } });
              return f10 ? this._returnResult({ data: null, error: f10 }) : this._returnResult({ data: e10, error: null });
            });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async _startPasskeyAuthentication(a10) {
          var b10;
          fI(this.experimental);
          try {
            let { data: c10, error: d10 } = await fO(this.fetch, "POST", `${this.url}/passkeys/authentication/options`, { headers: this.headers, body: { gotrue_meta_security: { captcha_token: null == (b10 = null == a10 ? void 0 : a10.options) ? void 0 : b10.captchaToken } } });
            if (d10) return this._returnResult({ data: null, error: d10 });
            return this._returnResult({ data: c10, error: null });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async _verifyPasskeyAuthentication(a10) {
          fI(this.experimental);
          try {
            let { data: b10, error: c10 } = await fO(this.fetch, "POST", `${this.url}/passkeys/authentication/verify`, { headers: this.headers, body: { challenge_id: a10.challengeId, credential: a10.credential }, xform: fQ });
            if (c10) return this._returnResult({ data: null, error: c10 });
            return b10.session && (await this._saveSession(b10.session), await this._notifyAllSubscribers("SIGNED_IN", b10.session)), this._returnResult({ data: b10, error: null });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async _listPasskeys() {
          fI(this.experimental);
          try {
            return await this._useSession(async (a10) => {
              let { data: { session: b10 }, error: c10 } = a10;
              if (c10) return this._returnResult({ data: null, error: c10 });
              if (!b10) return this._returnResult({ data: null, error: new e8() });
              let { data: d10, error: e10 } = await fO(this.fetch, "GET", `${this.url}/passkeys`, { headers: this.headers, jwt: b10.access_token, xform: (a11) => ({ data: a11, error: null }) });
              return e10 ? this._returnResult({ data: null, error: e10 }) : this._returnResult({ data: d10, error: null });
            });
          } catch (a10) {
            if (e4(a10)) return this._returnResult({ data: null, error: a10 });
            throw a10;
          }
        }
        async _updatePasskey(a10) {
          fI(this.experimental);
          try {
            return await this._useSession(async (b10) => {
              let { data: { session: c10 }, error: d10 } = b10;
              if (d10) return this._returnResult({ data: null, error: d10 });
              if (!c10) return this._returnResult({ data: null, error: new e8() });
              let { data: e10, error: f10 } = await fO(this.fetch, "PATCH", `${this.url}/passkeys/${a10.passkeyId}`, { headers: this.headers, jwt: c10.access_token, body: { friendly_name: a10.friendlyName } });
              return f10 ? this._returnResult({ data: null, error: f10 }) : this._returnResult({ data: e10, error: null });
            });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async _deletePasskey(a10) {
          fI(this.experimental);
          try {
            return await this._useSession(async (b10) => {
              let { data: { session: c10 }, error: d10 } = b10;
              if (d10) return this._returnResult({ data: null, error: d10 });
              if (!c10) return this._returnResult({ data: null, error: new e8() });
              let { error: e10 } = await fO(this.fetch, "DELETE", `${this.url}/passkeys/${a10.passkeyId}`, { headers: this.headers, jwt: c10.access_token, noResolveJson: true });
              return e10 ? this._returnResult({ data: null, error: e10 }) : this._returnResult({ data: null, error: null });
            });
          } catch (a11) {
            if (e4(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
      }
      gl.nextInstanceID = {};
      let gm = gl, gn = "";
      gn = "u" > typeof Deno ? "deno" : "u" > typeof document ? "web" : "u" > typeof navigator && "ReactNative" === navigator.product ? "react-native" : "node";
      let go = { headers: { "X-Client-Info": `supabase-js-${gn}/2.106.1` } }, gp = { schema: "public" }, gq = { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, flowType: "implicit" }, gr = {}, gs = { enabled: false, respectSamplingDecision: true }, gt = null;
      function gu(a10) {
        return (gu = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(a11) {
          return typeof a11;
        } : function(a11) {
          return a11 && "function" == typeof Symbol && a11.constructor === Symbol && a11 !== Symbol.prototype ? "symbol" : typeof a11;
        })(a10);
      }
      function gv(a10, b10) {
        var c10 = Object.keys(a10);
        if (Object.getOwnPropertySymbols) {
          var d10 = Object.getOwnPropertySymbols(a10);
          b10 && (d10 = d10.filter(function(b11) {
            return Object.getOwnPropertyDescriptor(a10, b11).enumerable;
          })), c10.push.apply(c10, d10);
        }
        return c10;
      }
      function gw(a10) {
        for (var b10 = 1; b10 < arguments.length; b10++) {
          var c10 = null != arguments[b10] ? arguments[b10] : {};
          b10 % 2 ? gv(Object(c10), true).forEach(function(b11) {
            !(function(a11, b12, c11) {
              var d10;
              (d10 = (function(a12, b13) {
                if ("object" != gu(a12) || !a12) return a12;
                var c12 = a12[Symbol.toPrimitive];
                if (void 0 !== c12) {
                  var d11 = c12.call(a12, b13);
                  if ("object" != gu(d11)) return d11;
                  throw TypeError("@@toPrimitive must return a primitive value.");
                }
                return ("string" === b13 ? String : Number)(a12);
              })(b12, "string"), (b12 = "symbol" == gu(d10) ? d10 : d10 + "") in a11) ? Object.defineProperty(a11, b12, { value: c11, enumerable: true, configurable: true, writable: true }) : a11[b12] = c11;
            })(a10, b11, c10[b11]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(a10, Object.getOwnPropertyDescriptors(c10)) : gv(Object(c10)).forEach(function(b11) {
            Object.defineProperty(a10, b11, Object.getOwnPropertyDescriptor(c10, b11));
          });
        }
        return a10;
      }
      async function gx(a10, b10, c10) {
        if (!(function(a11, b11) {
          let c11;
          if (!a11 || !b11 || 0 === b11.length) return false;
          if (a11 instanceof URL) c11 = a11;
          else try {
            c11 = new URL(a11);
          } catch (a12) {
            return false;
          }
          for (let a12 of b11) try {
            if ("string" == typeof a12) {
              if ((function(a13, b12) {
                if (b12 === a13) return true;
                if (b12.startsWith("*.")) {
                  let c12 = b12.slice(2);
                  if (a13.endsWith(c12) && (a13 === c12 || a13.endsWith("." + c12))) return true;
                }
                return false;
              })(c11.hostname, a12)) return true;
            } else if (a12 instanceof RegExp) {
              if (a12.test(c11.hostname)) return true;
            } else if ("function" == typeof a12 && a12(c11)) return true;
          } catch (a13) {
            continue;
          }
          return false;
        })("string" == typeof a10 || a10 instanceof URL ? a10 : a10.url, b10)) return null;
        let d10 = await (function() {
          var a11, b11, c11, d11;
          return a11 = this, b11 = void 0, c11 = void 0, d11 = function* () {
            try {
              let a12 = yield (null === gt && (gt = Promise.resolve().then(() => (init_esm(), esm_exports)).catch(() => null)), gt);
              if (!a12 || !a12.propagation || !a12.context) return null;
              let b12 = {};
              a12.propagation.inject(a12.context.active(), b12);
              let c12 = b12.traceparent;
              if (!c12) return null;
              return { traceparent: c12, tracestate: b12.tracestate, baggage: b12.baggage };
            } catch (a12) {
              return null;
            }
          }, new (c11 || (c11 = Promise))(function(e10, f10) {
            function g2(a12) {
              try {
                i2(d11.next(a12));
              } catch (a13) {
                f10(a13);
              }
            }
            function h2(a12) {
              try {
                i2(d11.throw(a12));
              } catch (a13) {
                f10(a13);
              }
            }
            function i2(a12) {
              var b12;
              a12.done ? e10(a12.value) : ((b12 = a12.value) instanceof c11 ? b12 : new c11(function(a13) {
                a13(b12);
              })).then(g2, h2);
            }
            i2((d11 = d11.apply(a11, b11 || [])).next());
          });
        })();
        if (!d10 || !d10.traceparent) return null;
        if (c10) {
          let a11 = (function(a12) {
            if (!a12 || "string" != typeof a12) return null;
            let b11 = a12.split("-");
            if (4 !== b11.length) return null;
            let [c11, d11, e10, f10] = b11;
            if (2 !== c11.length || 32 !== d11.length || 16 !== e10.length || 2 !== f10.length) return null;
            let g2 = /^[0-9a-f]+$/i;
            return g2.test(c11) && g2.test(d11) && g2.test(e10) && g2.test(f10) && "00000000000000000000000000000000" !== d11 && "0000000000000000" !== e10 ? { version: c11, traceId: d11, parentId: e10, traceFlags: f10, isSampled: (1 & parseInt(f10, 16)) == 1 } : null;
          })(d10.traceparent);
          if (a11 && !a11.isSampled) return null;
        }
        return d10;
      }
      function gy(a10) {
        return "boolean" == typeof a10 ? { enabled: a10 } : a10;
      }
      var gz = class extends gm {
        constructor(a10) {
          super(a10);
        }
      }, gA = class {
        constructor(a10, b10, c10) {
          var d10, e10, f10;
          this.supabaseUrl = a10, this.supabaseKey = b10;
          const g2 = (function(a11) {
            let b11 = null == a11 ? void 0 : a11.trim();
            if (!b11) throw Error("supabaseUrl is required.");
            if (!b11.match(/^https?:\/\//i)) throw Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");
            try {
              return new URL(b11.endsWith("/") ? b11 : b11 + "/");
            } catch (a12) {
              throw Error("Invalid supabaseUrl: Provided URL is malformed.");
            }
          })(a10);
          if (!b10) throw Error("supabaseKey is required.");
          this.realtimeUrl = new URL("realtime/v1", g2), this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws"), this.authUrl = new URL("auth/v1", g2), this.storageUrl = new URL("storage/v1", g2), this.functionsUrl = new URL("functions/v1", g2);
          const h2 = `sb-${g2.hostname.split(".")[0]}-auth-token`, i2 = (function(a11, b11) {
            var c11, d11, e11, f11, g3, h3;
            let { db: i3, auth: j2, realtime: k2, global: l2 } = a11, { db: m2, auth: n2, realtime: o2, global: p2 } = b11, q2 = gy(a11.tracePropagation), r2 = gy(b11.tracePropagation), s2 = { db: gw(gw({}, m2), i3), auth: gw(gw({}, n2), j2), realtime: gw(gw({}, o2), k2), storage: {}, global: gw(gw(gw({}, p2), l2), {}, { headers: gw(gw({}, null != (c11 = null == p2 ? void 0 : p2.headers) ? c11 : {}), null != (d11 = null == l2 ? void 0 : l2.headers) ? d11 : {}) }), tracePropagation: { enabled: null != (e11 = null != (f11 = null == q2 ? void 0 : q2.enabled) ? f11 : null == r2 ? void 0 : r2.enabled) && e11, respectSamplingDecision: null == (g3 = null != (h3 = null == q2 ? void 0 : q2.respectSamplingDecision) ? h3 : null == r2 ? void 0 : r2.respectSamplingDecision) || g3 }, accessToken: async () => "" };
            return a11.accessToken ? s2.accessToken = a11.accessToken : delete s2.accessToken, s2;
          })(null != c10 ? c10 : {}, { db: gp, realtime: gr, auth: gw(gw({}, gq), {}, { storageKey: h2 }), global: go, tracePropagation: gs });
          this.settings = i2, this.storageKey = null != (d10 = i2.auth.storageKey) ? d10 : "", this.headers = null != (e10 = i2.global.headers) ? e10 : {}, i2.accessToken ? (this.accessToken = i2.accessToken, this.auth = new Proxy({}, { get: (a11, b11) => {
            throw Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(b11)} is not possible`);
          } })) : this.auth = this._initSupabaseAuthClient(null != (f10 = i2.auth) ? f10 : {}, this.headers, i2.global.fetch), this.fetch = ((a11, b11, c11, d11, e11) => {
            let f11 = d11 ? (...a12) => d11(...a12) : (...a12) => fetch(...a12), g3 = Headers, h3 = (null == e11 ? void 0 : e11.enabled) === true, i3 = (null == e11 ? void 0 : e11.respectSamplingDecision) !== false, j2 = h3 ? (function(a12) {
              let b12 = [];
              try {
                let c12 = new URL(a12);
                b12.push(c12.hostname);
              } catch (a13) {
              }
              return b12.push("*.supabase.co", "*.supabase.in"), b12.push("localhost", "127.0.0.1", "[::1]"), b12;
            })(b11) : null;
            return async (b12, d12) => {
              var e12;
              let h4 = null != (e12 = await c11()) ? e12 : a11, k2 = new g3(null == d12 ? void 0 : d12.headers);
              if (k2.has("apikey") || k2.set("apikey", a11), k2.has("Authorization") || k2.set("Authorization", `Bearer ${h4}`), j2) {
                let a12 = await gx(b12, j2, i3);
                a12 && (a12.traceparent && !k2.has("traceparent") && k2.set("traceparent", a12.traceparent), a12.tracestate && !k2.has("tracestate") && k2.set("tracestate", a12.tracestate), a12.baggage && !k2.has("baggage") && k2.set("baggage", a12.baggage));
              }
              return f11(b12, gw(gw({}, d12), {}, { headers: k2 }));
            };
          })(b10, a10, this._getAccessToken.bind(this), i2.global.fetch, i2.tracePropagation), this.realtime = this._initRealtimeClient(gw({ headers: this.headers, accessToken: this._getAccessToken.bind(this), fetch: this.fetch }, i2.realtime)), this.accessToken && Promise.resolve(this.accessToken()).then((a11) => this.realtime.setAuth(a11)).catch((a11) => console.warn("Failed to set initial Realtime auth token:", a11)), this.rest = new dy(new URL("rest/v1", g2).href, { headers: this.headers, schema: i2.db.schema, fetch: this.fetch, timeout: i2.db.timeout, urlLengthLimit: i2.db.urlLengthLimit }), this.storage = new eZ(this.storageUrl.href, this.headers, this.fetch, null == c10 ? void 0 : c10.storage), i2.accessToken || this._listenForAuthEvents();
        }
        get functions() {
          return new dj(this.functionsUrl.href, { headers: this.headers, customFetch: this.fetch });
        }
        from(a10) {
          return this.rest.from(a10);
        }
        schema(a10) {
          return this.rest.schema(a10);
        }
        rpc(a10, b10 = {}, c10 = { head: false, get: false, count: void 0 }) {
          return this.rest.rpc(a10, b10, c10);
        }
        channel(a10, b10 = { config: {} }) {
          return this.realtime.channel(a10, b10);
        }
        getChannels() {
          return this.realtime.getChannels();
        }
        removeChannel(a10) {
          return this.realtime.removeChannel(a10);
        }
        removeAllChannels() {
          return this.realtime.removeAllChannels();
        }
        async _getAccessToken() {
          var a10, b10;
          if (this.accessToken) return await this.accessToken();
          let { data: c10 } = await this.auth.getSession();
          return null != (a10 = null == (b10 = c10.session) ? void 0 : b10.access_token) ? a10 : this.supabaseKey;
        }
        _initSupabaseAuthClient({ autoRefreshToken: a10, persistSession: b10, detectSessionInUrl: c10, storage: d10, userStorage: e10, storageKey: f10, flowType: g2, lock: h2, debug: i2, throwOnError: j2, experimental: k2, lockAcquireTimeout: l2, skipAutoInitialize: m2 }, n2, o2) {
          let p2 = { Authorization: `Bearer ${this.supabaseKey}`, apikey: `${this.supabaseKey}` };
          return new gz({ url: this.authUrl.href, headers: gw(gw({}, p2), n2), storageKey: f10, autoRefreshToken: a10, persistSession: b10, detectSessionInUrl: c10, storage: d10, userStorage: e10, flowType: g2, lock: h2, debug: i2, throwOnError: j2, experimental: k2, fetch: o2, lockAcquireTimeout: l2, skipAutoInitialize: m2, hasCustomAuthorizationHeader: Object.keys(this.headers).some((a11) => "authorization" === a11.toLowerCase()) });
        }
        _initRealtimeClient(a10) {
          return new ei(this.realtimeUrl.href, gw(gw({}, a10), {}, { params: gw(gw({}, { apikey: this.supabaseKey }), null == a10 ? void 0 : a10.params) }));
        }
        _listenForAuthEvents() {
          return this.auth.onAuthStateChange((a10, b10) => {
            this._handleTokenChanged(a10, "CLIENT", null == b10 ? void 0 : b10.access_token);
          });
        }
        _handleTokenChanged(a10, b10, c10) {
          ("TOKEN_REFRESHED" === a10 || "SIGNED_IN" === a10) && this.changedAccessToken !== c10 ? (this.changedAccessToken = c10, this.realtime.setAuth(c10)) : "SIGNED_OUT" === a10 && (this.realtime.setAuth(), "STORAGE" == b10 && this.auth.signOut(), this.changedAccessToken = void 0);
        }
      };
      (function() {
        if ("u" > typeof window) return false;
        let a10 = globalThis.process;
        if (!a10) return false;
        let b10 = a10.version;
        if (null == b10) return false;
        let c10 = b10.match(/^v(\d+)\./);
        return !!c10 && 18 >= parseInt(c10[1], 10);
      })() && console.warn("⚠️  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217");
      var gB = c(536);
      let gC = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""), gD = " 	\n\r=".split(""), gE = (() => {
        let a10 = Array(128);
        for (let b10 = 0; b10 < a10.length; b10 += 1) a10[b10] = -1;
        for (let b10 = 0; b10 < gD.length; b10 += 1) a10[gD[b10].charCodeAt(0)] = -2;
        for (let b10 = 0; b10 < gC.length; b10 += 1) a10[gC[b10].charCodeAt(0)] = b10;
        return a10;
      })();
      function gF(a10) {
        let b10 = [], c10 = 0, d10 = 0;
        if ((function(a11, b11) {
          for (let c11 = 0; c11 < a11.length; c11 += 1) {
            let d11 = a11.charCodeAt(c11);
            if (d11 > 55295 && d11 <= 56319) {
              let b12 = (d11 - 55296) * 1024 & 65535;
              d11 = (a11.charCodeAt(c11 + 1) - 56320 & 65535 | b12) + 65536, c11 += 1;
            }
            !(function(a12, b12) {
              if (a12 <= 127) return b12(a12);
              if (a12 <= 2047) {
                b12(192 | a12 >> 6), b12(128 | 63 & a12);
                return;
              }
              if (a12 <= 65535) {
                b12(224 | a12 >> 12), b12(128 | a12 >> 6 & 63), b12(128 | 63 & a12);
                return;
              }
              if (a12 <= 1114111) {
                b12(240 | a12 >> 18), b12(128 | a12 >> 12 & 63), b12(128 | a12 >> 6 & 63), b12(128 | 63 & a12);
                return;
              }
              throw Error(`Unrecognized Unicode codepoint: ${a12.toString(16)}`);
            })(d11, b11);
          }
        })(a10, (a11) => {
          for (c10 = c10 << 8 | a11, d10 += 8; d10 >= 6; ) {
            let a12 = c10 >> d10 - 6 & 63;
            b10.push(gC[a12]), d10 -= 6;
          }
        }), d10 > 0) for (c10 <<= 6 - d10, d10 = 6; d10 >= 6; ) {
          let a11 = c10 >> d10 - 6 & 63;
          b10.push(gC[a11]), d10 -= 6;
        }
        return b10.join("");
      }
      function gG() {
        return "u" > typeof window && void 0 !== window.document;
      }
      gB.qg, gB.lK;
      let gH = /^(.*)[.](0|[1-9][0-9]*)$/;
      function gI(a10, b10) {
        if (a10 === b10) return true;
        let c10 = a10.match(gH);
        return !!c10 && c10[1] === b10;
      }
      function gJ(a10, b10, c10) {
        let d10 = 3180, e10 = encodeURIComponent(b10);
        if (e10.length <= d10) return [{ name: a10, value: b10 }];
        let f10 = [];
        for (; e10.length > 0; ) {
          let a11 = e10.slice(0, d10), b11 = a11.lastIndexOf("%");
          b11 > d10 - 3 && (a11 = a11.slice(0, b11));
          let c11 = "";
          for (; a11.length > 0; ) try {
            c11 = decodeURIComponent(a11);
            break;
          } catch (b12) {
            if (b12 instanceof URIError && "%" === a11.at(-3) && a11.length > 3) a11 = a11.slice(0, a11.length - 3);
            else throw b12;
          }
          f10.push(c11), e10 = e10.slice(a11.length);
        }
        return f10.map((b11, c11) => ({ name: `${a10}.${c11}`, value: b11 }));
      }
      async function gK(a10, b10) {
        let c10 = await b10(a10);
        if (c10) return c10;
        let d10 = [];
        for (let c11 = 0; ; c11++) {
          let e10 = `${a10}.${c11}`, f10 = await b10(e10);
          if (!f10) break;
          d10.push(f10);
        }
        return d10.length > 0 ? d10.join("") : null;
      }
      let gL = { path: "/", sameSite: "lax", httpOnly: false, maxAge: 3456e4 }, gM = "base64-";
      function gN(a10) {
        let b10;
        if (!a10.startsWith(gM)) return a10;
        try {
          b10 = (function(a11) {
            let b11 = [], c10 = (a12) => {
              b11.push(String.fromCodePoint(a12));
            }, d10 = { utf8seq: 0, codepoint: 0 }, e10 = 0, f10 = 0;
            for (let b12 = 0; b12 < a11.length; b12 += 1) {
              let g2 = gE[a11.charCodeAt(b12)];
              if (g2 > -1) for (e10 = e10 << 6 | g2, f10 += 6; f10 >= 8; ) (function(a12, b13, c11) {
                if (0 === b13.utf8seq) {
                  if (a12 <= 127) return c11(a12);
                  for (let c12 = 1; c12 < 6; c12 += 1) if ((a12 >> 7 - c12 & 1) == 0) {
                    b13.utf8seq = c12;
                    break;
                  }
                  if (2 === b13.utf8seq) b13.codepoint = 31 & a12;
                  else if (3 === b13.utf8seq) b13.codepoint = 15 & a12;
                  else if (4 === b13.utf8seq) b13.codepoint = 7 & a12;
                  else throw Error("Invalid UTF-8 sequence");
                  b13.utf8seq -= 1;
                } else if (b13.utf8seq > 0) {
                  if (a12 <= 127) throw Error("Invalid UTF-8 sequence");
                  b13.codepoint = b13.codepoint << 6 | 63 & a12, b13.utf8seq -= 1, 0 === b13.utf8seq && c11(b13.codepoint);
                }
              })(e10 >> f10 - 8 & 255, d10, c10), f10 -= 8;
              else if (-2 === g2) continue;
              else throw Error(`Invalid Base64-URL character "${a11.at(b12)}" at position ${b12}`);
            }
            return b11.join("");
          })(a10.substring(gM.length));
        } catch (a11) {
          return console.warn("@supabase/ssr: could not base64url-decode chunked cookie value, treating as absent. Cookie chunks may have been written partially across responses.", a11), null;
        }
        try {
          JSON.parse(b10);
        } catch {
          return console.warn("@supabase/ssr: chunked cookie decoded to invalid JSON, treating as absent. This usually indicates that cookie chunks from different writes were combined (e.g. response committed before all Set-Cookie headers were sent)."), null;
        }
        return b10;
      }
      async function gO({ getAll: a10, setAll: b10, setItems: c10, removedItems: d10 }, e10) {
        let f10 = e10.cookieEncoding, g2 = e10.cookieOptions ?? null, h2 = await a10([...c10 ? Object.keys(c10) : [], ...d10 ? Object.keys(d10) : []]), i2 = h2?.map(({ name: a11 }) => a11) || [], j2 = Object.keys(d10).flatMap((a11) => i2.filter((b11) => gI(b11, a11))), k2 = Object.keys(c10).flatMap((a11) => {
          let b11 = new Set(i2.filter((b12) => gI(b12, a11))), d11 = c10[a11];
          "base64url" === f10 && (d11 = gM + gF(d11));
          let e11 = gJ(a11, d11);
          return e11.forEach((a12) => {
            b11.delete(a12.name);
          }), j2.push(...b11), e11;
        }), l2 = { ...gL, ...g2, maxAge: 0 }, m2 = { ...gL, ...g2, maxAge: gL.maxAge };
        delete l2.name, delete m2.name, await b10([...j2.map((a11) => ({ name: a11, value: "", options: l2 })), ...k2.map(({ name: a11, value: b11 }) => ({ name: a11, value: b11, options: m2 }))], { "Cache-Control": "private, no-cache, no-store, must-revalidate, max-age=0", Expires: "0", Pragma: "no-cache" });
      }
      let gP = false, gQ = ["@supabase/auth-helpers-nextjs", "@supabase/auth-helpers-react", "@supabase/auth-helpers-remix", "@supabase/auth-helpers-sveltekit"], gR = (l = { ...I = { locales: ["en", "hi"], defaultLocale: "en", localePrefix: "always" }, localePrefix: "object" == typeof (K = I.localePrefix) ? K : { mode: K || "always" }, localeCookie: !!((J = I.localeCookie) ?? 1) && { name: "NEXT_LOCALE", sameSite: "lax", ..."object" == typeof J && J }, localeDetection: I.localeDetection ?? true, alternateLinks: I.alternateLinks ?? true }, function(a10) {
        var b10, c10;
        let d10;
        try {
          d10 = decodeURI(a10.nextUrl.pathname);
        } catch {
          return aH.next();
        }
        let e10 = d10.replace(/\\/g, "%5C").replace(/[\t\n\r]/g, "").replace(/\/+/g, "/"), { domain: f10, locale: g2 } = (b10 = a10.headers, c10 = a10.cookies, l.domains ? (function(a11, b11, c11, d11) {
          let e11, f11 = (function(a12, b12) {
            let c12 = cV(a12);
            if (c12) return b12.find((a13) => a13.domain === c12);
          })(b11, a11.domains);
          if (!f11) return { locale: dd(a11, b11, c11, d11) };
          if (d11) {
            let b12 = cT(d11, a11.locales, a11.localePrefix, f11)?.locale;
            if (b12) {
              if (!cW(b12, f11)) return { locale: b12, domain: f11 };
              e11 = b12;
            }
          }
          if (!e11 && a11.localeDetection) {
            let b12 = dc(a11, c11);
            b12 && cW(b12, f11) && (e11 = b12);
          }
          if (!e11 && a11.localeDetection) {
            let a12 = db(b11, f11.locales, f11.defaultLocale);
            a12 && (e11 = a12);
          }
          return e11 || (e11 = f11.defaultLocale), { locale: e11, domain: f11 };
        })(l, b10, c10, e10) : { locale: dd(l, b10, c10, e10) }), h2 = f10 ? f10.defaultLocale === g2 : g2 === l.defaultLocale, i2 = l.domains?.filter((a11) => cW(g2, a11)) || [], j2 = null != l.domains && !f10;
        function k2(b11) {
          var c11;
          let d11 = new URL(b11, a10.url);
          a10.nextUrl.basePath && (c11 = d11.pathname, d11.pathname = cI(a10.nextUrl.basePath + c11));
          let e11 = new Headers(a10.headers);
          return e11.set("X-NEXT-INTL-LOCALE", g2), cI(a10.nextUrl.pathname) !== cI(d11.pathname) ? aH.rewrite(d11, { request: { headers: e11 } }) : aH.next({ request: { headers: e11 } });
        }
        function m2(b11, c11) {
          var d11;
          let e11 = new URL(b11, a10.url);
          if (e11.pathname = cI(e11.pathname), i2.length > 0 && !c11 && f10) {
            let a11 = cX(f10, g2, i2);
            if (a11) {
              c11 = a11.domain;
              let b12 = a11.localePrefix || l.localePrefix.mode;
              a11.defaultLocale === g2 && "as-needed" === b12 && (e11.pathname = cR(e11.pathname, l.locales, l.localePrefix));
            }
          }
          return c11 && (e11.host = c11, a10.headers.get("x-forwarded-host")) && (e11.protocol = a10.headers.get("x-forwarded-proto") ?? a10.nextUrl.protocol, e11.port = c11.split(":")[1] ?? a10.headers.get("x-forwarded-port") ?? ""), a10.nextUrl.basePath && (d11 = e11.pathname, e11.pathname = cI(a10.nextUrl.basePath + d11)), u2 = true, aH.redirect(e11.toString());
        }
        let n2 = cR(e10, l.locales, l.localePrefix), o2 = cT(e10, l.locales, l.localePrefix, f10), p2 = null != o2, q2 = f10?.localePrefix || l.localePrefix.mode, r2 = "never" === q2 || h2 && "as-needed" === q2, s2, t2, u2, v2 = n2, w2 = l.pathnames;
        if (w2) {
          let b11;
          if ([b11, t2] = (function(a11, b12, c11) {
            for (let d11 of Object.keys(a11).sort(cP)) {
              let e11 = a11[d11];
              if ("string" == typeof e11) {
                if (cJ(e11, b12)) return [void 0, d11];
              } else {
                let f11 = Object.entries(e11), g3 = f11.findIndex(([a12]) => a12 === c11);
                for (let [c12] of (g3 > 0 && f11.unshift(f11.splice(g3, 1)[0]), f11)) if (cJ(cH(a11[d11], c12, d11), b12)) return [c12, d11];
              }
            }
            for (let c12 of Object.keys(a11)) if (cJ(c12, b12)) return [void 0, c12];
            return [void 0, void 0];
          })(w2, n2, g2), t2) {
            let c11 = w2[t2], d11 = cH(c11, g2, t2);
            if (cJ(d11, n2)) v2 = cQ(n2, d11, t2);
            else {
              let e11;
              e11 = b11 ? cH(c11, b11, t2) : t2;
              let f11 = r2 ? void 0 : cK(g2, l.localePrefix);
              s2 = m2(cU(cQ(n2, e11, d11), f11, a10.nextUrl.search));
            }
          }
        }
        if (!s2) if ("/" !== v2 || p2) {
          let b11 = cU(v2, `/${g2}`, a10.nextUrl.search);
          if (p2) {
            let c11 = cU(n2, o2.prefix, a10.nextUrl.search);
            if ("never" === q2) s2 = m2(cU(n2, void 0, a10.nextUrl.search));
            else if (o2.exact) if (h2 && r2) s2 = m2(cU(n2, void 0, a10.nextUrl.search));
            else if (l.domains) {
              let a11 = cX(f10, o2.locale, i2);
              s2 = f10?.domain === a11?.domain || j2 ? k2(b11) : m2(c11, a11?.domain);
            } else s2 = k2(b11);
            else s2 = m2(c11);
          } else s2 = r2 ? k2(b11) : m2(cU(n2, cK(g2, l.localePrefix), a10.nextUrl.search));
        } else s2 = r2 ? k2(cU(v2, `/${g2}`, a10.nextUrl.search)) : m2(cU(n2, cK(g2, l.localePrefix), a10.nextUrl.search));
        return (function(a11, b11, c11, d11, e11) {
          if (!d11.localeCookie) return;
          let { name: f11, ...g3 } = d11.localeCookie, h3 = a11.cookies.has(f11);
          h3 && a11.cookies.get(f11)?.value !== c11 ? b11.cookies.set(f11, c11, { path: a11.nextUrl.basePath || void 0, ...g3 }) : h3 || db(a11.headers, e11?.locales || d11.locales, d11.defaultLocale) === c11 || b11.cookies.set(f11, c11, { path: a11.nextUrl.basePath || void 0, ...g3 });
        })(a10, s2, g2, l, f10), !u2 && "never" !== q2 && l.alternateLinks && l.locales.length > 1 && s2.headers.set("Link", (function({ internalTemplateName: a11, localizedPathnames: b11, request: c11, resolvedLocale: d11, routing: e11 }) {
          let f11 = c11.nextUrl.clone(), g3 = cV(c11.headers);
          function h3(a12, b12) {
            var d12;
            return a12.pathname = cI(a12.pathname), c11.nextUrl.basePath && ((a12 = new URL(a12)).pathname = (d12 = a12.pathname, cI(c11.nextUrl.basePath + d12))), `<${a12.toString()}>; rel="alternate"; hreflang="${b12}"`;
          }
          function i3(c12, e12) {
            return b11 && "object" == typeof b11 ? cQ(c12, b11[d11] ?? a11, b11[e12] ?? a11) : c12;
          }
          g3 && (f11.port = "", f11.host = g3), f11.protocol = c11.headers.get("x-forwarded-proto") ?? f11.protocol, f11.pathname = cR(f11.pathname, e11.locales, e11.localePrefix);
          let j3 = cS(e11.locales, e11.localePrefix, false).flatMap(([a12, c12]) => {
            let d12;
            function g4(a13) {
              return "/" === a13 ? c12 : c12 + a13;
            }
            if (e11.domains) return e11.domains.filter((b12) => cW(a12, b12)).map((b12) => {
              (d12 = new URL(f11)).port = "", d12.host = b12.domain, d12.pathname = i3(f11.pathname, a12);
              let c13 = b12.localePrefix || e11.localePrefix.mode;
              return a12 === b12.defaultLocale && "always" !== c13 || (d12.pathname = g4(d12.pathname)), h3(d12, a12);
            });
            {
              let c13;
              c13 = b11 && "object" == typeof b11 ? i3(f11.pathname, a12) : f11.pathname, a12 === e11.defaultLocale && "always" !== e11.localePrefix.mode || (c13 = g4(c13)), d12 = new URL(c13, f11);
            }
            return h3(d12, a12);
          });
          if (!e11.domains || 0 === e11.domains.length) {
            let a12 = i3(f11.pathname, e11.defaultLocale);
            if (a12) {
              let b12 = new URL(a12, f11);
              j3.push(h3(b12, "x-default"));
            }
          }
          return j3.join(", ");
        })({ routing: l, internalTemplateName: t2, localizedPathnames: null != t2 && w2 ? w2[t2] : void 0, request: a10, resolvedLocale: g2 })), s2;
      });
      async function gS(a10) {
        let b10 = gR(a10), c10 = "https://gwzjfqgvunyvvwygzkxp.supabase.co", d10 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3empmcWd2dW55dnZ3eWd6a3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MzQ1ODgsImV4cCI6MjA5NTAxMDU4OH0.Uz4rDCzhpW2fhoujfRH2zsIQf5rsSvZ3YvlaSq4klEY";
        {
          let e10 = (function(a11, b11, c11) {
            if (!(function() {
              if (gP || "u" < typeof process || !process.env?.npm_package_name) return;
              let a12 = process.env.npm_package_name;
              gQ.includes(a12) && (gP = true, console.warn(`
╔════════════════════════════════════════════════════════════════════════════╗
║ ⚠️  IMPORTANT: Package Consolidation Notice                                ║
║                                                                            ║
║ The ${a12.padEnd(35)} package name is deprecated.  ║
║                                                                            ║
║ You are now using @supabase/ssr - a unified solution for all frameworks.  ║
║                                                                            ║
║ The auth-helpers packages have been consolidated into @supabase/ssr       ║
║ to provide better maintenance and consistent APIs across frameworks.      ║
║                                                                            ║
║ Please update your package.json to use @supabase/ssr directly:            ║
║   npm uninstall ${a12.padEnd(42)} ║
║   npm install @supabase/ssr                                               ║
║                                                                            ║
║ For more information, visit:                                              ║
║ https://supabase.com/docs/guides/auth/server-side                         ║
╚════════════════════════════════════════════════════════════════════════════╝
    `));
            })(), !b11) ;
            let { storage: d11, getAll: e11, setAll: f10, setItems: g2, removedItems: h2 } = (function(a12, b12) {
              let c12, d12, e12 = a12.cookies ?? null, f11 = a12.cookieEncoding, g3 = {}, h3 = {};
              if (e12) if ("get" in e12) {
                let a13 = async (a14) => {
                  let b13 = a14.flatMap((a15) => [a15, ...Array.from({ length: 5 }).map((b14, c14) => `${a15}.${c14}`)]), c13 = [];
                  for (let a15 = 0; a15 < b13.length; a15 += 1) {
                    let d13 = await e12.get(b13[a15]);
                    (d13 || "string" == typeof d13) && c13.push({ name: b13[a15], value: d13 });
                  }
                  return c13;
                };
                if (c12 = async (b13) => await a13(b13), "set" in e12 && "remove" in e12) d12 = async (a14) => {
                  for (let b13 = 0; b13 < a14.length; b13 += 1) {
                    let { name: c13, value: d13, options: f12 } = a14[b13];
                    d13 ? await e12.set(c13, d13, f12) : await e12.remove(c13, f12);
                  }
                };
                else d12 = async () => {
                  console.warn("@supabase/ssr: createServerClient was configured without set and remove cookie methods, but the client needs to set cookies. This can lead to issues such as random logouts, early session termination or increased token refresh requests. If in NextJS, check your middleware.ts file, route handlers and server actions for correctness. Consider switching to the getAll and setAll cookie methods instead of get, set and remove which are deprecated and can be difficult to use correctly.");
                };
              } else if ("getAll" in e12) if (c12 = async () => await e12.getAll(), "setAll" in e12) d12 = e12.setAll;
              else d12 = async () => {
                console.warn("@supabase/ssr: createServerClient was configured without the setAll cookie method, but the client needs to set cookies. This can lead to issues such as random logouts, early session termination or increased token refresh requests. If in NextJS, check your middleware.ts file, route handlers and server actions for correctness.");
              };
              else throw Error(`@supabase/ssr: ${"createServerClient"} requires configuring getAll and setAll cookie methods (deprecated: alternatively use get, set and remove).${gG() ? " As this is called in a browser runtime, consider removing the cookies option object to use the document.cookie API automatically." : ""}`);
              else throw Error("@supabase/ssr: createServerClient must be initialized with cookie options that specify getAll and setAll functions (deprecated, not recommended: alternatively use get, set and remove)");
              return { getAll: c12, setAll: d12, setItems: g3, removedItems: h3, storage: { isServer: true, getItem: async (a13) => {
                if ("string" == typeof g3[a13]) return g3[a13];
                if (h3[a13]) return null;
                let b13 = await c12([a13]), d13 = await gK(a13, async (a14) => {
                  let c13 = b13?.find(({ name: b14 }) => b14 === a14) || null;
                  return c13 ? c13.value : null;
                });
                return d13 ? "string" != typeof d13 ? d13 : gN(d13) : null;
              }, setItem: async (b13, e13) => {
                b13.endsWith("-code-verifier") && await gO({ getAll: c12, setAll: d12, setItems: { [b13]: e13 }, removedItems: {} }, { cookieOptions: a12?.cookieOptions ?? null, cookieEncoding: f11 }), g3[b13] = e13, delete h3[b13];
              }, removeItem: async (a13) => {
                delete g3[a13], h3[a13] = true;
              } } };
            })({ ...c11, cookieEncoding: c11?.cookieEncoding ?? "base64url" }), i2 = new gA(a11, b11, { ...c11, global: { ...c11?.global, headers: { ...c11?.global?.headers, "X-Client-Info": "supabase-ssr/0.10.3 createServerClient" } }, auth: { ...c11?.cookieOptions?.name ? { storageKey: c11.cookieOptions.name } : null, ...c11?.auth, flowType: "pkce", autoRefreshToken: false, detectSessionInUrl: false, persistSession: true, skipAutoInitialize: true, storage: d11, ...c11?.cookies && "encode" in c11.cookies && "tokens-only" === c11.cookies.encode ? { userStorage: c11?.auth?.userStorage ?? /* @__PURE__ */ (function(a12 = {}) {
              return { getItem: (b12) => a12[b12] || null, setItem: (b12, c12) => {
                a12[b12] = c12;
              }, removeItem: (b12) => {
                delete a12[b12];
              } };
            })() } : null } });
            return i2.auth.onAuthStateChange(async (a12) => {
              (Object.keys(g2).length > 0 || Object.keys(h2).length > 0) && ("SIGNED_IN" === a12 || "TOKEN_REFRESHED" === a12 || "USER_UPDATED" === a12 || "PASSWORD_RECOVERY" === a12 || "SIGNED_OUT" === a12 || "MFA_CHALLENGE_VERIFIED" === a12) && await gO({ getAll: e11, setAll: f10, setItems: g2, removedItems: h2 }, { cookieOptions: c11?.cookieOptions ?? null, cookieEncoding: c11?.cookieEncoding ?? "base64url" });
            }), i2;
          })(c10, d10, { cookies: { getAll: () => a10.cookies.getAll(), setAll(c11) {
            c11.forEach(({ name: b11, value: c12 }) => a10.cookies.set(b11, c12)), b10 = gR(a10), c11.forEach(({ name: a11, value: c12, options: d11 }) => b10.cookies.set(a11, c12, d11));
          } } });
          if (a10.nextUrl.pathname.match(/^\/(en|hi)\/dashboard/)) {
            let { data: { user: b11 } } = await e10.auth.getUser();
            if (!b11) {
              let b12 = a10.nextUrl.pathname.split("/")[1] || "en";
              return aH.redirect(new URL(`/${b12}/login`, a10.url));
            }
          }
        }
        return b10;
      }
      let gT = { matcher: ["/", "/(hi|en)/:path*"] };
      let gU = { ...S }, gV = "/src/middleware", gW = gU.middleware || gU.default;
      class gX extends Error {
        constructor(a10) {
          super(a10), this.stack = "";
        }
      }
      if ("function" != typeof gW) throw new gX(`The Middleware file "${gV}" must export a function named \`middleware\` or a default function.`);
      let gY = (a10) => b1({ ...a10, IncrementalCache: cF, incrementalCacheHandler: null, page: gV, handler: async (...a11) => {
        try {
          return await gW(...a11);
        } catch (e10) {
          let b10 = a11[0], c10 = new URL(b10.url), d10 = c10.pathname + c10.search;
          throw await W(e10, { path: d10, method: b10.method, headers: Object.fromEntries(b10.headers.entries()) }, { routerKind: "Pages Router", routePath: "/proxy", routeType: "proxy", revalidateReason: void 0 }), e10;
        }
      } });
      async function gZ(a10, b10) {
        let c10 = await gY({ request: { url: a10.url, method: a10.method, headers: ai(a10.headers), nextConfig: { basePath: "", i18n: "", trailingSlash: false, experimental: { cacheLife: { default: { stale: 300, revalidate: 900, expire: 4294967294 }, seconds: { stale: 30, revalidate: 1, expire: 60 }, minutes: { stale: 300, revalidate: 60, expire: 3600 }, hours: { stale: 300, revalidate: 3600, expire: 86400 }, days: { stale: 300, revalidate: 86400, expire: 604800 }, weeks: { stale: 300, revalidate: 604800, expire: 2592e3 }, max: { stale: 300, revalidate: 2592e3, expire: 31536e3 } }, authInterrupts: false, clientParamParsingOrigins: [] } }, page: { name: gV }, body: "GET" !== a10.method && "HEAD" !== a10.method ? a10.body ?? void 0 : void 0, waitUntil: b10.waitUntil, requestMeta: b10.requestMeta, signal: b10.signal || new AbortController().signal } });
        return null == b10.waitUntil || b10.waitUntil.call(b10, c10.waitUntil), c10.response;
      }
      let g$ = gY;
    }, 987: (a, b, c) => {
      Object.defineProperty(b, "__esModule", { value: true });
      var d = { interceptTestApis: function() {
        return h;
      }, wrapRequestHandler: function() {
        return i;
      } };
      for (var e in d) Object.defineProperty(b, e, { enumerable: true, get: d[e] });
      let f = c(643), g = c(318);
      function h() {
        return (0, g.interceptFetch)(c.g.fetch);
      }
      function i(a2) {
        return (b2, c2) => (0, f.withRequest)(b2, g.reader, () => a2(b2, c2));
      }
    }, 990: (a, b, c) => {
      var d, e = { 226: function(e2, f2) {
        !(function(g2) {
          var h = "function", i = "undefined", j = "object", k = "string", l = "major", m = "model", n = "name", o = "type", p = "vendor", q = "version", r = "architecture", s = "console", t = "mobile", u = "tablet", v = "smarttv", w = "wearable", x = "embedded", y = "Amazon", z = "Apple", A = "ASUS", B = "BlackBerry", C = "Browser", D = "Chrome", E = "Firefox", F = "Google", G = "Huawei", H = "Microsoft", I = "Motorola", J = "Opera", K = "Samsung", L = "Sharp", M = "Sony", N = "Xiaomi", O = "Zebra", P = "Facebook", Q = "Chromium OS", R = "Mac OS", S = function(a2, b2) {
            var c2 = {};
            for (var d2 in a2) b2[d2] && b2[d2].length % 2 == 0 ? c2[d2] = b2[d2].concat(a2[d2]) : c2[d2] = a2[d2];
            return c2;
          }, T = function(a2) {
            for (var b2 = {}, c2 = 0; c2 < a2.length; c2++) b2[a2[c2].toUpperCase()] = a2[c2];
            return b2;
          }, U = function(a2, b2) {
            return typeof a2 === k && -1 !== V(b2).indexOf(V(a2));
          }, V = function(a2) {
            return a2.toLowerCase();
          }, W = function(a2, b2) {
            if (typeof a2 === k) return a2 = a2.replace(/^\s\s*/, ""), typeof b2 === i ? a2 : a2.substring(0, 350);
          }, X = function(a2, b2) {
            for (var c2, d2, e3, f3, g3, i2, k2 = 0; k2 < b2.length && !g3; ) {
              var l2 = b2[k2], m2 = b2[k2 + 1];
              for (c2 = d2 = 0; c2 < l2.length && !g3 && l2[c2]; ) if (g3 = l2[c2++].exec(a2)) for (e3 = 0; e3 < m2.length; e3++) i2 = g3[++d2], typeof (f3 = m2[e3]) === j && f3.length > 0 ? 2 === f3.length ? typeof f3[1] == h ? this[f3[0]] = f3[1].call(this, i2) : this[f3[0]] = f3[1] : 3 === f3.length ? typeof f3[1] !== h || f3[1].exec && f3[1].test ? this[f3[0]] = i2 ? i2.replace(f3[1], f3[2]) : void 0 : this[f3[0]] = i2 ? f3[1].call(this, i2, f3[2]) : void 0 : 4 === f3.length && (this[f3[0]] = i2 ? f3[3].call(this, i2.replace(f3[1], f3[2])) : void 0) : this[f3] = i2 || void 0;
              k2 += 2;
            }
          }, Y = function(a2, b2) {
            for (var c2 in b2) if (typeof b2[c2] === j && b2[c2].length > 0) {
              for (var d2 = 0; d2 < b2[c2].length; d2++) if (U(b2[c2][d2], a2)) return "?" === c2 ? void 0 : c2;
            } else if (U(b2[c2], a2)) return "?" === c2 ? void 0 : c2;
            return a2;
          }, Z = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, $ = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [q, [n, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [q, [n, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [n, q], [/opios[\/ ]+([\w\.]+)/i], [q, [n, J + " Mini"]], [/\bopr\/([\w\.]+)/i], [q, [n, J]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [n, q], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [q, [n, "UC" + C]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [q, [n, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [q, [n, "WeChat"]], [/konqueror\/([\w\.]+)/i], [q, [n, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [q, [n, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [q, [n, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[n, /(.+)/, "$1 Secure " + C], q], [/\bfocus\/([\w\.]+)/i], [q, [n, E + " Focus"]], [/\bopt\/([\w\.]+)/i], [q, [n, J + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [q, [n, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [q, [n, "Dolphin"]], [/coast\/([\w\.]+)/i], [q, [n, J + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [q, [n, "MIUI " + C]], [/fxios\/([-\w\.]+)/i], [q, [n, E]], [/\bqihu|(qi?ho?o?|360)browser/i], [[n, "360 " + C]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[n, /(.+)/, "$1 " + C], q], [/(comodo_dragon)\/([\w\.]+)/i], [[n, /_/g, " "], q], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [n, q], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [n], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[n, P], q], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [n, q], [/\bgsa\/([\w\.]+) .*safari\//i], [q, [n, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [q, [n, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [q, [n, D + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[n, D + " WebView"], q], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [q, [n, "Android " + C]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [n, q], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [q, [n, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [q, n], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [n, [q, Y, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [n, q], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[n, "Netscape"], q], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [q, [n, E + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [n, q], [/(cobalt)\/([\w\.]+)/i], [n, [q, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[r, "amd64"]], [/(ia32(?=;))/i], [[r, V]], [/((?:i[346]|x)86)[;\)]/i], [[r, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[r, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[r, "armhf"]], [/windows (ce|mobile); ppc;/i], [[r, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[r, /ower/, "", V]], [/(sun4\w)[;\)]/i], [[r, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[r, V]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [m, [p, K], [o, u]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [m, [p, K], [o, t]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [m, [p, z], [o, t]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [m, [p, z], [o, u]], [/(macintosh);/i], [m, [p, z]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [m, [p, L], [o, t]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [m, [p, G], [o, u]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [m, [p, G], [o, t]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[m, /_/g, " "], [p, N], [o, t]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[m, /_/g, " "], [p, N], [o, u]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [m, [p, "OPPO"], [o, t]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [m, [p, "Vivo"], [o, t]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [m, [p, "Realme"], [o, t]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [m, [p, I], [o, t]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [m, [p, I], [o, u]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [m, [p, "LG"], [o, u]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [m, [p, "LG"], [o, t]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [m, [p, "Lenovo"], [o, u]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[m, /_/g, " "], [p, "Nokia"], [o, t]], [/(pixel c)\b/i], [m, [p, F], [o, u]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [m, [p, F], [o, t]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [m, [p, M], [o, t]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[m, "Xperia Tablet"], [p, M], [o, u]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [m, [p, "OnePlus"], [o, t]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [m, [p, y], [o, u]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[m, /(.+)/g, "Fire Phone $1"], [p, y], [o, t]], [/(playbook);[-\w\),; ]+(rim)/i], [m, p, [o, u]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [m, [p, B], [o, t]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [m, [p, A], [o, u]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [m, [p, A], [o, t]], [/(nexus 9)/i], [m, [p, "HTC"], [o, u]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [p, [m, /_/g, " "], [o, t]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [m, [p, "Acer"], [o, u]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [m, [p, "Meizu"], [o, t]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [p, m, [o, t]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [p, m, [o, u]], [/(surface duo)/i], [m, [p, H], [o, u]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [m, [p, "Fairphone"], [o, t]], [/(u304aa)/i], [m, [p, "AT&T"], [o, t]], [/\bsie-(\w*)/i], [m, [p, "Siemens"], [o, t]], [/\b(rct\w+) b/i], [m, [p, "RCA"], [o, u]], [/\b(venue[\d ]{2,7}) b/i], [m, [p, "Dell"], [o, u]], [/\b(q(?:mv|ta)\w+) b/i], [m, [p, "Verizon"], [o, u]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [m, [p, "Barnes & Noble"], [o, u]], [/\b(tm\d{3}\w+) b/i], [m, [p, "NuVision"], [o, u]], [/\b(k88) b/i], [m, [p, "ZTE"], [o, u]], [/\b(nx\d{3}j) b/i], [m, [p, "ZTE"], [o, t]], [/\b(gen\d{3}) b.+49h/i], [m, [p, "Swiss"], [o, t]], [/\b(zur\d{3}) b/i], [m, [p, "Swiss"], [o, u]], [/\b((zeki)?tb.*\b) b/i], [m, [p, "Zeki"], [o, u]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[p, "Dragon Touch"], m, [o, u]], [/\b(ns-?\w{0,9}) b/i], [m, [p, "Insignia"], [o, u]], [/\b((nxa|next)-?\w{0,9}) b/i], [m, [p, "NextBook"], [o, u]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[p, "Voice"], m, [o, t]], [/\b(lvtel\-)?(v1[12]) b/i], [[p, "LvTel"], m, [o, t]], [/\b(ph-1) /i], [m, [p, "Essential"], [o, t]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [m, [p, "Envizen"], [o, u]], [/\b(trio[-\w\. ]+) b/i], [m, [p, "MachSpeed"], [o, u]], [/\btu_(1491) b/i], [m, [p, "Rotor"], [o, u]], [/(shield[\w ]+) b/i], [m, [p, "Nvidia"], [o, u]], [/(sprint) (\w+)/i], [p, m, [o, t]], [/(kin\.[onetw]{3})/i], [[m, /\./g, " "], [p, H], [o, t]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [m, [p, O], [o, u]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [m, [p, O], [o, t]], [/smart-tv.+(samsung)/i], [p, [o, v]], [/hbbtv.+maple;(\d+)/i], [[m, /^/, "SmartTV"], [p, K], [o, v]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[p, "LG"], [o, v]], [/(apple) ?tv/i], [p, [m, z + " TV"], [o, v]], [/crkey/i], [[m, D + "cast"], [p, F], [o, v]], [/droid.+aft(\w)( bui|\))/i], [m, [p, y], [o, v]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [m, [p, L], [o, v]], [/(bravia[\w ]+)( bui|\))/i], [m, [p, M], [o, v]], [/(mitv-\w{5}) bui/i], [m, [p, N], [o, v]], [/Hbbtv.*(technisat) (.*);/i], [p, m, [o, v]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[p, W], [m, W], [o, v]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[o, v]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [p, m, [o, s]], [/droid.+; (shield) bui/i], [m, [p, "Nvidia"], [o, s]], [/(playstation [345portablevi]+)/i], [m, [p, M], [o, s]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [m, [p, H], [o, s]], [/((pebble))app/i], [p, m, [o, w]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [m, [p, z], [o, w]], [/droid.+; (glass) \d/i], [m, [p, F], [o, w]], [/droid.+; (wt63?0{2,3})\)/i], [m, [p, O], [o, w]], [/(quest( 2| pro)?)/i], [m, [p, P], [o, w]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [p, [o, x]], [/(aeobc)\b/i], [m, [p, y], [o, x]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [m, [o, t]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [m, [o, u]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[o, u]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[o, t]], [/(android[-\w\. ]{0,9});.+buil/i], [m, [p, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [q, [n, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [q, [n, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [n, q], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [q, n]], os: [[/microsoft (windows) (vista|xp)/i], [n, q], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [n, [q, Y, Z]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[n, "Windows"], [q, Y, Z]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[q, /_/g, "."], [n, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[n, R], [q, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [q, n], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [n, q], [/\(bb(10);/i], [q, [n, B]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [q, [n, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [q, [n, E + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [q, [n, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [q, [n, "watchOS"]], [/crkey\/([\d\.]+)/i], [q, [n, D + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[n, Q], q], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [n, q], [/(sunos) ?([\w\.\d]*)/i], [[n, "Solaris"], q], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [n, q]] }, _ = function(a2, b2) {
            if (typeof a2 === j && (b2 = a2, a2 = void 0), !(this instanceof _)) return new _(a2, b2).getResult();
            var c2 = typeof g2 !== i && g2.navigator ? g2.navigator : void 0, d2 = a2 || (c2 && c2.userAgent ? c2.userAgent : ""), e3 = c2 && c2.userAgentData ? c2.userAgentData : void 0, f3 = b2 ? S($, b2) : $, s2 = c2 && c2.userAgent == d2;
            return this.getBrowser = function() {
              var a3, b3 = {};
              return b3[n] = void 0, b3[q] = void 0, X.call(b3, d2, f3.browser), b3[l] = typeof (a3 = b3[q]) === k ? a3.replace(/[^\d\.]/g, "").split(".")[0] : void 0, s2 && c2 && c2.brave && typeof c2.brave.isBrave == h && (b3[n] = "Brave"), b3;
            }, this.getCPU = function() {
              var a3 = {};
              return a3[r] = void 0, X.call(a3, d2, f3.cpu), a3;
            }, this.getDevice = function() {
              var a3 = {};
              return a3[p] = void 0, a3[m] = void 0, a3[o] = void 0, X.call(a3, d2, f3.device), s2 && !a3[o] && e3 && e3.mobile && (a3[o] = t), s2 && "Macintosh" == a3[m] && c2 && typeof c2.standalone !== i && c2.maxTouchPoints && c2.maxTouchPoints > 2 && (a3[m] = "iPad", a3[o] = u), a3;
            }, this.getEngine = function() {
              var a3 = {};
              return a3[n] = void 0, a3[q] = void 0, X.call(a3, d2, f3.engine), a3;
            }, this.getOS = function() {
              var a3 = {};
              return a3[n] = void 0, a3[q] = void 0, X.call(a3, d2, f3.os), s2 && !a3[n] && e3 && "Unknown" != e3.platform && (a3[n] = e3.platform.replace(/chrome os/i, Q).replace(/macos/i, R)), a3;
            }, this.getResult = function() {
              return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
            }, this.getUA = function() {
              return d2;
            }, this.setUA = function(a3) {
              return d2 = typeof a3 === k && a3.length > 350 ? W(a3, 350) : a3, this;
            }, this.setUA(d2), this;
          };
          _.VERSION = "1.0.35", _.BROWSER = T([n, q, l]), _.CPU = T([r]), _.DEVICE = T([m, p, o, s, t, v, u, w, x]), _.ENGINE = _.OS = T([n, q]), typeof f2 !== i ? (e2.exports && (f2 = e2.exports = _), f2.UAParser = _) : c.amdO ? void 0 === (d = function() {
            return _;
          }.call(b, c, b, a)) || (a.exports = d) : typeof g2 !== i && (g2.UAParser = _);
          var aa = typeof g2 !== i && (g2.jQuery || g2.Zepto);
          if (aa && !aa.ua) {
            var ab = new _();
            aa.ua = ab.getResult(), aa.ua.get = function() {
              return ab.getUA();
            }, aa.ua.set = function(a2) {
              ab.setUA(a2);
              var b2 = ab.getResult();
              for (var c2 in b2) aa.ua[c2] = b2[c2];
            };
          }
        })("object" == typeof window ? window : this);
      } }, f = {};
      function g(a2) {
        var b2 = f[a2];
        if (void 0 !== b2) return b2.exports;
        var c2 = f[a2] = { exports: {} }, d2 = true;
        try {
          e[a2].call(c2.exports, c2, c2.exports, g), d2 = false;
        } finally {
          d2 && delete f[a2];
        }
        return c2.exports;
      }
      g.ab = "//", a.exports = g(226);
    } }, (a) => {
      var b = a(a.s = 967);
      (_ENTRIES = "u" < typeof _ENTRIES ? {} : _ENTRIES)["middleware_src/middleware"] = b;
    }]);
  }
});
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  const correspondingRoute = routes.find((route) => route.regex.some((r) => new RegExp(r).test(path3)));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "src/middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/(\\/?index|\\/?index\\.json|\\/?index(?:\\.rsc|\\.segments\\/.+\\.segment\\.rsc)))?[\\/#\\?]?$", "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/(hi|en))(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$"] }];
    require_edge_runtime_webpack();
    require_middleware();
  }
});
init_logger();
var RequestCache = class {
  _caches = /* @__PURE__ */ new Map();
  /**
   * Returns the Map registered under `key`.
   * If no Map exists yet for that key, a new empty Map is created, stored, and returned.
   * Repeated calls with the same key always return the **same** Map instance.
   */
  getOrCreate(key) {
    let cache = this._caches.get(key);
    if (!cache) {
      cache = /* @__PURE__ */ new Map();
      this._caches.set(key, cache);
    }
    return cache;
  }
};
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug$2(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error$2(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = /* @__PURE__ */ Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = /* @__PURE__ */ Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set(),
    requestCache: new RequestCache()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}
init_logger();
init_logger();
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}
async function createGenericHandler(handler3) {
  const config2 = await import("./open-next.config_B21JbPiJ.mjs").then((m) => m.default);
  globalThis.openNextConfig = config2;
  const handlerConfig = config2[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug$2("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}
init_logger();
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug$2({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "typescript": { "ignoreBuildErrors": false }, "typedRoutes": false, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.ts", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": true, "compress": true, "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 14400, "formats": ["image/webp"], "maximumRedirects": 3, "maximumResponseBody": 5e7, "dangerouslyAllowLocalIP": false, "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "attachment", "localPatterns": [{ "pathname": "**", "search": "" }], "remotePatterns": [{ "protocol": "https", "hostname": "*.r2.cloudflarestorage.com" }, { "protocol": "https", "hostname": "*.supabase.co" }], "qualities": [75], "unoptimized": false, "customCacheHandler": false }, "devIndicators": { "position": "bottom-left" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "excludeDefaultMomentLocales": true, "reactProductionProfiling": false, "reactStrictMode": null, "reactMaxHeadersLength": 6e3, "httpAgentOptions": { "keepAlive": true }, "logging": { "serverFunctions": true, "browserToTerminal": "warn" }, "compiler": {}, "expireTime": 31536e3, "staticPageGenerationTimeout": 60, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "outputFileTracingRoot": "C:\\Users\\hudav\\Documents\\GitHub\\webapp", "cacheComponents": false, "cacheLife": { "default": { "stale": 300, "revalidate": 900, "expire": 4294967294 }, "seconds": { "stale": 30, "revalidate": 1, "expire": 60 }, "minutes": { "stale": 300, "revalidate": 60, "expire": 3600 }, "hours": { "stale": 300, "revalidate": 3600, "expire": 86400 }, "days": { "stale": 300, "revalidate": 86400, "expire": 604800 }, "weeks": { "stale": 300, "revalidate": 604800, "expire": 2592e3 }, "max": { "stale": 300, "revalidate": 2592e3, "expire": 31536e3 } }, "cacheHandlers": {}, "experimental": { "appNewScrollHandler": false, "useSkewCookie": false, "cssChunking": true, "multiZoneDraftMode": false, "appNavFailHandling": false, "prerenderEarlyExit": true, "serverMinification": true, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "cachedNavigations": false, "partialFallbacks": false, "dynamicOnHover": false, "varyParams": false, "prefetchInlining": false, "preloadEntriesOnStart": true, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "proxyPrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 3, "memoryBasedWorkersCount": false, "imgOptConcurrency": null, "imgOptTimeoutInSeconds": 7, "imgOptMaxInputPixels": 268402689, "imgOptSequentialRead": null, "imgOptSkipMetadata": null, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "typedEnv": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "authInterrupts": false, "webpackMemoryOptimizations": false, "optimizeServerReact": true, "strictRouteTypes": false, "viewTransition": false, "removeUncaughtErrorAndRejectionListeners": false, "validateRSCRequestHeaders": false, "staleTimes": { "dynamic": 0, "static": 300 }, "reactDebugChannel": true, "serverComponentsHmrCache": true, "staticGenerationMaxConcurrency": 8, "staticGenerationMinPagesPerWorker": 25, "transitionIndicator": false, "gestureTransition": false, "inlineCss": false, "useCache": false, "globalNotFound": false, "browserDebugInfoInTerminal": "warn", "lockDistDir": true, "proxyClientMaxBodySize": 10485760, "hideLogsAfterAbort": false, "mcpServer": true, "turbopackFileSystemCacheForDev": true, "turbopackFileSystemCacheForBuild": false, "turbopackInferModuleSideEffects": true, "turbopackPluginRuntimeStrategy": "childProcesses", "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "effect", "@effect/schema", "@effect/platform", "@effect/platform-node", "@effect/platform-browser", "@effect/platform-bun", "@effect/sql", "@effect/sql-mssql", "@effect/sql-mysql2", "@effect/sql-pg", "@effect/sql-sqlite-node", "@effect/sql-sqlite-bun", "@effect/sql-sqlite-wasm", "@effect/sql-sqlite-react-native", "@effect/rpc", "@effect/rpc-http", "@effect/typeclass", "@effect/experimental", "@effect/opentelemetry", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "htmlLimitedBots": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight", "bundlePagesRouterDependencies": false, "configFileName": "next.config.ts", "turbopack": { "resolveAlias": { "next-intl/config": "./src/i18n/request.ts" }, "root": "C:\\Users\\hudav\\Documents\\GitHub\\webapp" }, "distDirRoot": ".next" };
var BuildId = "LzwEMGWu7DweUytf4jGNp";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "priority": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_global-error", "regex": "^/_global\\-error(?:/)?$", "routeKeys": {}, "namedRegex": "^/_global\\-error(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/brand/social", "regex": "^/brand/social(?:/)?$", "routeKeys": {}, "namedRegex": "^/brand/social(?:/)?$" }, { "page": "/campaign/onboarding", "regex": "^/campaign/onboarding(?:/)?$", "routeKeys": {}, "namedRegex": "^/campaign/onboarding(?:/)?$" }, { "page": "/campaign/volunteer", "regex": "^/campaign/volunteer(?:/)?$", "routeKeys": {}, "namedRegex": "^/campaign/volunteer(?:/)?$" }, { "page": "/education", "regex": "^/education(?:/)?$", "routeKeys": {}, "namedRegex": "^/education(?:/)?$" }, { "page": "/favicon.ico", "regex": "^/favicon\\.ico(?:/)?$", "routeKeys": {}, "namedRegex": "^/favicon\\.ico(?:/)?$" }, { "page": "/grievance", "regex": "^/grievance(?:/)?$", "routeKeys": {}, "namedRegex": "^/grievance(?:/)?$" }, { "page": "/sitemap.xml", "regex": "^/sitemap\\.xml(?:/)?$", "routeKeys": {}, "namedRegex": "^/sitemap\\.xml(?:/)?$" }, { "page": "/terminal", "regex": "^/terminal(?:/)?$", "routeKeys": {}, "namedRegex": "^/terminal(?:/)?$" }, { "page": "/transparency", "regex": "^/transparency(?:/)?$", "routeKeys": {}, "namedRegex": "^/transparency(?:/)?$" }], "dynamic": [{ "page": "/representative/[id]", "regex": "^/representative/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/representative/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/ward/[id]", "regex": "^/ward/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/ward/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/[locale]", "regex": "^/([^/]+?)(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)(?:/)?$" }, { "page": "/[locale]/about", "regex": "^/([^/]+?)/about(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/about(?:/)?$" }, { "page": "/[locale]/admin", "regex": "^/([^/]+?)/admin(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/admin(?:/)?$" }, { "page": "/[locale]/cadre", "regex": "^/([^/]+?)/cadre(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/cadre(?:/)?$" }, { "page": "/[locale]/candidates", "regex": "^/([^/]+?)/candidates(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/candidates(?:/)?$" }, { "page": "/[locale]/constitution", "regex": "^/([^/]+?)/constitution(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/constitution(?:/)?$" }, { "page": "/[locale]/contact", "regex": "^/([^/]+?)/contact(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/contact(?:/)?$" }, { "page": "/[locale]/dashboard", "regex": "^/([^/]+?)/dashboard(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/dashboard(?:/)?$" }, { "page": "/[locale]/donate", "regex": "^/([^/]+?)/donate(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/donate(?:/)?$" }, { "page": "/[locale]/infrastructure", "regex": "^/([^/]+?)/infrastructure(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/infrastructure(?:/)?$" }, { "page": "/[locale]/issues", "regex": "^/([^/]+?)/issues(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/issues(?:/)?$" }, { "page": "/[locale]/join", "regex": "^/([^/]+?)/join(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/join(?:/)?$" }, { "page": "/[locale]/leadership", "regex": "^/([^/]+?)/leadership(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/leadership(?:/)?$" }, { "page": "/[locale]/login", "regex": "^/([^/]+?)/login(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/login(?:/)?$" }, { "page": "/[locale]/manifesto", "regex": "^/([^/]+?)/manifesto(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/manifesto(?:/)?$" }, { "page": "/[locale]/media", "regex": "^/([^/]+?)/media(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/media(?:/)?$" }, { "page": "/[locale]/mission", "regex": "^/([^/]+?)/mission(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/mission(?:/)?$" }, { "page": "/[locale]/privacy", "regex": "^/([^/]+?)/privacy(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/privacy(?:/)?$" }, { "page": "/[locale]/report", "regex": "^/([^/]+?)/report(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/report(?:/)?$" }, { "page": "/[locale]/terms", "regex": "^/([^/]+?)/terms(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/terms(?:/)?$" }, { "page": "/[locale]/transparency", "regex": "^/([^/]+?)/transparency(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/transparency(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [{ "source": "/(.*)", "headers": [{ "key": "X-Content-Type-Options", "value": "nosniff" }, { "key": "X-Frame-Options", "value": "DENY" }, { "key": "X-XSS-Protection", "value": "1; mode=block" }, { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }, { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }], "regex": "^(?:/(.*))(?:/)?$" }];
var PrerenderManifest = { "version": 4, "routes": { "/": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/", "dataRoute": "/index.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/_global-error": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_global-error", "dataRoute": "/_global-error.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/_not-found": { "initialStatus": 404, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_not-found", "dataRoute": "/_not-found.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/brand/social": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/brand/social", "dataRoute": "/brand/social.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/campaign/onboarding": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/campaign/onboarding", "dataRoute": "/campaign/onboarding.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/campaign/volunteer": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/campaign/volunteer", "dataRoute": "/campaign/volunteer.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/education": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/education", "dataRoute": "/education.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/favicon.ico": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "image/x-icon", "x-next-cache-tags": "_N_T_/layout,_N_T_/favicon.ico/layout,_N_T_/favicon.ico/route,_N_T_/favicon.ico" }, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/favicon.ico", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/grievance": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/grievance", "dataRoute": "/grievance.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/sitemap.xml": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "application/xml", "x-next-cache-tags": "_N_T_/layout,_N_T_/sitemap.xml/layout,_N_T_/sitemap.xml/route,_N_T_/sitemap.xml" }, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/sitemap.xml", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/terminal": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/terminal", "dataRoute": "/terminal.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/transparency": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/transparency", "dataRoute": "/transparency.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "b6b47f5ccde79c2e869bc35228e668fa", "previewModeSigningKey": "b1cfbb70a50b783077048612a897a7abda8286da821830873f56a67feb5261f6", "previewModeEncryptionKey": "392791466ece1a78709b102b06948d3f87a601991ff6fa86a21ec4af9e2b3196" } };
var MiddlewareManifest = { "middleware": { "/": { "files": ["server/edge-runtime-webpack.js", "server/src/middleware.js"], "entrypoint": "server/src/middleware.js", "name": "src/middleware", "page": "/", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/(\\/?index|\\/?index\\.json|\\/?index(?:\\.rsc|\\.segments\\/.+\\.segment\\.rsc)))?[\\/#\\?]?$", "originalSource": "/" }, { "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/(hi|en))(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$", "originalSource": "/(hi|en)/:path*" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "LzwEMGWu7DweUytf4jGNp", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "qaptayh476q4s0/DudpXouIy4Y4o3Oai2CNrjsZo4yY=", "__NEXT_PREVIEW_MODE_ID": "b6b47f5ccde79c2e869bc35228e668fa", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "b1cfbb70a50b783077048612a897a7abda8286da821830873f56a67feb5261f6", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "392791466ece1a78709b102b06948d3f87a601991ff6fa86a21ec4af9e2b3196" } } } };
var AppPathRoutesManifest = { "/_not-found/page": "/_not-found", "/_global-error/page": "/_global-error", "/favicon.ico/route": "/favicon.ico", "/sitemap.xml/route": "/sitemap.xml", "/campaign/onboarding/page": "/campaign/onboarding", "/campaign/volunteer/page": "/campaign/volunteer", "/education/page": "/education", "/grievance/page": "/grievance", "/page": "/", "/representative/[id]/page": "/representative/[id]", "/terminal/page": "/terminal", "/transparency/page": "/transparency", "/ward/[id]/page": "/ward/[id]", "/brand/social/page": "/brand/social", "/[locale]/about/page": "/[locale]/about", "/[locale]/cadre/page": "/[locale]/cadre", "/[locale]/candidates/page": "/[locale]/candidates", "/[locale]/constitution/page": "/[locale]/constitution", "/[locale]/contact/page": "/[locale]/contact", "/[locale]/dashboard/page": "/[locale]/dashboard", "/[locale]/donate/page": "/[locale]/donate", "/[locale]/infrastructure/page": "/[locale]/infrastructure", "/[locale]/issues/page": "/[locale]/issues", "/[locale]/join/page": "/[locale]/join", "/[locale]/leadership/page": "/[locale]/leadership", "/[locale]/login/page": "/[locale]/login", "/[locale]/manifesto/page": "/[locale]/manifesto", "/[locale]/media/page": "/[locale]/media", "/[locale]/mission/page": "/[locale]/mission", "/[locale]/page": "/[locale]", "/[locale]/privacy/page": "/[locale]/privacy", "/[locale]/report/page": "/[locale]/report", "/[locale]/terms/page": "/[locale]/terms", "/[locale]/transparency/page": "/[locale]/transparency", "/[locale]/admin/page": "/[locale]/admin" };
var FunctionsConfigManifest = { "functions": {} };
var PagesManifest = { "/404": "pages/404.html", "/500": "pages/500.html" };
process.env.NEXT_BUILD_ID = BuildId;
process.env.OPEN_NEXT_BUILD_ID = NextConfig.deploymentId ?? BuildId;
process.env.NEXT_PREVIEW_MODE_ID = PrerenderManifest?.preview?.previewModeId;
init_logger();
init_util();
init_util();
init_logger();
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType.split(";")[0];
  return commonBinaryMimeTypes.has(value);
}
init_stream();
init_logger();
function parse(raw, preferences, options) {
  const header = raw.replace(/[ \t]/g, "");
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  {
    return values;
  }
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language"
  })[0] || void 0;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  {
    return;
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug$2({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  {
    return internalEvent.rawPath;
  }
}
function handleLocaleRedirect(internalEvent) {
  {
    return false;
  }
}
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (!pattern.test(url))
    return false;
  if (host) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.host !== host;
    } catch {
      return !url.includes(host);
    }
  }
  return true;
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath;
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_µ1_").replaceAll("(..)", "_µ2_").replaceAll("(...)", "_µ3_");
  return isPath ? result : result.replaceAll("+", "_µ4_");
}
function unescapeRegex(str) {
  return str.replaceAll("_µ1_", "(.)").replaceAll("_µ2_", "(..)").replaceAll("_µ3_", "(...)").replaceAll("_µ4_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  return new ReadableStream$1({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function normalizeLocationHeader(location2, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location2)) {
    return location2;
  }
  const locationURL = new URL(location2);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringify(parse$1(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}
init_logger();
init_stream();
init_logger();
function compareSemver(v1, operator, v2) {
  let versionDiff = 0;
  if (v1 === "latest") {
    versionDiff = 1;
  } else {
    if (/^[^\d]/.test(v1)) {
      v1 = v1.substring(1);
    }
    if (/^[^\d]/.test(v2)) {
      v2 = v2.substring(1);
    }
    const [major1, minor1 = 0, patch1 = 0] = v1.split(".").map(Number);
    const [major2, minor2 = 0, patch2 = 0] = v2.split(".").map(Number);
    if (Number.isNaN(major1) || Number.isNaN(major2)) {
      throw new Error("The major version is required.");
    }
    if (major1 !== major2) {
      versionDiff = major1 - major2;
    } else if (minor1 !== minor2) {
      versionDiff = minor1 - minor2;
    } else if (patch1 !== patch2) {
      versionDiff = patch1 - patch2;
    }
  }
  switch (operator) {
    case "=":
      return versionDiff === 0;
    case ">=":
      return versionDiff >= 0;
    case "<=":
      return versionDiff <= 0;
    case ">":
      return versionDiff > 0;
    case "<":
      return versionDiff < 0;
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}
async function isStale(key, tags, lastModified) {
  if (!compareSemver(globalThis.nextVersion, ">=", "16.0.0")) {
    return false;
  }
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.isStale?.(tags, lastModified) ?? false;
  }
  return await globalThis.tagCache.isStale?.(key, lastModified) ?? false;
}
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    const cacheTags = value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
    delete value.meta?.headers?.["x-next-cache-tags"];
    return cacheTags;
  } catch (e) {
    return [];
  }
}
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
var NEXT_SEGMENT_PREFETCH_HEADER = "next-router-segment-prefetch";
var NEXT_PRERENDER_HEADER = "x-nextjs-prerender";
var NEXT_POSTPONED_HEADER = "x-nextjs-postponed";
async function computeCacheControl(path3, body, host, revalidate, lastModified, isStaleFromTagCache = false) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest?.routes ?? {}).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  const isSSG = finalRevalidate === CACHE_ONE_YEAR;
  const remainingTtl = Math.max(finalRevalidate - age, 1);
  const isStaleFromTime = !isSSG && remainingTtl === 1;
  const isStale2 = isStaleFromTime || isStaleFromTagCache;
  if (!isSSG || isStaleFromTagCache) {
    const sMaxAge = isStaleFromTagCache ? 1 : remainingTtl;
    debug$2("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate,
      isStaleFromTagCache
    });
    if (isStale2) {
      let url = path3;
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale2 ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
function getBodyForAppRouter(event, cachedValue) {
  if (cachedValue.type !== "app") {
    throw new Error("getBodyForAppRouter called with non-app cache value");
  }
  try {
    const segmentHeader = `${event.headers[NEXT_SEGMENT_PREFETCH_HEADER]}`;
    const isSegmentResponse = Boolean(segmentHeader) && segmentHeader in (cachedValue.segmentData || {}) && !NextConfig.experimental?.prefetchInlining;
    const body = isSegmentResponse ? cachedValue.segmentData[segmentHeader] : cachedValue.rsc;
    return {
      body,
      additionalHeaders: isSegmentResponse ? { [NEXT_PRERENDER_HEADER]: "1", [NEXT_POSTPONED_HEADER]: "2" } : {}
    };
  } catch (e) {
    error$2("Error while getting body for app router from cache:", e);
    return { body: cachedValue.rsc, additionalHeaders: {} };
  }
}
async function generateResult(event, localizedPath, cachedValue, lastModified, isStaleFromTagCache = false) {
  debug$2("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  let additionalHeaders = {};
  if (cachedValue.type === "app") {
    isDataRequest = event.headers.rsc === "1";
    if (isDataRequest) {
      const { body: appRouterBody, additionalHeaders: appHeaders } = getBodyForAppRouter(event, cachedValue);
      body = appRouterBody;
      additionalHeaders = appHeaders;
    } else {
      body = cachedValue.html;
    }
    type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
  } else if (cachedValue.type === "page") {
    isDataRequest = Boolean(event.query.__nextDataReq);
    body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
    type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
  } else {
    throw new Error("generateResult called with unsupported cache value type, only 'app' and 'page' are supported");
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified, isStaleFromTagCache);
  return {
    type: "core",
    // Sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    // Also set the status code to the rewriteStatusCode if defined
    // This can happen in handleMiddleware in routingHandler.
    // `NextResponse.rewrite(url, { status: xxx})
    // The rewrite status code should take precedence over the cached one
    statusCode: event.rewriteStatusCode ?? cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER,
      ...additionalHeaders
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${"|%(2f|23|3f|5c)"})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => {
    try {
      return escapePathDelimiters(decodeURIComponent(segment), true);
    } catch (e) {
      return segment;
    }
  }).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug$2("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  localizedPath = localizedPath.replace(/\/$/, "");
  localizedPath = decodePathParams(localizedPath);
  debug$2("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest?.routes ?? {}).includes(localizedPath ?? "/") || Object.values(PrerenderManifest?.dynamicRoutes ?? {}).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug$2("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(localizedPath ?? "/index");
      debug$2("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      const tags = getTagsFromValue(cachedData.value);
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const _hasBeenRevalidated = cachedData.shouldBypassTagCache ? false : await hasBeenRevalidated(localizedPath, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const _isStale = cachedData.shouldBypassTagCache ? false : await isStale(localizedPath, tags, cachedData.lastModified ?? Date.now());
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified, _isStale);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified, _isStale);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified, _isStale);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          return {
            type: "core",
            statusCode: event.rewriteStatusCode ?? cachedData.value.meta?.status ?? 200,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers: {
              ...cacheControl,
              ...cachedData.value.meta?.headers,
              vary: VARY_HEADER
            },
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug$2("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re2 = pathToRegexp(str, keys, options);
  return regexpToFunction(re2, keys, options);
}
function regexpToFunction(re2, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re2.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}
init_stream();
init_logger();
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => (route.startsWith("/api/") || route === "/api") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug$2("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug$2(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug$2("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug$2("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug$2("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect();
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath;
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes = {}, routes = {} } = prerenderManifest ?? {};
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  let localizedPath = rawPath;
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest?.preview?.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: rewriteUrl && !isExternalRewrite ? statusCode : void 0
  };
}
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
var NEXT_INTERNAL_HEADERS = [
  "x-middleware-rewrite",
  "x-middleware-redirect",
  "x-middleware-set-cookie",
  "x-middleware-skip",
  "x-middleware-override-headers",
  "x-middleware-next",
  "x-now-route-matches",
  "x-matched-path",
  "x-nextjs-data",
  "x-next-resume-state-length"
];
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      const lowerCaseKey = key.toLowerCase();
      if (lowerCaseKey.startsWith(INTERNAL_HEADER_PREFIX) || lowerCaseKey.startsWith(MIDDLEWARE_HEADER_PREFIX) || NEXT_INTERNAL_HEADERS.includes(lowerCaseKey)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug$2("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    const middlewareHeadersPrioritized = globalThis.openNextConfig.dangerous?.middlewareHeadersOverrideNextConfigHeaders ?? false;
    if (middlewareHeadersPrioritized) {
      headers = {
        ...headers,
        ...middlewareEventOrResult.responseHeaders
      };
    } else {
      headers = {
        ...middlewareEventOrResult.responseHeaders,
        ...headers
      };
    }
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug$2("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug$2("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error$2("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug$2("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error$2("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    if (process.env.OPEN_NEXT_REQUEST_ID_HEADER || globalThis.openNextDebug) {
      result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    }
    debug$2("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
globalThis.openNextDebug = false;
globalThis.openNextVersion = "4.0.2";
globalThis.nextVersion = "16.2.6";
var IgnorableError = class extends Error {
  __openNextInternal = true;
  canIgnore = true;
  logLevel = 0;
  constructor(message) {
    super(message);
    this.name = "IgnorableError";
  }
};
var RecoverableError = class extends Error {
  __openNextInternal = true;
  canIgnore = true;
  logLevel = 1;
  constructor(message) {
    super(message);
    this.name = "RecoverableError";
  }
};
var FatalError = class extends Error {
  __openNextInternal = true;
  canIgnore = false;
  logLevel = 2;
  constructor(message) {
    super(message);
    this.name = "FatalError";
  }
};
function isOpenNextError$1(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
function debug$1(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn$1(...args) {
  console.warn(...args);
}
var DOWNPLAYED_ERROR_LOGS$1 = [
  {
    clientName: "S3Client",
    commandName: "GetObjectCommand",
    errorName: "NoSuchKey"
  }
];
var isDownplayedErrorLog$1 = (errorLog) => DOWNPLAYED_ERROR_LOGS$1.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
function error$1(...args) {
  if (args.some((arg) => isDownplayedErrorLog$1(arg))) {
    return debug$1(...args);
  }
  if (args.some((arg) => isOpenNextError$1(arg))) {
    const error2 = args.find((arg) => isOpenNextError$1(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel$1()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError$1(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn$1(...args.map((arg) => isOpenNextError$1(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel$1() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DEFAULT_MAX_REVALIDATION = 5;
var DEFAULT_REVALIDATION_TIMEOUT_MS = 1e4;
var DEFAULT_RETRY_INTERVAL_MS = 2e3;
var DEFAULT_MAX_RETRIES = 6;
var DOQueueHandler = class extends DurableObject {
  // Ongoing revalidations are deduped by the deduplication id
  // Since this is running in waitUntil, we expect the durable object state to persist this during the duration of the revalidation
  // TODO: handle incremental cache with only eventual consistency (i.e. KV or R2/D1 with the optional cache layer on top)
  ongoingRevalidations = /* @__PURE__ */ new Map();
  sql;
  routeInFailedState = /* @__PURE__ */ new Map();
  service;
  // Configurable params
  maxRevalidations;
  revalidationTimeout;
  revalidationRetryInterval;
  maxRetries;
  disableSQLite;
  constructor(ctx, env2) {
    super(ctx, env2);
    if (!env2.WORKER_SELF_REFERENCE) {
      throw new IgnorableError("No service binding for cache revalidation worker");
    }
    this.service = env2.WORKER_SELF_REFERENCE;
    this.sql = ctx.storage.sql;
    this.maxRevalidations = env2.NEXT_CACHE_DO_QUEUE_MAX_REVALIDATION ? parseInt(env2.NEXT_CACHE_DO_QUEUE_MAX_REVALIDATION) : DEFAULT_MAX_REVALIDATION;
    this.revalidationTimeout = env2.NEXT_CACHE_DO_QUEUE_REVALIDATION_TIMEOUT_MS ? parseInt(env2.NEXT_CACHE_DO_QUEUE_REVALIDATION_TIMEOUT_MS) : DEFAULT_REVALIDATION_TIMEOUT_MS;
    this.revalidationRetryInterval = env2.NEXT_CACHE_DO_QUEUE_RETRY_INTERVAL_MS ? parseInt(env2.NEXT_CACHE_DO_QUEUE_RETRY_INTERVAL_MS) : DEFAULT_RETRY_INTERVAL_MS;
    this.maxRetries = env2.NEXT_CACHE_DO_QUEUE_MAX_RETRIES ? parseInt(env2.NEXT_CACHE_DO_QUEUE_MAX_RETRIES) : DEFAULT_MAX_RETRIES;
    this.disableSQLite = env2.NEXT_CACHE_DO_QUEUE_DISABLE_SQLITE === "true";
    ctx.blockConcurrencyWhile(async () => {
      debug$1(`Restoring the state of the durable object`);
      await this.initState();
    });
    debug$1(`Durable object initialized`);
  }
  async revalidate(msg) {
    if (this.ongoingRevalidations.size > 2 * this.maxRevalidations) {
      warn$1(`Your durable object has 2 times the maximum number of revalidations (${this.maxRevalidations}) in progress. If this happens often, you should consider increasing the NEXT_CACHE_DO_QUEUE_MAX_REVALIDATION or the number of durable objects with the MAX_REVALIDATE_CONCURRENCY env var.`);
    }
    if (this.ongoingRevalidations.has(msg.MessageDeduplicationId))
      return;
    if (this.routeInFailedState.has(msg.MessageDeduplicationId))
      return;
    if (this.checkSyncTable(msg))
      return;
    if (this.ongoingRevalidations.size >= this.maxRevalidations) {
      debug$1(`The maximum number of revalidations (${this.maxRevalidations}) is reached. Blocking until one of the revalidations finishes.`);
      while (this.ongoingRevalidations.size >= this.maxRevalidations) {
        const ongoingRevalidations = this.ongoingRevalidations.values();
        debug$1(`Waiting for one of the revalidations to finish`);
        await Promise.race(ongoingRevalidations);
      }
    }
    const revalidationPromise = this.executeRevalidation(msg);
    this.ongoingRevalidations.set(msg.MessageDeduplicationId, revalidationPromise);
    this.ctx.waitUntil(revalidationPromise);
  }
  async executeRevalidation(msg) {
    let response;
    try {
      debug$1(`Revalidating ${msg.MessageBody.host}${msg.MessageBody.url}`);
      const { MessageBody: { host, url } } = msg;
      const protocol = host.includes("localhost") ? "http" : "https";
      response = await this.service.fetch(`${protocol}://${host}${url}`, {
        method: "HEAD",
        headers: {
          // This is defined during build
          "x-prerender-revalidate": "b6b47f5ccde79c2e869bc35228e668fa",
          "x-isr": "1"
        },
        // This one is kind of problematic, it will always show the wall time of the revalidation to `this.revalidationTimeout`
        signal: AbortSignal.timeout(this.revalidationTimeout)
      });
      if (response.status === 200 && response.headers.get("x-nextjs-cache") !== "REVALIDATED") {
        this.routeInFailedState.delete(msg.MessageDeduplicationId);
        throw new FatalError(`The revalidation for ${host}${url} cannot be done. This error should never happen.`);
      } else if (response.status === 404) {
        this.routeInFailedState.delete(msg.MessageDeduplicationId);
        throw new IgnorableError(`The revalidation for ${host}${url} cannot be done because the page is not found. It's either expected or an error in user code itself`);
      } else if (response.status === 500) {
        await this.addToFailedState(msg);
        throw new IgnorableError(`Something went wrong while revalidating ${host}${url}`);
      } else if (response.status !== 200) {
        await this.addToFailedState(msg);
        throw new RecoverableError(`An unknown error occurred while revalidating ${host}${url}`);
      }
      if (!this.disableSQLite) {
        this.sql.exec(
          "INSERT OR REPLACE INTO sync (id, lastSuccess, buildId) VALUES (?, unixepoch(), ?)",
          // We cannot use the deduplication id because it's not unique per route - every time a route is revalidated, the deduplication id is different.
          `${host}${url}`,
          "LzwEMGWu7DweUytf4jGNp"
        );
      }
      this.routeInFailedState.delete(msg.MessageDeduplicationId);
    } catch (e) {
      if (!isOpenNextError$1(e)) {
        await this.addToFailedState(msg);
      }
      error$1(e);
    } finally {
      this.ongoingRevalidations.delete(msg.MessageDeduplicationId);
      try {
        await response?.body?.cancel();
      } catch {
      }
    }
  }
  async alarm() {
    const currentDateTime = Date.now();
    const nextEventToRetry = Array.from(this.routeInFailedState.values()).filter(({ nextAlarmMs }) => nextAlarmMs > currentDateTime).sort(({ nextAlarmMs: a }, { nextAlarmMs: b }) => a - b)[0];
    const expiredEvents = Array.from(this.routeInFailedState.values()).filter(({ nextAlarmMs }) => nextAlarmMs <= currentDateTime);
    const allEventsToRetry = nextEventToRetry ? [nextEventToRetry, ...expiredEvents] : expiredEvents;
    for (const event of allEventsToRetry) {
      debug$1(`Retrying revalidation for ${event.msg.MessageBody.host}${event.msg.MessageBody.url}`);
      await this.executeRevalidation(event.msg);
    }
  }
  async addToFailedState(msg) {
    debug$1(`Adding ${msg.MessageBody.host}${msg.MessageBody.url} to the failed state`);
    const existingFailedState = this.routeInFailedState.get(msg.MessageDeduplicationId);
    let updatedFailedState;
    if (existingFailedState) {
      if (existingFailedState.retryCount >= this.maxRetries) {
        error$1(`The revalidation for ${msg.MessageBody.host}${msg.MessageBody.url} has failed after ${this.maxRetries} retries. It will not be tried again, but subsequent ISR requests will retry.`);
        this.routeInFailedState.delete(msg.MessageDeduplicationId);
        return;
      }
      const nextAlarmMs = Date.now() + Math.pow(2, existingFailedState.retryCount + 1) * this.revalidationRetryInterval;
      updatedFailedState = {
        ...existingFailedState,
        retryCount: existingFailedState.retryCount + 1,
        nextAlarmMs
      };
    } else {
      updatedFailedState = {
        msg,
        retryCount: 1,
        nextAlarmMs: Date.now() + 2e3
      };
    }
    this.routeInFailedState.set(msg.MessageDeduplicationId, updatedFailedState);
    if (!this.disableSQLite) {
      this.sql.exec("INSERT OR REPLACE INTO failed_state (id, data, buildId) VALUES (?, ?, ?)", msg.MessageDeduplicationId, JSON.stringify(updatedFailedState), "LzwEMGWu7DweUytf4jGNp");
    }
    await this.addAlarm();
  }
  async addAlarm() {
    const existingAlarm = await this.ctx.storage.getAlarm({ allowConcurrency: false });
    if (existingAlarm)
      return;
    if (this.routeInFailedState.size === 0)
      return;
    let nextAlarmToSetup = Math.min(...Array.from(this.routeInFailedState.values()).map(({ nextAlarmMs }) => nextAlarmMs));
    if (nextAlarmToSetup < Date.now()) {
      nextAlarmToSetup = Date.now() + this.revalidationRetryInterval;
    }
    await this.ctx.storage.setAlarm(nextAlarmToSetup);
  }
  // This function is used to restore the state of the durable object
  // We don't restore the ongoing revalidations because we cannot know in which state they are
  // We only restore the failed state and the alarm
  async initState() {
    if (this.disableSQLite)
      return;
    this.sql.exec("CREATE TABLE IF NOT EXISTS failed_state (id TEXT PRIMARY KEY, data TEXT, buildId TEXT)");
    this.sql.exec("CREATE TABLE IF NOT EXISTS sync (id TEXT PRIMARY KEY, lastSuccess INTEGER, buildId TEXT)");
    this.sql.exec("DELETE FROM failed_state WHERE buildId != ?", "LzwEMGWu7DweUytf4jGNp");
    this.sql.exec("DELETE FROM sync WHERE buildId != ?", "LzwEMGWu7DweUytf4jGNp");
    const failedStateCursor = this.sql.exec("SELECT * FROM failed_state");
    for (const row of failedStateCursor) {
      this.routeInFailedState.set(row.id, JSON.parse(row.data));
    }
    await this.addAlarm();
  }
  /**
   *
   * @param msg
   * @returns `true` if the route has been revalidated since the lastModified from the message, `false` otherwise
   */
  checkSyncTable(msg) {
    try {
      if (this.disableSQLite)
        return false;
      return this.sql.exec("SELECT 1 FROM sync WHERE id = ? AND lastSuccess > ? LIMIT 1", `${msg.MessageBody.host}${msg.MessageBody.url}`, Math.round(msg.MessageBody.lastModified / 1e3)).toArray().length > 0;
    } catch {
      return false;
    }
  }
};
globalThis.openNextDebug = false;
globalThis.openNextVersion = "4.0.2";
globalThis.nextVersion = "16.2.6";
var debugCache$1 = (name, ...args) => {
  if (process.env.NEXT_PRIVATE_DEBUG_CACHE) {
    console.log(`[${name}] `, ...args);
  }
};
var DOShardedTagCache = class extends DurableObject {
  sql;
  constructor(state, env2) {
    super(state, env2);
    this.sql = state.storage.sql;
    state.blockConcurrencyWhile(async () => {
      this.sql.exec(`CREATE TABLE IF NOT EXISTS revalidations (tag TEXT PRIMARY KEY, revalidatedAt INTEGER, stale INTEGER, expire INTEGER DEFAULT NULL)`);
      try {
        this.sql.exec(`ALTER TABLE revalidations ADD COLUMN stale INTEGER; ALTER TABLE revalidations ADD COLUMN expire INTEGER DEFAULT NULL`);
      } catch {
      }
    });
  }
  async getTagData(tags) {
    if (tags.length === 0)
      return {};
    try {
      const result = this.sql.exec(`SELECT tag, revalidatedAt, stale, expire FROM revalidations WHERE tag IN (${tags.map(() => "?").join(", ")})`, ...tags).toArray();
      debugCache$1("DOShardedTagCache", `getTagData tags=${tags} -> ${result.length} results`);
      return Object.fromEntries(result.map((row) => [
        row.tag,
        {
          revalidatedAt: row.revalidatedAt ?? 0,
          stale: row.stale ?? null,
          expire: row.expire ?? null
        }
      ]));
    } catch (e) {
      console.error(e);
      return {};
    }
  }
  /**
   * @deprecated since v1.19.
   *
   * Use `getTagData` instead - no processing should be done in the DO ao allow using the regional cache to cache all the values
   * for a given tag using a single key.
   *
   * Kept for backward compatibility during rolling deploys.
   */
  async getLastRevalidated(tags) {
    const data = await this.getTagData(tags);
    const values = Object.values(data);
    const timeMs = values.length === 0 ? 0 : Math.max(...values.map(({ revalidatedAt }) => revalidatedAt));
    debugCache$1("DOShardedTagCache", `getLastRevalidated tags=${tags} -> time=${timeMs}`);
    return timeMs;
  }
  /**
   * @deprecated since v1.19.
   *
   * Use `getTagData` instead - no processing should be done in the DO ao allow using the regional cache to cache all the values
   * for a given tag using a single key.
   *
   * Kept for backward compatibility during rolling deploys.
   */
  async hasBeenRevalidated(tags, lastModified) {
    const data = await this.getTagData(tags);
    const lastModifiedOrNowMs = lastModified ?? Date.now();
    const revalidated = Object.values(data).some(({ revalidatedAt }) => revalidatedAt > lastModifiedOrNowMs);
    debugCache$1("DOShardedTagCache", `hasBeenRevalidated tags=${tags} -> revalidated=${revalidated}`);
    return revalidated;
  }
  /**
   * @deprecated since v1.19.
   *
   * Use `getTagData` instead - no processing should be done in the DO ao allow using the regional cache to cache all the values
   * for a given tag using a single key.
   *
   * Kept for backward compatibility during rolling deploys.
   */
  async getRevalidationTimes(tags) {
    const data = await this.getTagData(tags);
    return Object.fromEntries(Object.entries(data).map(([tag, { revalidatedAt }]) => [tag, revalidatedAt]));
  }
  async writeTags(tags, lastModified) {
    if (tags.length === 0)
      return;
    const nowMs = lastModified ?? Date.now();
    debugCache$1("DOShardedTagCache", `writeTags tags=${JSON.stringify(tags)} time=${nowMs}`);
    if (typeof tags[0] === "string") {
      for (const tag of tags) {
        this.sql.exec(`INSERT OR REPLACE INTO revalidations (tag, revalidatedAt, stale) VALUES (?, ?, ?)`, tag, nowMs, nowMs);
      }
    } else {
      for (const entry of tags) {
        const staleValue = entry.stale ?? nowMs;
        this.sql.exec(`INSERT OR REPLACE INTO revalidations (tag, revalidatedAt, stale, expire) VALUES (?, ?, ?, ?)`, entry.tag, staleValue, staleValue, entry.expire ?? null);
      }
    }
  }
};
globalThis.openNextDebug = false;
globalThis.openNextVersion = "4.0.2";
globalThis.nextVersion = "16.2.6";
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
var DOWNPLAYED_ERROR_LOGS = [
  {
    clientName: "S3Client",
    commandName: "GetObjectCommand",
    errorName: "NoSuchKey"
  }
];
var isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var debugCache = (name, ...args) => {
  if (process.env.NEXT_PRIVATE_DEBUG_CACHE) {
    console.log(`[${name}] `, ...args);
  }
};
async function internalPurgeCacheByTags(env2, tags) {
  if (!env2.CACHE_PURGE_ZONE_ID || !env2.CACHE_PURGE_API_TOKEN) {
    error("No cache zone ID or API token provided. Skipping cache purge.");
    return "missing-credentials";
  }
  let response;
  try {
    response = await fetch(`https://api.cloudflare.com/client/v4/zones/${env2.CACHE_PURGE_ZONE_ID}/purge_cache`, {
      headers: {
        Authorization: `Bearer ${env2.CACHE_PURGE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        tags
      })
    });
    if (response.status === 429) {
      error("purgeCacheByTags: Rate limit exceeded. Skipping cache purge.");
      return "rate-limit-exceeded";
    }
    const bodyResponse = await response.json();
    if (!bodyResponse.success) {
      error("purgeCacheByTags: Cache purge failed. Errors:", bodyResponse.errors.map((error2) => `${error2.code}: ${error2.message}`));
      return "purge-failed";
    }
    debugCache("purgeCacheByTags", "Cache purged successfully for tags:", tags);
    return "purge-success";
  } catch (error2) {
    console.error("Error purging cache by tags:", error2);
    return "purge-failed";
  } finally {
    try {
      await response?.body?.cancel();
    } catch {
    }
  }
}
var DEFAULT_BUFFER_TIME_IN_SECONDS = 5;
var MAX_NUMBER_OF_TAGS_PER_PURGE = 100;
var BucketCachePurge = class extends DurableObject {
  bufferTimeInSeconds;
  constructor(state, env2) {
    super(state, env2);
    this.bufferTimeInSeconds = env2.NEXT_CACHE_DO_PURGE_BUFFER_TIME_IN_SECONDS ? parseInt(env2.NEXT_CACHE_DO_PURGE_BUFFER_TIME_IN_SECONDS) : DEFAULT_BUFFER_TIME_IN_SECONDS;
    state.blockConcurrencyWhile(async () => {
      state.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS cache_purge (
        tag TEXT NOT NULL
      );
      CREATE UNIQUE INDEX IF NOT EXISTS tag_index ON cache_purge (tag);
      `);
    });
  }
  async purgeCacheByTags(tags) {
    for (const tag of tags) {
      this.ctx.storage.sql.exec(`
        INSERT OR REPLACE INTO cache_purge (tag)
        VALUES (?)`, [tag]);
    }
    const nextAlarm = await this.ctx.storage.getAlarm();
    if (!nextAlarm) {
      this.ctx.storage.setAlarm(Date.now() + this.bufferTimeInSeconds * 1e3);
    }
  }
  async alarm() {
    let tags = this.ctx.storage.sql.exec(`
      SELECT * FROM cache_purge LIMIT ${MAX_NUMBER_OF_TAGS_PER_PURGE}
    `).toArray();
    do {
      if (tags.length === 0) {
        return;
      }
      const result = await internalPurgeCacheByTags(this.env, tags.map((row) => row.tag));
      if (result === "rate-limit-exceeded") {
        throw new Error("Rate limit exceeded");
      }
      this.ctx.storage.sql.exec(`
        DELETE FROM cache_purge
        WHERE tag IN (${tags.map(() => "?").join(",")})
      `, tags.map((row) => row.tag));
      if (tags.length < MAX_NUMBER_OF_TAGS_PER_PURGE) {
        tags = [];
      } else {
        tags = this.ctx.storage.sql.exec(`
          SELECT * FROM cache_purge LIMIT ${MAX_NUMBER_OF_TAGS_PER_PURGE}
        `).toArray();
      }
    } while (tags.length >= 0);
  }
};
const worker = {
  async fetch(request, env2, ctx) {
    return runWithCloudflareRequestContext(request, env2, ctx, async () => {
      const response = maybeGetSkewProtectionResponse();
      if (response) {
        return response;
      }
      const url = new URL(request.url);
      if (url.pathname.startsWith("/cdn-cgi/image/")) {
        return handleCdnCgiImageRequest(url, env2);
      }
      if (url.pathname === `${globalThis.__NEXT_BASE_PATH__}/_next/image${globalThis.__TRAILING_SLASH__ ? "/" : ""}`) {
        return await handleImageRequest(url, request.headers, env2);
      }
      const reqOrResp = await handler2(request, env2, ctx);
      if (reqOrResp instanceof Response) {
        return reqOrResp;
      }
      const { handler: handler3 } = await import("./handler_Dpx9yNSV.mjs");
      return handler3(reqOrResp, env2, ctx, request.signal);
    });
  }
};
const workerEntry = worker ?? {};
export {
  BucketCachePurge as B,
  DOQueueHandler as D,
  DOShardedTagCache as a,
  rawHeaders as r,
  workerEntry as w
};
