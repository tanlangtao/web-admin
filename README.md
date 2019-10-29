
1.执行npm install(线上部署时可不执行)

2.新建.env文件
REACT_APP_HOST=  ? (映射Admin服务地址)

dev环境：REACT_APP_HOST=http://operation.0717996.com/admin
测试环境：REACT_APP_HOST=http://react_web.539316.com/admin
灰度环境：REACT_APP_HOST=
正式环境：REACT_APP_HOST=http://prdweb.539316.com

3.nginx 路径 绑定 admin-web/build/index.html

4.nginx配置 可参考hqq-dev-platform-01 设定档


