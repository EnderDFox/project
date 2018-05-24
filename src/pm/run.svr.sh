#执行命令sh ./run.svr.sh
#svn更新
svn up ../../
#copy 文件
mv ./*.go /data/web/pm -f
cp -rf ../../web /data/web/pm/web
cp -rf ./config.svr.xml /data/web/pm/config.xml
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