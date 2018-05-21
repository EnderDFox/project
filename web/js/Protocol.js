//=======================C2L协议=======================
var C2L = /** @class */ (function () {
    function C2L() {
    }
    C2L.C2L_SESSION_LOGIN = 10001;
    C2L.C2L_SAVE_COLLATE = 11001;
    C2L.C2L_PROCESS_VIEW = 50001;
    C2L.C2L_PROCESS_GRID_CHANGE = 50002;
    C2L.C2L_PROCESS_GRID_CLEAR = 50003;
    C2L.C2L_PROCESS_USER_CHANGE = 50004;
    C2L.C2L_PROCESS_GRID_SWAP = 50005;
    C2L.C2L_PROCESS_GRID_ADD = 50006;
    C2L.C2L_PROCESS_LINK_DELETE = 50007;
    C2L.C2L_PROCESS_LINK_EDIT = 50008;
    C2L.C2L_PROCESS_WORK_EDIT = 50009;
    C2L.C2L_PROCESS_MODE_EDIT = 50010;
    C2L.C2L_PROCESS_MODE_ADD = 50011;
    C2L.C2L_PROCESS_MODE_DELETE = 50012;
    C2L.C2L_PROCESS_MODE_COLOR = 50013;
    C2L.C2L_PROCESS_SCORE_EDIT = 50014;
    C2L.C2L_PROCESS_MODE_MOVE = 50015;
    C2L.C2L_PROCESS_MODE_STORE = 50016;
    C2L.C2L_PROCESS_LINK_COLOR = 50017;
    C2L.C2L_PROCESS_LINK_STORE = 50018;
    C2L.C2L_PROCESS_PUBLISH_EDIT = 50019;
    C2L.C2L_PROCESS_PUBLISH_DELETE = 50020;
    C2L.C2L_COLLATE_VIEW = 60001;
    C2L.C2L_COLLATE_STEP_EDIT = 60002;
    C2L.C2L_COLLATE_STEP_ADD = 60003;
    C2L.C2L_COLLATE_EXTRA_EDIT = 60004;
    C2L.C2L_COLLATE_EXTRA_DELETE = 60005;
    C2L.C2L_PROFILE_VIEW = 70001;
    C2L.C2L_TPL_MODE_VIEW = 51010;
    C2L.C2L_TPL_MODE_ADD = 51011;
    C2L.C2L_TPL_MODE_EDIT_NAME = 51012;
    C2L.C2L_TPL_MODE_DELETE = 51013;
    C2L.C2L_TPL_LINK_ADD = 51021;
    C2L.C2L_TPL_LINK_EDIT_NAME = 51022;
    C2L.C2L_TPL_LINK_EDIT_DID = 51023;
    C2L.C2L_TPL_LINK_EDIT_SORT = 51024;
    C2L.C2L_TPL_LINK_DELETE = 51025;
    //文件上传
    C2L.C2L_UPLOAD_ADD = 80001;
    C2L.C2L_UPLOAD_DELETE = 80002;
    //版本
    C2L.C2L_VERSION_ADD = 80101;
    C2L.C2L_VERSION_DELETE = 80102;
    C2L.C2L_VERSION_CHANGE_VER = 80103;
    C2L.C2L_VERSION_CHANGE_NAME = 80104;
    C2L.C2L_VERSION_CHANGE_PUBLISH = 80105;
    return C2L;
}());
//======================L2C协议=======================
var L2C = /** @class */ (function () {
    function L2C() {
    }
    L2C.L2C_SESSION_LOGIN = 10001;
    L2C.L2C_USER_LIST = 10002;
    L2C.L2C_DEPARTMENT_LIST = 10003;
    L2C.L2C_SAVE_COLLATE = 11001;
    L2C.L2C_SESSION_LOGIN_ERROR = 20001;
    L2C.L2C_PROCESS_VIEW = 50001;
    L2C.L2C_PROCESS_GRID_CHANGE = 50002;
    L2C.L2C_PROCESS_GRID_CLEAR = 50003;
    L2C.L2C_PROCESS_USER_CHANGE = 50004;
    L2C.L2C_PROCESS_GRID_SWAP = 50005;
    L2C.L2C_PROCESS_GRID_ADD = 50006;
    L2C.L2C_PROCESS_LINK_DELETE = 50007;
    L2C.L2C_PROCESS_LINK_EDIT = 50008;
    L2C.L2C_PROCESS_WORK_EDIT = 50009;
    L2C.L2C_PROCESS_MODE_EDIT = 50010;
    L2C.L2C_PROCESS_MODE_ADD = 50011;
    L2C.L2C_PROCESS_MODE_DELETE = 50012;
    L2C.L2C_PROCESS_MODE_COLOR = 50013;
    L2C.L2C_PROCESS_SCORE_EDIT = 50014;
    L2C.L2C_PROCESS_MODE_MOVE = 50015;
    L2C.L2C_PROCESS_MODE_STORE = 50016;
    L2C.L2C_PROCESS_LINK_COLOR = 50017;
    L2C.L2C_PROCESS_LINK_STORE = 50018;
    L2C.L2C_PROCESS_PUBLISH_EDIT = 50019;
    L2C.L2C_PROCESS_PUBLISH_DELETE = 50020;
    L2C.L2C_PROCESS_SCORE_NOTICE = 51001;
    L2C.L2C_COLLATE_VIEW = 60001;
    L2C.L2C_COLLATE_STEP_EDIT = 60002;
    L2C.L2C_COLLATE_STEP_ADD = 60003;
    L2C.L2C_COLLATE_EXTRA_EDIT = 60004;
    L2C.L2C_COLLATE_EXTRA_DELETE = 60005;
    L2C.L2C_PROFILE_VIEW = 70001;
    L2C.L2C_TPL_MODE_VIEW = 51010;
    L2C.L2C_TPL_MODE_ADD = 51011;
    L2C.L2C_TPL_MODE_EDIT_NAME = 51012;
    L2C.L2C_TPL_MODE_DELETE = 51013;
    L2C.L2C_TPL_LINK_ADD = 51021;
    L2C.L2C_TPL_LINK_EDIT_NAME = 51022;
    L2C.L2C_TPL_LINK_EDIT_DID = 51023;
    L2C.L2C_TPL_LINK_EDIT_SORT = 51024;
    L2C.L2C_TPL_LINK_DELETE = 51025;
    //文件上传
    L2C.L2C_UPLOAD_ADD = 80001;
    L2C.L2C_UPLOAD_DELETE = 80002;
    //版本
    L2C.L2C_VERSION_ADD = 80101;
    L2C.L2C_VERSION_DELETE = 80102;
    L2C.L2C_VERSION_CHANGE_VER = 80103;
    L2C.L2C_VERSION_CHANGE_NAME = 80104;
    L2C.L2C_VERSION_CHANGE_PUBLISH = 80105;
    return L2C;
}());
//# sourceMappingURL=Protocol.js.map