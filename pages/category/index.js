import request from "../../utils/request.js"
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
    // 商品分类类型
    goodstypelist : [],
    goodstype:'',
    // 请求参数
    name: '',
    goodstype: '',
    cur_page: 1,
    page_nums: 10,
    // 商品数据列表
    goodsList: [],
    // 有没有数据的展示开关
    isshow: true,
    // 每页显示条数
    limitarr: [
      { text: '每次加载10条', value: '10' },
      { text: '每次加载20条', value: '20' },
      { text: '每次加载30条', value: '30' },
    ],
    limitnum: '10',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

  },

  onShow: function () {
    // 获取分类类型
    this.getgoodsType()
  },
  // 获取分类类型
  async getgoodsType() {
    let res = await request({
      url: '/getAllGoodsType',
      method: 'get'
    })
    console.log('类型',res)
    let typelist = res.data.data
    let goodstypelist = []
    typelist.forEach((item, index) => {
      goodstypelist.push({
        text: item.goodTypeName,
        value: item.goodstype
      })
    });
    this.setData({
      goodstypelist,
      goodstype:typelist[0].goodstype
    })
    this.doSearch()
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
  // 改变每页显示条数
  async changepagenums(e){
    this.setData({
      goodsList: [],
      limitnum: e.detail,
      cur_page: 1,
      page_nums:e.detail
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