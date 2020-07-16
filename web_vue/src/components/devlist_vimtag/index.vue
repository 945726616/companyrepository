<template>
  <div id="devlist"></div>
</template>
<script>
export default {
  data () {
    return {
      srcdiv: null,
      devlistData: null,
      searchData: [],
      filterData: [],
      searchDevId: '',
      treeListFlag: 1,
      devImgWidth: null,
      addDeviceList: [],
      addDeviceTime: '',
      tmpData: [],
      search_sort: [],
      search_tree: []
    }
  },
  methods: {
    vimtagDevlist (obj) {
      let _this = this
      // console.log("进入设备列表页" ,obj)
      // if (isAction) {
      //     $.playBar.Stop() // 录像播放停止
      // }
      // get_dev_list("refresh") // 刷新获取设备列表处理删除设备后回到列表页仍能对设备进行操作的问题
      // 展示遮罩层
      _this.publicFunc.showBufferPage()
      // $("#buffer_page").show();
      obj.box_ipc = 0;
      // obj.parent[0].innerHTML = "";
      obj.parent.html("<div id='device_list_menu'>"
        + "<div id='device_list_tree_box' style='display:none'>"
        + "<div id='device_list_tree_div'>"
        + "<div id='device_list_tree'>"
        + "<div class='device_list_tree_level_box' id='device_list_tree_level_box'>"
        + "</div>"
        + "<div id='device_list_tree_all'>" + mcs_all + "</div>"
        + "<div id='device_list_tree_leaf'></div>"
        + "</div>"
        + "</div>"
        + "<div id='device_list_tree_box_btn'></div>"
        + "</div>"
        + "<div id='device_refresh_btn'></div>"
        + "<div id='dev_search'><input type='text' id='dev_search_input' " + (sessionStorage.getItem('userLanguage') === "zh" ? "placeholder='请输入关键词'" : '') + " value=''><div id='dev_search_btn'></div></div>"
        + "<div id='dev_filter_box' style='display:none'>"
        + "<div id='online_btn' class='online_btn'>"
        + "<span id='online_btn_span'>" + mcs_all + "</span>"
        + "<div id='online_btn_direction' class='online_btn_down'></div>"
        + "</div>"
        + "<div id='online_btn_box'>"
        + "<div id='online_btn_select_all'>" + mcs_all + "</div>"
        + "<div id='online_btn_select_online'>" + mcs_state_device_online + "</div>"
        + "<div id='online_btn_select_offline'>" + mcs_offline_status + "</div>"
        + "</div>"
        + "</div>"
        + "<div id='device_list_edit' class='device_list_menu'>" + mcs_edit + "</div>"
        + "<div id='device_add_btn' class='device_list_menu'>" + mcs_add_device
        + "<div id='device_add_btn_down'>" + mcs_click_add_equipment + "</div>"
        + "</div>"
        + "</div>"
        + "<div id='vimtag_device_list_box'></div>")
      if (window.fujikam === "fujikam") { // 判断平台是否为客户端
        this.check_app_version()
        $("#device_list_menu").attr("style", "width:85%;height:40px;margin:0 auto;margin-top:20px")
        $("#vimtag_device_list_box").attr("style", "width:90%")
      }
      if (_this.$store.state.jumpPageData.supportFilterFlag === 1) { // 是否支持筛选
        $("#dev_filter_box").show()
      }

      get_dev_list() //创建设备列表页面

      function get_dev_list (type) {   // 获取设备列表
        // // console.log('获取设备列表', type)
        // // console.log(_this.treeListFlag, "_this.treeListFlag")
        // // console.log(pc_is_offline, "pc_is_offline")
        // // console.log(_this.$store.state.jumpPageData.localFlag, "_this.$store.state.jumpPageData.localFlag")
        let g_block = $("#device_list_tree_box").css('display')
        if (type === 'refresh' && g_block === 'block') {
          if (_this.treeListFlag == 1) {
            $("#vimtag_device_list_box").addClass("device_tree_class");
          } else {
            $("#vimtag_device_list_box").removeClass("device_tree_class");
          }
        }
        if (_this.$store.state.pcOfflineFlag === 1) { // 离线模式
          _this.$store.dispatch('setLocalModel', 1)
        }
        if (_this.$store.state.localModel) {
          _this.$api.devlist.local_devlist_get().then(res => {
            console.log('本地模式res', res)
            device_list()
          })
        } else {
          if (_this.$store.state.jumpPageData.deviceData.length === 0 || type === 'refresh') {
            //发送设备列表请求
            _this.$api.devlist.devs_refresh().then(res => {
              // console.log(res, '获取设备列表数据')
              devlist_get_ack(res)
            })
          } else {
            devlist_get_ack()
          }

        }
      }

      function devlist_get_ack (data) { // 设备列表数据整理并存储
        // console.log("进入devlist_get_ack回调", data)
        let flag = 1; //从播放页面返回的标记，不发送cfsf请求
        if (data) {
          _this.$store.dispatch('setDeviceData', data)
        } else {
          data = _this.$store.state.jumpPageData.deviceData;
          flag = 0;
        }
        for (let key in data) {
          _this.search_sort[key] = _this.$store.state.user.name + "_" + data[key].sn + "_sort";
          _this.search_tree[key] = _this.$store.state.user.name + "_" + data[key].sn + "_tree";
        }
        if (_this.$store.state.jumpPageData.supportTreeFlag && flag === 1) { //是不是支持树状结构
          // console.log('是否为树形结构')

          get_service_record_list(0);
        } else if (_this.$store.state.jumpPageData.supportTreeFlag && flag === 0) { //从播放页面返回，不发cfsf请求
          back_flag = sessionStorage.getItem("back_flag");
          if (back_flag === null || !back_flag) {
            _this.filterData = data;//解决返回后搜索设备功能无效问题
            tree_list(tree_back_data);
            device_list(tree_back_data);
          } else {
            let back_data = [];
            getNickRecord = sessionStorage.getItem("saveNickRecord");
            for (let m = 0; m < data.length; m++) {
              if (data[m].nick.indexOf(getNickRecord) > -1) {
                back_data.push(data[m])
              }
            }
            _this.filterData = data;//解决返回后搜索设备功能无效问题
            tree_list(tree_back_data);
            device_list(back_data);
          }
          // tree_list(tree_back_data);
          // device_list(tree_back_data);
        } else {
          _this.devlistData = _this.$store.state.jumpPageData.deviceData;
          _this.searchData = data;
          _this.filterData = data;
          device_list(data);
        }
      }

      function device_list (data, searchId) {
        let ipc_num = 0, box_num = 0;
        _this.publicFunc.closeBufferPage()
        // $("#buffer_page").hide();
        let search_id = searchId ? searchId : ""
        // console.log(search_id, '检查search_id')
        // console.log(data, 'device_list_data')
        let dev_list_dom = "";
        let dev_list_dom_box = "";
        if (data && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].type === 'IPC') {
              ipc_num = 1
              dev_list_dom +=
                "<div class='device_list_img' play='0' img='0' nick='" + data[i].nick + "' state='" + data[i].stat + "' sn=" + data[i].sn + " dtype='" + data[i].type + "' addr='" + data[i].addr + "' sort='" + (data[i].sort ? data[i].sort : '') + "' tree='" + (data[i].tree ? data[i].tree : '') + "' ondrop='drop(event,this)' ondragover='allowDrop(event)' draggable='true' ondragstart='drag(event, this)'>"  //实现拖拽功能
                + "<div id='device_list_alert_box'>"
                + "<img class='device_list_move_ico' sn=" + data[i].sn + " src='"+require('@/assets/device/move.png')+ "' alt=''>"
                + "<img class='device_list_door_ico' sn=" + data[i].sn + " src='"+require('@/assets/device/door.png')+ "' alt=''>"
                + "<img class='device_list_sos_ico' sn=" + data[i].sn + " src='"+require('@/assets/device/sos.png')+ "' alt=''>"
                + "</div>"
                + "<div class='box_sign_picture device_list_img_child'>"
                + "<div class='camera_sign_picture_div'>"
                + "<img src='" + data[i].def_img + "' class='img_class' alt=''>" //图片
                + "</div>"
                + "<div class='camera_sign_video'></div>"
                + "</div>"
                + "<div class='device_nick'>"
                + "<div class='device_list_del_ico'></div>"
                + "<div class='device_list_sort_box'>"
                + "<input class='device_list_sort_num' value='" + (data[i].sort || "") + "'>"
                + "<div class='device_list_sort_btn'>" + mcs_edit + "</div>"
                + "</div>"
                // +"<span class='device_nick_span'>"+(data[i].nick.length<14?data[i].nick:data[i].nick.substr(0,14)+"...")+"</span>"
                + "<span class='device_nick_span'>" + data[i].nick + "</span>"
                + "</div>"
                + "</div>";
            }
            if (data[i].type === 'BOX') {
              box_num = 1
              dev_list_dom_box +=
                "<div class='device_list_img' play='0' img='0' nick='" + data[i].nick + "' state='" + data[i].stat + "' box_live='" + (data[i].box_live ? data[i].box_live : 0) + "' sn=" + data[i].sn + " dtype='" + data[i].type + "' addr='" + data[i].addr + "' sort='" + (data[i].sort ? data[i].sort : '') + "' tree='" + (data[i].tree ? data[i].tree : '') + "' ondrop='drop(event,this)' ondragover='allowDrop(event)' draggable='true' ondragstart='drag(event, this)'>"
                + "<div id='device_list_alert_box'>"
                + "<img class='device_list_move_ico' sn=" + data[i].sn + " src='"+require('@/assets/device/move.png')+ "' alt=''>"
                + "<img class='device_list_door_ico' sn=" + data[i].sn + " src='"+require('@/assets/device/door.png')+ "' alt=''>"
                + "<img class='device_list_sos_ico' sn=" + data[i].sn + " src='"+require('@/assets/device/sos.png')+ "' alt=''>"
                + "</div>"
                + "<div class='box_sign_picture device_list_img_child'>"
                + "<div class='camera_sign_picture_div'>"
                + "<img src='" + data[i].def_img + "' class='img_class' alt=''>"
                + "</div>"
                + "<div class='camera_sign_video'></div>"
                + "</div>"
                + "<div class='device_nick'>"
                + "<div class='device_list_del_ico'></div>"
                + "<div class='device_list_sort_box'>"
                + "<input class='device_list_sort_num' value='" + (data[i].sort || "") + "'>"
                + "<div class='device_list_sort_btn'>" + mcs_edit + "</div>"
                + "</div>"
                + "<span class='device_nick_span'>" + (data[i].nick.length < 14 ? data[i].nick : data[i].nick.substr(0, 14) + "...") + "</span>"
                + "</div>"
                + "</div>";
            }
          }
        } else {
          dev_list_dom =
            "<div id='empty_div_img'></div>"
            + "<div class='empty_div_txt'>" + mcs_your_device_list_empty + "</div>" //您的设备列表还是空空的...
          // +"<a href='javascript:;'><div id='storage_buy'>"+mcs_storage_buying+"</div></a>" 
        }
        $("#vimtag_device_list_box").html(
          "<div style='overflow:hidden'>"
          + "<div style='overflow:hidden;font-size:15px'>" + "<div id='dev_camera' style='" + (ipc_num == 1 ? 'display:block' : 'display:none') + "'>" + mcs_camera + "</div>" + dev_list_dom + "</div>"
          + "<div style='display:block;font-size:15px'><div id='dev_cloudbox' style='" + (box_num == 1 ? 'display:block' : 'display:none') + "'>" + mcs_cloud_box + "</div>"
          + dev_list_dom_box
          + "</div>"
        )
        let device_list_num = sessionStorage.getItem("device_list_num") ? sessionStorage.getItem("device_list_num") : 4;
        _this.devImgWidth = 100 / device_list_num + "%";
        $(".device_list_img").css({ "width": _this.devImgWidth })
        let dev_img_height = $(".device_list_img").width() / 16 * 9;
        $(".device_list_img").css({ "width": _this.devImgWidth, "height": dev_img_height + 34 })
        $(".device_list_img_child").css({ "width": "100%", "height": dev_img_height, "position": "relative" });
        if (_this.$store.state.jumpPageData.experienceFlag) { // 体验标识检测
          $(".device_list_menu").hide();
          $("#dev_search").hide();
        } else {
          $(".device_list_menu").show();
          $("#dev_search").show();
        }
        if (_this.$store.state.jumpPageData.localFlag) {
          $(".device_list_menu").hide();
          $("#dev_search").hide();
          $("#dev_filter_box").hide();
          device_event();
        } else {
          device_list_load();
          $(".device_list_menu").show();
          $("#dev_search").show();
          $("#dev_filter_box").show();
        }
      }

      function device_list_load () {
        console.log(_this.devImgWidth, 'devimgwidth')
        if (_this.devImgWidth[_this.devImgWidth.length - 1] === "%") { //将百分数转换成小数
          _this.devImgWidth = parseFloat(_this.devImgWidth) / 100;
        }
        let dev_list_dom_width = ($("#vimtag_device_list_box").outerWidth()) * _this.devImgWidth;
        let dev_list_dom_height = dev_list_dom_width / 16 * 9 + 34;
        let client_width = $("#vimtag_device_list_box").outerWidth();
        let client_height = window.innerHeight;
        let x_num = parseInt(client_width / dev_list_dom_width);
        let y_num = parseInt(client_height / dev_list_dom_height);
        let num = x_num * y_num;
        let stop_scroll = null;
        let asnyc_time = _this.$store.state.jumpPageData.autoPlayFlag ? 2000 : 100;
        function device_show (n) {
          for (let i = 0; i < num; i++) {
            $(".device_list_img").eq(n + i).show();
          }
        }
        device_show(0);
        stop_scroll = setInterval(function () {
          clearInterval(stop_scroll);
          device_event(0, num);
        }, asnyc_time)
        $(window).scroll(function () {
          if (stop_scroll) {
            clearInterval(stop_scroll);
          }
          if ($("#vimtag_device_list_box").length > 0) {
            let scrollTop = $(this).scrollTop();
            // let windowHeight = $(this).height();
            // let scrollHeight = $(document).height();
            // if (scrollTop + windowHeight === scrollHeight) { j++; }
            if (_this.$store.state.jumpPageData.autoPlayFlag) {
              stop_scroll = setInterval(function () {
                clearInterval(stop_scroll);
                let top = scrollTop - 111;
                let show_height = Math.ceil(top / dev_list_dom_height); //从第几行开始显示
                device_event((show_height * x_num), num);
              }, asnyc_time)
            } else {
              clearInterval(stop_scroll);
              let top = scrollTop - 111;
              let show_height = Math.ceil(top / dev_list_dom_height); //从第几行开始显示
              device_event((show_height * x_num), num);
            }
          }
        });
      }

      function device_event (n, num) { //n为第几个开始，num为显示的个数
        let length
        if (_this.$store.state.jumpPageData.localFlag) {
          $(".device_list_img").show();
          n = 0;
          length = $(".camera_sign_picture_div").length;
        } else {
          length = n + num > $(".camera_sign_picture_div").length ? $(".camera_sign_picture_div").length : n + num;
        }
        //add list click event
        for (let i = 0; i < $(".camera_sign_picture_div").length; i++) {
          let l_dom_device_list_img = $(".camera_sign_picture_div")[i].parentNode.parentNode;
          let device_sn = l_dom_device_list_img.getAttribute("sn")
          // let device_info = mcloud_agent.devs
          if (i >= n && i < length) {
            if (l_dom_device_list_img.getAttribute("state") === "Online") {
              //State Normal equipment click event
              $(".camera_sign_picture_div")[i].onclick = function () {
                _this.$store.dispatch('setSelectDeviceIpc', this.parentNode.parentNode.getAttribute("sn")) // 点击时获取sn
                _this.$store.dispatch('setSelectNick', this.parentNode.parentNode.getAttribute("nick")) // 点击时获取nick
                _this.$store.state.jumpPageData.selectNick= this.parentNode.parentNode.getAttribute("nick")
                let type = this.parentNode.parentNode.getAttribute("dtype");
                let state = this.parentNode.parentNode.getAttribute("state");
                let addr = this.parentNode.parentNode.getAttribute("addr");
                if (state === "Online" && type === "IPC") {
                  obj.addr = addr;
                  console.log(obj, '创建播放页面')
                  // createPage("play", obj);
                  _this.$router.push({name:'play',params:obj})
                } else if (state === "Online" && type === "BOX") {
                  let box_live = this.parentNode.parentNode.getAttribute("box_live");//获取云盒子是否支持实时播放
                  obj.addr = addr;
                  obj.box_live = box_live;
                  console.log(obj, '创建云盒子播放页面')
                  // createPage("boxlist", obj);
                  _this.$router.push({name:'bolist',params:obj})
                }
              }
              if (_this.$store.state.jumpPageData.localFlag === 1) {
                if (l_dom_device_list_img.getAttribute("dtype") === "IPC") {
                  let local_play_data = {};
                  local_play_data.addr = l_dom_device_list_img.getAttribute("addr");
                  local_play_data.sn = l_dom_device_list_img.getAttribute("sn");
                  local_play_data.password = sessionStorage.getItem("pass_" + local_play_data.sn);
                  local_play_data.dom = $(".camera_sign_picture_div")[i].parentNode.childNodes[1];
                  local_play_data.profile_token = "p3";
                  local_play_data.func = function (msg) {
                    if (msg.result) {
                      _this.publicFunc.msg_tips({ msg: mcs_invalid_password, type: "error", timeout: 3000 })
                    }
                  }
                  msdk_ctrl({ type: "local_device_play", data: local_play_data }); // 本地化接口暂缓
                } else if (l_dom_device_list_img.getAttribute("dtype") === "BOX") {
                  let local_play_data = {};
                  local_play_data.addr = l_dom_device_list_img.getAttribute("addr");
                  local_play_data.sn = l_dom_device_list_img.getAttribute("sn");
                  local_play_data.password = sessionStorage.getItem("pass_" + local_play_data.sn);
                  local_play_data.dom = $(".camera_sign_picture_div")[i].parentNode.childNodes[1];
                  local_play_data.profile_token = "p3";
                  local_play_data.func = function (msg) {
                    if (msg.result) {
                      _this.publicFunc.msg_tips({ msg: mcs_invalid_password, type: "error", timeout: 3000 })
                    }
                  };
                  msdk_ctrl({ type: "local_box", data: local_play_data }); // 本地化接口暂缓
                }
              } else {
                if (l_dom_device_list_img.getAttribute("dtype") === "IPC") {
                  if (_this.$store.state.jumpPageData.autoPlayFlag) {
                    let is_play = l_dom_device_list_img.getAttribute("play");
                    if (is_play === 0) {
                      $($(".camera_sign_picture_div")[i].childNodes[0]).hide();
                      $(".camera_sign_picture_div")[i].childNodes[0].src = "";
                      l_dom_device_list_img.setAttribute("play", 1)
                      _this.$api.devlist.play({
                        dom: $(".camera_sign_video")[i],
                        sn: l_dom_device_list_img.getAttribute("sn"),
                        profile_token: "p2"
                      }).then(res => {
                        console.log(res, '播放res')
                      })
                    }
                  } else {
                    let is_img = l_dom_device_list_img.getAttribute("img");
                    l_dom_device_list_img.setAttribute("img", 1)
                    if (is_img == 0) {   //6.5.2
                      _this.$api.devlist.load_noid_img({
                        refresh: obj.refresh ? 1 : 0,
                        sn: device_sn,
                        num: i,
                        dom: document.getElementsByClassName('device_list_img')
                      })
                    }
                  }
                } else {
                  let is_img = l_dom_device_list_img.getAttribute("img");
                  l_dom_device_list_img.setAttribute("img", 1)
                  if (is_img == '0') {
                    _this.$api.devlist.load_noid_img({
                      refresh: obj.refresh ? 1 : 0,
                      sn: device_sn,
                      num: i,
                      dom: document.getElementsByClassName('device_list_img')
                    })
                  }
                }
              }
            } else if (l_dom_device_list_img.getAttribute("state") === "InvalidAuth") {
              $(".camera_sign_picture_div")[i].onclick = function () {
                _this.$store.dispatch('setSelectDeviceIpc', this.parentNode.parentNode.getAttribute("sn")) // 点击时存储sn
                let type = this.parentNode.parentNode.getAttribute("dtype");
                let addr = this.parentNode.parentNode.getAttribute("addr");
                if (_this.$store.state.jumpPageData.localFlag) {
                  if (type == "IPC") {
                    create_input_passwrod_box({ sn: _this.$store.state.jumpPageData.selectDeviceIpc, addr: addr, dom: this.parentNode.childNodes[1], type: "IPC" })
                  } else if (type == "BOX") {
                    create_input_passwrod_box({ sn: _this.$store.state.jumpPageData.selectDeviceIpc, addr: addr, dom: this.parentNode.childNodes[1], type: "BOX" })
                  }
                } else {
                  $("#add_device_page").show();
                  $('#add_device_page').css({ 'position': 'fixed', 'height': '100%', 'min-height': '0' });//id为bg的div就是我页面中的遮罩层
                  create_add_devices_box({ parent: $("#add_device_page"), sn: _this.$store.state.jumpPageData.selectDeviceIpc });
                }
              }
            } else if (l_dom_device_list_img.getAttribute("state") === "Offline") {
              $(".camera_sign_picture_div")[i].onclick = function () {
                _this.$store.dispatch('setSelectDeviceIpc', this.parentNode.parentNode.getAttribute("sn")) // 点击时存储sn
                let type = this.parentNode.parentNode.getAttribute("dtype");
                let state = this.parentNode.parentNode.getAttribute("state");
                let addr = this.parentNode.parentNode.getAttribute("addr");
                let nick = this.parentNode.parentNode.getAttribute("nick");
                $("#add_device_page").show();
                $('#add_device_page').css({ 'position': 'fixed', 'height': '100%', 'min-height': '0' });//id为bg的div就是我页面中的遮罩层
                create_devices_offline({ parent: $("#add_device_page"), sn: _this.$store.state.jumpPageData.selectDeviceIpc, type: type, state: state, addr: addr, nick: nick });
              }
            }
          } else {
            if (l_dom_device_list_img.getAttribute("dtype") === "IPC") {
              let is_play = l_dom_device_list_img.getAttribute("play");
              if (is_play == 1) {
                l_dom_device_list_img.setAttribute("play", 0)
                $(".camera_sign_video")[i].innerHTML = null;
                $($(".camera_sign_picture_div")[i].childNodes[0]).show();
                _this.$api.devlist.load_noid_img({
                  refresh: obj.refresh ? 1 : 0,
                  sn: device_sn,
                  num: i,
                  dom: document.getElementsByClassName('device_list_img')
                })
              }
            }
          }
        }

        if ($("#device_refresh_btn").length > 0) {
          $("#device_refresh_btn").click(function () {
            get_dev_list("refresh")
          })
        }
        if ($("#device_list_edit").length > 0) {
          $("#device_list_edit").click(function () {
            if ($(".device_list_del_ico").css("display") === "none") {
              $(".device_list_del_ico").show();
            } else {
              $(".device_list_del_ico").hide();
            }
            if (_this.$store.state.jumpPageData.supportTreeFlag) {
              if ($(".device_list_sort_box").css("display") === "none") {
                $(".device_list_sort_box").show();
              } else {
                $(".device_list_sort_box").hide();
              }
            }
          })
        }
        $(".device_list_del_ico").bind('click', function () {
          let _this_sn = this.parentNode.parentNode.getAttribute("sn");
          let _this_parent = this.parentNode.parentNode;
          _this.publicFunc.delete_tips({
            content: mcs_delete_device + "?", func: function () {
              _this.$api.devlist.dev_del({
                sn: _this_sn,
                dom: _this_parent
              }).then(res => {
                _this.publicFunc.msg_tips({
                  msg: res.msg,
                  type: 'error',
                  timeout: 3000
                })
                if (res.type === 'success') {
                  _this.$api.devlist.devs_refresh().then($(res.dom).hide())
                }
              })
            }
          })
        })
        $(".device_list_sort_btn").click(function () { // 向cfsf添加sort（设备排序用） tree（显示树状列表用，不和昵称绑定）数据
          let sn = this.parentNode.parentNode.parentNode.getAttribute("sn");
          let tree = this.parentNode.parentNode.parentNode.getAttribute("tree");
          let sort = this.parentNode.parentNode.parentNode.getAttribute("sort");
          create_devices_group({ parent: $("#vimtag_device_list_box"), sn: sn, tree: tree, sort: sort });// 点击编辑，显示设置设备分组页面
        })
        if ($("#device_add_btn").length > 0) {
          if (sessionStorage.getItem('userLanguage') === "zh") {
            $("#device_add_btn").mouseenter(function () {
              $('#device_add_btn_down').show().delay(1500).hide(0);
            })
          }
          $("#device_add_btn").click(function () {
            _this.addDeviceTime = new Date().getTime();//日志 点击添加设备时间
            $('#device_add_btn_down').hide();
            $("#add_device_page").show();
            $('#add_device_page').css({ 'position': 'fixed', 'height': '100%', 'min-height': '0' });//id为bg的div就是我页面中的遮罩层
            create_add_devices_box({ parent: $("#add_device_page") });
          })
        }
        if ($("#dev_search_btn")) {
          $("#dev_search_btn").click(function () {
            let search_id = $("#dev_search_input").val();
            let tmp_data = [];
            if (search_id) {
              for (let i = 0; i < _this.filterData.length; i++) {
                if (_this.filterData[i].nick.indexOf(search_id) > -1 || _this.filterData[i].sn.indexOf(search_id) > -1) {
                  tmp_data.push(_this.filterData[i])
                }
                _this.searchData = tmp_data;
                device_list(tmp_data, search_id)
              }
            } else {
              _this.searchData = _this.devlistData;
              device_list(_this.filterData)
            }
          })
          $("#dev_search_input").keyup(function () {
            let search_id = $("#dev_search_input").val();
            let tmp_data = [];
            if (search_id != _this.searchDevId) {
              _this.searchDevId = search_id;
              if (search_id) {
                for (let i = 0; i < _this.filterData.length; i++) {
                  if (_this.filterData[i].nick.indexOf(search_id) > -1 || _this.filterData[i].sn.indexOf(search_id) > -1) {
                    tmp_data.push(_this.filterData[i])
                  }
                }
                _this.searchData = tmp_data;
                device_list(tmp_data, search_id)
              } else {
                _this.searchData = _this.devlistData;
                device_list(_this.filterData)
              }
            }
          })
          $("#online_btn").click(function () {
            if ($("#online_btn_box").css("display") == "none") {
              $("#online_btn_box").slideDown();
              $("#online_btn_direction").attr('class', 'online_btn_up')
            } else {
              $("#online_btn_box").slideUp();
              $("#online_btn_direction").attr('class', 'online_btn_down')
            }
          })
          $("#online_btn_select_all").click(function () {
            $("#online_btn_box").hide();
            $("#online_btn_direction").attr('class', 'online_btn_down')
            $("#online_btn_span").html(mcs_all)
            $("#online_btn").attr('class', 'online_btn')
            _this.filterData = _this.devlistData;
            device_list(_this.searchData)
          })

          $("#online_btn_select_online").click(function () {
            $("#online_btn_box").hide();
            $("#online_btn_direction").attr('class', 'online_btn_down')
            $("#online_btn_span").html(mcs_state_device_online)
            let tmp_data = [];
            let tmp_filter_data = [];
            $("#online_btn").attr('class', 'online_btn_active')
            for (let i = 0; i < _this.searchData.length; i++) {
              if (_this.searchData[i].stat == "Online") {
                tmp_data.push(_this.searchData[i])
              }
            }
            for (let j = 0; j < _this.devlistData.length; j++) {
              if (_this.devlistData[j].stat == "Online") {
                tmp_filter_data.push(_this.devlistData[j])
              }
            }
            _this.filterData = tmp_filter_data;
            device_list(tmp_data)
          })
          $("#online_btn_select_offline").click(function () {
            $("#online_btn_box").hide();
            $("#online_btn_direction").attr('class', 'online_btn_down')
            $("#online_btn_span").html(mcs_offline_status)
            let tmp_data = [];
            let tmp_filter_data = [];
            $("#online_btn").attr('class', 'online_btn_active')
            for (let i = 0; i < _this.searchData.length; i++) {
              if (_this.searchData[i].stat == "Offline") {
                tmp_data.push(_this.searchData[i])
              }
            }
            for (let j = 0; j < _this.devlistData.length; j++) {
              if (_this.devlistData[j].stat == "Offline") {
                tmp_filter_data.push(_this.devlistData[j])
              }
            }
            _this.filterData = tmp_filter_data;
            device_list(tmp_data)
          })
        }
      }

      function create_devices_group (data) {  //tree后设备树状分组弹出框
        data.parent.innerHTML +=
          "<div id='add_device_group_box'>"
          + "<div style='overflow:hidden'>"
          + "<div id='device_group_sn' class='device_group_box'>sn:" + data.sn + "</div>"
          + "<div id='input_password_box_close'></div>"
          + "</div>"

          + "<div class='device_group_box'>"
          + "<label for = 'group_name'>" + mrs_create_group + "</label>"
          + "<input id = 'group_name' placeholder='" + mrs_group_tip + "' value='" + data.tree + "'></input>"
          + "<div id='grounp_standard'>( " + mrs_tree_format + " : xxx.xxx.xxx... )</div>"
          + "</div>"

          + "<div class='device_group_box'>"
          + "<label for = 'device_sort'>" + mrs_sort + "</label>"
          + "<input id='device_sort' placeholder='" + mrs_sort_tip + "' value='" + data.sort + "'>"
          + "</div>"

          + "<div id='add_device_group_buttton'>" + mcs_ok + "</div>"

          + "</div>";

        function create_devices_group_event () {
          $("#device_sort").keyup(function () { //限制sort输入框只能输入正整数
            reg = /^[0-9]*[1-9][0-9]*$/;
            if (reg.test(this.value)) {
              dev_set_input_num = this.value;
            } else {
              this.value = "";
            }
          })

          $("#add_device_group_buttton").click(function () { //点击确定
            let treelist = $('#group_name').val();
            let num = $('#device_sort').val();
            let sn = data.sn
            // 调用tree接口
            _this.$api.devlist.service_record_set({
              keys: [_this.$store.state.user.name + "_" + sn + "_sort"],
              datas: [num]
            })
            _this.$api.devlist.service_record_set({
              keys: [_this.$store.state.user.name + "_" + sn + "_tree"],
              datas: [treelist]
            }).then(res => {
              if (res.rflags[0] === 0) {
                _this.publicFunc.msg_tips({ msg: mcs_set_successfully, type: "success", timeout: 3000 })
              }
            })
          })
          $("#input_password_box_close").click(function () { //点击关闭
            $("#add_device_group_box").hide()
            get_dev_list()
            // $("#device_list_tree_all").click(); 新加了点击全选清除sessionst
          })
        }
        create_devices_group_event();
      }
      function create_input_passwrod_box (dataGet) {
        let data = dataGet ? dataGet : {};
        data.sn = data.sn ? data.sn : mcs_input_device_id;
        if (!$("#input_password_page").length > 0) {
          $("body").prepend(
            "<div id='input_password_page'>"
            + "<div id='input_password_box'>"
            + "<div id='input_password_box_close'></div>"
            + "<div id='input_password_username'>"
            + "<div id='input_password_username_ico'></div>"
            + "<input type='text' id='input_password_username_input' value='" + data.sn + "'>"
            + "<div id='input_password_username_div'></div>"
            + "</div>"
            + "<div id='input_password_password'>"
            + "<div id='input_password_password_ico'></div>"
            + "<input type='password' id='input_password_password_input' value=''>"
            + "<div id='dev_pwd_eye' class='dev_pwd_eye_hide'></div>"
            + "<div id='input_password_password_div'></div>"
            + "</div>"
            + "<div id='input_password_submit'>" + mcs_ok + "</div>"
            + "</div>"
            + "</div>")
        }
        $("#input_password_box_close").click(function () {
          $("#input_password_page").remove()
        })
        $("#dev_pwd_eye").click(function () { // 密码框输入密码可视状态
          if ($("#dev_pwd_eye").attr('class') === "dev_pwd_eye_hide") {
            $("#dev_pwd_eye").attr('class', 'dev_pwd_eye_show')
            $("#input_password_password_input").attr('type', 'text')
          } else {
            $("#dev_pwd_eye").attr('class', 'dev_pwd_eye_hide')
            $("#input_password_password_input").attr('type', 'password')
          }
        })
        $("#input_password_submit").click(function () {
          let local_play_data = {};
          local_play_data.addr = data.addr;
          local_play_data.sn = data.sn;
          local_play_data.password = $("#input_password_password_input").val();
          local_play_data.dom = data.dom;
          local_play_data.profile_token = "p3";
          local_play_data.func = local_sign_in_ack;
          msdk_ctrl({ type: "local_sign_in", data: local_play_data })
          function local_sign_in_ack (msg) {
            if (msg.result == "accounts.pass.invalid") {
              _this.publicFunc.msg_tips({ msg: mcs_invalid_password, type: "error", timeout: 3000 })
            } else {
              if (data.type == "IPC") {
                obj.addr = data.addr;
                // createPage("play", obj);
                _this.$router.push({name:'play',params:obj})
              } else if (data.type == "BOX") {
                obj.addr = data.addr;
                // createPage("boxlist", obj);
                _this.$router.push({name:'boxlist',params:obj})
              }
              $("#input_password_page").remove();
            }
          }
        })
      }
      function create_devices_offline (data) {
        // console.log(data, "data_create_offline")
        data.parent.html("<div id='add_devices_box'>"
          + "<div id='add_devices_box_menu'>"
          + "<div id='add_devices_box_close'></div>"
          + "<div id='add_devices_box_title'>" + data.nick + "</div>"
          + "</div>"
          + "<div id='add_devices_box_body'>"

          + "<div id='video_play_offline'>"
          + "<div id='video_play_id'></div>"
          + "<div id='video_play_offline_word'>" + mcs_video_play_offline + "</div>"
          + "</div>"
          + "<div id='search_help'>" + mcs_search_help + "</div>"
          + "</div>"
          + "</div>")
        $("#video_play_id").html(mcs_device_id + ":  " + data.sn)
        $("#add_devices_box_close").click(function () { close_add_page() })
        $('#search_help').click(function () {
          create_search_help({ parent: $("#add_device_page"), sn: _this.$store.state.jumpPageData.selectDeviceIpc, state: data.state, type: data.type, addr: data.addr });
        })
      }

      function create_search_help (data) {
        data.parent.innerHTML =
          "<div id='add_devices_box'>"
          + "<div id='add_devices_box_menu'>"
          + "<div id='add_devices_box_close'></div>"
          + "<div id='add_devices_box_title'>" + mcs_device_offline + "</div>"
          + "</div>"
          + "<div class='device_offline_reason_box'>"
          + "<div class='device_offline_reason'>" + mcs_device_offline_reson + "</div>"
          + "<div class='device_offline_reason_public'>1、" + mcs_device_offline_first_reson + "</div>"
          + "<div class='device_offline_reason_public'>2、" + mcs_device_offline_check + "<span id='reconfig_wifi'>" + mcs_reconfigure + "</span>" + "</div>"
          + "<div class='device_offline_reason_public'>3、" + mcs_device_offline_fourth_reson + "</div>"
          + "</div>"
          + "</div>";
        $("#add_devices_box_close").click(function () {
          close_add_page()
        })
        $("#reconfig_wifi").click(function () {
          create_add_devices_box({ parent: $("#add_device_page"), sn: _this.$store.state.jumpPageData.selectDeviceIpc, type: data.type });
        })
      }

      function create_add_devices_box (data) {
        let d_type = "cp1", d_id = "";
        if (data.type && data.type == 'IPC') {
          d_type = "cp1"
        } else if (data.type && data.type == 'BOX') {
          d_type = "s1"
        }
        function add_device_select_type () {
          data.parent.html("<div id='add_devices_box'>"
            + "<div id='add_devices_box_menu'>"
            + "<div id='add_devices_box_close'></div>"
            + "<div id='add_devices_box_title'>" + mcs_choose_device_type + "</div>"
            + "</div>"
            + "<div id='add_devices_box_body'>"
            + "<div class='add_devices_type'>"
            + "<div class='add_devices_type_name'>" + mcs_cloud_camera + "</div>"
            + "<div class='add_devices_type_list' d_type='p1'>"
            + "<div class='add_devices_type_list_img' style='background:url("+require('@/assets/device/add_p1.png')+ ")no-repeat;'></div>"
            + "<div class='add_devices_type_list_name'>P1" + mcs_intelligent_cloud_camera + "</div>"
            + "</div>"
            + "<div class='add_devices_type_list' d_type='cp1'>"
            + "<div class='add_devices_type_list_img' style='background:url("+require('@/assets/device/add_cp1.png')+ ")no-repeat;'></div>"
            + "<div class='add_devices_type_list_name'>CP1" + mcs_intelligent_cloud_camera + "</div>"
            + "</div>"
            + "<div class='add_devices_type_list' d_type='m1'>"
            + "<div class='add_devices_type_list_img' style='background:url("+require('@/assets/device/add_m1.png')+ ")no-repeat;'></div>"
            + "<div class='add_devices_type_list_name'>M1" + mcs_intelligent_cloud_camera + "</div>"
            + "</div>"
            + "<div class='add_devices_type_list' d_type='361'>"
            + "<div class='add_devices_type_list_img' style='background:url("+require('@/assets/device/add_361.png')+ ")no-repeat;'></div>"
            + "<div class='add_devices_type_list_name'>361" + mcs_intelligent_cloud_camera + "</div>"
            + "</div>"
            + "<div class='add_devices_type_list' d_type='cm1'>"
            + "<div class='add_devices_type_list_img' style='background:url("+require('@/assets/device/add_cm1.png')+ ")no-repeat;'></div>"
            + "<div class='add_devices_type_list_name'>CM1" + mcs_intelligent_cloud_camera + "</div>"
            + "</div>"
            + "<div class='add_devices_type_list' d_type='b1'>"
            + "<div class='add_devices_type_list_img' style='background:url("+require('@/assets/device/add_b1.png')+ ")no-repeat;'></div>"
            + "<div class='add_devices_type_list_name'>B1" + mcs_intelligent_cloud_camera + "</div>"
            + "</div>"
            + "<div class='add_devices_type_list' d_type='s1'>"
            + "<div class='add_devices_type_list_img' style='background:url("+require('@/assets/device/add_s1.png')+ ")no-repeat;'></div>"
            + "<div class='add_devices_type_list_name'>" + mcs_cloud_box + "</div>"
            + "</div>"

            + "<div class='add_devices_type_list' d_type='fisheye'>"
            + "<div class='add_devices_type_list_img' style='background:url("+require('@/assets/device/add_fisheye.png')+ ")no-repeat;'></div>"
            + "<div class='add_devices_type_list_name'>fisheye" + mcs_intelligent_cloud_camera + "</div>"
            + "</div>"
            + "<div class='add_devices_type_list' d_type='b2'>"
            + "<div class='add_devices_type_list_img' style='background:url("+require('@/assets/device/b2.png')+ ")no-repeat;'></div>"
            + "<div class='add_devices_type_list_name'>B2" + mcs_intelligent_cloud_camera + "</div>"
            + "</div>"
            + "<div class='add_devices_type_list' d_type='b3'>"
            + "<div class='add_devices_type_list_img' style='background:url("+require('@/assets/device/b3.png')+ ")no-repeat;'></div>"
            + "<div class='add_devices_type_list_name'>B3" + mcs_intelligent_cloud_camera + "</div>"
            + "</div>"
            + "</div>"
            + "</div>"
            + "</div>")
          function add_device_select_type_event () {
            let add_device_step_time = new Date().getTime(); //进入类型选择页面的时间
            for (let i = 0; i < $(".add_devices_type_list").length; i++) {
              $(".add_devices_type_list").eq(i).click(function () {
                d_type = this.getAttribute("d_type");
                let add_device_type = d_type //日志
                let add_dev_info = {}; //add_device_list数组中的值 类型为{}type title desc time
                add_dev_info.type = 'click';
                add_dev_info.title = 'choose device type';
                add_dev_info.desc = 'chosse ' + d_type + ' to add';
                add_dev_info.time = new Date().getTime() - add_device_step_time;
                // console.log(add_dev_info)
                _this.addDeviceList.push(add_dev_info)
                add_device_input_id();
              })
            }
            $("#add_devices_box_close").click(function () {
              close_add_page('add_dev')
            })
          }
          add_device_select_type_event();
        }

        function add_device_input_id (existed) {
          data.parent.html("<div id='add_devices_box'>"
            + "<div id='add_devices_box_menu'>"
            + "<div id='add_devices_box_back'>" + mcs_back + "</div>"
            + "<div id='add_devices_box_close'></div>"
            + "<div id='add_devices_box_title'>" + mcs_action_add_device + "</div>"
            + "</div>"
            + "<div id='add_devices_box_body'>"
            + "<div id='add_device_sample_img' style='background:url("+ require( "@/assets/device/id_" + d_type + ".png" )+") no-repeat center center;'></div>"
            + "<div class='add_device_input_id_box'>"
            + "<div class='add_device_input_id_box_ico'></div>"
            + "<div id='add_device_input_id_box_del' class='add_device_input_id_box_del'></div>"
            + "<input id='add_device_input_id_box_input' class='add_device_input_id_box_input' type='text' placeholder='" + mcs_input_device_id + "'>"
            + "</div>"
            + "<div id='add_device_submit'>" + mcs_action_next + "</div>"
            + "</div>"
            + "</div>")
          function add_device_input_id_event () {
            let add_device_step_time = new Date().getTime();//每步开始时间
            let add_dev_info = {};//每步操作信息
            if (data.sn) {
              add_dev_info.type = 'hint';//日志
              d_id = data.sn;
              $("#add_device_input_id_box_input").val(data.sn)
            }
            add_dev_info.type = 'input';//日志
            add_dev_info.title = 'input id';
            add_dev_info.desc = '';
            add_dev_info.time = 0;
            $('#add_device_input_id_box_input').keyup(function () {//日志 输入id后时间
              add_dev_info.desc = 'add_sn_' + this.value + '';
              add_dev_info.time = new Date().getTime() - add_device_step_time;
            })
            $("#add_devices_box_back").click(add_device_select_type)
            $("#add_device_input_id_box_del").click(function () {
              $("#add_device_input_id_box_input").val('')
            })
            $("#add_device_submit").click(function () { //输入完id 点击下一步
              let reg = new RegExp(/1jfie(.){8}$/i) // 正则判断匹配输入的设备号
              let device_existed;
              let add_device_stat;
              if ($("#add_device_input_id_box_input").val().match(reg)) {
                // console.log('匹配成功')
              } else {
                // console.log('匹配失败')
                _this.publicFunc.msg_tips({ msg: mrs_device_ID_input_error, type: "error", timeout: 3000 });
                return
              }

              if (existed) {
                device_existed = 0;
              } else {
                device_existed = 0;
                d_id = $("#add_device_input_id_box_input").val()
                let add_device_id = d_id;//日志
                for (let i = 0; i < _this.$store.state.jumpPageData.deviceData.length; i++) {
                  if (_this.$store.state.jumpPageData.deviceData[i].sn == d_id) {
                    device_existed = 1;
                  }
                }
              }
              if (!d_id) {
                _this.publicFunc.msg_tips({ msg: mcs_the_user_name_is_empty, type: "error", timeout: 3000 })
                return
              } else if (device_existed) {
                add_device_stat = 'lan' // 日志 本地设备
                _this.publicFunc.msg_tips({ msg: mcs_device_existed, type: "warning", timeout: 3000 })
              } else {
                // 展示遮罩层
                _this.publicFunc.showBufferPage()
                _this.$api.devlist.devlist_check_online({ // 检测设备是否在线(密码为默认固定值)
                  sn: d_id,
                  pass: "1pl%*.1"
                }).then(res => {
                  _this.publicFunc.closeBufferPage()
                  if (res === mcs_device_not_exist) { // 设备不存在
                    _this.publicFunc.msg_tips({ msg: res, type: "error", timeout: 3000 })
                  } else if (res === "user.offline") { // 设备不在线时
                    add_device_stat = 'offline' // 日志 设备状态
                    add_device_connect_power()
                  } else if (res === "") {
                    add_device_stat = 'online' // 日志
                    add_device_input_pass()
                  }
                })
              }
            })
            $("#add_devices_box_close").click(function () {
              close_add_page('add_dev')
            })
            _this.addDeviceList.push(add_dev_info)
          }
          add_device_input_id_event();
        }

        function add_device_connect_power () {  //添加设备 
          if (d_type == "cm1" || d_type == "m1" || d_type == "fisheye") {
            data.parent.html("<div id='add_devices_box'>"
              + "<div id='add_devices_box_menu'>"
              + "<div id='add_devices_box_back'>" + mcs_back + "</div>"
              + "<div id='add_devices_box_close'></div>"
              + "<div id='add_devices_box_title'>" + mcs_action_add_device + "</div>"
              + "</div>"
              + "<div class='dev_offline_tips'>"
              + "<img class='dev_offline_tips_img' src="+ require( "@/assets/device/" + d_type + ".png" )+") alt=''>"
              + "<div class='dev_offline_tips_text'>" + mcs_device_offline_use_iphone + "</div>"
              + "</div>"
              + "</div>")
            $("#add_devices_box_close").click(close_add_page)
            $("#add_devices_box_back").click(function () {
              add_device_input_id()
            })
          } else {
            if (d_type === "b1" || d_type === "b2" || d_type === "b3") {
              data.parent.html("<div id='add_devices_box'>"
                + "<div id='add_devices_box_menu'>"
                + "<div id='add_devices_box_back'>" + mcs_back + "</div>"
                + "<div id='add_devices_box_close'></div>"
                + "<div id='add_devices_box_title'>" + mcs_connect_power + "</div>"
                + "</div>"
                + "<div id='add_devices_box_body'>"
                + "<div id='add_device_sample_img' style='background:url("+ require( "@/assets/device/" + d_type + ".gif" )+") no-repeat center center;background-size:100% 100%'></div>"
                + "<div class='add_devices_box_info'>" + mcs_device_outdoor_camera_connect_power + "</div>" //接通电源后，请耐心等待30秒，直到摄像机数据线上的绿色指示灯开始闪烁，摄像机启动完成
                + "<div id='add_device_submit'>" + mcs_action_next + "</div>"
                + "</div>"
                + "</div>")
              add_device_connect_power_event()
            } else if (d_type === "s1") {
              data.parent.html("<div id='add_devices_box'>"
                + "<div id='add_devices_box_menu'>"
                + "<div id='add_devices_box_back'>" + mcs_back + "</div>"
                + "<div id='add_devices_box_close'></div>"
                + "<div id='add_devices_box_title'>" + mcs_connect_power + "</div>"
                + "</div>"
                + "<div id='add_devices_box_body'>"
                + "<div id='add_device_sample_img' style='background:url("+ require( "@/assets/device/" + d_type + ".gif" )+") no-repeat center center;background-size:100% 100%'></div>"
                + "<div class='add_devices_box_info'>" + mcs_device_box_connect_power + "</div>" //接通电源后，请耐心等待30秒，直到设备面板上的绿色指示灯开始闪烁，设备启动完成
                + "<div id='add_device_submit'>" + mcs_action_next + "</div>"
                + "</div>"
                + "</div>")
              add_device_connect_power_event();
            } else {
              data.parent.html("<div id='add_devices_box'>"
                + "<div id='add_devices_box_menu'>"
                + "<div id='add_devices_box_back'>" + mcs_back + "</div>"
                + "<div id='add_devices_box_close'></div>"
                + "<div id='add_devices_box_title'>" + mcs_connect_power + "</div>"
                + "</div>"
                + "<div id='add_devices_box_body'>"
                + "<div id='add_device_sample_img' style='background:url("+ require( "@/assets/device/" + d_type + ".gif" )+") no-repeat center center;background-size:100% 100%'></div>"
                + "<div class='add_devices_box_info'>" + mcs_normal_device_connect_power + mcs_camera_turn_on_voice + "<div id='add_devices_img'></div></div>"

                + "<div id='add_device_submit'>" + mcs_action_next + "</div>"
                + "</div>"
                + "</div>")
              add_device_connect_power_event();
            }
          }
        }
        function add_device_connect_ethernet () { //连接网线
          data.parent.html("<div id='add_devices_box'>"
            + "<div id='add_devices_box_menu'>"
            + "<div id='add_devices_box_back'>" + mcs_back + "</div>"
            + "<div id='add_devices_box_close'></div>"
            + "<div id='add_devices_box_title'>" + mcs_ethernet_configuration + "</div>"
            + "</div>"
            + "<div id='add_devices_box_body'>"
            + "<div id='add_device_sample_img' style='background:url("+ require( "@/assets/device/net_" + d_type + ".png" )+") no-repeat center center;'></div>"
            // +"<div class='add_devices_box_note'>"+mcs_device_connect_ethernet+"</div>" //去掉网口、网线
            + "<div class='add_devices_box_info'>" + msc_use_ethernet_cable_connect + "</div>" // 请用网线连接路由器和设备的网口，连接成功后设备会自动上线
            // +"<div id='no_light_twinkle'>"+ mcs_not_see_light +"</div>" // 去掉没看到灯闪
            // +"<div id='add_device_submit'>"+mcs_see_light_on +"</div>"  //去掉已看到灯闪
            + "<div class='add_devices_wait_online'>" + mcs_state_wait_device_online + "</div>" //等待设备上线
            + "<div id='add_devices_timenum'>60</div>"
            + "</div>"
            + "</div>")
          function add_device_connect_ethernet_event () {
            $("#add_devices_box_back").click(function () {
              add_device_input_id()
            })
            let div = document.getElementById("add_devices_timenum");
            // let setIntervalTime = 0
            let timer1 = setInterval(function () { // 倒计时出现负数(360浏览器出现) 修改方法两种 1.将定时器清除判断放入timer1中 2.在判断时提前-4秒防止360浏览器定时不准的问题
              --div.innerHTML;
              if (div.innerHTML <= 0) {
                // // console.log('进入小于等于0的判断123')
                clearInterval(timer1);
                clearInterval(timer2)
                add_device_unconnect_ethernet(); //等于0还没配置上，跳转到配置失败页面
              }
            }, 1000);
            let timer2 = setInterval(function () {
              _this.$api.devlist.devlist_check_online({
                sn: d_id,
                pass: "1pl%*.1"
              }).then(res => {
                if (res === "") {
                  clearInterval(timer1);
                  clearInterval(timer2);
                  add_device_input_pass();
                }
              })
            }, 5000)
            $("#add_devices_box_close").click(function () {
              close_add_page('add_dev')
              clearInterval(timer1)
              clearInterval(timer2)
            })
          }
          add_device_connect_ethernet_event();
        }

        function add_device_unconnect_ethernet () { //配置失败
          data.parent.innerHTML =
            "<div id='add_devices_box'>"
            + "<div id='add_devices_box_menu'>"
            + "<div id='add_device_unconnect_box'>"
            + "<div id='add_devices_help'></div>" //问号
            + "<div id='add_devices_box_close'></div>"
            + "</div>"
            + "<div id='add_devices_box_title' class='add_devices_unconnect_title'>" + mcs_finish + "</div>" //完成
            + "</div>"
            + "<div id='add_devices_box_body'>"
            + "<div id='add_device_fail_img'></div>"
            + "<div id='add_devices_unconnect_info' class='add_devices_box_info'>" + mcs_wifi_config_failure_reconnect + "</div>" // 配置失败，请点击重试
            + "</div>"
            + "</div>";

          function add_device_unconnect_ethernet_event () {
            $("#add_devices_box_close").click(function () {
              close_add_page('add_dev')
            })
            $("#add_device_fail_img").click(function () {
              add_device_connect_ethernet()
            })
            $("#add_devices_help").click(function () {
              add_devices_help_page()
            })
          }
          add_device_unconnect_ethernet_event()
        }
        function add_devices_help_page () { //配置失败时的帮助页面
          data.parent.innerHTML =
            "<div id='add_devices_box'>"
            + "<div id='add_devices_box_menu'>"
            + "<div id='add_devices_box_back'>" + mcs_back + "</div>"
            + "<div id='add_devices_box_close'></div>"
            + "<div id='add_devices_box_title'>" + mcs_help + "</div>" //帮助
            + "</div>"
            + "<div id='add_devices_box_body'>"
            + "<div class='device_offline_reason'>" + mcs_connect_ethernet_page_title + "</div>" //网线连接
            + "<div class='device_offline_reason_public'>" + mcs_always_cannot_online + "</div>" //设备一直无法上线
            + "<div class='device_offline_reason_public'>" + mcs_always_cannot_online_reason + "</div>"
            + "<div class='device_offline_reason_public'>" + mcs_other_problem_with_feedback + "</div>"
            + "</div>"
            + "</div>"
            + "</div>";
          function add_devices_help_page_event () {
            $("#add_devices_box_back").click(function () {
              add_device_unconnect_ethernet();
            })
            $("#add_devices_box_close").click(function () {
              close_add_page('add_dev')
            })
          }
          add_devices_help_page_event();
        }

        function add_device_input_pass () { //在线 输入密码
          let add_device_step_time = new Date().getTime();//每步开始时间  
          let add_dev_info = {};//每步操作信息  
          add_dev_info.type = 'input';//日志
          add_dev_info.title = 'input password';
          add_dev_info.desc = '';
          add_dev_info.time = 0;
          let b_id = d_id.toUpperCase();
          data.parent = data.parent.innerHTML?data.parent:data.parent[0];
          data.parent.innerHTML =
            "<div id='add_devices_box'>"
            + "<div id='add_devices_box_menu'>"
            + "<div id='add_devices_box_back'>" + mcs_back + "</div>"
            + "<div id='add_devices_box_close'></div>"
            + "<div id='add_devices_box_title'>" + mcs_action_add_device + "</div>"
            + "</div>"
            + "<div id='add_devices_box_body'>"
            + "<div id='add_device_info'>" + mcs_device_id + ":" + b_id + " &nbsp;&nbsp;" + mcs_status + ":" + mcs_state_device_online + "</div>"
            + "<div class='add_device_input_id_box'>"
            + "<div class='add_device_input_pass_box_ico'></div>"
            + "<div id='add_device_input_pass_box_del' class='add_device_input_id_box_del'></div>"
            + "<input id='add_device_input_pass' class='add_device_input_id_box_input' type='password' placeholder='" + mcs_input_password + "'>"
            + "</div>"
            + "<div id='add_device_submit'>" + mcs_action_next + "</div>"
            + "<div id='add_device_forget_pass'>" + mcs_forgot_your_password + "</div>"
            + "</div>"
            + "</div>";
          function add_device_input_pass_event () {
            if (obj.sn) {
              $("#add_devices_box_back").hide();
            }
            $("#add_devices_box_back").click(function () {
              add_device_input_id();
            })
            $('#add_device_input_pass').keyup(function () {//日志 输入密码后时间
              add_dev_info.desc = 'add_password_' + this.value + '';
              add_dev_info.time = new Date().getTime() - add_device_step_time;
            })
            $("#add_device_input_pass_box_del").click(function () {
              $("#add_device_input_pass").val('')
            })
            $("#add_device_submit").click(function () {
              let password = $("#add_device_input_pass").val();
              if (!password) {
                add_dev_info.desc = 'input password is empty';
                _this.publicFunc.msg_tips({ msg: mcs_the_password_is_empty, type: "error", timeout: 3000 });
              } else {
                // 展示遮罩层
                _this.publicFunc.showBufferPage()
                // $("#buffer_page").show();
                _this.$api.devlist.dev_add({ // 调用添加设备接口
                  sn: d_id,
                  password: password
                }).then(res => {
                  _this.publicFunc.closeBufferPage()
                  if (res && res.result == "") {
                    let add_device_result = 'success' //日志 添加设备结果
                    add_dev_info.desc = 'add device success';
                    if (password.length > 5) {
                      if (res.info && res.info.p) {
                        // 暂时不清楚判断参数的含义,但如果设备在线并且密码不为admin则不去设置任何关于摄像头的参数直接添加成功
                        for (let k = 0, length = res.info.p.length; k < length; k++) {
                          if (res.info.p[k].n == "s.wifs" && (res.info.p[k].v == "srvok")) {
                            // add_device_set_nick();
                            close_add_page('add_dev');
                            break;
                          } else if (res.info.p[k].v == "none") {
                            // add_device_set_nick();
                            close_add_page('add_dev');
                            break;
                          } else if (res.info.p[k].n == "s.wifs") {
                            // add_device_set_wifi();
                            close_add_page('add_dev');
                            break;
                          } else if (res.info.p[k].n == "s.eye") {//鱼眼
                            close_add_page('add_dev');
                            break;
                          }
                        }
                        close_add_page('add_dev');
                        _this.publicFunc.msg_tips({ msg: mcs_add_successfully, type: "success", timeout: 3000 }); // 添加成功
                      } else {
                        close_add_page('add_dev');
                      }
                    }
                    else { //如果密码是admin时，修改密码
                      add_device_edit_pass(password);
                    }
                  } else if (res.result == "accounts.pass.invalid") {
                    add_dev_info.desc = 'add device fail' + mcs_invalid_password;
                    _this.publicFunc.msg_tips({ msg: mcs_invalid_password + ".", type: "error", timeout: 3000 });
                  } else if (res.result == "subdev.exceed.device") {
                    add_dev_info.desc = 'add device fail' + mcs_devices_in_the_account_overrun;
                    _this.publicFunc.msg_tips({ msg: mcs_devices_in_the_account_overrun + ".", type: "error", timeout: 3000 });
                  } else if (res.result == "server.app.invalid") { // app限制   
                    add_dev_info.desc = 'add device fail' + mcs_device_add_app_invalid;
                    _this.publicFunc.msg_tips({ msg: mcs_device_add_app_invalid, type: "error", timeout: 3000 });
                  } else if (res.result == "server.loc.invalid") { // 地区限制 
                    add_dev_info.desc = 'add device fail' + mcs_device_add_loc_invalid;
                    _this.publicFunc.msg_tips({ msg: mcs_device_add_loc_invalid, type: "error", timeout: 3000 });
                  }
                })
              }
            })
            $("#add_device_forget_pass").click(function () {
              add_device_forget_pass()
            })
            _this.addDeviceList.push(add_dev_info);
            $("#add_devices_box_close").click(function () {
              close_add_page('add_dev')
            })
          }
          add_device_input_pass_event();
        }
        function add_device_edit_pass (old_password) {
          let b_id = d_id.toUpperCase();
          data.parent.innerHTML =
            "<div id='add_devices_box'>"
            + "<div id='add_devices_box_menu'>"
            + "<div id='add_devices_box_back' style='display:none;'>" + mcs_back + "</div>"
            + "<div id='add_devices_box_close' style='display:none;'></div>"
            + "<div id='add_devices_box_title'>" + mcs_action_add_device + "</div>"
            + "</div>"
            + "<div id='add_devices_box_body'>"
            + "<div id='add_device_success'>"
            + "<div id='add_device_success_ico'></div>"
            + "<div id='add_device_success_txt'>" + mcs_device_id + ":" + b_id + " " + mcs_add_successfully + "!</div>"
            + "</div>"
            + "<div id='add_device_edit_pass_tips'>" + mcs_device_password_too_simple + "</div>" //密码8到32位
            + "<div class='add_device_input_id_box'>"
            + "<div class='add_device_input_pass_box_ico'></div>"
            + "<input id='add_device_edit_pass' class='add_device_input_id_box_input' type='password' placeholder='" + mcs_input_password + "'>"
            + "</div>"
            + "<div class='add_device_input_id_box'>"
            + "<div class='add_device_input_pass_box_ico'></div>"
            + "<input id='add_device_edit_confirm_pass' class='add_device_input_id_box_input' type='password' placeholder='" + mcs_input_confirm_password + "'>"
            + "</div>"
            + "<div id='add_device_submit'>" + mcs_change + "</div>" //修改
            + "</div>"
            + "</div>";
          function add_device_edit_pass_event () {
            let add_device_step_time = new Date().getTime();//每步开始时间  
            let add_dev_info = {};//每步操作信息  
            add_dev_info.type = 'input';//日志
            add_dev_info.title = 'edit password';
            add_dev_info.desc = 'edit password';
            add_dev_info.time = 0;
            $("#add_devices_box_back").click(add_device_input_pass())
            $('#add_device_edit_confirm_pass').keyup(function () {//日志 修改密码再次确认后时间   
              add_dev_info.time = new Date().getTime() - add_device_step_time;
            })
            _this.addDeviceList.push(add_dev_info);//日志
            $("#add_device_submit").onclick = function () {
              let password = $("#add_device_edit_pass").val();
              let re_password = $("#add_device_edit_confirm_pass").val();
              let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,32}$/;
              if (!password || !re_password) {
                _this.publicFunc.msg_tips({ msg: mcs_the_password_is_empty, type: "error", timeout: 3000 });
              } else if (!reg.exec(password)) { //密码为8到32位的数字和字母
                _this.publicFunc.msg_tips({ msg: mcs_password_range_hint, type: "error", timeout: 3000 });
              } else if (password != re_password) { //密码不一致
                _this.publicFunc.msg_tips({ msg: mcs_two_password_input_inconsistent, type: "error", timeout: 3000 });
              } else {
                _this.$api.devlist.dev_passwd_set({ // 设备密码设置
                  sn: d_id,
                  old_password: old_password,
                  new_password: password
                }).then(res => {
                  if (res) {
                    _this.$api.devlist.dev_add({ // 添加设备
                      sn: d_id,
                      password: password
                    }).then(res => {
                      add_device_set_wifi(res)
                    })
                  } else {
                    _this.publicFunc.msg_tips({ msg: mcs_failed_to_set_the, type: "error", timeout: 3000 })
                  }
                })
              }
            }
            $("#add_devices_box_close").click(function () {
              close_add_page('add_dev')
            })
          }
          add_device_edit_pass_event();
        }
        function add_device_set_wifi () {
          let b_id = d_id.toUpperCase();
          data.parent.innerHTML =
            "<div id='add_devices_box'>"
            + "<div id='add_devices_box_menu'>"
            + "<div id='add_devices_box_back'>" + mcs_back + "</div>"
            + "<div id='add_devices_box_close'></div>"
            + "<div id='add_devices_box_title'>" + mcs_action_add_device + "</div>"
            + "</div>"
            + "<div id='add_devices_box_body'>"
            + "<div id='add_device_success'>"
            + "<div id='add_device_success_ico'></div>"
            + "<div id='add_device_success_txt'>" + mcs_device_id + ":" + b_id + " " + mcs_add_successfully + "!</div>"
            + "</div>"
            + "<div id='add_device_edit_pass_tips'>" + mcs_prompt_config_wifi + "</div>"
            + "<div id='add_device_set_wifi_refresh'></div>"
            + "<div id='add_device_set_wifi_box'>"
            + "<div class='add_device_set_wifi_box_ico'></div>"
            + "<div id='add_device_set_wifi_btn' class='add_device_set_wifi_up'></div>"
            + "<div id='add_device_set_wifi_input' class='add_device_set_wifi_input'>" + (mcs_select_wifi_wizard.length < 14 ? mcs_select_wifi_wizard : (mcs_select_wifi_wizard.substr(0, 14) + "...")) + "</div>"
            + "<div id='add_device_set_wifi_list_box'></div>"
            + "</div>"
            + "<div class='add_device_input_id_box'>"
            + "<div class='add_device_input_pass_box_ico'></div>"
            + "<input id='add_device_wifi_password' class='add_device_input_id_box_input' type='password' placeholder='" + mcs_input_password + "'>"
            + "</div>"
            + "<div id='add_device_submit'>" + mcs_action_next + "</div>"
            + "<div id='add_device_skip'>" + mcs_action_skip + "</div>"
            + "</div>"
            + "</div>";
          $("#add_device_set_wifi_refresh").click(function () {
            let wifi_Dom = ''
            $("#add_device_set_wifi_list_box").html('')
            _this.$api.devlist.wifi_get({ // 设备可连接wifi获取
              sn: d_id
            }).then(res => {
              _this.publicFunc.closeBufferPage()
              if (res) {
                for (let i = 0; i < res.length; i++) {
                  wifi_Dom += "<div class='add_device_set_wifi_list'>" + res[i].ssid + "</div>"
                  $("#add_device_set_wifi_list_box").html(wifi_Dom)
                }
                add_device_set_wifi_event();
              } else {
                add_device_set_wifi_event();
              }
            })
          })
          function add_device_set_wifi_event () {
            let select_wifi = '';
            let add_device_step_time = new Date().getTime();//每步开始时间
            let add_dev_info = {};//每步操作信息
            add_dev_info.type = 'click';//日志
            add_dev_info.title = 'connect wifi';
            add_dev_info.desc = 'skip set wifi';
            add_dev_info.time = 0;
            $("#add_devices_box_back").click(add_device_input_id)
            for (let i = 0; i < $(".add_device_set_wifi_list").length; i++) {
              $(".add_device_set_wifi_list")[i].click(function () {
                select_wifi = this.html();
                add_dev_info.desc = 'select wifiname_' + select_wifi + '';//日志
                select_wifi = select_wifi.length < 20 ? select_wifi : (select_wifi.substr(0, 20) + "...");
                $("#add_device_set_wifi_input").html(select_wifi)
                $("#add_device_set_wifi_list_box").hide();
                $("#add_device_set_wifi_btn").attr('class', 'add_device_set_wifi_up')
              })
            }
            $('#add_device_wifi_password').keyup(function () {//日志 输入完wifi密码后时间
              add_dev_info.time = new Date().getTime() - add_device_step_time;
            })
            $("#add_device_set_wifi_btn").click(function () {
              if (this.className == "add_device_set_wifi_down") {
                $("#add_device_set_wifi_list_box").slideUp();
                this.className = "add_device_set_wifi_up";
              } else if (this.className == "add_device_set_wifi_up") {
                $("#add_device_set_wifi_list_box").slideDown();
                this.className = "add_device_set_wifi_down";
              }
            })
            $("#add_device_submit").click(function () {
              // console.log("点击添加wifi下一步")
              add_set_wifi_startime = new Date().getTime(); //日志 wifi配置开始时间
              let wifi_password = $("#add_device_wifi_password").val();
              let wifi_ssid = $("#add_device_set_wifi_input").html();
              // 展示遮罩层
              _this.publicFunc.showBufferPage()
              _this.$api.devlist.wifi_set({
                sn: d_id,
                ssid: wifi_ssid,
                key: wifi_password
              }).then(res => {
                _this.publicFunc.closeBufferPage()
                if (res.type === 'error') {
                  add_dev_info.desc = 'set wifi_' + select_wifi + 'error';//日志
                  add_set_wifi_endtime = new Date().getTime(); //日志 wifi配置结束时间
                  add_set_wifi_totaltime = add_set_wifi_endtime - add_set_wifi_startime;//日志 wifi配置耗时
                  _this.publicFunc.msg_tips({ msg: res.msg, type: res.type, timeout: 3000 });
                } else if (res.type === 'success') {
                  add_dev_info.desc = 'set wifi_' + select_wifi + 'success';//日志
                  add_set_wifi_endtime = new Date().getTime(); //日志 wifi配置结束时间
                  add_set_wifi_totaltime = add_set_wifi_endtime - add_set_wifi_startime;//日志 wifi配置耗时
                  _this.publicFunc.msg_tips({ msg: res.msg, type: res.type, timeout: 3000 });
                  add_device_set_nick();
                } else {
                  add_device_set_nick();
                }
              })
            })
            $("#add_device_skip").click(function () {
              // console.log('点击跳过')
              add_device_set_nick();
            })
            _this.addDeviceList.push(add_dev_info);//日志
            $("#add_devices_box_close").click(function () {
              close_add_page('add_dev')
            })
          }
          $("#add_device_set_wifi_refresh").click();
        }
        function add_device_set_nick () {
          let b_id = d_id.toUpperCase();
          data.parent.html("<div id='add_devices_box'>"
            + "<div id='add_devices_box_menu'>"
            + "<div id='add_devices_box_back'>" + mcs_back + "</div>"
            + "<div id='add_devices_box_close'></div>"
            + "<div id='add_devices_box_title'>" + mcs_nick_modify + "</div>"
            + "</div>"
            + "<div id='add_devices_box_body'>"
            + "<div id='add_device_edit_name_tips'>" + mcs_device_id + ":" + b_id + "</div>"
            + "<div class='add_device_input_id_box'>"
            + "<div class='add_device_input_name_box_ico'></div>"
            + "<input id='add_device_nick' class='add_device_input_id_box_input' type='text' placeholder='" + mcs_input_nick + "'>"
            + "</div>"
            + "<div id='add_device_submit'>" + mcs_action_next + "</div>"
            + "<div id='add_device_skip'>" + mcs_action_skip + "</div>"
            + "</div>"
            + "</div>")
          function add_device_set_nick_event () {
            let add_device_step_time = new Date().getTime();//每步开始时间
            let add_dev_info = {};//每步操作信息
            add_dev_info.type = 'input'//日志
            add_dev_info.title = 'nickname modify'
            add_dev_info.desc = 'skip set nickname'
            add_dev_info.time = 0;
            $("#add_devices_box_back").click(function () {
              add_device_set_wifi();
            })
            $('#add_device_nick').keyup(function () {//日志 输入完昵称后时间
              add_dev_info.desc = 'set device nickname_' + this.value + '';
              add_dev_info.time = new Date().getTime() - add_device_step_time;
            })
            _this.addDeviceList.push(add_dev_info);//日志
            $("#add_device_submit").click(function () {
              let nick = $("#add_device_nick").val();
              if (!nick) {
                _this.publicFunc.msg_tips({ msg: mcs_nick_not_empty, type: "error", timeout: 3000 });
              } else {
                _this.$api.devlist.nick_set({ // 设置设备昵称
                  sn: d_id,
                  nick: nick
                }).then(res => {
                  add_device_set_zone(res)
                })
              }
            })
            $("#add_device_skip").click(function () {
              add_device_set_zone()
            })
            $("#add_devices_box_close").click(function () {
              close_add_page('add_dev')
            })
          }
          add_device_set_nick_event()
        }
        function add_device_set_zone () {
          let timezone = "";
          data.parent.html("<div id='add_devices_box'>"
            + "<div id='add_devices_box_menu'>"
            + "<div id='add_devices_box_back'>" + mcs_back + "</div>"
            + "<div id='add_devices_box_close'></div>"
            + "<div id='add_devices_box_title'>" + mcs_settings + mcs_time_zone + "</div>"
            + "</div>"
            + "<div id='add_devices_box_body'>"
            + "<div id='add_device_set_zone_box'>"
            + "<div class='add_device_set_zone_box_ico'></div>"
            + "<div id='add_device_set_wifi_btn' class='add_device_set_wifi_up'></div>"
            + "<div id='add_device_set_zone_input' class='add_device_set_wifi_input'></div>"
            + "<div id='add_device_set_wifi_list_box'></div>"
            + "</div>"
            + "<div id='add_device_submit'>" + mcs_ok + "</div>"
            + "<div id='add_device_skip'>" + mcs_action_skip + "</div>"
            + "</div>"
            + "</div>")
          // 展示遮罩层
          _this.publicFunc.showBufferPage()
          _this.$api.devlist.time_zone_get({ // 设备时区获取
            sn: d_id
          }).then(res => {
            let wifi_Dom
            $("#add_device_set_wifi_list_box").html('')
            if (res) {
              _this.$api.devlist.time_get({ // 设备详细时间获取
                sn: d_id
              }).then(res => {
                time_get_ack(res)
              })
              for (let i = 0; i < res.length; i++) {
                let zone_name_tmp = res[i].city.replace(/\(|&|\)|_/g, "")
                let zone_name = eval("mcs_timezone_" + zone_name_tmp)
                wifi_Dom += "<div class='add_device_set_wifi_list' utc='" + res[i].utc + "' city='" + res[i].city + "' name='" + res[i].file + "'>" + zone_name + "</div>"
                $("#add_device_set_wifi_list_box").html(wifi_Dom)
              }
            }
          })
          function time_get_ack (msg) {
            // $("#buffer_page").hide();
            _this.publicFunc.closeBufferPage()
            let timezone_name = msg.timezone;
            let timezone_tmp = msg.timezone.replace(/\(|&|\)|_/g, "");
            timezone_tmp = meval("mcs_timezone_" + timezone_tmp) || timezone_tmp;
            timezone_tmp = timezone_tmp.length < 10 ? timezone_tmp : (timezone_tmp.substr(0, 10) + "...");
            $("#add_device_set_zone_input").html(timezone_tmp)
            timezone = timezone_name;
            add_device_set_zone_event();
          }
          function add_device_set_zone_event () {
            let add_device_step_time = new Date().getTime();//每步开始时间
            let add_dev_info = {};//每步操作信息
            add_dev_info.type = 'click';//日志
            add_dev_info.title = 'add device set timezone';
            add_dev_info.desc = 'skip set timezone';
            add_dev_info.time = 0;
            $("#add_devices_box_back").click(function () {
              add_device_set_nick();
            })
            for (let i = 0; i < $(".add_device_set_wifi_list").length; i++) {
              $(".add_device_set_wifi_list")[i].click(function () {
                let timezone_tmp = this.html()
                add_dev_info.desc = 'set timezone_' + timezone_tmp + '';//日志
                add_dev_info.time = new Date().getTime() - add_device_step_time;//日志
                timezone_tmp = timezone_tmp.length < 10 ? timezone_tmp : (timezone_tmp.substr(0, 10) + "...");
                $("#add_device_set_zone_input").html(timezone_tmp)
                timezone = this.attr("city")
                $("#add_device_set_wifi_list_box").hide()
                $("#add_device_set_wifi_btn").attr('class', 'add_device_set_wifi_up')
              })
            }
            $("#add_device_set_wifi_btn").click(function () {
              if (this.attr('class') === "add_device_set_wifi_down") {
                $("#add_device_set_wifi_list_box").slideUp()
                this.attr('class', 'add_device_set_wifi_up')
              } else if (this.attr('class') == "add_device_set_wifi_up") {
                $("#add_device_set_wifi_list_box").slideDown()
                this.attr('class', 'add_device_set_wifi_down')
              }
            })
            _this.addDeviceList.push(add_dev_info);
            $("#add_device_submit").click(function () {
              // 展示遮罩层
              _this.publicFunc.showBufferPage()
              _thie.$api.devlist.time_set({ // 设置设备时区及时间
                sn: d_id,
                timezone: timezone
              }).then(res => {
                if (res == 1) {
                  _this.publicFunc.msg_tips({ msg: mcs_failed_to_set_the, type: "error", timeout: 3000 });
                } else {
                  // $("#buffer_page").hide();
                  _this.publicFunc.closeBufferPage()
                  _this.publicFunc.msg_tips({ msg: mcs_set_successfully, type: "success", timeout: 3000 }); //设置完时区提示
                  close_add_page('add_dev')
                }
              })
            })
            $("#add_devices_box_close").click(function () {
              close_add_page('add_dev');
            })
            $("#add_device_skip").click(function () {
              close_add_page('add_dev');
            })
          }
        }
        function add_device_forget_pass () {
          if (d_type == 'b1' || d_type == 'b2' || d_type == 'b3') {
            data.parent.innerHTML =
              "<div id='add_devices_box'>"
              + "<div id='add_devices_box_menu'>"
              + "<div id='add_devices_box_back'>" + mcs_back + "</div>"
              + "<div id='add_devices_box_close'></div>"
              + "<div id='add_devices_box_title'>" + mcs_forgot_your_password + "</div>"
              + "</div>"
              + "<div id='add_devices_box_body'>"
              + "<div id='add_device_sample_img' style='background:url("+ require( "@/assets/device/reset_" + d_type + ".png" )+") no-repeat center center;'></div>"
              + "<div class='add_devices_box_info'>" + mcs_bseries_forget_password + "</div>"
              // +"<div id='failed_to_restore'>"+ mcs_failed_to_restore+"</div>" // 未恢复出厂设置
              + "<div id='add_device_submit'>" + mcs_close + "</div>"
              + "</div>"
              + "</div>";
          } else if (d_type == 's1') {
            data.parent.innerHTML =
              "<div id='add_devices_box'>"
              + "<div id='add_devices_box_menu'>"
              + "<div id='add_devices_box_back'>" + mcs_back + "</div>"
              + "<div id='add_devices_box_close'></div>"
              + "<div id='add_devices_box_title'>" + mcs_forgot_your_password + "</div>"
              + "</div>"
              + "<div id='add_devices_box_body'>"
              + "<div id='add_device_sample_img' style='background:url("+ require( "@/assets/device/reset_" + d_type + ".png" )+") no-repeat center center;'></div>"
              + "<div class='add_devices_box_info'>测试用</div>"
              // +"<div class='add_devices_box_info'>"+mcs_reset_s1+"</div>" 
              // +"<div id='failed_to_restore'>"+ mcs_failed_to_restore  +"</div>" //未恢复出厂设置
              + "<div id='add_device_submit'>" + mcs_close + "</div>"
              + "</div>"
              + "</div>";
          } else if (d_type == 'p1' || d_type == '361') {
            data.parent.innerHTML =
              "<div id='add_devices_box'>"
              + "<div id='add_devices_box_menu'>"
              + "<div id='add_devices_box_back'>" + mcs_back + "</div>"
              + "<div id='add_devices_box_close'></div>"
              + "<div id='add_devices_box_title'>" + mcs_forgot_your_password + "</div>"
              + "</div>"
              + "<div id='add_devices_box_body'>"
              + "<div id='add_device_sample_img' style='background:url(@/assets/device/reset_" + d_type + ".png) no-repeat center center;'></div>"
              + "<div class='add_devices_box_info'>" + mcs_press_hole_restore_to_reset_password + "</div>"
              // +"<div id='failed_to_restore'>"+ mcs_failed_to_restore  +"</div>" //未恢复出厂设置
              + "<div id='add_device_submit'>" + mcs_close + "</div>"
              + "</div>"
              + "</div>";
          } else {
            data.parent.innerHTML =
              "<div id='add_devices_box'>"
              + "<div id='add_devices_box_menu'>"
              + "<div id='add_devices_box_back'>" + mcs_back + "</div>"
              + "<div id='add_devices_box_close'></div>"
              + "<div id='add_devices_box_title'>" + mcs_forgot_your_password + "</div>"
              + "</div>"
              + "<div id='add_devices_box_body'>"
              + "<div id='add_device_sample_img' style='background:url("+ require( "@/assets/device/reset_" + d_type + ".png" )+") no-repeat center center;'></div>"
              + "<div class='add_devices_box_info'>" + mcs_press_button_restore_to_reset_password + "</div>"
              // +"<div id='heared_sound'>"+mcs_hear_voice +"?</div>" //没听到语音
              + "<div id='add_device_submit'>" + mcs_close + "</div>"
              + "</div>"
              + "</div>";
          }

          function add_device_forget_pass_event () {
            $("#add_devices_box_back").click(add_device_input_pass())
            $("#add_devices_box_close").click(close_add_page())
            $("#add_device_submit").click(add_device_input_pass())
          }
          add_device_forget_pass_event();
        }
        if (data.sn) {
          add_device_input_id(1);
        } else {
          add_device_select_type();
        }
      }
      function close_add_page (data) {
        if (data == 'add_dev') { //如果在添加设备过程中时关闭
          let add_device_endtime = new Date().getTime();//添加设备结束，点击关闭
          let add_device_totaltime = add_device_endtime - _this.addDeviceTime;
          // upload_log('log_app_add_dev');
        }
        $("#add_device_page").hide();
        get_dev_list("refresh");
      }
      window.onresize = function () { // 监听窗口改变事件
        if (!_this.$store.state.jumpPageData.localFlag && _this.$store.state.jumpPageData.autoPlayFlag) { // 判断是否为客户端且为本地模式的自动播放情况
          device_list_load();  // 重载设备列表
        }
      }
    },
    add_device_connect_power_event () {
      $("#add_devices_box_back").click(function () {
        add_device_input_id();
      })
      $("#add_devices_img").click(function () { //缺少删除步骤
        $('body').append('<embed src="./theme/device/startSound.mp3" autostart="true" hidden="true" loop="false">');
      });
      $("#add_devices_box_close").click(function () {
        close_add_page('add_dev');
      })
      $("#add_device_submit").click(add_device_connect_ethernet())
    },

    get_service_record_list (n) {
      let s_length = this.search_sort.length;
      let tmp_search_sort = [];
      let tmp_search_tree = [];
      if (s_length > n * 100) {
        let j = 0;
        for (let i = n * 100; i < s_length && i < (n + 1) * 100; i++) {
          tmp_search_sort[j] = this.search_sort[i];
          tmp_search_tree[j] = this.search_tree[i];
          j++;
        }
        _this.$api.devlist.service_record_get({ // 获取服务记录接口
          keys: tmp_search_sort
        }).then(res => {
          if (res && res.ret == "") {
            for (let i = n * 100; i < res.datas.length + n * 100; i++) {
              data[i].sort = parseInt(res.datas[i]);
            }
          }
          _this.$api.devlist.service_record_get({
            keys: tmp_search_tree
          }).then(res_tree => {
            if (res_tree && res_tree.ret === "") {
              for (let w = n * 100; w < res_tree.datas.length + n * 100; w++) {
                if (n == 0) {
                  data[w].tree = (res_tree.datas[w] !== "") ? res_tree.datas[w] : data[w].nick;
                } else {
                  data[w].tree = (res_tree.datas[w - n * 100] !== "") ? res_tree.datas[w - n * 100] : data[w].nick;
                }
              }
            }
          })
        })
      } else {
        data = data.sort(compare);
        tree_back_data = data;
        tree_list(data);
        this.devlistData = this.$store.state.jumpPageData.deviceData;
        this.searchData = data;
        this.filterData = data;
        back_flag = sessionStorage.getItem("back_flag");
        if (back_flag === null || !back_flag) {
          // console.log(data, 'data1')
          device_list(data);
        } else {
          let back_data = [];
          getNickRecord = sessionStorage.getItem("saveNickRecord");
          for (let m = 0; m < data.length; m++) {
            if (data[m].nick.indexOf(getNickRecord) > -1) {
              back_data.push(data[m])
            }
            // console.log(data, 'data2')
            device_list(back_data);
          }
        }
      }
    },
    //实现拖拽功能
    allowDrop (ev) {
      ev.preventDefault();
    },
    drag (ev, divdom) {
      srcdiv = divdom;
      ev.dataTransfer.setData("text/html", divdom.innerHTML);
    },
    drop (ev, divdom) {
      ev.preventDefault();
      if (srcdiv != divdom) {
        srcdiv.innerHTML = divdom.innerHTML;
        divdom.innerHTML = ev.dataTransfer.getData("text/html");
      }
    },
    //实现拖拽功能
    check_app_version () {
      let version_type = "";
      let app_version = window.appVersion ? window.appVersion : "";
      if (navigator.userAgent.indexOf("Intel Mac") > -1) {
        version_type = "mac_" + _this.$store.state.jumpPageData.projectName;
      } else if (navigator.userAgent.indexOf("Windows") > -1) {
        version_type = "windows_" + _this.$store.state.jumpPageData.projectName;
      }
      if (!$("#version_updata_tips_page").length > 0) {
        $("body").append(
          "<div id='version_updata_tips_page'>"
          + "<div id='version_updata_tips_box'>"
          + "<div id='version_updata_tips_content'>" + mcs_start_upgrade + "</div>"
          + "<a target='_top' href='http://" + host_oems + "/about/index.htm'><div id='version_updata_tips_ok'>" + mcs_ok + "</div></a>"
          + "<div id='version_updata_tips_cancel'>" + mcs_cancel + "</div>"
          + "</div>"
          + "</div>")
      }
      $("#version_updata_tips_cancel").click(function () {
        $("#version_updata_tips_page").hide()
      })
      _this.$api.login.get_version({ // 发送请求对比客户端版本是否为最新版
        srv: window.location.host,
        ver_type: version_type,
        ver_from: "v3.9.1.1607051739",
        lang: sessionStorage.getItem('userLanguage')
      }).then(res => {
        let msg = res.data
        if (msg && msg.result == "") {
          _this.$store.dispatch('setDownloadManualUrl', '')
          let app_ver = app_version.split(".");
          let new_ver = msg.info.ver_to.split(".");
          if (window.location.protocol === "https:") { // 赋值下载地址
            msg.info.link_url = msg.info.link_url.replace("http://209.133.212.170:2080", "https://us10.vimtag.com:2446");
            msg.info.link_url = msg.info.link_url.replace("http://61.147.109.92:7080", "https://js.vimtag.com:7446");
          }
          _this.$store.dispatch('setDownloadManualUrl', msg.info.link_url)
          // 这部分判断需要优化一下
          if (app_ver[0] < new_ver[0]) {
            $("#version_updata_tips_page").show();
          } else if (app_ver[0] == new_ver[0]) {
            if (app_ver[1] < new_ver[1]) {
              $("#version_updata_tips_page").show();
            } else if (app_ver[1] == new_ver[1]) {
              if (app_ver[2] < new_ver[2]) {
                $("#version_updata_tips_page").show();
              } else if (app_ver[2] == new_ver[2]) {
                if (app_ver[3] < new_ver[3]) {
                  $("#version_updata_tips_page").show();
                }
              }
            }
          }
        }
      })
    }
  },
  async mounted () {
    let userLanguage = sessionStorage.getItem('userLanguage')
    if (userLanguage) {
      await this.$chooseLanguage.lang(userLanguage)
    } else {
      await this.$chooseLanguage.lang('en')
    }
    let pageData;//页面创建相关对象
    if(this.$route.params){
      pageData = this.$route.params;
      pageData.parent = $("#" + this.$route.name)
    }else{
      pageData = {parent: $("#" + this.$route.name)}
    }
    console.log(pageData,"pageData")
    await this.vimtagDevlist(pageData) // 进入页面后加载
    await this.publicFunc.importCss('Public.scss') // 动态引入css样式 页面加载完成后加载样式(如果加载过早则会无法改变jq填充的dom)
    if (window.location.href.indexOf('vimtag') === -1) {
      // mipc系列
      languageSelect.mipc($('#login_box'))
      $('#login_box').append("<div id='is_mipc_div'></div>")
    }
    this.publicFunc.projectReload.call(this);
  }
}
</script>