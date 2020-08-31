// pages/goodsdetail/index.js
import request from "../../utils/request.js";
import {
  service
} from '../../common/base'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseurl: '',
    // 商品id
    goodsid: '',
    // 商品数据
    goodsdetail: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.setData({
      goodsid: options.goodsid,
      baseurl: service.baseurl
    })
    let res = await request({
      url: '/product/' + options.goodsid,
      method: 'get'
    })
    // console.log(res)
    let result = res.data.data
    result.img = this.data.baseurl + result.img
    this.setData({
      goodsdetail: result
    })
    // console.log(this.data.goodsdetail)
  },
  async addtoCart(e) {
    let {
      detail
    } = e.currentTarget.dataset

    wx.getStorage({
      key: 'oldWantBuyList',
      success: res => {
        var oldWantBuyList = JSON.parse(res.data);
        var findIndex=-1
        if(oldWantBuyList!==[]){
          oldWantBuyList.some( (item, index)=> {
              if(item==detail.id){
                findIndex=index
              }
          });
        }
        if (findIndex == -1) {
          oldWantBuyList.unshift(detail.id);
        } else {
          oldWantBuyList.splice(findIndex, 1);
          oldWantBuyList.unshift(detail.id);
        }
        wx.setStorage({
          key: 'oldWantBuyList',
          data: JSON.stringify(oldWantBuyList)
        });
      },
      fail: e => {
        var oldWantBuyList = [detail.id];
        wx.setStorage({
          key: 'oldWantBuyList',
          data: JSON.stringify(oldWantBuyList)
        });
        this.setData({
          oldWantBuyList
        })
      }
    });
    wx.showToast({
      title: '加入预购车成功',
      icon: 'none',
      duration: 2000
    });
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

})