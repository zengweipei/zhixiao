import request from "../../utils/request.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 搜索框左侧文本
    leftText: '',
    // placeholder提示
    defaultKeyword: '请输入想要搜索的商品',
    // 搜索关键字
    keyword: '',
    // 历史搜索列表
    oldKeywordList: [],
    // 热门搜索列表
    hotKeywordList: [],
    // 显示或隐藏热门搜索内容
    forbid: ''
  },


  onLoad: function (options) {
    this.init();
  },
  // 搜索框输入触发
  onChange(e) {
    this.setData({
      keyword: e.detail,
    });
  },
  init() {
    //加载历史搜索
    this.loadOldKeyword();
    //加载热门搜索
    this.loadHotKeyword();
  },
  //加载历史搜索,自动读取本地Storage
  loadOldKeyword() {
    wx.getStorage({
      key: 'OldKeys',
      success: res => {
        var OldKeys = JSON.parse(res.data);
        this.setData({
          oldKeywordList: OldKeys
        })
      }
    });
  },
  //加载热门搜索
  loadHotKeyword() {
    //定义热门搜索关键字，可以自己实现ajax请求数据再赋值
    this.setData({
      hotKeywordList: ['口罩','叉','勺']
    })
  },
  //清除历史搜索
  oldDelete() {
    wx.showModal({
      content: '确定清除历史搜索记录？',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定');
          this.setData({
            oldKeywordList: []
          })
          wx.removeStorage({
            key: 'OldKeys'
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
  //热门搜索开关
  hotToggle() {
    !this.data.forbid ? this.setData({
      forbid: '_forbid'
    }) : this.setData({
      forbid: ''
    })
  },
  // 搜索功能
  doSearch(e) {
    if (e.currentTarget.dataset.keyword) {
      this.setData({
        keyword: e.currentTarget.dataset.keyword
      })
    }
    if (!this.data.keyword) {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none',
        duration: 2000
      });
      return
    }
    this.saveKeyword(this.data.keyword); //保存为历史
    wx.navigateTo({
      url: '/pages/searchlist/index?keyword=' + this.data.keyword
    })
  },
  //保存关键字到历史记录
  saveKeyword(keyword) {
    wx.getStorage({
      key: 'OldKeys',
      success: res => {
        var OldKeys = JSON.parse(res.data);
        var findIndex = OldKeys.indexOf(keyword);
        if (findIndex == -1) {
          OldKeys.unshift(keyword);
        } else {
          OldKeys.splice(findIndex, 1);
          OldKeys.unshift(keyword);
        }
        //最多10个纪录
        OldKeys.length > 10 && OldKeys.pop();
        wx.setStorage({
          key: 'OldKeys',
          data: JSON.stringify(OldKeys)
        });
        this.setData({
          //更新历史搜索
          oldKeywordList: OldKeys
        })
      },
      fail: e => {
        var OldKeys = [keyword];
        wx.setStorage({
          key: 'OldKeys',
          data: JSON.stringify(OldKeys)
        });
        this.setData({
          //更新历史搜索
          oldKeywordList: OldKeys
        })
      }
    });
  }
})