declare interface CreateElement {
  (tag?: string | Component<any, any, any, any> | AsyncComponent<any, any, any, any>, children?: VNodeChildren): VNode;
  (tag?: string | Component<any, any, any, any> | AsyncComponent<any, any, any, any>, data?: VNodeData, children?: VNodeChildren): VNode;
}

declare interface Vue {
  readonly $el: HTMLElement;
  readonly $options: ComponentOptions<this>;
  readonly $parent: Vue;
  readonly $root: Vue;
  readonly $children: Vue[];
  readonly $refs: { [key: string]: Vue | Element | Vue[] | Element[] };
  readonly $slots: { [key: string]: VNode[] };
  readonly $scopedSlots: { [key: string]: ScopedSlot };
  readonly $isServer: boolean;
  readonly $data: Record<string, any>;
  readonly $props: Record<string, any>;
  readonly $ssrContext: any;
  readonly $vnode: VNode;
  readonly $attrs: Record<string, string>;
  readonly $listeners: Record<string, Function | Function[]>;

  $mount(elementOrSelector?: Element | String, hydrating?: boolean): this;
  $forceUpdate(): void;
  $destroy(): void;
  $set: typeof Vue.set;
  $delete: typeof Vue.delete;
  $watch(
    expOrFn: string,
    callback: (this: this, n: any, o: any) => void,
    options?: WatchOptions
  ): (() => void);
  $watch<T>(
    expOrFn: (this: this) => T,
    callback: (this: this, n: T, o: T) => void,
    options?: WatchOptions
  ): (() => void);
  $on(event: string | string[], callback: Function): this;
  $once(event: string, callback: Function): this;
  $off(event?: string | string[], callback?: Function): this;
  $emit(event: string, ...args: any[]): this;
  $nextTick(callback: (this: this) => void): void;
  $nextTick(): Promise<void>;
  $createElement: CreateElement;
}
declare type CombinedVueInstance<Instance extends Vue, Data, Methods, Computed, Props> = Instance & Data & Methods & Computed & Props;
declare type ExtendedVue<Instance extends Vue, Data, Methods, Computed, Props> = VueConstructor<CombinedVueInstance<Instance, Data, Methods, Computed, Props> & Vue>;

declare interface VueConstructor<V extends Vue = Vue> {
  new <Data = object, Methods = object, Computed = object, PropNames extends string = never>(options?: ThisTypedComponentOptionsWithArrayProps<V, Data, Methods, Computed, PropNames>): CombinedVueInstance<V, Data, Methods, Computed, Record<PropNames, any>>;
  // ideally, the return type should just contains Props, not Record<keyof Props, any>. But TS requires Base constructors must all have the same return type.
  new <Data = object, Methods = object, Computed = object, Props = object>(options?: ThisTypedComponentOptionsWithRecordProps<V, Data, Methods, Computed, Props>): CombinedVueInstance<V, Data, Methods, Computed, Record<keyof Props, any>>;
  new (options?: ComponentOptions<V>): CombinedVueInstance<V, object, object, object, Record<keyof object, any>>;

  extend<PropNames extends string = never>(definition: FunctionalComponentOptions<Record<PropNames, any>, PropNames[]>): ExtendedVue<V, {}, {}, {}, Record<PropNames, any>>;
  extend<Props>(definition: FunctionalComponentOptions<Props, RecordPropsDefinition<Props>>): ExtendedVue<V, {}, {}, {}, Props>;
  extend<Data, Methods, Computed, PropNames extends string>(options?: ThisTypedComponentOptionsWithArrayProps<V, Data, Methods, Computed, PropNames>): ExtendedVue<V, Data, Methods, Computed, Record<PropNames, any>>;
  extend<Data, Methods, Computed, Props>(options?: ThisTypedComponentOptionsWithRecordProps<V, Data, Methods, Computed, Props>): ExtendedVue<V, Data, Methods, Computed, Props>;
  extend(options?: ComponentOptions<V>): ExtendedVue<V, {}, {}, {}, {}>;

  nextTick(callback: () => void, context?: any[]): void;
  nextTick(): Promise<void>
  set<T>(object: Object, key: string, value: T): T;
  set<T>(array: T[], key: number, value: T): T;
  delete(object: Object, key: string): void;
  delete<T>(array: T[], key: number): void;

  directive(
    id: string,
    definition?: DirectiveOptions | DirectiveFunction
  ): DirectiveOptions;
  filter(id: string, definition?: Function): Function;

  component(id: string): VueConstructor;
  component<VC extends VueConstructor>(id: string, constructor: VC): VC;
  component<Data, Methods, Computed, Props>(id: string, definition: AsyncComponent<Data, Methods, Computed, Props>): ExtendedVue<V, Data, Methods, Computed, Props>;
  component<PropNames extends string>(id: string, definition: FunctionalComponentOptions<Record<PropNames, any>, PropNames[]>): ExtendedVue<V, {}, {}, {}, Record<PropNames, any>>;
  component<Props>(id: string, definition: FunctionalComponentOptions<Props, RecordPropsDefinition<Props>>): ExtendedVue<V, {}, {}, {}, Props>;
  component<Data, Methods, Computed, PropNames extends string>(id: string, definition?: ThisTypedComponentOptionsWithArrayProps<V, Data, Methods, Computed, PropNames>): ExtendedVue<V, Data, Methods, Computed, Record<PropNames, any>>;
  component<Data, Methods, Computed, Props>(id: string, definition?: ThisTypedComponentOptionsWithRecordProps<V, Data, Methods, Computed, Props>): ExtendedVue<V, Data, Methods, Computed, Props>;
  component(id: string, definition?: ComponentOptions<V>): ExtendedVue<V, {}, {}, {}, {}>;

  use<T>(plugin: PluginObject<T> | PluginFunction<T>, options?: T): void;
  use(plugin: PluginObject<any> | PluginFunction<any>, ...options: any[]): void;
  mixin(mixin: VueConstructor | ComponentOptions<Vue>): void;
  compile(template: string): {
    render(createElement: typeof Vue.prototype.$createElement): VNode;
    staticRenderFns: (() => VNode)[];
  };

  config: {
    silent: boolean;
    optionMergeStrategies: any;
    devtools: boolean;
    productionTip: boolean;
    performance: boolean;
    errorHandler(err: Error, vm: Vue, info: string): void;
    warnHandler(msg: string, vm: Vue, trace: string): void;
    ignoredElements: string[];
    keyCodes: { [key: string]: number | number[] };
  }
}

declare const Vue: VueConstructor;

declare type PluginFunction<T> = (Vue: Vue, options?: T) => void;
declare interface PluginObject<T> {
  install: PluginFunction<T>;
  [key: string]: any;
}

declare type ScopedSlot = (props: any) => VNodeChildrenArrayContents | string;

declare type VNodeChildren = VNodeChildrenArrayContents | [ScopedSlot] | string;
declare interface VNodeChildrenArrayContents {
  [x: number]: VNode | string | VNodeChildren;
}

declare interface VNode {
  tag?: string;
  data?: VNodeData;
  children?: VNode[];
  text?: string;
  elm?: Node;
  ns?: string;
  context?: Vue;
  key?: string | number;
  componentOptions?: VNodeComponentOptions;
  componentInstance?: Vue;
  parent?: VNode;
  raw?: boolean;
  isStatic?: boolean;
  isRootInsert: boolean;
  isComment: boolean;
}

declare interface VNodeComponentOptions {
  Ctor: typeof Vue;
  propsData?: Object;
  listeners?: Object;
  children?: VNodeChildren;
  tag?: string;
}

declare interface VNodeData {
  key?: string | number;
  slot?: string;
  scopedSlots?: { [key: string]: ScopedSlot };
  ref?: string;
  tag?: string;
  staticClass?: string;
  class?: any;
  staticStyle?: { [key: string]: any };
  style?: Object[] | Object;
  props?: { [key: string]: any };
  attrs?: { [key: string]: any };
  domProps?: { [key: string]: any };
  hook?: { [key: string]: Function };
  on?: { [key: string]: Function | Function[] };
  nativeOn?: { [key: string]: Function | Function[] };
  transition?: Object;
  show?: boolean;
  inlineTemplate?: {
    render: Function;
    staticRenderFns: Function[];
  };
  directives?: VNodeDirective[];
  keepAlive?: boolean;
}

declare interface VNodeDirective {
  readonly name: string;
  readonly value: any;
  readonly oldValue: any;
  readonly expression: any;
  readonly arg: string;
  readonly modifiers: { [key: string]: boolean };
}

type Constructor = {
  new (...args: any[]): any;
}

// we don't support infer props in async component
declare type Component<Data=DefaultData<Vue>, Methods=DefaultMethods<Vue>, Computed=DefaultComputed, Props=DefaultProps> =
  | typeof Vue
  | FunctionalComponentOptions<Props>
  // | ThisTypedComponentOptionsWithArrayProps<Vue, Data, Methods, Computed, keyof Props>
  | ThisTypedComponentOptionsWithRecordProps<Vue, Data, Methods, Computed, Props>;

interface EsModuleComponent {
  default: Component
}

declare type AsyncComponent<Data=DefaultData<Vue>, Methods=DefaultMethods<Vue>, Computed=DefaultComputed, Props=DefaultProps> = (
  resolve: (component: Component<Data, Methods, Computed, Props>) => void,
  reject: (reason?: any) => void
) => Promise<Component | EsModuleComponent> | void;

/**
 * When the `Computed` type parameter on `ComponentOptions` is inferred,
 * it should have a property with the return type of every get-accessor.
 * Since there isn't a way to query for the return type of a function, we allow TypeScript
 * to infer from the shape of `Accessors<Computed>` and work backwards.
 */
declare type Accessors<T> = {
  [K in keyof T]: (() => T[K]) | ComputedOptions<T[K]>
}

/**
 * This type should be used when an array of strings is used for a component's `props` value.
 */
declare type ThisTypedComponentOptionsWithArrayProps<V extends Vue, Data, Methods, Computed, PropNames extends string> =
  object &
  ComponentOptions<V, Data | ((this: Readonly<Record<PropNames, any>> & V) => Data), Methods, Computed, PropNames[]> &
  ThisType<CombinedVueInstance<V, Data, Methods, Computed, Readonly<Record<PropNames, any>>>>;

/**
 * This type should be used when an object mapped to `PropOptions` is used for a component's `props` value.
 */
declare type ThisTypedComponentOptionsWithRecordProps<V extends Vue, Data, Methods, Computed, Props> =
  object &
  ComponentOptions<V, Data | ((this: Readonly<Props> & V) => Data), Methods, Computed, RecordPropsDefinition<Props>> &
  ThisType<CombinedVueInstance<V, Data, Methods, Computed, Readonly<Props>>>;

type DefaultData<V> =  object | ((this: V) => object);
type DefaultProps = Record<string, any>;
type DefaultMethods<V> =  { [key: string]: (this: V, ...args: any[]) => any };
type DefaultComputed = { [key: string]: any };
declare interface ComponentOptions<
  V extends Vue,
  Data=DefaultData<V>,
  Methods=DefaultMethods<V>,
  Computed=DefaultComputed,
  PropsDef=PropsDefinition<DefaultProps>> {
  data?: Data;
  props?: PropsDef;
  propsData?: Object;
  computed?: Accessors<Computed>;
  methods?: Methods;
  watch?: Record<string, WatchOptionsWithHandler<any> | WatchHandler<any> | string>;

  el?: Element | String;
  template?: string;
  render?(createElement: CreateElement): VNode;
  renderError?: (h: () => VNode, err: Error) => VNode;
  staticRenderFns?: ((createElement: CreateElement) => VNode)[];

  beforeCreate?(this: V): void;
  created?(): void;
  beforeDestroy?(): void;
  destroyed?(): void;
  beforeMount?(): void;
  mounted?(): void;
  beforeUpdate?(): void;
  updated?(): void;
  activated?(): void;
  deactivated?(): void;
  errorCaptured?(): boolean | void;

  directives?: { [key: string]: DirectiveFunction | DirectiveOptions };
  components?: { [key: string]: Component<any, any, any, any> | AsyncComponent<any, any, any, any> };
  transitions?: { [key: string]: Object };
  filters?: { [key: string]: Function };

  provide?: Object | (() => Object);
  inject?: InjectOptions;

  model?: {
    prop?: string;
    event?: string;
  };

  parent?: Vue;
  mixins?: (ComponentOptions<Vue> | typeof Vue)[];
  name?: string;
  // TODO: support properly inferred 'extends'
  extends?: ComponentOptions<Vue> | typeof Vue;
  delimiters?: [string, string];
  comments?: boolean;
  inheritAttrs?: boolean;
}

declare interface FunctionalComponentOptions<Props = DefaultProps, PropDefs = PropsDefinition<Props>> {
  name?: string;
  props?: PropDefs;
  inject?: InjectOptions;
  functional: boolean;
  render(this: undefined, createElement: CreateElement, context: RenderContext<Props>): VNode;
}

declare interface RenderContext<Props=DefaultProps> {
  props: Props;
  children: VNode[];
  slots(): any;
  data: VNodeData;
  parent: Vue;
  injections: any
}

declare type Prop<T> = { (): T } | { new (...args: any[]): T & object }

declare type PropValidator<T> = PropOptions<T> | Prop<T> | Prop<T>[];

declare interface PropOptions<T=any> {
  type?: Prop<T> | Prop<T>[];
  required?: boolean;
  default?: T | null | undefined | (() => object);
  validator?(value: T): boolean;
}

declare type RecordPropsDefinition<T> = {
  [K in keyof T]: PropValidator<T[K]>
}
declare type ArrayPropsDefinition<T> = (keyof T)[];
declare type PropsDefinition<T> = ArrayPropsDefinition<T> | RecordPropsDefinition<T>;

declare interface ComputedOptions<T> {
  get?(): T;
  set?(value: T): void;
  cache?: boolean;
}

declare type WatchHandler<T> = (val: T, oldVal: T) => void;

declare interface WatchOptions {
  deep?: boolean;
  immediate?: boolean;
}

declare interface WatchOptionsWithHandler<T> extends WatchOptions {
  handler: WatchHandler<T>;
}

declare type DirectiveFunction = (
  el: HTMLElement,
  binding: VNodeDirective,
  vnode: VNode,
  oldVnode: VNode
) => void;

declare interface DirectiveOptions {
  bind?: DirectiveFunction;
  inserted?: DirectiveFunction;
  update?: DirectiveFunction;
  componentUpdated?: DirectiveFunction;
  unbind?: DirectiveFunction;
}

declare type InjectKey = string | symbol;

declare type InjectOptions = {
  [key: string]: InjectKey | { from?: InjectKey, default?: any }
} | string[];


