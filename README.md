## 项目说明
>  用于获取微信小程序日趋势数据，用到的接口有:
> > https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=appid&secret=appsecret
> > https://api.weixin.qq.com/datacube/getweanalysisappiddailyvisittrend?access_token=access_token
> > > 接口用法请查阅 [小程序日趋势数据](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/data-analysis/visit-trend/analysis.getDailyVisitTrend.html)

## 环境安装步骤
1. 安装[nodejs](https://nodejs.org/en/)   安装LTS稳定版
2. 全局安装nodemon 打开命令行执行 npm install nodemon -g，如果不需要修改配置进行热更新可不安装，直接执行node app
3. 进入项目根目录并打开命令行，执行npm install安装所需依赖
4. 安装等待中在config.js文件中进行对应的配置
5. 依赖安装完成后执行nodemon app打开项目
