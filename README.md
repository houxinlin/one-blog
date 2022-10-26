# oneblog

起名为one-blog，意为单页博客，简单、高效、无链接。

线上地址：

https://www.houxinlin.com

![在这里插入图片描述](https://img-blog.csdnimg.cn/1ea4d15c78c44f808226f363b9675253.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/b52fd098675e4a6eb292bb7d0a7febee.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/499edc6830bd4c4c952da2bf5f2068e9.png)


# 项目部署（Web）

1. 下载
```
git clone https://github.com/houxinlin/OneBlog.git
npm install
```

2. 修改项目配置

打开以下文件，将值替换成自己服务器地址。
```
.env.production

VITE_APP_REQUEST_URL = 'https://www.houxinlin.com/OneBlog/'
```

3. 运行
```
npm run serve
```

4. 打包
```
npm run build
```
## 项目部署（后端）

https://github.com/houxinlin/OneBlog-Server
