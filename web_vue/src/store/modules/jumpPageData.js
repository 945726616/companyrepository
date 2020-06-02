const jumpPageData = {
  state: {
    pageDom: '',
    pageObj: {}
  },

  mutations: {
    SET_PAGEDOM: (state, pageDom) => {
      state.pageDom = pageDom
    },
    SET_PAGEOBJ: (state, pageObj) => {
      state.pageObj = pageObj
    }
  }
}

export default jumpPageData