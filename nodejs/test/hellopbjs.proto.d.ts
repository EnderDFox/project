
/** Namespace hellopbjs. */
export namespace hellopbjs {

    /** cmd enum. */
    enum cmd {
        NONE = 0,
        CONNECT_SUCCESS = 101,
        CONNECT_EXCEPTION = 102,
        CONNECT_BREAK = 103,
        CONNECT_FAILURE = 104,
        COMMON_MSG = 1000,
        BATTLE_ENTER = 5001,
        BATTLE_TANK_MOVE = 5002
    }

    /** Properties of a Login. */
    interface ILogin {

        /** Login account */
        account: string;

        /** Login password */
        password: string;

        /** Login uid */
        uid?: (number|Long|null);
    }

    /** Represents a Login. */
    class Login implements ILogin {

        /**
         * Constructs a new Login.
         * @param [properties] Properties to set
         */
        constructor(properties?: hellopbjs.ILogin);

        /** Login account. */
        public account: string;

        /** Login password. */
        public password: string;

        /** Login uid. */
        public uid: (number|Long);

        /**
         * Creates a new Login instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Login instance
         */
        public static create(properties?: hellopbjs.ILogin): hellopbjs.Login;

        /**
         * Encodes the specified Login message. Does not implicitly {@link hellopbjs.Login.verify|verify} messages.
         * @param message Login message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hellopbjs.ILogin, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Login message, length delimited. Does not implicitly {@link hellopbjs.Login.verify|verify} messages.
         * @param message Login message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hellopbjs.ILogin, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Login message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Login
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hellopbjs.Login;

        /**
         * Decodes a Login message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Login
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hellopbjs.Login;

        /**
         * Verifies a Login message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Login message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Login
         */
        public static fromObject(object: { [k: string]: any }): hellopbjs.Login;

        /**
         * Creates a plain object from a Login message. Also converts values to other types if specified.
         * @param message Login
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hellopbjs.Login, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Login to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a createRole. */
    interface IcreateRole {

        /** createRole name */
        name: string;

        /** createRole sex */
        sex: number;
    }

    /** Represents a createRole. */
    class createRole implements IcreateRole {

        /**
         * Constructs a new createRole.
         * @param [properties] Properties to set
         */
        constructor(properties?: hellopbjs.IcreateRole);

        /** createRole name. */
        public name: string;

        /** createRole sex. */
        public sex: number;

        /**
         * Creates a new createRole instance using the specified properties.
         * @param [properties] Properties to set
         * @returns createRole instance
         */
        public static create(properties?: hellopbjs.IcreateRole): hellopbjs.createRole;

        /**
         * Encodes the specified createRole message. Does not implicitly {@link hellopbjs.createRole.verify|verify} messages.
         * @param message createRole message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hellopbjs.IcreateRole, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified createRole message, length delimited. Does not implicitly {@link hellopbjs.createRole.verify|verify} messages.
         * @param message createRole message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hellopbjs.IcreateRole, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a createRole message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns createRole
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hellopbjs.createRole;

        /**
         * Decodes a createRole message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns createRole
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hellopbjs.createRole;

        /**
         * Verifies a createRole message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a createRole message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns createRole
         */
        public static fromObject(object: { [k: string]: any }): hellopbjs.createRole;

        /**
         * Creates a plain object from a createRole message. Also converts values to other types if specified.
         * @param message createRole
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hellopbjs.createRole, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this createRole to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
