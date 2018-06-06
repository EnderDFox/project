#------本文件使用方法
#shell中输入下面的命令
# cd /root/trunk/src/pm ; sh ./run.svr.sh
#------
#svn更新
svn up ../../
#copy 文件
mv ./*.go /data/web/pm -f
# cp 会提示覆盖  用 \cp代替 下次部署时再试试 手动上传吧,  上传web下的js css vue_template index.html 
\cp -rf ../../web /data/web/pm
\cp -rf ./config.svr.xml /data/web/pm/config.xml
cd /data/web/pm
#代码编译
go build
echo 1.编译完成
#杀掉进程
kill -9 `ps aux | grep '\.\/pm' | awk '{print $2}'`
echo 2.进程关闭
#进程启动
nohup ./pm > pm.log &
echo 3.进程开启
#代码清理
rm *.go -rf
echo 清理完成
ps aux | grep '\.\/pm' | awk '{print $2}'