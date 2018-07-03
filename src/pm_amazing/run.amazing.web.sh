# 仅更新前端
# 直接运行  sh /root/trunk/src/pm_amazing/run.amazing.web.sh

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
