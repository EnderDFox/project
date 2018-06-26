# 直接运行  sh /root/trunk/src/pm_amazing/run.amazing.sh

proj_name="pm_amazing"
path_svn="/root/trunk"
bin_pm="/root/bin/"$proj_name
bin_pm_web=$bin_pm"/web"
#
cd $path_svn"/src/"$proj_name
#svn更新
svn up $path_svn
#copy 文件

if [ ! -d $bin_pm_web  ];then
echo "Create "$bin_pm_web
    mkdir $bin_pm_web
fi

\cp -rf $path_svn"/web/index.html" $bin_pm_web
\cp -rf $path_svn"/web/mdv.html" $bin_pm_web
\cp -rf $path_svn"/web/favicon.ico" $bin_pm_web
\cp -rf $path_svn"/web/更新日志.md" $bin_pm_web
\cp -rf $path_svn"/web/css" $bin_pm_web
\cp -rf $path_svn"/web/js" $bin_pm_web
\cp -rf $path_svn"/web/vue_template" $bin_pm_web
\cp -rf $path_svn"/src/pm/"*.go ./

go build
echo 1.编译完成
\cp -rf $path_svn"/src/"$proj_name"/"$proj_name $bin_pm
\cp -rf $path_svn"/src/"$proj_name"/"config.xml $bin_pm
# 进入bin目录
cd $bin_pm

#杀掉进程
kill -9 `ps aux | grep '\.\/'$proj_name | awk '{print $2}'`
echo 2.进程关闭

#进程启动
nohup './'$proj_name > $proj_name.log &
echo 3.进程开启

echo 全部进程:
ps aux | grep $proj_name
echo $proj_name进程id:
ps aux | grep '\.\/'$proj_name | awk '{print $2}'