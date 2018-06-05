var $protobuf = protobuf;
// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.pb = (function() {

    /**
     * Namespace pb.
     * @exports pb
     * @namespace
     */
    var pb = {};

    pb.mark = (function() {

        /**
         * Namespace mark.
         * @memberof pb
         * @namespace
         */
        var mark = {};

        /**
         * cmd enum.
         * @name pb.mark.cmd
         * @enum {string}
         * @property {number} NONE=0 NONE value
         * @property {number} CONNECT_SUCCESS=101 CONNECT_SUCCESS value
         * @property {number} CONNECT_EXCEPTION=102 CONNECT_EXCEPTION value
         * @property {number} CONNECT_FAILURE=103 CONNECT_FAILURE value
         * @property {number} CONNECT_BREAK=104 CONNECT_BREAK value
         * @property {number} COMMON_MSG=1000 COMMON_MSG value
         */
        mark.cmd = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NONE"] = 0;
            values[valuesById[101] = "CONNECT_SUCCESS"] = 101;
            values[valuesById[102] = "CONNECT_EXCEPTION"] = 102;
            values[valuesById[103] = "CONNECT_FAILURE"] = 103;
            values[valuesById[104] = "CONNECT_BREAK"] = 104;
            values[valuesById[1000] = "COMMON_MSG"] = 1000;
            return values;
        })();

        mark.Login = (function() {

            /**
             * Properties of a Login.
             * @memberof pb.mark
             * @interface ILogin
             * @property {string} account Login account
             * @property {string} password Login password
             */

            /**
             * Constructs a new Login.
             * @memberof pb.mark
             * @classdesc Represents a Login.
             * @implements ILogin
             * @constructor
             * @param {pb.mark.ILogin=} [properties] Properties to set
             */
            function Login(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Login account.
             * @member {string} account
             * @memberof pb.mark.Login
             * @instance
             */
            Login.prototype.account = "";

            /**
             * Login password.
             * @member {string} password
             * @memberof pb.mark.Login
             * @instance
             */
            Login.prototype.password = "";

            /**
             * Creates a new Login instance using the specified properties.
             * @function create
             * @memberof pb.mark.Login
             * @static
             * @param {pb.mark.ILogin=} [properties] Properties to set
             * @returns {pb.mark.Login} Login instance
             */
            Login.create = function create(properties) {
                return new Login(properties);
            };

            /**
             * Encodes the specified Login message. Does not implicitly {@link pb.mark.Login.verify|verify} messages.
             * @function encode
             * @memberof pb.mark.Login
             * @static
             * @param {pb.mark.ILogin} message Login message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Login.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.account);
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.password);
                return writer;
            };

            /**
             * Encodes the specified Login message, length delimited. Does not implicitly {@link pb.mark.Login.verify|verify} messages.
             * @function encodeDelimited
             * @memberof pb.mark.Login
             * @static
             * @param {pb.mark.ILogin} message Login message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Login.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Login message from the specified reader or buffer.
             * @function decode
             * @memberof pb.mark.Login
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {pb.mark.Login} Login
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Login.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.mark.Login();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.account = reader.string();
                        break;
                    case 2:
                        message.password = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("account"))
                    throw $util.ProtocolError("missing required 'account'", { instance: message });
                if (!message.hasOwnProperty("password"))
                    throw $util.ProtocolError("missing required 'password'", { instance: message });
                return message;
            };

            /**
             * Decodes a Login message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof pb.mark.Login
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {pb.mark.Login} Login
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Login.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Login message.
             * @function verify
             * @memberof pb.mark.Login
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Login.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (!$util.isString(message.account))
                    return "account: string expected";
                if (!$util.isString(message.password))
                    return "password: string expected";
                return null;
            };

            /**
             * Creates a Login message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof pb.mark.Login
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {pb.mark.Login} Login
             */
            Login.fromObject = function fromObject(object) {
                if (object instanceof $root.pb.mark.Login)
                    return object;
                var message = new $root.pb.mark.Login();
                if (object.account != null)
                    message.account = String(object.account);
                if (object.password != null)
                    message.password = String(object.password);
                return message;
            };

            /**
             * Creates a plain object from a Login message. Also converts values to other types if specified.
             * @function toObject
             * @memberof pb.mark.Login
             * @static
             * @param {pb.mark.Login} message Login
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Login.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.account = "";
                    object.password = "";
                }
                if (message.account != null && message.hasOwnProperty("account"))
                    object.account = message.account;
                if (message.password != null && message.hasOwnProperty("password"))
                    object.password = message.password;
                return object;
            };

            /**
             * Converts this Login to JSON.
             * @function toJSON
             * @memberof pb.mark.Login
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Login.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Login;
        })();

        mark.XY = (function() {

            /**
             * Properties of a XY.
             * @memberof pb.mark
             * @interface IXY
             * @property {number|null} [x] XY x
             * @property {number|null} [y] XY y
             */

            /**
             * Constructs a new XY.
             * @memberof pb.mark
             * @classdesc Represents a XY.
             * @implements IXY
             * @constructor
             * @param {pb.mark.IXY=} [properties] Properties to set
             */
            function XY(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * XY x.
             * @member {number} x
             * @memberof pb.mark.XY
             * @instance
             */
            XY.prototype.x = 0;

            /**
             * XY y.
             * @member {number} y
             * @memberof pb.mark.XY
             * @instance
             */
            XY.prototype.y = 0;

            /**
             * Creates a new XY instance using the specified properties.
             * @function create
             * @memberof pb.mark.XY
             * @static
             * @param {pb.mark.IXY=} [properties] Properties to set
             * @returns {pb.mark.XY} XY instance
             */
            XY.create = function create(properties) {
                return new XY(properties);
            };

            /**
             * Encodes the specified XY message. Does not implicitly {@link pb.mark.XY.verify|verify} messages.
             * @function encode
             * @memberof pb.mark.XY
             * @static
             * @param {pb.mark.IXY} message XY message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            XY.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.x != null && message.hasOwnProperty("x"))
                    writer.uint32(/* id 1, wireType 5 =*/13).float(message.x);
                if (message.y != null && message.hasOwnProperty("y"))
                    writer.uint32(/* id 2, wireType 5 =*/21).float(message.y);
                return writer;
            };

            /**
             * Encodes the specified XY message, length delimited. Does not implicitly {@link pb.mark.XY.verify|verify} messages.
             * @function encodeDelimited
             * @memberof pb.mark.XY
             * @static
             * @param {pb.mark.IXY} message XY message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            XY.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a XY message from the specified reader or buffer.
             * @function decode
             * @memberof pb.mark.XY
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {pb.mark.XY} XY
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            XY.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.mark.XY();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.x = reader.float();
                        break;
                    case 2:
                        message.y = reader.float();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a XY message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof pb.mark.XY
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {pb.mark.XY} XY
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            XY.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a XY message.
             * @function verify
             * @memberof pb.mark.XY
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            XY.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.x != null && message.hasOwnProperty("x"))
                    if (typeof message.x !== "number")
                        return "x: number expected";
                if (message.y != null && message.hasOwnProperty("y"))
                    if (typeof message.y !== "number")
                        return "y: number expected";
                return null;
            };

            /**
             * Creates a XY message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof pb.mark.XY
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {pb.mark.XY} XY
             */
            XY.fromObject = function fromObject(object) {
                if (object instanceof $root.pb.mark.XY)
                    return object;
                var message = new $root.pb.mark.XY();
                if (object.x != null)
                    message.x = Number(object.x);
                if (object.y != null)
                    message.y = Number(object.y);
                return message;
            };

            /**
             * Creates a plain object from a XY message. Also converts values to other types if specified.
             * @function toObject
             * @memberof pb.mark.XY
             * @static
             * @param {pb.mark.XY} message XY
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            XY.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.x = 0;
                    object.y = 0;
                }
                if (message.x != null && message.hasOwnProperty("x"))
                    object.x = options.json && !isFinite(message.x) ? String(message.x) : message.x;
                if (message.y != null && message.hasOwnProperty("y"))
                    object.y = options.json && !isFinite(message.y) ? String(message.y) : message.y;
                return object;
            };

            /**
             * Converts this XY to JSON.
             * @function toJSON
             * @memberof pb.mark.XY
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            XY.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return XY;
        })();

        mark.MarkBody = (function() {

            /**
             * Properties of a MarkBody.
             * @memberof pb.mark
             * @interface IMarkBody
             * @property {number|Long|null} [mid] MarkBody mid
             * @property {string|null} [name] MarkBody name
             * @property {number|null} [kind] MarkBody kind
             * @property {string|null} [refName] MarkBody refName
             * @property {string|null} [refPath] MarkBody refPath
             * @property {Array.<pb.mark.ILine>|null} [lines] MarkBody lines
             * @property {Array.<pb.mark.IBookmark>|null} [bookmarks] MarkBody bookmarks
             */

            /**
             * Constructs a new MarkBody.
             * @memberof pb.mark
             * @classdesc Represents a MarkBody.
             * @implements IMarkBody
             * @constructor
             * @param {pb.mark.IMarkBody=} [properties] Properties to set
             */
            function MarkBody(properties) {
                this.lines = [];
                this.bookmarks = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * MarkBody mid.
             * @member {number|Long} mid
             * @memberof pb.mark.MarkBody
             * @instance
             */
            MarkBody.prototype.mid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * MarkBody name.
             * @member {string} name
             * @memberof pb.mark.MarkBody
             * @instance
             */
            MarkBody.prototype.name = "";

            /**
             * MarkBody kind.
             * @member {number} kind
             * @memberof pb.mark.MarkBody
             * @instance
             */
            MarkBody.prototype.kind = 0;

            /**
             * MarkBody refName.
             * @member {string} refName
             * @memberof pb.mark.MarkBody
             * @instance
             */
            MarkBody.prototype.refName = "";

            /**
             * MarkBody refPath.
             * @member {string} refPath
             * @memberof pb.mark.MarkBody
             * @instance
             */
            MarkBody.prototype.refPath = "";

            /**
             * MarkBody lines.
             * @member {Array.<pb.mark.ILine>} lines
             * @memberof pb.mark.MarkBody
             * @instance
             */
            MarkBody.prototype.lines = $util.emptyArray;

            /**
             * MarkBody bookmarks.
             * @member {Array.<pb.mark.IBookmark>} bookmarks
             * @memberof pb.mark.MarkBody
             * @instance
             */
            MarkBody.prototype.bookmarks = $util.emptyArray;

            /**
             * Creates a new MarkBody instance using the specified properties.
             * @function create
             * @memberof pb.mark.MarkBody
             * @static
             * @param {pb.mark.IMarkBody=} [properties] Properties to set
             * @returns {pb.mark.MarkBody} MarkBody instance
             */
            MarkBody.create = function create(properties) {
                return new MarkBody(properties);
            };

            /**
             * Encodes the specified MarkBody message. Does not implicitly {@link pb.mark.MarkBody.verify|verify} messages.
             * @function encode
             * @memberof pb.mark.MarkBody
             * @static
             * @param {pb.mark.IMarkBody} message MarkBody message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MarkBody.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.mid != null && message.hasOwnProperty("mid"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.mid);
                if (message.name != null && message.hasOwnProperty("name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                if (message.kind != null && message.hasOwnProperty("kind"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.kind);
                if (message.refName != null && message.hasOwnProperty("refName"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.refName);
                if (message.refPath != null && message.hasOwnProperty("refPath"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.refPath);
                if (message.lines != null && message.lines.length)
                    for (var i = 0; i < message.lines.length; ++i)
                        $root.pb.mark.Line.encode(message.lines[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.bookmarks != null && message.bookmarks.length)
                    for (var i = 0; i < message.bookmarks.length; ++i)
                        $root.pb.mark.Bookmark.encode(message.bookmarks[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified MarkBody message, length delimited. Does not implicitly {@link pb.mark.MarkBody.verify|verify} messages.
             * @function encodeDelimited
             * @memberof pb.mark.MarkBody
             * @static
             * @param {pb.mark.IMarkBody} message MarkBody message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MarkBody.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MarkBody message from the specified reader or buffer.
             * @function decode
             * @memberof pb.mark.MarkBody
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {pb.mark.MarkBody} MarkBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MarkBody.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.mark.MarkBody();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.mid = reader.uint64();
                        break;
                    case 2:
                        message.name = reader.string();
                        break;
                    case 3:
                        message.kind = reader.uint32();
                        break;
                    case 4:
                        message.refName = reader.string();
                        break;
                    case 5:
                        message.refPath = reader.string();
                        break;
                    case 6:
                        if (!(message.lines && message.lines.length))
                            message.lines = [];
                        message.lines.push($root.pb.mark.Line.decode(reader, reader.uint32()));
                        break;
                    case 7:
                        if (!(message.bookmarks && message.bookmarks.length))
                            message.bookmarks = [];
                        message.bookmarks.push($root.pb.mark.Bookmark.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a MarkBody message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof pb.mark.MarkBody
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {pb.mark.MarkBody} MarkBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MarkBody.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MarkBody message.
             * @function verify
             * @memberof pb.mark.MarkBody
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MarkBody.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.mid != null && message.hasOwnProperty("mid"))
                    if (!$util.isInteger(message.mid) && !(message.mid && $util.isInteger(message.mid.low) && $util.isInteger(message.mid.high)))
                        return "mid: integer|Long expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.kind != null && message.hasOwnProperty("kind"))
                    if (!$util.isInteger(message.kind))
                        return "kind: integer expected";
                if (message.refName != null && message.hasOwnProperty("refName"))
                    if (!$util.isString(message.refName))
                        return "refName: string expected";
                if (message.refPath != null && message.hasOwnProperty("refPath"))
                    if (!$util.isString(message.refPath))
                        return "refPath: string expected";
                if (message.lines != null && message.hasOwnProperty("lines")) {
                    if (!Array.isArray(message.lines))
                        return "lines: array expected";
                    for (var i = 0; i < message.lines.length; ++i) {
                        var error = $root.pb.mark.Line.verify(message.lines[i]);
                        if (error)
                            return "lines." + error;
                    }
                }
                if (message.bookmarks != null && message.hasOwnProperty("bookmarks")) {
                    if (!Array.isArray(message.bookmarks))
                        return "bookmarks: array expected";
                    for (var i = 0; i < message.bookmarks.length; ++i) {
                        var error = $root.pb.mark.Bookmark.verify(message.bookmarks[i]);
                        if (error)
                            return "bookmarks." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a MarkBody message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof pb.mark.MarkBody
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {pb.mark.MarkBody} MarkBody
             */
            MarkBody.fromObject = function fromObject(object) {
                if (object instanceof $root.pb.mark.MarkBody)
                    return object;
                var message = new $root.pb.mark.MarkBody();
                if (object.mid != null)
                    if ($util.Long)
                        (message.mid = $util.Long.fromValue(object.mid)).unsigned = true;
                    else if (typeof object.mid === "string")
                        message.mid = parseInt(object.mid, 10);
                    else if (typeof object.mid === "number")
                        message.mid = object.mid;
                    else if (typeof object.mid === "object")
                        message.mid = new $util.LongBits(object.mid.low >>> 0, object.mid.high >>> 0).toNumber(true);
                if (object.name != null)
                    message.name = String(object.name);
                if (object.kind != null)
                    message.kind = object.kind >>> 0;
                if (object.refName != null)
                    message.refName = String(object.refName);
                if (object.refPath != null)
                    message.refPath = String(object.refPath);
                if (object.lines) {
                    if (!Array.isArray(object.lines))
                        throw TypeError(".pb.mark.MarkBody.lines: array expected");
                    message.lines = [];
                    for (var i = 0; i < object.lines.length; ++i) {
                        if (typeof object.lines[i] !== "object")
                            throw TypeError(".pb.mark.MarkBody.lines: object expected");
                        message.lines[i] = $root.pb.mark.Line.fromObject(object.lines[i]);
                    }
                }
                if (object.bookmarks) {
                    if (!Array.isArray(object.bookmarks))
                        throw TypeError(".pb.mark.MarkBody.bookmarks: array expected");
                    message.bookmarks = [];
                    for (var i = 0; i < object.bookmarks.length; ++i) {
                        if (typeof object.bookmarks[i] !== "object")
                            throw TypeError(".pb.mark.MarkBody.bookmarks: object expected");
                        message.bookmarks[i] = $root.pb.mark.Bookmark.fromObject(object.bookmarks[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a MarkBody message. Also converts values to other types if specified.
             * @function toObject
             * @memberof pb.mark.MarkBody
             * @static
             * @param {pb.mark.MarkBody} message MarkBody
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MarkBody.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.lines = [];
                    object.bookmarks = [];
                }
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.mid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.mid = options.longs === String ? "0" : 0;
                    object.name = "";
                    object.kind = 0;
                    object.refName = "";
                    object.refPath = "";
                }
                if (message.mid != null && message.hasOwnProperty("mid"))
                    if (typeof message.mid === "number")
                        object.mid = options.longs === String ? String(message.mid) : message.mid;
                    else
                        object.mid = options.longs === String ? $util.Long.prototype.toString.call(message.mid) : options.longs === Number ? new $util.LongBits(message.mid.low >>> 0, message.mid.high >>> 0).toNumber(true) : message.mid;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.kind != null && message.hasOwnProperty("kind"))
                    object.kind = message.kind;
                if (message.refName != null && message.hasOwnProperty("refName"))
                    object.refName = message.refName;
                if (message.refPath != null && message.hasOwnProperty("refPath"))
                    object.refPath = message.refPath;
                if (message.lines && message.lines.length) {
                    object.lines = [];
                    for (var j = 0; j < message.lines.length; ++j)
                        object.lines[j] = $root.pb.mark.Line.toObject(message.lines[j], options);
                }
                if (message.bookmarks && message.bookmarks.length) {
                    object.bookmarks = [];
                    for (var j = 0; j < message.bookmarks.length; ++j)
                        object.bookmarks[j] = $root.pb.mark.Bookmark.toObject(message.bookmarks[j], options);
                }
                return object;
            };

            /**
             * Converts this MarkBody to JSON.
             * @function toJSON
             * @memberof pb.mark.MarkBody
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MarkBody.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return MarkBody;
        })();

        mark.Bookmark = (function() {

            /**
             * Properties of a Bookmark.
             * @memberof pb.mark
             * @interface IBookmark
             * @property {number|null} [depth] Bookmark depth
             * @property {string|null} [title] Bookmark title
             * @property {string|null} [content] Bookmark content
             * @property {number|null} [page] Bookmark page
             * @property {pb.mark.IXY|null} [scorllXY] Bookmark scorllXY
             */

            /**
             * Constructs a new Bookmark.
             * @memberof pb.mark
             * @classdesc Represents a Bookmark.
             * @implements IBookmark
             * @constructor
             * @param {pb.mark.IBookmark=} [properties] Properties to set
             */
            function Bookmark(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Bookmark depth.
             * @member {number} depth
             * @memberof pb.mark.Bookmark
             * @instance
             */
            Bookmark.prototype.depth = 0;

            /**
             * Bookmark title.
             * @member {string} title
             * @memberof pb.mark.Bookmark
             * @instance
             */
            Bookmark.prototype.title = "";

            /**
             * Bookmark content.
             * @member {string} content
             * @memberof pb.mark.Bookmark
             * @instance
             */
            Bookmark.prototype.content = "";

            /**
             * Bookmark page.
             * @member {number} page
             * @memberof pb.mark.Bookmark
             * @instance
             */
            Bookmark.prototype.page = 0;

            /**
             * Bookmark scorllXY.
             * @member {pb.mark.IXY|null|undefined} scorllXY
             * @memberof pb.mark.Bookmark
             * @instance
             */
            Bookmark.prototype.scorllXY = null;

            /**
             * Creates a new Bookmark instance using the specified properties.
             * @function create
             * @memberof pb.mark.Bookmark
             * @static
             * @param {pb.mark.IBookmark=} [properties] Properties to set
             * @returns {pb.mark.Bookmark} Bookmark instance
             */
            Bookmark.create = function create(properties) {
                return new Bookmark(properties);
            };

            /**
             * Encodes the specified Bookmark message. Does not implicitly {@link pb.mark.Bookmark.verify|verify} messages.
             * @function encode
             * @memberof pb.mark.Bookmark
             * @static
             * @param {pb.mark.IBookmark} message Bookmark message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Bookmark.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.depth != null && message.hasOwnProperty("depth"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.depth);
                if (message.title != null && message.hasOwnProperty("title"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.title);
                if (message.content != null && message.hasOwnProperty("content"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.content);
                if (message.page != null && message.hasOwnProperty("page"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.page);
                if (message.scorllXY != null && message.hasOwnProperty("scorllXY"))
                    $root.pb.mark.XY.encode(message.scorllXY, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Bookmark message, length delimited. Does not implicitly {@link pb.mark.Bookmark.verify|verify} messages.
             * @function encodeDelimited
             * @memberof pb.mark.Bookmark
             * @static
             * @param {pb.mark.IBookmark} message Bookmark message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Bookmark.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Bookmark message from the specified reader or buffer.
             * @function decode
             * @memberof pb.mark.Bookmark
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {pb.mark.Bookmark} Bookmark
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Bookmark.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.mark.Bookmark();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.depth = reader.uint32();
                        break;
                    case 2:
                        message.title = reader.string();
                        break;
                    case 3:
                        message.content = reader.string();
                        break;
                    case 4:
                        message.page = reader.uint32();
                        break;
                    case 5:
                        message.scorllXY = $root.pb.mark.XY.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Bookmark message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof pb.mark.Bookmark
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {pb.mark.Bookmark} Bookmark
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Bookmark.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Bookmark message.
             * @function verify
             * @memberof pb.mark.Bookmark
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Bookmark.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.depth != null && message.hasOwnProperty("depth"))
                    if (!$util.isInteger(message.depth))
                        return "depth: integer expected";
                if (message.title != null && message.hasOwnProperty("title"))
                    if (!$util.isString(message.title))
                        return "title: string expected";
                if (message.content != null && message.hasOwnProperty("content"))
                    if (!$util.isString(message.content))
                        return "content: string expected";
                if (message.page != null && message.hasOwnProperty("page"))
                    if (!$util.isInteger(message.page))
                        return "page: integer expected";
                if (message.scorllXY != null && message.hasOwnProperty("scorllXY")) {
                    var error = $root.pb.mark.XY.verify(message.scorllXY);
                    if (error)
                        return "scorllXY." + error;
                }
                return null;
            };

            /**
             * Creates a Bookmark message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof pb.mark.Bookmark
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {pb.mark.Bookmark} Bookmark
             */
            Bookmark.fromObject = function fromObject(object) {
                if (object instanceof $root.pb.mark.Bookmark)
                    return object;
                var message = new $root.pb.mark.Bookmark();
                if (object.depth != null)
                    message.depth = object.depth >>> 0;
                if (object.title != null)
                    message.title = String(object.title);
                if (object.content != null)
                    message.content = String(object.content);
                if (object.page != null)
                    message.page = object.page >>> 0;
                if (object.scorllXY != null) {
                    if (typeof object.scorllXY !== "object")
                        throw TypeError(".pb.mark.Bookmark.scorllXY: object expected");
                    message.scorllXY = $root.pb.mark.XY.fromObject(object.scorllXY);
                }
                return message;
            };

            /**
             * Creates a plain object from a Bookmark message. Also converts values to other types if specified.
             * @function toObject
             * @memberof pb.mark.Bookmark
             * @static
             * @param {pb.mark.Bookmark} message Bookmark
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Bookmark.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.depth = 0;
                    object.title = "";
                    object.content = "";
                    object.page = 0;
                    object.scorllXY = null;
                }
                if (message.depth != null && message.hasOwnProperty("depth"))
                    object.depth = message.depth;
                if (message.title != null && message.hasOwnProperty("title"))
                    object.title = message.title;
                if (message.content != null && message.hasOwnProperty("content"))
                    object.content = message.content;
                if (message.page != null && message.hasOwnProperty("page"))
                    object.page = message.page;
                if (message.scorllXY != null && message.hasOwnProperty("scorllXY"))
                    object.scorllXY = $root.pb.mark.XY.toObject(message.scorllXY, options);
                return object;
            };

            /**
             * Converts this Bookmark to JSON.
             * @function toJSON
             * @memberof pb.mark.Bookmark
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Bookmark.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Bookmark;
        })();

        mark.Line = (function() {

            /**
             * Properties of a Line.
             * @memberof pb.mark
             * @interface ILine
             * @property {Array.<pb.mark.IXY>|null} [poiList] Line poiList
             * @property {number|null} [page] Line page
             */

            /**
             * Constructs a new Line.
             * @memberof pb.mark
             * @classdesc Represents a Line.
             * @implements ILine
             * @constructor
             * @param {pb.mark.ILine=} [properties] Properties to set
             */
            function Line(properties) {
                this.poiList = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Line poiList.
             * @member {Array.<pb.mark.IXY>} poiList
             * @memberof pb.mark.Line
             * @instance
             */
            Line.prototype.poiList = $util.emptyArray;

            /**
             * Line page.
             * @member {number} page
             * @memberof pb.mark.Line
             * @instance
             */
            Line.prototype.page = 0;

            /**
             * Creates a new Line instance using the specified properties.
             * @function create
             * @memberof pb.mark.Line
             * @static
             * @param {pb.mark.ILine=} [properties] Properties to set
             * @returns {pb.mark.Line} Line instance
             */
            Line.create = function create(properties) {
                return new Line(properties);
            };

            /**
             * Encodes the specified Line message. Does not implicitly {@link pb.mark.Line.verify|verify} messages.
             * @function encode
             * @memberof pb.mark.Line
             * @static
             * @param {pb.mark.ILine} message Line message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Line.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.poiList != null && message.poiList.length)
                    for (var i = 0; i < message.poiList.length; ++i)
                        $root.pb.mark.XY.encode(message.poiList[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.page != null && message.hasOwnProperty("page"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.page);
                return writer;
            };

            /**
             * Encodes the specified Line message, length delimited. Does not implicitly {@link pb.mark.Line.verify|verify} messages.
             * @function encodeDelimited
             * @memberof pb.mark.Line
             * @static
             * @param {pb.mark.ILine} message Line message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Line.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Line message from the specified reader or buffer.
             * @function decode
             * @memberof pb.mark.Line
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {pb.mark.Line} Line
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Line.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.mark.Line();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.poiList && message.poiList.length))
                            message.poiList = [];
                        message.poiList.push($root.pb.mark.XY.decode(reader, reader.uint32()));
                        break;
                    case 2:
                        message.page = reader.uint32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Line message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof pb.mark.Line
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {pb.mark.Line} Line
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Line.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Line message.
             * @function verify
             * @memberof pb.mark.Line
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Line.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.poiList != null && message.hasOwnProperty("poiList")) {
                    if (!Array.isArray(message.poiList))
                        return "poiList: array expected";
                    for (var i = 0; i < message.poiList.length; ++i) {
                        var error = $root.pb.mark.XY.verify(message.poiList[i]);
                        if (error)
                            return "poiList." + error;
                    }
                }
                if (message.page != null && message.hasOwnProperty("page"))
                    if (!$util.isInteger(message.page))
                        return "page: integer expected";
                return null;
            };

            /**
             * Creates a Line message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof pb.mark.Line
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {pb.mark.Line} Line
             */
            Line.fromObject = function fromObject(object) {
                if (object instanceof $root.pb.mark.Line)
                    return object;
                var message = new $root.pb.mark.Line();
                if (object.poiList) {
                    if (!Array.isArray(object.poiList))
                        throw TypeError(".pb.mark.Line.poiList: array expected");
                    message.poiList = [];
                    for (var i = 0; i < object.poiList.length; ++i) {
                        if (typeof object.poiList[i] !== "object")
                            throw TypeError(".pb.mark.Line.poiList: object expected");
                        message.poiList[i] = $root.pb.mark.XY.fromObject(object.poiList[i]);
                    }
                }
                if (object.page != null)
                    message.page = object.page >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a Line message. Also converts values to other types if specified.
             * @function toObject
             * @memberof pb.mark.Line
             * @static
             * @param {pb.mark.Line} message Line
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Line.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.poiList = [];
                if (options.defaults)
                    object.page = 0;
                if (message.poiList && message.poiList.length) {
                    object.poiList = [];
                    for (var j = 0; j < message.poiList.length; ++j)
                        object.poiList[j] = $root.pb.mark.XY.toObject(message.poiList[j], options);
                }
                if (message.page != null && message.hasOwnProperty("page"))
                    object.page = message.page;
                return object;
            };

            /**
             * Converts this Line to JSON.
             * @function toJSON
             * @memberof pb.mark.Line
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Line.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Line;
        })();

        return mark;
    })();

    return pb;
})();
pb = $root.pb