"use strict";
function IsIE(){
    var userAgentInfo = navigator.userAgent
    var keys = ['MSIE','rv:11'] // MSIE是IE<=10   rv:11是IE==11
    for (var i = 0; i < keys.length; i++) {
        if (userAgentInfo.indexOf(keys[i]) > 0) {
            return true
        }
    }
    return false
}

function uploadFile(e) {
    var myform = new FormData();
    console.log("[debug]","uploadFile:",e.target.files[0]);
    // myform.append('file',$('#load_xls')[0].files[0]);
   /*  $.ajax({
        url: "admin.php?r=org/orguser/addusers",
        type: "POST",
        data: myform,
        contentType: false,
        processData: false,
        success: function (data) {
            console.log(data);
        },
        error:function(data){
            console.log(data)
        }
    }); */
}

function preventDel(e){
    console.log("[debug]",e.type,e.keyCode);
    if(e.keyCode==8 || e.keyCode==46){
        //Backspace || Del
        e.preventDefault();
    }else if(e.keyCode==86){
        console.log("[debug]","window.clipboardData:",window.clipboardData);
        // var file = window.clipboardData.getData("data")//得不到东西
        // console.log("[debug]",file);
    }
}

(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        module.exports = mod();
    else if (typeof define == "function" && define.amd) // AMD
        return define([], mod);
    else // Plain browser env
        window.UploadImage = mod();
})(function () {


    //public
    function UploadImage(id, url, key) {
        this.element = document.getElementById(id);
        // this.element = document
        this.url = url; //后端处理图片的路径
        this.imgKey = key || "AreaImgKey"; //提到到后端的name

    }
    UploadImage.prototype.updateBtn = function (callback) {
        var btnUpload = document.getElementById('btnUpload')
        btnUpload.addEventListener('change', function(e){
            console.log("[debug]","uploadFile pp:",e.target.files[0]);
            var file = e.target.files[0]
            dataReader(file,function (e) { //reader读取完成后，xhr上传
                callback(null,e.target.result)
            });
        })
    },
    UploadImage.prototype.paste = function (callback, formData) {
        var thatthat = this;
        this.element.addEventListener('paste', function (e) {//处理目标容器（id）的paste事件
            console.log("[debug]","on paste",e,this)
            if(IsIE()){
                //其它浏览器的e是ClipboardEvent
                //IE的e是DragEvent 且没正确的粘贴数据
                //好在IE11时 contenteditable="true" 可以粘贴进去chrome反而贴不进去 
                //IE10 根本不会触发这个事件
                console.log("[debug]","This is IE");
                return
            }else{
                console.log("[debug]","This is not IE");
            }
            console.log("[debug]","=-----------------on paste",e);
            console.log("[debug]","on paste e.clipboardData",e.clipboardData);
            console.log("[debug]","on paste e.clipboardData.items",e.clipboardData.items);
            console.log("[debug]","on paste e.clipboardData.files",e.clipboardData.files);
            console.log("[debug]","on paste e.clipboardData.types",e.clipboardData.types);
            // console.log("[debug]","paste 1");
            if (e.clipboardData && e.clipboardData.items[0].type.indexOf('image') > -1) {
                var that = this
                console.log("[debug]","paste 0",e.clipboardData.items[0]);
                var file = e.clipboardData.items[0].getAsFile();//读取e.clipboardData中的数据
                console.log("[debug]","paste",file);
                dataReader(file,function (e) { //reader读取完成后，xhr上传
                    // console.log("[debug]","paste 2 dataReader read callback");
                    // var fd = formData || (new FormData());
                    // fd.append(thatthat.imgKey, this.result); // this.result得到图片的base64
                    // console.log("[debug]","paste 3 ",e,e.target.result,this.result);
                    callback(null,e.target.result)
                    // xhRequest('POST',thatthat.url,fd,callback,that);

                });

            }else{
                console.log("[warn]","no e.clipboardData:",e);
            }
        }, false);

    };

    UploadImage.prototype.drag=function(callback,formData)
    {
        var that = this;
        this.element.addEventListener('drop', function (e) {//处理目标容器（id）的drop事件
            console.log("[debug]","on drag drop",e)
            that.OnDragDrop(callback,e)

        }, false);
    };
    UploadImage.prototype.OnDragDrop = function(callback,e){
        // e.preventDefault()
        var fileList = e.dataTransfer.files; //获取文件对象
        //检测是否是拖拽文件到页面的操作
        if(fileList.length == 0){
            return false;
        }
        console.log("[debug]","fileList[0]:",fileList[0]);
        //检测文件是不是图片
        if(fileList[0].type.indexOf('image') === -1){
            console.log&&console.log("您拖的不是图片！");
            return false;
        }
        console.log("[debug]","drag 0",fileList[0]);
        var file = fileList[0]
        console.log("[debug]","drag",file);
        dataReader(file,function (e) { //reader读取完成后，xhr上传
            // var fd = formData || (new FormData());
            // fd.append(that.imgKey, fileList[0]); //
            // console.log("[debug]","drag: ",that.imgKey,e);
            callback(null,e.target.result)
            // xhRequest('POST',that.url,fd,callback,this);
        })
    }

    UploadImage.prototype.upload=function(callback,formData)
    {
        this.drag(callback,formData);
        this.paste(callback,formData);
        this.updateBtn(callback);
    };

    preventDragDefault();
    //private

    function xhRequest(method,url,formData,callback,callbackContext)
    {
        var xhr=new XMLHttpRequest();
        xhr.open(method,url,true);
        xhr.onload=function()
        {
            callback&&callback.call(callbackContext||this,xhr);
        };
        xhr.send(formData||(new FormData()));

    }

    function preventDragDefault()//阻止浏览器默认将图片打开的行为
    {
        document.addEventListener("dragleave",preventDefault);//拖离
        document.addEventListener("drop",preventDefault);//拖后放
        document.addEventListener("dragenter",preventDefault);//拖进
        document.addEventListener("dragover",preventDefault);//拖来拖去
    }

    function preventDefault(e){
        e.preventDefault();
    }

    function dataReader(file,callback)
    {
        var  reader = new FileReader();
        reader.onload =callback;
        reader.readAsDataURL(file);//获取base64编码
    }
    return UploadImage;
});