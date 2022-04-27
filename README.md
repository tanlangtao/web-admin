
1.执行npm install(线上部署时可不执行)

2.新建.env文件
REACT_APP_HOST=  ? (映射Admin服务地址)

dev环境：REACT_APP_HOST=http://operation.0717996.com
测试环境：REACT_APP_HOST=http://devadmin.539316.com
灰度环境：REACT_APP_HOST=http://preweb.539316.com
正式环境：REACT_APP_HOST=http://prdweb.539316.com

"scripts": {
    "start": "react-app-rewired start",//对应.env.development
    "build": "react-app-rewired build",//对应.env.production
    "build:pre": "dotenv -e .env.pre react-app-rewired build",//对应.env.pre
    "build:dev": "dotenv -e .env.dev react-app-rewired build",//对应.env.dev
  },

  .env.pre:REACT_APP_HOST=http://admin.lymrmfyp.com
  .env.production:REACT_APP_HOST=https://admin.whjfxly66.com,https://admin.0posi.club,https://admin.whjfxly88.com,https://admin.hcxch.club,https://admin.ahdmzx.com,https://admin.hfbgszx.com,https://admin.sdyz86.com,https://admin.shuyahome.com,https://admin.biblv.club
  
3.nginx 路径 绑定 admin-web/build/index.html

4.nginx配置 可参考hqq-dev-platform-01 设定档

