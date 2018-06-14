#------本文件使用方法
#shell中输入下面的命令
# cd /root/trunk/src/pm_beta ; sh ./run.beta.sh
#------
#svn更新
svn up ../../
#copy 文件
\cp -rf ../pm/*.go ./
# \cp -rf ./config.beta.xml ../pm_beta/config.xml
#代码编译
go build
echo 1.编译完成
#杀掉进程
kill -9 `ps aux | grep '\.\/pm_beta' | awk '{print $2}'`
echo 2.进程关闭
#进程启动
nohup ./pm_beta > pm_beta.log &
echo 3.进程开启
#代码清理
rm *.go -rf
echo 清理完成
echo 全部进程:
ps aux | grep pm_bate
echo pm_beta进程id:
ps aux | grep '\.\/pm_beta' | awk '{print $2}'
echo pm_beta.log:
cat ../pm_beta/pm_beta.log
