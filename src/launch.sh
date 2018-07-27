
# mysql 正式服务器
/bin/sh /usr/bin/mysqld_safe --datadir=/var/lib/mysql --socket=/var/lib/mysql/mysql.sock --pid-file=/var/run/mysqld/mysqld.pid --basedir=/usr --user=mysql
# mysql beta服务器
/bin/sh /usr/bin/mysqld_safe --defaults-extra-file=/etc/my_3307.cnf
#nignx服务器
/etc/init.d/nginx restart
#redislv服务器
/data/ssdb/ssdb-server -d /data/ssdbconfig/ssdb.conf
# svn
svnserve -d -r /data/svn/pm/ --listen-host=0.0.0.0 --listen-port=3690
# 禅道
/usr/bin/hhvm --mode daemon --user root --config /data/conf/server.hdf -vServer.Type=fastcgi -vServer.FileSocket=/var/run/hhvm/hhvm.sock
#启动 管理工具 正式服
sh /root/trunk/src/run.sh pm_amazing full r 435
#启动 管理工具 beta服
sh /root/trunk/src/run.sh pm_amazing full r 459

