# Wlniao会议助手
本项目用于发布简单的HTML网站，将入口文件命名为`index.html`后，放在`wwwroot`目录即可，访问端口号为`80`。

### Docker部署脚本
```
docker run -d -p 80:8012 --name wemeet \
registry.cn-hangzhou.aliyuncs.com/wlniao/wemeet:latest
```