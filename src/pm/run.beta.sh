#在 cd /root/trunk_beta/src/pm 后 执行命令sh ./run.beta.sh
#svn更新
svn up ../../
#copy 文件
mv ./*.go ../pm_beta -f
cp -rf ./config.beta.xml ../pm_beta/config.xml
cd ../pm_beta
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
ps aux | grep pm
echo pm_beta进程id:
ps aux | grep '\.\/pm_beta' | awk '{print $2}'
echo pm_beta.log:
cat ../pm_beta/pm_beta.log
