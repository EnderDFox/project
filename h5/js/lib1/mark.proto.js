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

        mark.MarkDocList = (function() {

            /**
             * Properties of a MarkDocList.
             * @memberof pb.mark
             * @interface IMarkDocList
             * @property {Array.<pb.mark.IMarkDoc>|null} [MarkDocList] MarkDocList MarkDocList
             */

            /**
             * Constructs a new MarkDocList.
             * @memberof pb.mark
             * @classdesc Represents a MarkDocList.
             * @implements IMarkDocList
             * @constructor
             * @param {pb.mark.IMarkDocList=} [properties] Properties to set
             */
            function MarkDocList(properties) {
                this.MarkDocList = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * MarkDocList MarkDocList.
             * @member {Array.<pb.mark.IMarkDoc>} MarkDocList
             * @memberof pb.mark.MarkDocList
             * @instance
             */
            MarkDocList.prototype.MarkDocList = $util.emptyArray;

            /**
             * Creates a new MarkDocList instance using the specified properties.
             * @function create
             * @memberof pb.mark.MarkDocList
             * @static
             * @param {pb.mark.IMarkDocList=} [properties] Properties to set
             * @returns {pb.mark.MarkDocList} MarkDocList instance
             */
            MarkDocList.create = function create(properties) {
                return new MarkDocList(properties);
            };

            /**
             * Encodes the specified MarkDocList message. Does not implicitly {@link pb.mark.MarkDocList.verify|verify} messages.
             * @function encode
             * @memberof pb.mark.MarkDocList
             * @static
             * @param {pb.mark.IMarkDocList} message MarkDocList message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MarkDocList.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.MarkDocList != null && message.MarkDocList.length)
                    for (var i = 0; i < message.MarkDocList.length; ++i)
                        $root.pb.mark.MarkDoc.encode(message.MarkDocList[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified MarkDocList message, length delimited. Does not implicitly {@link pb.mark.MarkDocList.verify|verify} messages.
             * @function encodeDelimited
             * @memberof pb.mark.MarkDocList
             * @static
             * @param {pb.mark.IMarkDocList} message MarkDocList message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MarkDocList.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MarkDocList message from the specified reader or buffer.
             * @function decode
             * @memberof pb.mark.MarkDocList
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {pb.mark.MarkDocList} MarkDocList
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MarkDocList.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.mark.MarkDocList();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.MarkDocList && message.MarkDocList.length))
                            message.MarkDocList = [];
                        message.MarkDocList.push($root.pb.mark.MarkDoc.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a MarkDocList message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof pb.mark.MarkDocList
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {pb.mark.MarkDocList} MarkDocList
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MarkDocList.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MarkDocList message.
             * @function verify
             * @memberof pb.mark.MarkDocList
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MarkDocList.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.MarkDocList != null && message.hasOwnProperty("MarkDocList")) {
                    if (!Array.isArray(message.MarkDocList))
                        return "MarkDocList: array expected";
                    for (var i = 0; i < message.MarkDocList.length; ++i) {
                        var error = $root.pb.mark.MarkDoc.verify(message.MarkDocList[i]);
                        if (error)
                            return "MarkDocList." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a MarkDocList message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof pb.mark.MarkDocList
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {pb.mark.MarkDocList} MarkDocList
             */
            MarkDocList.fromObject = function fromObject(object) {
                if (object instanceof $root.pb.mark.MarkDocList)
                    return object;
                var message = new $root.pb.mark.MarkDocList();
                if (object.MarkDocList) {
                    if (!Array.isArray(object.MarkDocList))
                        throw TypeError(".pb.mark.MarkDocList.MarkDocList: array expected");
                    message.MarkDocList = [];
                    for (var i = 0; i < object.MarkDocList.length; ++i) {
                        if (typeof object.MarkDocList[i] !== "object")
                            throw TypeError(".pb.mark.MarkDocList.MarkDocList: object expected");
                        message.MarkDocList[i] = $root.pb.mark.MarkDoc.fromObject(object.MarkDocList[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a MarkDocList message. Also converts values to other types if specified.
             * @function toObject
             * @memberof pb.mark.MarkDocList
             * @static
             * @param {pb.mark.MarkDocList} message MarkDocList
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MarkDocList.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.MarkDocList = [];
                if (message.MarkDocList && message.MarkDocList.length) {
                    object.MarkDocList = [];
                    for (var j = 0; j < message.MarkDocList.length; ++j)
                        object.MarkDocList[j] = $root.pb.mark.MarkDoc.toObject(message.MarkDocList[j], options);
                }
                return object;
            };

            /**
             * Converts this MarkDocList to JSON.
             * @function toJSON
             * @memberof pb.mark.MarkDocList
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MarkDocList.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return MarkDocList;
        })();

        mark.MarkDoc = (function() {

            /**
             * Properties of a MarkDoc.
             * @memberof pb.mark
             * @interface IMarkDoc
             * @property {number|Long|null} [Mid] MarkDoc Mid
             * @property {string|null} [Name] MarkDoc Name
             * @property {number|null} [Kind] MarkDoc Kind
             * @property {string|null} [CreateDate] MarkDoc CreateDate
             * @property {string|null} [RefName] MarkDoc RefName
             * @property {Array.<pb.mark.ILine>|null} [Lines] MarkDoc Lines
             * @property {Array.<pb.mark.IBookmark>|null} [BookmarkList] MarkDoc BookmarkList
             */

            /**
             * Constructs a new MarkDoc.
             * @memberof pb.mark
             * @classdesc Represents a MarkDoc.
             * @implements IMarkDoc
             * @constructor
             * @param {pb.mark.IMarkDoc=} [properties] Properties to set
             */
            function MarkDoc(properties) {
                this.Lines = [];
                this.BookmarkList = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * MarkDoc Mid.
             * @member {number|Long} Mid
             * @memberof pb.mark.MarkDoc
             * @instance
             */
            MarkDoc.prototype.Mid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * MarkDoc Name.
             * @member {string} Name
             * @memberof pb.mark.MarkDoc
             * @instance
             */
            MarkDoc.prototype.Name = "";

            /**
             * MarkDoc Kind.
             * @member {number} Kind
             * @memberof pb.mark.MarkDoc
             * @instance
             */
            MarkDoc.prototype.Kind = 0;

            /**
             * MarkDoc CreateDate.
             * @member {string} CreateDate
             * @memberof pb.mark.MarkDoc
             * @instance
             */
            MarkDoc.prototype.CreateDate = "";

            /**
             * MarkDoc RefName.
             * @member {string} RefName
             * @memberof pb.mark.MarkDoc
             * @instance
             */
            MarkDoc.prototype.RefName = "";

            /**
             * MarkDoc Lines.
             * @member {Array.<pb.mark.ILine>} Lines
             * @memberof pb.mark.MarkDoc
             * @instance
             */
            MarkDoc.prototype.Lines = $util.emptyArray;

            /**
             * MarkDoc BookmarkList.
             * @member {Array.<pb.mark.IBookmark>} BookmarkList
             * @memberof pb.mark.MarkDoc
             * @instance
             */
            MarkDoc.prototype.BookmarkList = $util.emptyArray;

            /**
             * Creates a new MarkDoc instance using the specified properties.
             * @function create
             * @memberof pb.mark.MarkDoc
             * @static
             * @param {pb.mark.IMarkDoc=} [properties] Properties to set
             * @returns {pb.mark.MarkDoc} MarkDoc instance
             */
            MarkDoc.create = function create(properties) {
                return new MarkDoc(properties);
            };

            /**
             * Encodes the specified MarkDoc message. Does not implicitly {@link pb.mark.MarkDoc.verify|verify} messages.
             * @function encode
             * @memberof pb.mark.MarkDoc
             * @static
             * @param {pb.mark.IMarkDoc} message MarkDoc message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MarkDoc.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.Mid != null && message.hasOwnProperty("Mid"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.Mid);
                if (message.Name != null && message.hasOwnProperty("Name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.Name);
                if (message.Kind != null && message.hasOwnProperty("Kind"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.Kind);
                if (message.CreateDate != null && message.hasOwnProperty("CreateDate"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.CreateDate);
                if (message.RefName != null && message.hasOwnProperty("RefName"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.RefName);
                if (message.Lines != null && message.Lines.length)
                    for (var i = 0; i < message.Lines.length; ++i)
                        $root.pb.mark.Line.encode(message.Lines[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.BookmarkList != null && message.BookmarkList.length)
                    for (var i = 0; i < message.BookmarkList.length; ++i)
                        $root.pb.mark.Bookmark.encode(message.BookmarkList[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified MarkDoc message, length delimited. Does not implicitly {@link pb.mark.MarkDoc.verify|verify} messages.
             * @function encodeDelimited
             * @memberof pb.mark.MarkDoc
             * @static
             * @param {pb.mark.IMarkDoc} message MarkDoc message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MarkDoc.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MarkDoc message from the specified reader or buffer.
             * @function decode
             * @memberof pb.mark.MarkDoc
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {pb.mark.MarkDoc} MarkDoc
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MarkDoc.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.mark.MarkDoc();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.Mid = reader.uint64();
                        break;
                    case 2:
                        message.Name = reader.string();
                        break;
                    case 3:
                        message.Kind = reader.uint32();
                        break;
                    case 4:
                        message.CreateDate = reader.string();
                        break;
                    case 5:
                        message.RefName = reader.string();
                        break;
                    case 6:
                        if (!(message.Lines && message.Lines.length))
                            message.Lines = [];
                        message.Lines.push($root.pb.mark.Line.decode(reader, reader.uint32()));
                        break;
                    case 7:
                        if (!(message.BookmarkList && message.BookmarkList.length))
                            message.BookmarkList = [];
                        message.BookmarkList.push($root.pb.mark.Bookmark.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a MarkDoc message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof pb.mark.MarkDoc
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {pb.mark.MarkDoc} MarkDoc
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MarkDoc.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MarkDoc message.
             * @function verify
             * @memberof pb.mark.MarkDoc
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MarkDoc.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.Mid != null && message.hasOwnProperty("Mid"))
                    if (!$util.isInteger(message.Mid) && !(message.Mid && $util.isInteger(message.Mid.low) && $util.isInteger(message.Mid.high)))
                        return "Mid: integer|Long expected";
                if (message.Name != null && message.hasOwnProperty("Name"))
                    if (!$util.isString(message.Name))
                        return "Name: string expected";
                if (message.Kind != null && message.hasOwnProperty("Kind"))
                    if (!$util.isInteger(message.Kind))
                        return "Kind: integer expected";
                if (message.CreateDate != null && message.hasOwnProperty("CreateDate"))
                    if (!$util.isString(message.CreateDate))
                        return "CreateDate: string expected";
                if (message.RefName != null && message.hasOwnProperty("RefName"))
                    if (!$util.isString(message.RefName))
                        return "RefName: string expected";
                if (message.Lines != null && message.hasOwnProperty("Lines")) {
                    if (!Array.isArray(message.Lines))
                        return "Lines: array expected";
                    for (var i = 0; i < message.Lines.length; ++i) {
                        var error = $root.pb.mark.Line.verify(message.Lines[i]);
                        if (error)
                            return "Lines." + error;
                    }
                }
                if (message.BookmarkList != null && message.hasOwnProperty("BookmarkList")) {
                    if (!Array.isArray(message.BookmarkList))
                        return "BookmarkList: array expected";
                    for (var i = 0; i < message.BookmarkList.length; ++i) {
                        var error = $root.pb.mark.Bookmark.verify(message.BookmarkList[i]);
                        if (error)
                            return "BookmarkList." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a MarkDoc message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof pb.mark.MarkDoc
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {pb.mark.MarkDoc} MarkDoc
             */
            MarkDoc.fromObject = function fromObject(object) {
                if (object instanceof $root.pb.mark.MarkDoc)
                    return object;
                var message = new $root.pb.mark.MarkDoc();
                if (object.Mid != null)
                    if ($util.Long)
                        (message.Mid = $util.Long.fromValue(object.Mid)).unsigned = true;
                    else if (typeof object.Mid === "string")
                        message.Mid = parseInt(object.Mid, 10);
                    else if (typeof object.Mid === "number")
                        message.Mid = object.Mid;
                    else if (typeof object.Mid === "object")
                        message.Mid = new $util.LongBits(object.Mid.low >>> 0, object.Mid.high >>> 0).toNumber(true);
                if (object.Name != null)
                    message.Name = String(object.Name);
                if (object.Kind != null)
                    message.Kind = object.Kind >>> 0;
                if (object.CreateDate != null)
                    message.CreateDate = String(object.CreateDate);
                if (object.RefName != null)
                    message.RefName = String(object.RefName);
                if (object.Lines) {
                    if (!Array.isArray(object.Lines))
                        throw TypeError(".pb.mark.MarkDoc.Lines: array expected");
                    message.Lines = [];
                    for (var i = 0; i < object.Lines.length; ++i) {
                        if (typeof object.Lines[i] !== "object")
                            throw TypeError(".pb.mark.MarkDoc.Lines: object expected");
                        message.Lines[i] = $root.pb.mark.Line.fromObject(object.Lines[i]);
                    }
                }
                if (object.BookmarkList) {
                    if (!Array.isArray(object.BookmarkList))
                        throw TypeError(".pb.mark.MarkDoc.BookmarkList: array expected");
                    message.BookmarkList = [];
                    for (var i = 0; i < object.BookmarkList.length; ++i) {
                        if (typeof object.BookmarkList[i] !== "object")
                            throw TypeError(".pb.mark.MarkDoc.BookmarkList: object expected");
                        message.BookmarkList[i] = $root.pb.mark.Bookmark.fromObject(object.BookmarkList[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a MarkDoc message. Also converts values to other types if specified.
             * @function toObject
             * @memberof pb.mark.MarkDoc
             * @static
             * @param {pb.mark.MarkDoc} message MarkDoc
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MarkDoc.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.Lines = [];
                    object.BookmarkList = [];
                }
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.Mid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.Mid = options.longs === String ? "0" : 0;
                    object.Name = "";
                    object.Kind = 0;
                    object.CreateDate = "";
                    object.RefName = "";
                }
                if (message.Mid != null && message.hasOwnProperty("Mid"))
                    if (typeof message.Mid === "number")
                        object.Mid = options.longs === String ? String(message.Mid) : message.Mid;
                    else
                        object.Mid = options.longs === String ? $util.Long.prototype.toString.call(message.Mid) : options.longs === Number ? new $util.LongBits(message.Mid.low >>> 0, message.Mid.high >>> 0).toNumber(true) : message.Mid;
                if (message.Name != null && message.hasOwnProperty("Name"))
                    object.Name = message.Name;
                if (message.Kind != null && message.hasOwnProperty("Kind"))
                    object.Kind = message.Kind;
                if (message.CreateDate != null && message.hasOwnProperty("CreateDate"))
                    object.CreateDate = message.CreateDate;
                if (message.RefName != null && message.hasOwnProperty("RefName"))
                    object.RefName = message.RefName;
                if (message.Lines && message.Lines.length) {
                    object.Lines = [];
                    for (var j = 0; j < message.Lines.length; ++j)
                        object.Lines[j] = $root.pb.mark.Line.toObject(message.Lines[j], options);
                }
                if (message.BookmarkList && message.BookmarkList.length) {
                    object.BookmarkList = [];
                    for (var j = 0; j < message.BookmarkList.length; ++j)
                        object.BookmarkList[j] = $root.pb.mark.Bookmark.toObject(message.BookmarkList[j], options);
                }
                return object;
            };

            /**
             * Converts this MarkDoc to JSON.
             * @function toJSON
             * @memberof pb.mark.MarkDoc
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MarkDoc.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return MarkDoc;
        })();

        mark.Bookmark = (function() {

            /**
             * Properties of a Bookmark.
             * @memberof pb.mark
             * @interface IBookmark
             * @property {number|null} [Depth] Bookmark Depth
             * @property {string|null} [Title] Bookmark Title
             * @property {string|null} [Content] Bookmark Content
             * @property {number|null} [PageNum] Bookmark PageNum
             * @property {string|null} [RefPath] Bookmark RefPath
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
             * Bookmark Depth.
             * @member {number} Depth
             * @memberof pb.mark.Bookmark
             * @instance
             */
            Bookmark.prototype.Depth = 0;

            /**
             * Bookmark Title.
             * @member {string} Title
             * @memberof pb.mark.Bookmark
             * @instance
             */
            Bookmark.prototype.Title = "";

            /**
             * Bookmark Content.
             * @member {string} Content
             * @memberof pb.mark.Bookmark
             * @instance
             */
            Bookmark.prototype.Content = "";

            /**
             * Bookmark PageNum.
             * @member {number} PageNum
             * @memberof pb.mark.Bookmark
             * @instance
             */
            Bookmark.prototype.PageNum = 0;

            /**
             * Bookmark RefPath.
             * @member {string} RefPath
             * @memberof pb.mark.Bookmark
             * @instance
             */
            Bookmark.prototype.RefPath = "";

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
                if (message.Depth != null && message.hasOwnProperty("Depth"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.Depth);
                if (message.Title != null && message.hasOwnProperty("Title"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.Title);
                if (message.Content != null && message.hasOwnProperty("Content"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.Content);
                if (message.PageNum != null && message.hasOwnProperty("PageNum"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.PageNum);
                if (message.RefPath != null && message.hasOwnProperty("RefPath"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.RefPath);
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
                        message.Depth = reader.uint32();
                        break;
                    case 2:
                        message.Title = reader.string();
                        break;
                    case 3:
                        message.Content = reader.string();
                        break;
                    case 4:
                        message.PageNum = reader.uint32();
                        break;
                    case 5:
                        message.RefPath = reader.string();
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
                if (message.Depth != null && message.hasOwnProperty("Depth"))
                    if (!$util.isInteger(message.Depth))
                        return "Depth: integer expected";
                if (message.Title != null && message.hasOwnProperty("Title"))
                    if (!$util.isString(message.Title))
                        return "Title: string expected";
                if (message.Content != null && message.hasOwnProperty("Content"))
                    if (!$util.isString(message.Content))
                        return "Content: string expected";
                if (message.PageNum != null && message.hasOwnProperty("PageNum"))
                    if (!$util.isInteger(message.PageNum))
                        return "PageNum: integer expected";
                if (message.RefPath != null && message.hasOwnProperty("RefPath"))
                    if (!$util.isString(message.RefPath))
                        return "RefPath: string expected";
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
                if (object.Depth != null)
                    message.Depth = object.Depth >>> 0;
                if (object.Title != null)
                    message.Title = String(object.Title);
                if (object.Content != null)
                    message.Content = String(object.Content);
                if (object.PageNum != null)
                    message.PageNum = object.PageNum >>> 0;
                if (object.RefPath != null)
                    message.RefPath = String(object.RefPath);
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
                    object.Depth = 0;
                    object.Title = "";
                    object.Content = "";
                    object.PageNum = 0;
                    object.RefPath = "";
                }
                if (message.Depth != null && message.hasOwnProperty("Depth"))
                    object.Depth = message.Depth;
                if (message.Title != null && message.hasOwnProperty("Title"))
                    object.Title = message.Title;
                if (message.Content != null && message.hasOwnProperty("Content"))
                    object.Content = message.Content;
                if (message.PageNum != null && message.hasOwnProperty("PageNum"))
                    object.PageNum = message.PageNum;
                if (message.RefPath != null && message.hasOwnProperty("RefPath"))
                    object.RefPath = message.RefPath;
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
             * @property {Array.<pb.mark.IXY>|null} [PoiList] Line PoiList
             * @property {number|null} [PageNum] Line PageNum
             * @property {pb.mark.IXY|null} [RefXY] Line RefXY
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
                this.PoiList = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Line PoiList.
             * @member {Array.<pb.mark.IXY>} PoiList
             * @memberof pb.mark.Line
             * @instance
             */
            Line.prototype.PoiList = $util.emptyArray;

            /**
             * Line PageNum.
             * @member {number} PageNum
             * @memberof pb.mark.Line
             * @instance
             */
            Line.prototype.PageNum = 0;

            /**
             * Line RefXY.
             * @member {pb.mark.IXY|null|undefined} RefXY
             * @memberof pb.mark.Line
             * @instance
             */
            Line.prototype.RefXY = null;

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
                if (message.PoiList != null && message.PoiList.length)
                    for (var i = 0; i < message.PoiList.length; ++i)
                        $root.pb.mark.XY.encode(message.PoiList[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.PageNum != null && message.hasOwnProperty("PageNum"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.PageNum);
                if (message.RefXY != null && message.hasOwnProperty("RefXY"))
                    $root.pb.mark.XY.encode(message.RefXY, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
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
                        if (!(message.PoiList && message.PoiList.length))
                            message.PoiList = [];
                        message.PoiList.push($root.pb.mark.XY.decode(reader, reader.uint32()));
                        break;
                    case 2:
                        message.PageNum = reader.uint32();
                        break;
                    case 3:
                        message.RefXY = $root.pb.mark.XY.decode(reader, reader.uint32());
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
                if (message.PoiList != null && message.hasOwnProperty("PoiList")) {
                    if (!Array.isArray(message.PoiList))
                        return "PoiList: array expected";
                    for (var i = 0; i < message.PoiList.length; ++i) {
                        var error = $root.pb.mark.XY.verify(message.PoiList[i]);
                        if (error)
                            return "PoiList." + error;
                    }
                }
                if (message.PageNum != null && message.hasOwnProperty("PageNum"))
                    if (!$util.isInteger(message.PageNum))
                        return "PageNum: integer expected";
                if (message.RefXY != null && message.hasOwnProperty("RefXY")) {
                    var error = $root.pb.mark.XY.verify(message.RefXY);
                    if (error)
                        return "RefXY." + error;
                }
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
                if (object.PoiList) {
                    if (!Array.isArray(object.PoiList))
                        throw TypeError(".pb.mark.Line.PoiList: array expected");
                    message.PoiList = [];
                    for (var i = 0; i < object.PoiList.length; ++i) {
                        if (typeof object.PoiList[i] !== "object")
                            throw TypeError(".pb.mark.Line.PoiList: object expected");
                        message.PoiList[i] = $root.pb.mark.XY.fromObject(object.PoiList[i]);
                    }
                }
                if (object.PageNum != null)
                    message.PageNum = object.PageNum >>> 0;
                if (object.RefXY != null) {
                    if (typeof object.RefXY !== "object")
                        throw TypeError(".pb.mark.Line.RefXY: object expected");
                    message.RefXY = $root.pb.mark.XY.fromObject(object.RefXY);
                }
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
                    object.PoiList = [];
                if (options.defaults) {
                    object.PageNum = 0;
                    object.RefXY = null;
                }
                if (message.PoiList && message.PoiList.length) {
                    object.PoiList = [];
                    for (var j = 0; j < message.PoiList.length; ++j)
                        object.PoiList[j] = $root.pb.mark.XY.toObject(message.PoiList[j], options);
                }
                if (message.PageNum != null && message.hasOwnProperty("PageNum"))
                    object.PageNum = message.PageNum;
                if (message.RefXY != null && message.hasOwnProperty("RefXY"))
                    object.RefXY = $root.pb.mark.XY.toObject(message.RefXY, options);
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