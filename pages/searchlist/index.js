// pages/searchlist/index.js
import request from "../../utils/request.js";
import {
  service
} from '../../common/base'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 加载更多
    loadingText: '加载更多...',
    // placeholder提示
    defaultKeyword: '请输入想要搜索的商品',
    // 搜索关键字
    keyword: '',
    // 请求参数
    name: '',
    goodstype: '',
    cur_page: 1,
    page_nums: 10,
    // 商品数据列表
    goodsList: [],
    // 有没有数据的展示开关
    isshow: true,
    // 商品分类类型
    goodstypelist: [{
      text: '选择分类类型',
      value: ''
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      let {
        keyword
      } = options
      this.setData({
        keyword,
        name: keyword
      })
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取分类类型
    this.getgoodsType()
    this.doSearch()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  // 加载更多
  async loadmore() {
    let page = this.data.cur_page
    page += 1
    this.setData({
      cur_page: page
    })
    this.doSearch()
  },
  // 获取分类类型
  async getgoodsType() {
    let res = await request({
      url: '/getAllGoodsType',
      method: 'get'
    })
    // console.log('类型',res)
    let typelist = res.data.data
    let goodstypelist = [{
      text: '选择分类类型',
      value: ''
    }]
    typelist.forEach((item, index) => {
      goodstypelist.push({
        text: item.goodTypeName,
        value: item.goodstype
      })
    });
    this.setData({
      goodstypelist
    })
  },
  // 搜索框输入触发
  onChange(e) {
    this.setData({
      keyword: e.detail,
      name: e.detail,
      goodsList: []
    });
  },
  // 搜索功能
  async doSearch() {
    if (this.data.keyword) {
      this.saveKeyword(this.data.keyword); //保存为历史
    }
    // 发起请求获取数据
    this.setData({
      loadingText: '加载中...'
    })
    let res = await request({
      url: '/product?name=' + this.data.name + '&goodstype=' + this.data.goodstype + '&cur_page=' + this.data.cur_page + '&page_nums=' + this.data.page_nums,
      method: 'get'
    })
    // console.log(res)
    let tempgoodsList = res.data.data
    if (!tempgoodsList) {
      this.setData({
        loadingText: '已经到底了'
      })
      return
    }
    tempgoodsList.forEach((item, index) => {
      item.img = service.baseurl + item.img
    });
    let goods = [...this.data.goodsList, ...tempgoodsList]
    // console.log('goods', goods)
    this.setData({
      goodsList: goods
    })
    if (res.data.data.length < this.data.page_nums) {
      this.setData({
        loadingText: '已经到底了'
      })
    } else {
      this.setData({
        loadingText: '加载更多...'
      })
    }
  },
  // 改变分类类型
  async changegoodstype(e) {
    this.setData({
      goodsList: [],
      goodstype: e.detail,
      cur_page: 1
    })
    this.doSearch()
  },
  // 重置
  async reset() {
    this.setData({
      goodsList: [],
      keyword: '',
      name: '',
      goodstype: '',
      cur_page: 1
    })
    this.doSearch()
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
      },
      fail: e => {
        var OldKeys = [keyword];
        wx.setStorage({
          key: 'OldKeys',
          data: JSON.stringify(OldKeys)
        });
      }
    });
  }
})