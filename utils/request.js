


// 增加发送请求加载中的状态提示
let ajaxCount = 0;
function request({url,...params}){
  const baseURL = "https://api.qiujiajin.com/zeng";
    // 获取本地缓存token
    const token =  wx.getStorageSync('token') || "";
    ajaxCount++;
    return new Promise((resolve,reject)=>{  
        wx.showLoading({
            title: '加载中',
            mask: true,
        });
        wx.request({
            url: baseURL + url,
            header: { 
                "Accept": "*/*",
                // "Authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNTExOTUyOTg2NCIsImF1dGgiOiJNTUFfQURNSU4iLCJleHAiOjE1Nzc5NTQ1NDd9.T1_kyD7EWvJludbHS0zI1zAnA9eQtgd9gJrsK-ztZ05cBUBYU11iRdPTWjnj_H1O1W-56O_wnl6n8g8LV9zt_A"
                "token": token
            },
            ...params,
            success: (result) => {
              resolve(result)
            },
            complete: () => {
                ajaxCount--;
                if(ajaxCount===0){
                    wx.hideLoading();
                }
            }
        });
    })
      
}

export default request;