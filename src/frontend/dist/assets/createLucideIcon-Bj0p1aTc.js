import { H as ProtocolError, T as TimeoutWaitingForResponseErrorCode, I as utf8ToBytes, J as ExternalError, M as MissingRootKeyErrorCode, K as Certificate, N as lookupResultToBuffer, O as RequestStatusResponseStatus, U as UnknownError, Q as RequestStatusDoneNoReplyErrorCode, V as RejectError, W as CertifiedRejectErrorCode, X as UNREACHABLE_ERROR, Y as InputError, Z as InvalidReadStateRequestErrorCode, _ as ReadRequestType, $ as Principal, a0 as IDL, a1 as MissingCanisterIdErrorCode, a2 as HttpAgent, a3 as encode, a4 as QueryResponseStatus, a5 as UncertifiedRejectErrorCode, a6 as isV3ResponseBody, a7 as isV2ResponseBody, a8 as UncertifiedRejectUpdateErrorCode, a9 as UnexpectedErrorCode, aa as decode, r as reactExports, j as jsxRuntimeExports, v as React, h as clsx, c as cn, ab as Variant, ac as Record, ad as Vec, ae as Service, af as Func, ag as Text, ah as Null, ai as Float64, aj as Int, ak as Principal$1, al as Nat, am as Bool, R as React$1 } from "./index-BSjU2GqU.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a = agent.createReadStateRequest) == null ? void 0 : _a.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a, _b;
      options = {
        ...options,
        ...(_b = (_a = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b.call(_a, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a, _b;
      options = {
        ...options,
        ...(_b = (_a = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b.call(_a, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
var use = React[" use ".trim().toString()];
function isPromiseLike(value) {
  return typeof value === "object" && value !== null && "then" in value;
}
function isLazyComponent(element) {
  return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike(element._payload);
}
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    const childrenArray = reactExports.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (reactExports.Children.count(newElement) > 1) return reactExports.Children.only(null);
          return reactExports.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: reactExports.isValidElement(newElement) ? reactExports.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
var Slot = /* @__PURE__ */ createSlot("Slot");
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    if (reactExports.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== reactExports.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return reactExports.cloneElement(children, props2);
    }
    return reactExports.Children.count(children) > 1 ? reactExports.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
function isSlottable(child) {
  return reactExports.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  var _a, _b;
  let getter = (_a = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = (_b = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
const falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
const cx = clsx;
const cva = (base, config) => (props) => {
  var _config_compoundVariants;
  if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
  const { variants, defaultVariants } = config;
  const getVariantClassNames = Object.keys(variants).map((variant) => {
    const variantProp = props === null || props === void 0 ? void 0 : props[variant];
    const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
    if (variantProp === null) return null;
    const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
    return variants[variant][variantKey];
  });
  const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
    let [key, value] = param;
    if (value === void 0) {
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
  const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
    let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
    return Object.entries(compoundVariantOptions).every((param2) => {
      let [key, value] = param2;
      return Array.isArray(value) ? value.includes({
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key]) : {
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key] === value;
    }) ? [
      ...acc,
      cvClass,
      cvClassName
    ] : acc;
  }, []);
  return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
};
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
const Timestamp = Int;
const GlucoseUnit$1 = Variant({
  "mmoll": Null,
  "mgdl": Null
});
const AddGlucoseInput = Record({
  "readingTime": Timestamp,
  "value": Float64,
  "unit": GlucoseUnit$1,
  "notes": Text
});
const UserId = Principal$1;
const GlucoseEntry = Record({
  "id": Nat,
  "readingTime": Timestamp,
  "value": Float64,
  "userId": UserId,
  "createdAt": Timestamp,
  "unit": GlucoseUnit$1,
  "notes": Text
});
const Result__1_2 = Variant({
  "ok": GlucoseEntry,
  "err": Text
});
const WeightUnit$1 = Variant({ "kg": Null, "lbs": Null });
const AddWeightInput = Record({
  "value": Float64,
  "unit": WeightUnit$1,
  "recordedAt": Timestamp,
  "notes": Text
});
const WeightEntry = Record({
  "id": Nat,
  "value": Float64,
  "userId": UserId,
  "createdAt": Timestamp,
  "unit": WeightUnit$1,
  "recordedAt": Timestamp,
  "notes": Text
});
const Result__1_1 = Variant({
  "ok": WeightEntry,
  "err": Text
});
const UserDetail = Record({
  "id": UserId,
  "createdAt": Timestamp,
  "fullName": Text,
  "email": Text,
  "weightEntries": Vec(WeightEntry),
  "glucoseEntries": Vec(GlucoseEntry)
});
const Result__3_1 = Variant({ "ok": UserDetail, "err": Text });
const UserSummary = Record({
  "id": UserId,
  "entryCount": Nat,
  "createdAt": Timestamp,
  "fullName": Text,
  "email": Text
});
const Result__3 = Variant({
  "ok": Vec(UserSummary),
  "err": Text
});
const HealthPage = Record({
  "total": Nat,
  "offset": Nat,
  "limit": Nat,
  "weightEntries": Vec(WeightEntry),
  "glucoseEntries": Vec(GlucoseEntry)
});
const Result__1 = Variant({ "ok": HealthPage, "err": Text });
const Role$1 = Variant({ "admin": Null, "user": Null });
const User = Record({
  "id": UserId,
  "createdAt": Timestamp,
  "role": Role$1,
  "fullName": Text,
  "email": Text
});
const Result__2 = Variant({ "ok": User, "err": Text });
const Result_2 = Variant({ "ok": Nat, "err": Text });
const NotificationKind = Variant({
  "weight": Null,
  "glucose": Null
});
const Notification = Record({
  "id": Nat,
  "userName": Text,
  "value": Float64,
  "userId": UserId,
  "kind": NotificationKind,
  "unit": Text,
  "isRead": Bool,
  "timestamp": Timestamp
});
const Result_1 = Variant({
  "ok": Vec(Notification),
  "err": Text
});
const LoginInput = Record({
  "password": Text,
  "email": Text
});
const AuthResult = Variant({
  "ok": Record({ "token": Text, "user": User }),
  "err": Text
});
const Result = Variant({ "ok": Null, "err": Text });
const SignupInput = Record({
  "password": Text,
  "fullName": Text,
  "email": Text
});
Service({
  "addGlucoseEntry": Func([Text, AddGlucoseInput], [Result__1_2], []),
  "addWeightEntry": Func([Text, AddWeightInput], [Result__1_1], []),
  "adminGetUserDetail": Func([Text, UserId], [Result__3_1], ["query"]),
  "adminListUsers": Func([Text], [Result__3], ["query"]),
  "getAllHealthEntries": Func(
    [Text, Nat, Nat],
    [Result__1],
    ["query"]
  ),
  "getMe": Func([Text], [Result__2], ["query"]),
  "getMyHealthEntries": Func(
    [Text, Nat, Nat],
    [Result__1],
    ["query"]
  ),
  "getUnreadNotificationCount": Func([Text], [Result_2], ["query"]),
  "getUnreadNotifications": Func([Text], [Result_1], ["query"]),
  "getUserHealthEntries": Func(
    [Text, UserId, Nat, Nat],
    [Result__1],
    ["query"]
  ),
  "initAdmin": Func([], [Text], []),
  "isAdmin": Func([], [Bool], ["query"]),
  "login": Func([LoginInput], [AuthResult], []),
  "logout": Func([Text], [], []),
  "markNotificationsRead": Func(
    [Text, Vec(Nat)],
    [Result],
    []
  ),
  "resetAdmin": Func([], [Text], []),
  "signup": Func([SignupInput], [AuthResult], [])
});
const idlFactory = ({ IDL: IDL2 }) => {
  const Timestamp2 = IDL2.Int;
  const GlucoseUnit2 = IDL2.Variant({ "mmoll": IDL2.Null, "mgdl": IDL2.Null });
  const AddGlucoseInput2 = IDL2.Record({
    "readingTime": Timestamp2,
    "value": IDL2.Float64,
    "unit": GlucoseUnit2,
    "notes": IDL2.Text
  });
  const UserId2 = IDL2.Principal;
  const GlucoseEntry2 = IDL2.Record({
    "id": IDL2.Nat,
    "readingTime": Timestamp2,
    "value": IDL2.Float64,
    "userId": UserId2,
    "createdAt": Timestamp2,
    "unit": GlucoseUnit2,
    "notes": IDL2.Text
  });
  const Result__1_22 = IDL2.Variant({ "ok": GlucoseEntry2, "err": IDL2.Text });
  const WeightUnit2 = IDL2.Variant({ "kg": IDL2.Null, "lbs": IDL2.Null });
  const AddWeightInput2 = IDL2.Record({
    "value": IDL2.Float64,
    "unit": WeightUnit2,
    "recordedAt": Timestamp2,
    "notes": IDL2.Text
  });
  const WeightEntry2 = IDL2.Record({
    "id": IDL2.Nat,
    "value": IDL2.Float64,
    "userId": UserId2,
    "createdAt": Timestamp2,
    "unit": WeightUnit2,
    "recordedAt": Timestamp2,
    "notes": IDL2.Text
  });
  const Result__1_12 = IDL2.Variant({ "ok": WeightEntry2, "err": IDL2.Text });
  const UserDetail2 = IDL2.Record({
    "id": UserId2,
    "createdAt": Timestamp2,
    "fullName": IDL2.Text,
    "email": IDL2.Text,
    "weightEntries": IDL2.Vec(WeightEntry2),
    "glucoseEntries": IDL2.Vec(GlucoseEntry2)
  });
  const Result__3_12 = IDL2.Variant({ "ok": UserDetail2, "err": IDL2.Text });
  const UserSummary2 = IDL2.Record({
    "id": UserId2,
    "entryCount": IDL2.Nat,
    "createdAt": Timestamp2,
    "fullName": IDL2.Text,
    "email": IDL2.Text
  });
  const Result__32 = IDL2.Variant({
    "ok": IDL2.Vec(UserSummary2),
    "err": IDL2.Text
  });
  const HealthPage2 = IDL2.Record({
    "total": IDL2.Nat,
    "offset": IDL2.Nat,
    "limit": IDL2.Nat,
    "weightEntries": IDL2.Vec(WeightEntry2),
    "glucoseEntries": IDL2.Vec(GlucoseEntry2)
  });
  const Result__12 = IDL2.Variant({ "ok": HealthPage2, "err": IDL2.Text });
  const Role2 = IDL2.Variant({ "admin": IDL2.Null, "user": IDL2.Null });
  const User2 = IDL2.Record({
    "id": UserId2,
    "createdAt": Timestamp2,
    "role": Role2,
    "fullName": IDL2.Text,
    "email": IDL2.Text
  });
  const Result__22 = IDL2.Variant({ "ok": User2, "err": IDL2.Text });
  const Result_22 = IDL2.Variant({ "ok": IDL2.Nat, "err": IDL2.Text });
  const NotificationKind2 = IDL2.Variant({
    "weight": IDL2.Null,
    "glucose": IDL2.Null
  });
  const Notification2 = IDL2.Record({
    "id": IDL2.Nat,
    "userName": IDL2.Text,
    "value": IDL2.Float64,
    "userId": UserId2,
    "kind": NotificationKind2,
    "unit": IDL2.Text,
    "isRead": IDL2.Bool,
    "timestamp": Timestamp2
  });
  const Result_12 = IDL2.Variant({
    "ok": IDL2.Vec(Notification2),
    "err": IDL2.Text
  });
  const LoginInput2 = IDL2.Record({ "password": IDL2.Text, "email": IDL2.Text });
  const AuthResult2 = IDL2.Variant({
    "ok": IDL2.Record({ "token": IDL2.Text, "user": User2 }),
    "err": IDL2.Text
  });
  const Result2 = IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text });
  const SignupInput2 = IDL2.Record({
    "password": IDL2.Text,
    "fullName": IDL2.Text,
    "email": IDL2.Text
  });
  return IDL2.Service({
    "addGlucoseEntry": IDL2.Func(
      [IDL2.Text, AddGlucoseInput2],
      [Result__1_22],
      []
    ),
    "addWeightEntry": IDL2.Func([IDL2.Text, AddWeightInput2], [Result__1_12], []),
    "adminGetUserDetail": IDL2.Func(
      [IDL2.Text, UserId2],
      [Result__3_12],
      ["query"]
    ),
    "adminListUsers": IDL2.Func([IDL2.Text], [Result__32], ["query"]),
    "getAllHealthEntries": IDL2.Func(
      [IDL2.Text, IDL2.Nat, IDL2.Nat],
      [Result__12],
      ["query"]
    ),
    "getMe": IDL2.Func([IDL2.Text], [Result__22], ["query"]),
    "getMyHealthEntries": IDL2.Func(
      [IDL2.Text, IDL2.Nat, IDL2.Nat],
      [Result__12],
      ["query"]
    ),
    "getUnreadNotificationCount": IDL2.Func([IDL2.Text], [Result_22], ["query"]),
    "getUnreadNotifications": IDL2.Func([IDL2.Text], [Result_12], ["query"]),
    "getUserHealthEntries": IDL2.Func(
      [IDL2.Text, UserId2, IDL2.Nat, IDL2.Nat],
      [Result__12],
      ["query"]
    ),
    "initAdmin": IDL2.Func([], [IDL2.Text], []),
    "isAdmin": IDL2.Func([], [IDL2.Bool], ["query"]),
    "login": IDL2.Func([LoginInput2], [AuthResult2], []),
    "logout": IDL2.Func([IDL2.Text], [], []),
    "markNotificationsRead": IDL2.Func(
      [IDL2.Text, IDL2.Vec(IDL2.Nat)],
      [Result2],
      []
    ),
    "resetAdmin": IDL2.Func([], [IDL2.Text], []),
    "signup": IDL2.Func([SignupInput2], [AuthResult2], [])
  });
};
var GlucoseUnit = /* @__PURE__ */ ((GlucoseUnit2) => {
  GlucoseUnit2["mmoll"] = "mmoll";
  GlucoseUnit2["mgdl"] = "mgdl";
  return GlucoseUnit2;
})(GlucoseUnit || {});
var Role = /* @__PURE__ */ ((Role2) => {
  Role2["admin"] = "admin";
  Role2["user"] = "user";
  return Role2;
})(Role || {});
var WeightUnit = /* @__PURE__ */ ((WeightUnit2) => {
  WeightUnit2["kg"] = "kg";
  WeightUnit2["lbs"] = "lbs";
  return WeightUnit2;
})(WeightUnit || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async addGlucoseEntry(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.addGlucoseEntry(arg0, to_candid_AddGlucoseInput_n1(this._uploadFile, this._downloadFile, arg1));
        return from_candid_Result__1_2_n5(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addGlucoseEntry(arg0, to_candid_AddGlucoseInput_n1(this._uploadFile, this._downloadFile, arg1));
      return from_candid_Result__1_2_n5(this._uploadFile, this._downloadFile, result);
    }
  }
  async addWeightEntry(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.addWeightEntry(arg0, to_candid_AddWeightInput_n11(this._uploadFile, this._downloadFile, arg1));
        return from_candid_Result__1_1_n15(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addWeightEntry(arg0, to_candid_AddWeightInput_n11(this._uploadFile, this._downloadFile, arg1));
      return from_candid_Result__1_1_n15(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminGetUserDetail(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminGetUserDetail(arg0, arg1);
        return from_candid_Result__3_1_n21(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminGetUserDetail(arg0, arg1);
      return from_candid_Result__3_1_n21(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminListUsers(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminListUsers(arg0);
        return from_candid_Result__3_n27(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminListUsers(arg0);
      return from_candid_Result__3_n27(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAllHealthEntries(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.getAllHealthEntries(arg0, arg1, arg2);
        return from_candid_Result__1_n29(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllHealthEntries(arg0, arg1, arg2);
      return from_candid_Result__1_n29(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMe(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getMe(arg0);
        return from_candid_Result__2_n33(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMe(arg0);
      return from_candid_Result__2_n33(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMyHealthEntries(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.getMyHealthEntries(arg0, arg1, arg2);
        return from_candid_Result__1_n29(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyHealthEntries(arg0, arg1, arg2);
      return from_candid_Result__1_n29(this._uploadFile, this._downloadFile, result);
    }
  }
  async getUnreadNotificationCount(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getUnreadNotificationCount(arg0);
        return from_candid_Result_2_n39(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getUnreadNotificationCount(arg0);
      return from_candid_Result_2_n39(this._uploadFile, this._downloadFile, result);
    }
  }
  async getUnreadNotifications(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getUnreadNotifications(arg0);
        return from_candid_Result_1_n41(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getUnreadNotifications(arg0);
      return from_candid_Result_1_n41(this._uploadFile, this._downloadFile, result);
    }
  }
  async getUserHealthEntries(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.getUserHealthEntries(arg0, arg1, arg2, arg3);
        return from_candid_Result__1_n29(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getUserHealthEntries(arg0, arg1, arg2, arg3);
      return from_candid_Result__1_n29(this._uploadFile, this._downloadFile, result);
    }
  }
  async initAdmin() {
    if (this.processError) {
      try {
        const result = await this.actor.initAdmin();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.initAdmin();
      return result;
    }
  }
  async isAdmin() {
    if (this.processError) {
      try {
        const result = await this.actor.isAdmin();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isAdmin();
      return result;
    }
  }
  async login(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.login(arg0);
        return from_candid_AuthResult_n48(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.login(arg0);
      return from_candid_AuthResult_n48(this._uploadFile, this._downloadFile, result);
    }
  }
  async logout(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.logout(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.logout(arg0);
      return result;
    }
  }
  async markNotificationsRead(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.markNotificationsRead(arg0, arg1);
        return from_candid_Result_n51(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.markNotificationsRead(arg0, arg1);
      return from_candid_Result_n51(this._uploadFile, this._downloadFile, result);
    }
  }
  async resetAdmin() {
    if (this.processError) {
      try {
        const result = await this.actor.resetAdmin();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.resetAdmin();
      return result;
    }
  }
  async signup(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.signup(arg0);
        return from_candid_AuthResult_n48(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.signup(arg0);
      return from_candid_AuthResult_n48(this._uploadFile, this._downloadFile, result);
    }
  }
}
function from_candid_AuthResult_n48(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n49(_uploadFile, _downloadFile, value);
}
function from_candid_GlucoseEntry_n7(_uploadFile, _downloadFile, value) {
  return from_candid_record_n8(_uploadFile, _downloadFile, value);
}
function from_candid_GlucoseUnit_n9(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n10(_uploadFile, _downloadFile, value);
}
function from_candid_HealthPage_n31(_uploadFile, _downloadFile, value) {
  return from_candid_record_n32(_uploadFile, _downloadFile, value);
}
function from_candid_NotificationKind_n46(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n47(_uploadFile, _downloadFile, value);
}
function from_candid_Notification_n44(_uploadFile, _downloadFile, value) {
  return from_candid_record_n45(_uploadFile, _downloadFile, value);
}
function from_candid_Result_1_n41(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n42(_uploadFile, _downloadFile, value);
}
function from_candid_Result_2_n39(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n40(_uploadFile, _downloadFile, value);
}
function from_candid_Result__1_1_n15(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n16(_uploadFile, _downloadFile, value);
}
function from_candid_Result__1_2_n5(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n6(_uploadFile, _downloadFile, value);
}
function from_candid_Result__1_n29(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n30(_uploadFile, _downloadFile, value);
}
function from_candid_Result__2_n33(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n34(_uploadFile, _downloadFile, value);
}
function from_candid_Result__3_1_n21(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n22(_uploadFile, _downloadFile, value);
}
function from_candid_Result__3_n27(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n28(_uploadFile, _downloadFile, value);
}
function from_candid_Result_n51(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n52(_uploadFile, _downloadFile, value);
}
function from_candid_Role_n37(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n38(_uploadFile, _downloadFile, value);
}
function from_candid_UserDetail_n23(_uploadFile, _downloadFile, value) {
  return from_candid_record_n24(_uploadFile, _downloadFile, value);
}
function from_candid_User_n35(_uploadFile, _downloadFile, value) {
  return from_candid_record_n36(_uploadFile, _downloadFile, value);
}
function from_candid_WeightEntry_n17(_uploadFile, _downloadFile, value) {
  return from_candid_record_n18(_uploadFile, _downloadFile, value);
}
function from_candid_WeightUnit_n19(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n20(_uploadFile, _downloadFile, value);
}
function from_candid_record_n18(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    value: value.value,
    userId: value.userId,
    createdAt: value.createdAt,
    unit: from_candid_WeightUnit_n19(_uploadFile, _downloadFile, value.unit),
    recordedAt: value.recordedAt,
    notes: value.notes
  };
}
function from_candid_record_n24(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    createdAt: value.createdAt,
    fullName: value.fullName,
    email: value.email,
    weightEntries: from_candid_vec_n25(_uploadFile, _downloadFile, value.weightEntries),
    glucoseEntries: from_candid_vec_n26(_uploadFile, _downloadFile, value.glucoseEntries)
  };
}
function from_candid_record_n32(_uploadFile, _downloadFile, value) {
  return {
    total: value.total,
    offset: value.offset,
    limit: value.limit,
    weightEntries: from_candid_vec_n25(_uploadFile, _downloadFile, value.weightEntries),
    glucoseEntries: from_candid_vec_n26(_uploadFile, _downloadFile, value.glucoseEntries)
  };
}
function from_candid_record_n36(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    createdAt: value.createdAt,
    role: from_candid_Role_n37(_uploadFile, _downloadFile, value.role),
    fullName: value.fullName,
    email: value.email
  };
}
function from_candid_record_n45(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    userName: value.userName,
    value: value.value,
    userId: value.userId,
    kind: from_candid_NotificationKind_n46(_uploadFile, _downloadFile, value.kind),
    unit: value.unit,
    isRead: value.isRead,
    timestamp: value.timestamp
  };
}
function from_candid_record_n50(_uploadFile, _downloadFile, value) {
  return {
    token: value.token,
    user: from_candid_User_n35(_uploadFile, _downloadFile, value.user)
  };
}
function from_candid_record_n8(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    readingTime: value.readingTime,
    value: value.value,
    userId: value.userId,
    createdAt: value.createdAt,
    unit: from_candid_GlucoseUnit_n9(_uploadFile, _downloadFile, value.unit),
    notes: value.notes
  };
}
function from_candid_variant_n10(_uploadFile, _downloadFile, value) {
  return "mmoll" in value ? "mmoll" : "mgdl" in value ? "mgdl" : value;
}
function from_candid_variant_n16(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_WeightEntry_n17(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n20(_uploadFile, _downloadFile, value) {
  return "kg" in value ? "kg" : "lbs" in value ? "lbs" : value;
}
function from_candid_variant_n22(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_UserDetail_n23(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n28(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n30(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_HealthPage_n31(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n34(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_User_n35(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n38(_uploadFile, _downloadFile, value) {
  return "admin" in value ? "admin" : "user" in value ? "user" : value;
}
function from_candid_variant_n40(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n42(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_vec_n43(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n47(_uploadFile, _downloadFile, value) {
  return "weight" in value ? "weight" : "glucose" in value ? "glucose" : value;
}
function from_candid_variant_n49(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_record_n50(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n52(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n6(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_GlucoseEntry_n7(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_vec_n25(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_WeightEntry_n17(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n26(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_GlucoseEntry_n7(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n43(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Notification_n44(_uploadFile, _downloadFile, x));
}
function to_candid_AddGlucoseInput_n1(_uploadFile, _downloadFile, value) {
  return to_candid_record_n2(_uploadFile, _downloadFile, value);
}
function to_candid_AddWeightInput_n11(_uploadFile, _downloadFile, value) {
  return to_candid_record_n12(_uploadFile, _downloadFile, value);
}
function to_candid_GlucoseUnit_n3(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n4(_uploadFile, _downloadFile, value);
}
function to_candid_WeightUnit_n13(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n14(_uploadFile, _downloadFile, value);
}
function to_candid_record_n12(_uploadFile, _downloadFile, value) {
  return {
    value: value.value,
    unit: to_candid_WeightUnit_n13(_uploadFile, _downloadFile, value.unit),
    recordedAt: value.recordedAt,
    notes: value.notes
  };
}
function to_candid_record_n2(_uploadFile, _downloadFile, value) {
  return {
    readingTime: value.readingTime,
    value: value.value,
    unit: to_candid_GlucoseUnit_n3(_uploadFile, _downloadFile, value.unit),
    notes: value.notes
  };
}
function to_candid_variant_n14(_uploadFile, _downloadFile, value) {
  return value == "kg" ? {
    kg: null
  } : value == "lbs" ? {
    lbs: null
  } : value;
}
function to_candid_variant_n4(_uploadFile, _downloadFile, value) {
  return value == "mmoll" ? {
    mmoll: null
  } : value == "mgdl" ? {
    mgdl: null
  } : value;
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
const identity = (arg) => arg;
function useStore(api, selector = identity) {
  const slice = React$1.useSyncExternalStore(
    api.subscribe,
    React$1.useCallback(() => selector(api.getState()), [api, selector]),
    React$1.useCallback(() => selector(api.getInitialState()), [api, selector])
  );
  React$1.useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  const api = createStore(createState);
  const useBoundStore = (selector) => useStore(api, selector);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = (createState) => createState ? createImpl(createState) : createImpl;
function createJSONStorage(getStorage, options) {
  let storage;
  try {
    storage = getStorage();
  } catch (e) {
    return;
  }
  const persistStorage = {
    getItem: (name) => {
      var _a;
      const parse = (str2) => {
        if (str2 === null) {
          return null;
        }
        return JSON.parse(str2, void 0);
      };
      const str = (_a = storage.getItem(name)) != null ? _a : null;
      if (str instanceof Promise) {
        return str.then(parse);
      }
      return parse(str);
    },
    setItem: (name, newValue) => storage.setItem(name, JSON.stringify(newValue, void 0)),
    removeItem: (name) => storage.removeItem(name)
  };
  return persistStorage;
}
const toThenable = (fn) => (input) => {
  try {
    const result = fn(input);
    if (result instanceof Promise) {
      return result;
    }
    return {
      then(onFulfilled) {
        return toThenable(onFulfilled)(result);
      },
      catch(_onRejected) {
        return this;
      }
    };
  } catch (e) {
    return {
      then(_onFulfilled) {
        return this;
      },
      catch(onRejected) {
        return toThenable(onRejected)(e);
      }
    };
  }
};
const persistImpl = (config, baseOptions) => (set, get, api) => {
  let options = {
    storage: createJSONStorage(() => window.localStorage),
    partialize: (state) => state,
    version: 0,
    merge: (persistedState, currentState) => ({
      ...currentState,
      ...persistedState
    }),
    ...baseOptions
  };
  let hasHydrated = false;
  let hydrationVersion = 0;
  const hydrationListeners = /* @__PURE__ */ new Set();
  const finishHydrationListeners = /* @__PURE__ */ new Set();
  let storage = options.storage;
  if (!storage) {
    return config(
      (...args) => {
        console.warn(
          `[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`
        );
        set(...args);
      },
      get,
      api
    );
  }
  const setItem = () => {
    const state = options.partialize({ ...get() });
    return storage.setItem(options.name, {
      state,
      version: options.version
    });
  };
  const savedSetState = api.setState;
  api.setState = (state, replace) => {
    savedSetState(state, replace);
    return setItem();
  };
  const configResult = config(
    (...args) => {
      set(...args);
      return setItem();
    },
    get,
    api
  );
  api.getInitialState = () => configResult;
  let stateFromStorage;
  const hydrate = () => {
    var _a, _b;
    if (!storage) return;
    const currentVersion = ++hydrationVersion;
    hasHydrated = false;
    hydrationListeners.forEach((cb) => {
      var _a2;
      return cb((_a2 = get()) != null ? _a2 : configResult);
    });
    const postRehydrationCallback = ((_b = options.onRehydrateStorage) == null ? void 0 : _b.call(options, (_a = get()) != null ? _a : configResult)) || void 0;
    return toThenable(storage.getItem.bind(storage))(options.name).then((deserializedStorageValue) => {
      if (deserializedStorageValue) {
        if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
          if (options.migrate) {
            const migration = options.migrate(
              deserializedStorageValue.state,
              deserializedStorageValue.version
            );
            if (migration instanceof Promise) {
              return migration.then((result) => [true, result]);
            }
            return [true, migration];
          }
          console.error(
            `State loaded from storage couldn't be migrated since no migrate function was provided`
          );
        } else {
          return [false, deserializedStorageValue.state];
        }
      }
      return [false, void 0];
    }).then((migrationResult) => {
      var _a2;
      if (currentVersion !== hydrationVersion) {
        return;
      }
      const [migrated, migratedState] = migrationResult;
      stateFromStorage = options.merge(
        migratedState,
        (_a2 = get()) != null ? _a2 : configResult
      );
      set(stateFromStorage, true);
      if (migrated) {
        return setItem();
      }
    }).then(() => {
      if (currentVersion !== hydrationVersion) {
        return;
      }
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(get(), void 0);
      stateFromStorage = get();
      hasHydrated = true;
      finishHydrationListeners.forEach((cb) => cb(stateFromStorage));
    }).catch((e) => {
      if (currentVersion !== hydrationVersion) {
        return;
      }
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(void 0, e);
    });
  };
  api.persist = {
    setOptions: (newOptions) => {
      options = {
        ...options,
        ...newOptions
      };
      if (newOptions.storage) {
        storage = newOptions.storage;
      }
    },
    clearStorage: () => {
      storage == null ? void 0 : storage.removeItem(options.name);
    },
    getOptions: () => options,
    rehydrate: () => hydrate(),
    hasHydrated: () => hasHydrated,
    onHydrate: (cb) => {
      hydrationListeners.add(cb);
      return () => {
        hydrationListeners.delete(cb);
      };
    },
    onFinishHydration: (cb) => {
      finishHydrationListeners.add(cb);
      return () => {
        finishHydrationListeners.delete(cb);
      };
    }
  };
  if (!options.skipHydration) {
    hydrate();
  }
  return stateFromStorage || configResult;
};
const persist = persistImpl;
const useAuthStore = create()(
  persist(
    (set) => ({
      currentUser: null,
      sessionToken: null,
      isAuthenticated: false,
      isAdmin: false,
      setAuth: (user, token) => set({
        currentUser: user,
        sessionToken: token,
        isAuthenticated: true,
        isAdmin: user.role === Role.admin
      }),
      logout: () => set({
        currentUser: null,
        sessionToken: null,
        isAuthenticated: false,
        isAdmin: false
      })
    }),
    {
      name: "glucofit-auth",
      partialize: (state) => ({
        currentUser: state.currentUser,
        sessionToken: state.sessionToken,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin
      })
    }
  )
);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
export {
  Button as B,
  GlucoseUnit as G,
  Role as R,
  Slot as S,
  WeightUnit as W,
  useComposedRefs as a,
  createSlot as b,
  createLucideIcon as c,
  composeRefs as d,
  cva as e,
  createActor as f,
  useAuthStore as u
};
