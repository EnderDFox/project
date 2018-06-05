import $protobuf = protobuf;

/** Namespace pb. */
declare module pb {

    /** Namespace mark. */
    namespace mark {

        /** cmd enum. */
        enum cmd {
            NONE = 0,
            CONNECT_SUCCESS = 101,
            CONNECT_EXCEPTION = 102,
            CONNECT_FAILURE = 103,
            CONNECT_BREAK = 104,
            COMMON_MSG = 1000
        }

        /** Properties of a Login. */
        interface ILogin {

            /** Login account */
            account: string;

            /** Login password */
            password: string;
        }

        /** Represents a Login. */
        class Login implements ILogin {

            /**
             * Constructs a new Login.
             * @param [properties] Properties to set
             */
            constructor(properties?: pb.mark.ILogin);

            /** Login account. */
            public account: string;

            /** Login password. */
            public password: string;

            /**
             * Creates a new Login instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Login instance
             */
            public static create(properties?: pb.mark.ILogin): pb.mark.Login;

            /**
             * Encodes the specified Login message. Does not implicitly {@link pb.mark.Login.verify|verify} messages.
             * @param message Login message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: pb.mark.ILogin, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Login message, length delimited. Does not implicitly {@link pb.mark.Login.verify|verify} messages.
             * @param message Login message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: pb.mark.ILogin, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Login message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Login
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.mark.Login;

            /**
             * Decodes a Login message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Login
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.mark.Login;

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
            public static fromObject(object: { [k: string]: any }): pb.mark.Login;

            /**
             * Creates a plain object from a Login message. Also converts values to other types if specified.
             * @param message Login
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: pb.mark.Login, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Login to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a XY. */
        interface IXY {

            /** XY x */
            x?: (number|null);

            /** XY y */
            y?: (number|null);
        }

        /** Represents a XY. */
        class XY implements IXY {

            /**
             * Constructs a new XY.
             * @param [properties] Properties to set
             */
            constructor(properties?: pb.mark.IXY);

            /** XY x. */
            public x: number;

            /** XY y. */
            public y: number;

            /**
             * Creates a new XY instance using the specified properties.
             * @param [properties] Properties to set
             * @returns XY instance
             */
            public static create(properties?: pb.mark.IXY): pb.mark.XY;

            /**
             * Encodes the specified XY message. Does not implicitly {@link pb.mark.XY.verify|verify} messages.
             * @param message XY message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: pb.mark.IXY, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified XY message, length delimited. Does not implicitly {@link pb.mark.XY.verify|verify} messages.
             * @param message XY message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: pb.mark.IXY, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a XY message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns XY
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.mark.XY;

            /**
             * Decodes a XY message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns XY
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.mark.XY;

            /**
             * Verifies a XY message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a XY message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns XY
             */
            public static fromObject(object: { [k: string]: any }): pb.mark.XY;

            /**
             * Creates a plain object from a XY message. Also converts values to other types if specified.
             * @param message XY
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: pb.mark.XY, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this XY to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a MarkDocList. */
        interface IMarkDocList {

            /** MarkDocList MarkDocList */
            MarkDocList?: (pb.mark.IMarkDoc[]|null);
        }

        /** Represents a MarkDocList. */
        class MarkDocList implements IMarkDocList {

            /**
             * Constructs a new MarkDocList.
             * @param [properties] Properties to set
             */
            constructor(properties?: pb.mark.IMarkDocList);

            /** MarkDocList MarkDocList. */
            public MarkDocList: pb.mark.IMarkDoc[];

            /**
             * Creates a new MarkDocList instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MarkDocList instance
             */
            public static create(properties?: pb.mark.IMarkDocList): pb.mark.MarkDocList;

            /**
             * Encodes the specified MarkDocList message. Does not implicitly {@link pb.mark.MarkDocList.verify|verify} messages.
             * @param message MarkDocList message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: pb.mark.IMarkDocList, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MarkDocList message, length delimited. Does not implicitly {@link pb.mark.MarkDocList.verify|verify} messages.
             * @param message MarkDocList message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: pb.mark.IMarkDocList, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MarkDocList message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MarkDocList
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.mark.MarkDocList;

            /**
             * Decodes a MarkDocList message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MarkDocList
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.mark.MarkDocList;

            /**
             * Verifies a MarkDocList message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MarkDocList message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MarkDocList
             */
            public static fromObject(object: { [k: string]: any }): pb.mark.MarkDocList;

            /**
             * Creates a plain object from a MarkDocList message. Also converts values to other types if specified.
             * @param message MarkDocList
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: pb.mark.MarkDocList, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MarkDocList to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a MarkDoc. */
        interface IMarkDoc {

            /** MarkDoc Mid */
            Mid?: (number|Long|null);

            /** MarkDoc Name */
            Name?: (string|null);

            /** MarkDoc Kind */
            Kind?: (number|null);

            /** MarkDoc CreateDate */
            CreateDate?: (string|null);

            /** MarkDoc RefName */
            RefName?: (string|null);

            /** MarkDoc Lines */
            Lines?: (pb.mark.ILine[]|null);

            /** MarkDoc BookmarkList */
            BookmarkList?: (pb.mark.IBookmark[]|null);
        }

        /** Represents a MarkDoc. */
        class MarkDoc implements IMarkDoc {

            /**
             * Constructs a new MarkDoc.
             * @param [properties] Properties to set
             */
            constructor(properties?: pb.mark.IMarkDoc);

            /** MarkDoc Mid. */
            public Mid: (number|Long);

            /** MarkDoc Name. */
            public Name: string;

            /** MarkDoc Kind. */
            public Kind: number;

            /** MarkDoc CreateDate. */
            public CreateDate: string;

            /** MarkDoc RefName. */
            public RefName: string;

            /** MarkDoc Lines. */
            public Lines: pb.mark.ILine[];

            /** MarkDoc BookmarkList. */
            public BookmarkList: pb.mark.IBookmark[];

            /**
             * Creates a new MarkDoc instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MarkDoc instance
             */
            public static create(properties?: pb.mark.IMarkDoc): pb.mark.MarkDoc;

            /**
             * Encodes the specified MarkDoc message. Does not implicitly {@link pb.mark.MarkDoc.verify|verify} messages.
             * @param message MarkDoc message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: pb.mark.IMarkDoc, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MarkDoc message, length delimited. Does not implicitly {@link pb.mark.MarkDoc.verify|verify} messages.
             * @param message MarkDoc message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: pb.mark.IMarkDoc, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MarkDoc message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MarkDoc
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.mark.MarkDoc;

            /**
             * Decodes a MarkDoc message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MarkDoc
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.mark.MarkDoc;

            /**
             * Verifies a MarkDoc message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MarkDoc message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MarkDoc
             */
            public static fromObject(object: { [k: string]: any }): pb.mark.MarkDoc;

            /**
             * Creates a plain object from a MarkDoc message. Also converts values to other types if specified.
             * @param message MarkDoc
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: pb.mark.MarkDoc, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MarkDoc to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Bookmark. */
        interface IBookmark {

            /** Bookmark Depth */
            Depth?: (number|null);

            /** Bookmark Title */
            Title?: (string|null);

            /** Bookmark Content */
            Content?: (string|null);

            /** Bookmark PageNum */
            PageNum?: (number|null);

            /** Bookmark RefPath */
            RefPath?: (string|null);
        }

        /** Represents a Bookmark. */
        class Bookmark implements IBookmark {

            /**
             * Constructs a new Bookmark.
             * @param [properties] Properties to set
             */
            constructor(properties?: pb.mark.IBookmark);

            /** Bookmark Depth. */
            public Depth: number;

            /** Bookmark Title. */
            public Title: string;

            /** Bookmark Content. */
            public Content: string;

            /** Bookmark PageNum. */
            public PageNum: number;

            /** Bookmark RefPath. */
            public RefPath: string;

            /**
             * Creates a new Bookmark instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Bookmark instance
             */
            public static create(properties?: pb.mark.IBookmark): pb.mark.Bookmark;

            /**
             * Encodes the specified Bookmark message. Does not implicitly {@link pb.mark.Bookmark.verify|verify} messages.
             * @param message Bookmark message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: pb.mark.IBookmark, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Bookmark message, length delimited. Does not implicitly {@link pb.mark.Bookmark.verify|verify} messages.
             * @param message Bookmark message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: pb.mark.IBookmark, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Bookmark message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Bookmark
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.mark.Bookmark;

            /**
             * Decodes a Bookmark message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Bookmark
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.mark.Bookmark;

            /**
             * Verifies a Bookmark message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Bookmark message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Bookmark
             */
            public static fromObject(object: { [k: string]: any }): pb.mark.Bookmark;

            /**
             * Creates a plain object from a Bookmark message. Also converts values to other types if specified.
             * @param message Bookmark
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: pb.mark.Bookmark, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Bookmark to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Line. */
        interface ILine {

            /** Line PoiList */
            PoiList?: (pb.mark.IXY[]|null);

            /** Line PageNum */
            PageNum?: (number|null);

            /** Line RefXY */
            RefXY?: (pb.mark.IXY|null);
        }

        /** Represents a Line. */
        class Line implements ILine {

            /**
             * Constructs a new Line.
             * @param [properties] Properties to set
             */
            constructor(properties?: pb.mark.ILine);

            /** Line PoiList. */
            public PoiList: pb.mark.IXY[];

            /** Line PageNum. */
            public PageNum: number;

            /** Line RefXY. */
            public RefXY?: (pb.mark.IXY|null);

            /**
             * Creates a new Line instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Line instance
             */
            public static create(properties?: pb.mark.ILine): pb.mark.Line;

            /**
             * Encodes the specified Line message. Does not implicitly {@link pb.mark.Line.verify|verify} messages.
             * @param message Line message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: pb.mark.ILine, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Line message, length delimited. Does not implicitly {@link pb.mark.Line.verify|verify} messages.
             * @param message Line message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: pb.mark.ILine, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Line message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Line
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.mark.Line;

            /**
             * Decodes a Line message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Line
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.mark.Line;

            /**
             * Verifies a Line message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Line message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Line
             */
            public static fromObject(object: { [k: string]: any }): pb.mark.Line;

            /**
             * Creates a plain object from a Line message. Also converts values to other types if specified.
             * @param message Line
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: pb.mark.Line, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Line to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
