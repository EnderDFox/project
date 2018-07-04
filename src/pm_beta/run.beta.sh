# 发布最新版 直接运行   sh /root/trunk/src/pm_beta/run.beta.sh
# 仅更新web 加参数 web:  sh /root/trunk/src/pm_beta/run.beta.sh web
# 更新到svn对应版本 加参数 r:  sh /root/trunk/src/pm_beta/run.beta.sh full r 379

proj_name="pm_beta"
path_svn="/root/trunk"
bin_pm="/root/bin/"$proj_name
bin_pm_web=$bin_pm"/web"
#
cd $path_svn"/src/"$proj_name
#svn更新
if [ $2 == "r" ]
then
    svn up $path_svn -r $3
else
    svn up $path_svn
fi
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


if [ $1 == "web" ]
then
    echo "Build web only complete"
else
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
fi