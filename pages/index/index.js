import request from "../../utils/request.js";
import {
  service
} from '../../common/base'

Page({
  
  data: {
    // 加载更多
    loadingText: '加载更多...',
    // 请求参数
    name: '',
    goodstype: '',
    cur_page: 1,
    page_nums: 10,
    // 商品数据列表
    goodsList: [],
  },

  onLoad(){
    
  },
  onShow: function () {
    this.setData({
      goodsList:[]
    })
    this.doSearch()
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
  // 搜索功能
  async doSearch() {
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

})
