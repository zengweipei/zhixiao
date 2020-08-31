Component({
  /**
   * 组件的属性列表
   * //配置页面传过来的值,key值要一一对应
   */
  properties: {
    // 例子
    goodslist: {
      // 属性名
      type: Array,
      value: [],
    }
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      // 组件生命周期函数，类似于onLoad

    },
    ready() {
      // 在组件在视图层布局完成后执行
      // console.log(this.data.goodslist)
    }
  },

  /**
   * 组件的初始数据，可用于模板渲染
   */
  data: {
    
  },

  /**
   * 小程序的方法都写在这里面
   */
  methods: {
    // 点击单项内容时跳转详情页
    changeurl(e) {
      wx.navigateTo({
        url: '/pages/goodsdetail/index?goodsid=' + e.currentTarget.dataset.id
      })
    }
  }
})