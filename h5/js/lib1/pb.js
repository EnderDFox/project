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

    /**
     * cmd enum.
     * @name pb.cmd
     * @enum {string}
     * @property {number} NONE=0 NONE value
     * @property {number} CONNECT_SUCCESS=101 CONNECT_SUCCESS value
     * @property {number} CONNECT_EXCEPTION=102 CONNECT_EXCEPTION value
     * @property {number} CONNECT_BREAK=103 CONNECT_BREAK value
     * @property {number} CONNECT_FAILURE=104 CONNECT_FAILURE value
     * @property {number} COMMON_MSG=1000 COMMON_MSG value
     * @property {number} BATTLE_ENTER=5001 BATTLE_ENTER value
     * @property {number} BATTLE_TANK_MOVE=5002 BATTLE_TANK_MOVE value
     */
    pb.cmd = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "NONE"] = 0;
        values[valuesById[101] = "CONNECT_SUCCESS"] = 101;
        values[valuesById[102] = "CONNECT_EXCEPTION"] = 102;
        values[valuesById[103] = "CONNECT_BREAK"] = 103;
        values[valuesById[104] = "CONNECT_FAILURE"] = 104;
        values[valuesById[1000] = "COMMON_MSG"] = 1000;
        values[valuesById[5001] = "BATTLE_ENTER"] = 5001;
        values[valuesById[5002] = "BATTLE_TANK_MOVE"] = 5002;
        return values;
    })();

    pb.Login = (function() {

        /**
         * Properties of a Login.
         * @memberof pb
         * @interface ILogin
         * @property {string} account Login account
         * @property {string} password Login password
         */

        /**
         * Constructs a new Login.
         * @memberof pb
         * @classdesc Represents a Login.
         * @implements ILogin
         * @constructor
         * @param {pb.ILogin=} [properties] Properties to set
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
         * @memberof pb.Login
         * @instance
         */
        Login.prototype.account = "";

        /**
         * Login password.
         * @member {string} password
         * @memberof pb.Login
         * @instance
         */
        Login.prototype.password = "";

        /**
         * Creates a new Login instance using the specified properties.
         * @function create
         * @memberof pb.Login
         * @static
         * @param {pb.ILogin=} [properties] Properties to set
         * @returns {pb.Login} Login instance
         */
        Login.create = function create(properties) {
            return new Login(properties);
        };

        /**
         * Encodes the specified Login message. Does not implicitly {@link pb.Login.verify|verify} messages.
         * @function encode
         * @memberof pb.Login
         * @static
         * @param {pb.ILogin} message Login message or plain object to encode
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
         * Encodes the specified Login message, length delimited. Does not implicitly {@link pb.Login.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.Login
         * @static
         * @param {pb.ILogin} message Login message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Login.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Login message from the specified reader or buffer.
         * @function decode
         * @memberof pb.Login
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.Login} Login
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Login.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.Login();
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
         * @memberof pb.Login
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.Login} Login
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
         * @memberof pb.Login
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
         * @memberof pb.Login
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.Login} Login
         */
        Login.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.Login)
                return object;
            var message = new $root.pb.Login();
            if (object.account != null)
                message.account = String(object.account);
            if (object.password != null)
                message.password = String(object.password);
            return message;
        };

        /**
         * Creates a plain object from a Login message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.Login
         * @static
         * @param {pb.Login} message Login
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
         * @memberof pb.Login
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Login.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Login;
    })();

    pb.createRole = (function() {

        /**
         * Properties of a createRole.
         * @memberof pb
         * @interface IcreateRole
         * @property {string} name createRole name
         * @property {number} sex createRole sex
         */

        /**
         * Constructs a new createRole.
         * @memberof pb
         * @classdesc Represents a createRole.
         * @implements IcreateRole
         * @constructor
         * @param {pb.IcreateRole=} [properties] Properties to set
         */
        function createRole(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * createRole name.
         * @member {string} name
         * @memberof pb.createRole
         * @instance
         */
        createRole.prototype.name = "";

        /**
         * createRole sex.
         * @member {number} sex
         * @memberof pb.createRole
         * @instance
         */
        createRole.prototype.sex = 0;

        /**
         * Creates a new createRole instance using the specified properties.
         * @function create
         * @memberof pb.createRole
         * @static
         * @param {pb.IcreateRole=} [properties] Properties to set
         * @returns {pb.createRole} createRole instance
         */
        createRole.create = function create(properties) {
            return new createRole(properties);
        };

        /**
         * Encodes the specified createRole message. Does not implicitly {@link pb.createRole.verify|verify} messages.
         * @function encode
         * @memberof pb.createRole
         * @static
         * @param {pb.IcreateRole} message createRole message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        createRole.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.sex);
            return writer;
        };

        /**
         * Encodes the specified createRole message, length delimited. Does not implicitly {@link pb.createRole.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.createRole
         * @static
         * @param {pb.IcreateRole} message createRole message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        createRole.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a createRole message from the specified reader or buffer.
         * @function decode
         * @memberof pb.createRole
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.createRole} createRole
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        createRole.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.createRole();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.name = reader.string();
                    break;
                case 2:
                    message.sex = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("name"))
                throw $util.ProtocolError("missing required 'name'", { instance: message });
            if (!message.hasOwnProperty("sex"))
                throw $util.ProtocolError("missing required 'sex'", { instance: message });
            return message;
        };

        /**
         * Decodes a createRole message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.createRole
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.createRole} createRole
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        createRole.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a createRole message.
         * @function verify
         * @memberof pb.createRole
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        createRole.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.name))
                return "name: string expected";
            if (!$util.isInteger(message.sex))
                return "sex: integer expected";
            return null;
        };

        /**
         * Creates a createRole message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.createRole
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.createRole} createRole
         */
        createRole.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.createRole)
                return object;
            var message = new $root.pb.createRole();
            if (object.name != null)
                message.name = String(object.name);
            if (object.sex != null)
                message.sex = object.sex | 0;
            return message;
        };

        /**
         * Creates a plain object from a createRole message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.createRole
         * @static
         * @param {pb.createRole} message createRole
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        createRole.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.name = "";
                object.sex = 0;
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.sex != null && message.hasOwnProperty("sex"))
                object.sex = message.sex;
            return object;
        };

        /**
         * Converts this createRole to JSON.
         * @function toJSON
         * @memberof pb.createRole
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        createRole.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return createRole;
    })();

    return pb;
})();
pb = $root.pb