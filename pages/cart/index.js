import request from "../../utils/request.js";
import {
  service
} from '../../common/base'
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 联系方式弹出层
    showPopup: false,
    qq: '',
    wechat: '',
    phone: '',
    leavemessage: '',
    // 请求基准路径
    baseurl: '',
    // 判断购物车是否为空
    isEmpty: false,
    // 总价格
    allPrice: 50000,
    // 是否全选
    isAllSelected: false,
    // 数据
    wantBuyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置基准路径
    this.setData({
      baseurl: service.baseurl
    })
  },

  onShow() {
    // 获取本地存储的商品id数组
    wx.getStorage({
      key: 'oldWantBuyList',
      success: res => {
        // 重置数据
        this.setData({
          wantBuyList: []
        })
        var oldWantBuyList = JSON.parse(res.data);
        // 遍历根据id获取商品信息并赋值
        oldWantBuyList.forEach((item, index) => {
          // 获取每一项商品信息
          this.getGoodsItemMessage(item)
        });
        // 如果商品id数组是空的，设置页面为空样式
        if (oldWantBuyList.length == 0) {
          this.setData({
            isEmpty: true
          })
        } else {
          this.setData({
            isEmpty: false
          })
        }
      },
      fail: e => {
        // 获取失败时
        // 设置为空页面样式
        this.setData({
          isEmpty: true
        })
        // 自定义空商品id数组并存储
        var oldWantBuyList = [];
        wx.setStorage({
          key: 'oldWantBuyList',
          data: JSON.stringify(oldWantBuyList)
        });
      }
    });
  },
  // 获取每一项商品信息
  async getGoodsItemMessage(id) {
    let res = await request({
      url: '/product/' + id,
      method: 'get'
    })
    // console.log(res)
    let result = res.data.data
    // 拼接图片路径用于渲染
    result.img = this.data.baseurl + result.img
    // 添加是否选中状态
    result.isselect = false
    // 添加每一项商品信息到总的商品信息数组中，并刷新数据
    let wantBuyList = this.data.wantBuyList
    wantBuyList.push(result)
    this.setData({
      wantBuyList
    })
    // 判断是否全选
    let num = 0
    wantBuyList.forEach((item, index) => {
      if (item.isselect == true) {
        num++
      }
    });
    if (num == wantBuyList.length) {
      this.setData({
        isAllSelected: true
      })
    } else {
      this.setData({
        isAllSelected: false
      })
    }
  },
  // 全选按钮的更改
  onChange(event) {
    this.setData({
      isAllSelected: event.detail,
    });
    // 全选更改时改变所有单项商品的选中状态
    let wantBuyList = this.data.wantBuyList
    wantBuyList.forEach((item, index) => {
      item.isselect = event.detail
    });
    this.setData({
      wantBuyList
    })
  },
  // 单选按钮
  async onChangeitemSelected(e) {
    let {
      eachitem,
      eachselect
    } = e.currentTarget.dataset
    // 单选时检查是否所有的单项都是选中状态，如果是，将全选状态改变
    let wantBuyList = this.data.wantBuyList
    let num = 0
    wantBuyList.forEach((item, index) => {
      if (item.id == eachitem.id) {
        item.isselect = eachselect
      }
      if (item.isselect == true) {
        num++
      }
    });
    this.setData({
      wantBuyList
    })
    if (num == wantBuyList.length) {
      this.setData({
        isAllSelected: true
      })
    } else {
      this.setData({
        isAllSelected: false
      })
    }
  },
  // 删除单项
  async deleteItem(e) {
    Dialog.confirm({
        message: '确定要删除吗？',
      })
      .then(() => {
        // on confirm
        let {
          id
        } = e.currentTarget.dataset
        let wantBuyList = this.data.wantBuyList
        let findIndex = 0
        wantBuyList.some((item, index) => {
          if (item.id == id) {
            findIndex = index
          }
        });
        // console.log('findindex',findIndex)
        wantBuyList.splice(findIndex, 1)
        this.setData({
          wantBuyList
        })
        // 如果删除的该项是最后一项，设置为空页面样式
        if (wantBuyList.length == 0) {
          this.setData({
            isEmpty: true
          })
        } else {
          this.setData({
            isEmpty: false
          })
        }
        wx.setStorage({
          key: 'oldWantBuyList',
          data: JSON.stringify(wantBuyList)
        })
      })
      .catch(() => {
        // on cancel
      });

  },
  // 联系方式弹出层打开/关闭
  async contactways() {
    this.setData({
      showPopup: true
    })
  },
  async onClosePopup() {
    this.setData({
      showPopup: false
    })
  },
  // 最终结算按钮
  async onClickButton() {
    // 如果留下了有效的联系方式
    if (this.data.qq || this.data.wechat || this.data.phone) {
      // 获取被选中的数据
      let orderlist = []
      let oldWantBuyList = this.data.wantBuyList
      oldWantBuyList.forEach((item, index) => {
        if (item.isselect == true) {
          orderlist.push(item)
        }
      });
      // 获取没有被选中的数据用于更新
      var result = [];
      for (var i = 0; i < oldWantBuyList.length; i++) {
        var obj = oldWantBuyList[i];
        var num = obj.id;
        var isExist = false;
        for (var j = 0; j < orderlist.length; j++) {
          var aj = orderlist[j];
          var n = aj.id;
          if (n == num) {
            isExist = true;
            break;
          }
        }
        if (!isExist) {
          result.push(obj);
        }
      }
      this.setData({
        wantBuyList: result
      })
      // 更新本地存储的商品id数组
      let storageiddarr = []
      result.forEach((item, index) => {
        storageiddarr.push(item.id)
      });
      wx.setStorage({
        key: 'oldWantBuyList',
        data: JSON.stringify(storageiddarr)
      })
      // 收集最终的提交数据
      let sentidarr = []
      orderlist.forEach((item, index) => {
        sentidarr.push(item.id)
      });
      let form = {
        id: sentidarr,
        qq: this.data.qq,
        wechat: this.data.wechat,
        phone: this.data.phone,
        leavemessage: this.data.leavemessage
      }
      // 留下联系方式，选中任何商品
      if (form.id.length > 0) {
        // console.log('form', form)
        let res = await request({
          url: '/order',
          method: 'post',
          data: form
        })
        // console.log(res)
        if (res.data.code == 200) {
          // 提交成功时，判断是否提交后商品id数组为空，如果是，设置空页面样式
          if (result.length == 0) {
            this.setData({
              isEmpty: true
            })
          } else {
            this.setData({
              isEmpty: false
            })
          }
          wx.showToast({
            title: '提交成功，请留意您留下的联系方式，很快商家将联系您，谢谢！',
            icon: 'none',
            duration: 3000
          });
        }
      } else {
        // 留下联系方式但是没有选中任何商品
        Dialog.alert({
            theme: 'round-button',
            message: '请选择意向购买的商品，谢谢',
          })
          .then(() => {
            // on confirm
          })
      }
    } else {
      // 没留下任何联系方式
      Dialog.alert({
          theme: 'round-button',
          message: '请填写有效的联系方式，方便商家主动联系您，注意不要写错，以免联系不到，谢谢',
        })
        .then(() => {
          // on confirm
        })
    }

  },
  // 去逛逛
  async gotuShop() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }

})