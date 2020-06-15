<template>
  <div id="test">加载内容</div>
</template>

<style lang="scss" scoped>
// @import url(./index.scss); (暂时注释后续放开)
#test{
  height: 100%;
}
</style>

<script>
export default {
  name: "testJq",
  data () {
    return {
      obj: ""
    }
  },
  methods: {
    create_login_page (obj) {
      // 创建登录页面dom结构
      // 暂存全局obj变量
      // g_obj_login = obj 
      obj.parent.html(
        "<div id='login_page'>" +
        "<div id='login_box'>" +
        "<div id='vimtag_signin_inner'>" +
        "<div id='signin_logo_vimtag'></div>" +
        "<div id='sigin_in_username' class='input_div'>" +
        "<div class='vimtag_login_user'></div>" +
        "<input id='signin_name' class='input_username' value='" +
        mcs_username +
        "'>" + // 登录时用户名
        "<div class='vimtag_login_input'></div>" +
        "</div>" +
        "<div id='register_username' class='input_div'>" +
        "<div class='vimtag_login_user'></div>" +
        "<input id='register_signin_name' class='input_username' value='" +
        mcs_input_username +
        "'>" + // 注册时填写用户名
        "<div class='vimtag_login_input'></div>" +
        "</div>" +
        "<div id='sigin_in_password' class='input_div'>" +
        "<div class='vimtag_password_img'></div>" +
        "<input id='signin_pw' class='input_password' type='text' value='" +
        mcs_password +
        "'>" + // 登录时密码
        "<div id='password_eye' class='password_eye_gray'></div>" +
        "<div class='vimtag_login_input'></div>" +
        "</div>" +
        "<div id='register_account_pwd' class='input_div'>" +
        "<div class='vimtag_password_img'></div>" +
        "<input id='register_signin_pw' class='input_password' type='text' value='" +
        mcs_input_password +
        "'>" + // 注册时填写密码
        "<div id='register_password_eye' class='password_eye_gray'></div>" +
        "<div class='vimtag_login_input'></div>" +
        "</div>" +
        "<div id='register_account_pwd_again' class='input_div'>" +
        "<div class='vimtag_password_img'></div>" +
        "<input id='register_signin_pw_again' class='input_password' type='text' value='" +
        mcs_confirm_password +
        "'>" + // 注册时填写确认密码
        "<div id='register_password_eye_again' class='password_eye_gray'></div>" +
        "<div class='vimtag_login_input'></div>" +
        "</div>" +
        "<div id='keep_sign_in'>" +
        "<input id='keep_sign_in_check' type='checkbox'><span>" +
        mcs_remember_password +
        "</span>" + // 记住密码选框
        "</div>" +
        "<button class='vimtag_btn' id='sign_in'>" +
        mcs_sign_in +
        "</button>" + // 登录页面中登录按钮
        "<button class='vimtag_btn' id='register_btn'>" +
        mcs_sign_up +
        "</button>" + // 注册页面中注册按钮
        "<div>" +
        "<span id='register_account'>" +
        mcs_sign_up +
        "</span>" + // 登录页面中注册文字按钮
        "<span id='forget_pass'>" +
        mcs_forgot_your_password +
        "?</span>" + // 登录页面中忘记密码文字按钮
        "<span id='sign_account'>" +
        mcs_sign_in +
        "</span>" + // 注册页面中登录文字按钮
        "</div>" +
        "</div>" +
        "<div id='forget_pass_inner_main'>" + // 忘记密码点击弹窗渲染节点
        "</div>" +
        "</div>" +
        "</div>"
      )

      // 默认展示登录页面的节点
      $("#keep_sign_in").show()
      $("#register_username").hide()
      $("#register_account_pwd").hide()
      $("#register_account_pwd_again").hide()
      $("#register_btn").hide()
      $("#sign_account").hide()

      var bt, aaa, username
      if (localStorage.getItem("remember_msg_info")) {
        // mlocal_storage参见\web\lib\mlib.core.localstorage.js
        bt = localStorage.getItem("remember_msg_info")
        aaa = eval("(" + bt + ")")  // aaa为remember_msg_info字符串方法的结果
        username = aaa.user
      }

      if (!localStorage.getItem("keep_pw")) {
        // 本地加密存储帐号密码 改变自动登录状态
        if (username) {
          localStorage.setItem(
            "remember_msg_info",
            mcodec.obj_2_str({ user: username })
          )  // mcodec参见\web\lib\mlib.core.codec.js
        }
      }

      let l_remember_data = localStorage.getItem("remember_msg_info")  // 从存储空间中取出账户名和密码并填写渲染在页面中
      let l_remember_data_obj = l_remember_data
        ? eval("(" + l_remember_data + ")")
        : null
      if (l_remember_data_obj && l_remember_data_obj.user) {
        $("#signin_name").val(l_remember_data_obj.user)
        $("#signin_name").attr('style', 'color: #404040')
      }
      if (l_remember_data_obj && l_remember_data_obj.password) {
        $("#signin_pw").val("••••••")
        l_password_value = l_remember_data_obj.password
        $("#signin_pw").css('color', "#404040")
      }
      if (localStorage.getItem("keep_pw")) {
        // 存储中保持登录状态被选中
        mx("#keep_sign_in_check").setAttribute("checked", "true")  // 页面中添加被选中效果
      }
      $("#forget_pass").click(function () {
        // 忘记密码渲染dom
        var dom_forget_pass =
          "<div id='forget_pass_inner'>" +
          "<div id='binding_account_cancel_btn'>&times </div>" +
          "<div style='margin-top:50px ' id='input_account_page'>" +
          "<div style='font-size:20px color:#323232 '>" +
          mcs_forgot_your_password +
          "</div>" + // 忘记密码 (弹框title)
          "<div style='font-size:14px color:#646464 margin-top:40px margin-bottom:20px '>" +
          mcs_valid_user_name +
          "</div>" + // 第一步：请输入有效用户名
          "<div style='margin-bottom:20px '>" +
          "<input class='standard_inputs_normal' id='binding_account_name' type='text' style='width:230px float:none ' value='" +
          mcs_please_input_username +
          "'>" + // 请输入用户名
          "<input class='standard_inputs_normal' id='binding_account' type='text' style='display:none color:#404040 width:230px float:none '>" +
          "</div>" +
          "<div style='width:235px margin:auto '>" + // 下一步按钮
          "<input id='binding_account_next_btn' style='width:100% line-height:34px height:34px background-color:#00a6ba ' type='button' class='vimtag_button_right' value='" +
          mcs_action_next +
          "'>" +
          "</div>" +
          "</div>" +
          "<div style='margin-top:50px display:none color:#00a6ba font-size:14px ' id='input_email_page'>" +
          "<div style='font-size:20px color:#323232 '>" +
          mcs_forgot_your_password +
          "</div>" + // 忘记密码 (弹框title)
          "<div style='font-size:14px color:#646464 margin-top:40px margin-bottom:10px '>" +
          mcs_binding_mailbox +
          "</div>" + // 第二步：请输入绑定的邮箱
          "<div id='email_warn' style='display:none margin-bottom:10px '>" +
          "<span>" +
          mcs_prompt +
          ": </span><span id='binding_account_email'></span>" + // 提示: 绑定的邮箱隐去中间部分
          "</div>" +
          "<div style='margin-bottom:10px '>" +
          "<input class='standard_inputs_normal' id='recovery_pass_email_addr' type='text' style='width:230px float:none ' value='" +
          mcs_input_email_addr +
          "'>" + // 邮箱输入框部分
          "<input class='standard_inputs_normal' id='recovery_pass_email' type='text' style='display:none color:#404040 width:230px float:none '>" +
          "</div>" +
          "<div style='width:235px margin:auto margin-top:10px '>" +
          "<input id='recovery_pass_ok_btn' style='width:100% line-height:34px height:34px background-color:#00a6ba ' type='button' class='vimtag_button_left' value='" +
          mcs_ok +
          "'>" + // 确定按钮
          "<input id='recovery_pass_cancel_btn' style='display:none ' type='button' class='vimtag_button_right' value='" +
          mcs_cancel +
          "'>" + // 取消按钮
          "</div>" +
          "</div>" +
          "<div style='margin-top:50px display:none color:#00a6ba font-size:14px ' id='forget_password_page'>" +
          "<div style='font-size:20px color:#323232 '>" +
          mcs_forgot_your_password +
          "</div>" + // 忘记密码 (弹框title)
          "<div style='margin-bottom:10px margin:0 auto margin-top:60px font-size:14px color:#323232 width:335px ' id='retrieve_password_warn'></div>" +
          "<div style='width:235px margin:auto margin-top:20px '>" + // 提示内容
          "<input id='forget_password_close_btn' style='width:100% line-height:34px height:34px background-color:#00a6ba ' type='button' class='vimtag_button_left' value='" +
          mcs_ok +
          "'>" + // 确定按钮
          "</div>" +
          "</div>" +
          "</div>"
        // 在登录页面中插入忘记密码弹窗dom
        $("#forget_pass_inner_main").html(dom_forget_pass)
        // dom绑定局部元素
        var l_dom_recovery_pass_email_addr = mx("#recovery_pass_email_addr"),
          l_dom_recovery_pass_email = mx("#recovery_pass_email"),
          l_dom_recovery_pass_cancel_btn = mx("#recovery_pass_cancel_btn"),
          l_dom_recovery_pass_ok_btn = mx("#recovery_pass_ok_btn"),
          l_dom_binding_account_name = mx("#binding_account_name"),
          l_dom_binding_account = mx("#binding_account"),
          l_dom_binding_account_cancel_btn = mx("#binding_account_cancel_btn"),
          l_dom_binding_account_next_btn = mx("#binding_account_next_btn"),
          l_dom_input_account_page = mx("#input_account_page"),
          l_dom_input_email_page = mx("#input_email_page"),
          l_dom_binding_account_email = mx("#binding_account_email"),
          l_dom_email_warn = mx("#email_warn"),
          l_dom_forget_password_close_btn = mx("#forget_password_close_btn")
        var l_username_value = mx("#signin_name").value.trim()  // 获取用户名 去除空格
        var appid = "vimtag.com"
        var name = "vimtag"
        if (l_username_value && l_username_value != mcs_username) {
          l_dom_binding_account_name.style.display = "none"
          l_dom_binding_account.style.display = "inline"
          l_dom_binding_account.value = l_username_value
        }

        l_dom_binding_account_name.onfocus = function () {
          // 当焦点在用户名输入框时,隐藏展示的input 显示隐藏的input框
          this.style.display = "none"
          l_dom_binding_account.style.display = "inline"
          l_dom_binding_account.focus()
        }
        l_dom_binding_account.onfocus = function () {
          // 触发select事件
          this.select()
        }
        l_dom_binding_account.onblur = function () {
          // 焦点离开时事件操作
          if (this.value == "") {
            // 未输入任何值时隐藏输入框显示默认展示框
            this.style.display = "none"
            l_dom_binding_account_name.style.display = "inline"
          }
        }
        l_dom_recovery_pass_email_addr.onfocus = function () {
          // 邮箱验证框
          this.style.display = "none"
          l_dom_recovery_pass_email.style.display = "inline"
          l_dom_recovery_pass_email.focus()
        }
        l_dom_recovery_pass_email.onfocus = function () {
          this.select()
        }
        l_dom_recovery_pass_email.onblur = function () {
          // 焦点离开邮箱验证
          if (this.value == "") {
            this.style.display = "none"
            l_dom_recovery_pass_email_addr.style.display = "inline"
          }
        }
        l_dom_binding_account_next_btn.onclick = function () {
          // 点击下一步按钮
          if (!l_dom_binding_account.value) {
            // 未输入任何值弹出报错信息
            msg_tips({
              msg: mcs_the_user_name_is_empty,
              type: "error",
              timeout: 3000
            })
            return
          }
          // 调用接口请求参数
          msdk_ctrl({
            type: "account_check_username",
            data: {
              username: l_dom_binding_account.value,
              appid: appid,
              func: binding_accounts_info_ack
            }
          })
        }
        function binding_accounts_info_ack (msg) {
          // 用户名验证回调函数
          if (msg.result) {
            if (msg.result == "accounts.user.unknown") {
              msg_tips({
                msg: mcs_username_does_not_exis,
                type: "error",
                timeout: 3000
              })
            } else {
              msg_tips({ msg: msg.result, type: "error", timeout: 3000 })
            }
          } else {
            if (msg.conf.email) {
              // 用户绑定邮箱
              l_dom_input_account_page.style.display = "none"
              l_dom_input_email_page.style.display = "block"
              l_dom_email_warn.style.display = "block"
              l_dom_binding_account_email.innerHTML = msg.conf.email
            } else {
              msg_tips({
                msg: mcs_recovery_fail_no_mail,
                type: "error",
                timeout: 3000
              })
            }
          }
        }
        l_dom_recovery_pass_ok_btn.onclick = function () {
          // 邮箱验证确定按钮点击事件
          var reg
          if (
            !l_dom_recovery_pass_email.value ||
            l_dom_recovery_pass_email.value == mcs_input_email_addr
          ) {
            // 验证输入的邮箱号是否与账户绑定的邮箱一致
            msg_tips({
              msg: mcs_invalid_email_addr,
              type: "error",
              timeout: 3000
            })
            return
          } else {
            reg = /^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
            if (!reg.exec(l_dom_recovery_pass_email.value)) {
              msg_tips({
                msg: mcs_invalid_email_addr,
                type: "error",
                timeout: 3000
              })
              return
            }
          }
          // 发送重置密码邮件
          msdk_ctrl({
            type: "account_recovery_password",
            data: {
              username: l_dom_binding_account.value,
              email: l_dom_recovery_pass_email.value,
              appid: appid,
              name: name,
              func: recovery_binding_email_ack
            }
          })
        }
        function recovery_binding_email_ack (msg) {
          // 重置密码回调处理函数
          if (msg != "") {
            msg_tips({ msg: msg, type: "error", timeout: 3000 })
          } else {
            mx("#input_email_page").style.display = "none"
            mx("#forget_password_page").style.display = "block"
            mx(
              "#retrieve_password_warn"
            ).innerHTML = mcs_password_reset_confirmation
          }
        }
        // 取消按钮事件
        l_dom_recovery_pass_cancel_btn.onclick = function () {
          mx("#forget_pass_inner_main").innerHTML = ""
        }
        l_dom_binding_account_cancel_btn.onclick = function () {
          mx("#forget_pass_inner_main").innerHTML = ""
        }
        l_dom_forget_password_close_btn.onclick = function () {
          mx("#forget_pass_inner_main").innerHTML = ""
        }
      })
      $("#signin_name").focus(function () {
        // 用户名输入框聚焦
        if (this.value == mcs_username) {
          this.value = ""
        }
        this.style.color = "#404040"
      })
      $("#signin_name").blur(function () {
        // 用户名输入框失焦
        if (this.value == "") {
          this.style.color = "#bdbdbd"
          this.value = mcs_username
        } else {
          this.style.color = "#404040"
        }
      })
      $("#password_eye").click(function () {
        // 密码框输入密码可视状态
        if ($("#password_eye").attr('class') == "password_eye") {
          $("#password_eye").attr('class', "password_eye_gray")
          $("#signin_pw").attr('type', 'password')
        } else {
          $("#password_eye").attr('class', "password_eye")
          $("#signin_pw").attr('type', 'text')
        }
        if ($("#signin_pw").val() === mcs_password) {
          $("#signin_pw").attr('type', 'text')
        }
      })
      $("#signin_pw").focus(function () {
        // 密码输入框聚焦(内含密码可见情况判断)
        if ($("#password_eye").attr('class') === "password_eye_gray") {
          $("#signin_pw").attr('type', 'password')
        } else {
          $("#signin_pw").attr('type', 'text')
        }
        $("#signin_pw").css('color', '#404040')
        if ($("#signin_pw").val() === mcs_password) {
          $("#signin_pw").val('')
        }
      })
      $("#signin_pw").blur(function () {
        // 密码输入框失焦
        if ($("#signin_pw").val() == "") {
          $("#signin_pw").css('color', '#bdbdbd')
          $("#signin_pw").val(mcs_password)
        } else {
          $("#signin_pw").css('color', '#404040')
        }
        if ($("#password_eye").attr('class') === "password_eye_gray" && $("#signin_pw").val() !== mcs_password) {
          $("#signin_pw").attr('type', 'password')
        } else {
          $("#signin_pw").attr('type', 'text')
        }
      })
      $("#signin_pw").keypress(function (e) {
        // 监听回车键是否按下
        var evt = e || window.event
        if ((evt.which || evt.keyCode) == 13) {
          $("#sign_in").click()
          evt.returnValue = false
        }
      })
      /*注册按钮点击事件*/
      $("#register_account").click(function () {
        $("#sigin_in_username").hide()
        $("#sigin_in_password").hide()
        $("#sign_in").hide()
        $("#register_account").hide()
        $("#register_username").show()
        $("#register_account_pwd").show()
        $("#register_account_pwd_again").show()
        $("#keep_sign_in").hide()
        $("#register_btn").show()
        $("#sign_account").show()
        mx("#forget_pass").style.display = "none"
      })
      // 登录按钮点击事件
      $("#sign_account").click(function () {
        $("#sigin_in_username").show()
        $("#sigin_in_password").show()
        $("#sign_in").show()
        $("#register_account").show()
        $("#register_username").hide()
        $("#register_account_pwd").hide()
        $("#register_account_pwd_again").hide()
        $("#keep_sign_in").show()
        $("#register_btn").hide()
        $("#sign_account").hide()
        mx("#forget_pass").style.display = "block"
      })
      $("#register_signin_name").focus(function () {
        if (this.value == mcs_input_username) {
          this.value = ""
        }
        this.style.color = "#404040"
      })
      $("#register_signin_name").blur(function () {
        if (this.value == "") {
          this.style.color = "#bdbdbd"
          this.value = mcs_input_username
        } else {
          this.style.color = "#404040"
        }
      })
      $("#register_signin_pw").focus(function () {
        if ($("#register_password_eye").attr('class') === "password_eye_gray") {
          this.type = "password"
        } else {
          this.type = "text"
        }
        this.style.color = "#404040"
        if (this.value == mcs_input_password) this.value = ""
      })
      $("#register_signin_pw").blur(function () {
        if (this.value == "") {
          this.style.color = "#bdbdbd"
          this.value = mcs_input_password
        } else {
          this.style.color = "#404040"
        }
        if (
          $("#register_password_eye").attr('class') === "password_eye_gray" &&
          this.value != mcs_input_password
        ) {
          this.type = "password"
        } else {
          this.type = "text"
        }
      })
      $("#register_password_eye").click(function () {
        if (this.className == "password_eye") {
          this.className = "password_eye_gray"
          $("#register_signin_pw").attr('type', 'password')
        } else {
          this.className = "password_eye"
          $("#register_signin_pw").attr('type', 'text')
        }
        if ($("#register_signin_pw").val() === mcs_input_password) {
          $("#register_signin_pw").attr('type', 'text')
        }
      })
      $("#register_signin_pw_again").focus(function () {
        if (
          $("#register_password_eye_again").attr('class') === "password_eye_gray"
        ) {
          this.type = "password"
        } else {
          this.type = "text"
        }
        this.style.color = "#404040"
        if (this.value == mcs_confirm_password) this.value = ""
      })
      $("#register_signin_pw_again").blur(function () {
        if (this.value == "") {
          this.style.color = "#bdbdbd"
          this.value = mcs_confirm_password
        } else {
          this.style.color = "#404040"
        }
        if (
          $("#register_password_eye_again").attr('class') === "password_eye_gray" &&
          this.value != mcs_confirm_password
        ) {
          this.type = "password"
        } else {
          this.type = "text"
        }
      })
      $("#register_password_eye_again").click(function () {
        if (this.className == "password_eye") {
          this.className = "password_eye_gray"
          $("#register_signin_pw_again").attr('type', 'password')
        } else {
          this.className = "password_eye"
          $("#register_signin_pw_again").attr('type', 'text')
        }
        if ($("#register_signin_pw_again").val() === mcs_confirm_password) {
          $("#register_signin_pw_again").attr('type', 'text')
        }
      })
      //Login key events 点击登录按钮事件
      $("#sign_in").click(function () {
        if (!localStorage.getItem("auto_login")) {
          g_login_method = "manual"  //登录日志
        }
        if ($("#keep_sign_in_check").is(":checked")) {
          localStorage.setItem("keep_pw", 1)
        } else {
          localStorage.setItem("keep_pw")
        }
        if ($("#signin_pw").val() === "amdin") {
          $("#signin_pw").val('admin')
        }
        (username_value = $("#signin_name").val().trim()),
          (password_value = $("#signin_pw").val().trim())
        //storage the password use mmd5 format
        if (password_value == "••••••") l_pwd_val = l_password_value
        else l_pwd_val = mmd5.hex(password_value)

        var username_arra = username_value.split("")
        var isDevicesID =
          username_arra.length &&
          username_arra[0] == "1" &&
          (username_arra[1] == "j" || username_arra[1] == "J") &&
          (username_arra[2] == "f" || username_arra[2] == "F") &&
          (username_arra[3] == "i" || username_arra[3] == "I") &&
          (username_arra[4] == "e" || username_arra[4] == "E")
        if (!username_value || username_value == mcs_username) {
          msg_tips({
            msg: mcs_the_user_name_is_empty,
            type: "error",
            timeout: 3000
          })
          return
        }
        if (!password_value || password_value == mcs_password) {
          if (!localStorage.getItem("remember_msg_info")) {
            msg_tips({
              msg: mcs_the_password_is_empty,
              type: "error",
              timeout: 3000
            })
          }
          return
        }
        /*IPC to debug so annotation these lines*/
        if (isDevicesID) {
          msg_tips({ msg: mcs_register_prompt, type: "error", timeout: 3000 })
          return
        }
        //Judgment is ipc login or user login
        var reg = /^\d/
        if (reg.exec(username_value)) g_login_status = "ipc"
        else g_login_status = "register_user"
        if (!g_login_waiting_flag) {
          g_login_waiting_flag = 1
          msdk_ctrl({
            type: "account_login_in",
            data: { user: username_value, password: l_pwd_val, func: login_ack }
          })
        }
      })

      //Log Returns
      function login_ack (msg, ref) {
        //There is a problem before returning, no result is a successful login
        if (msg.result == "") {
          login_ack_lid = msg.lid  //登录返回lid head中
          login_result = "success"
          loginendtime = new Date().getTime()  //日志
          logintime = (loginendtime - loginstartime) / 1000
          g_username = ref.user
          var version_type = ""
          if (navigator.userAgent.indexOf("Intel Mac") > -1) {
            version_type = "mac_" + g_oems
          } else if (navigator.userAgent.indexOf("Windows") > -1) {
            version_type = "windows_" + g_oems
          }
          msdk_ctrl({
            type: "get_download",
            data: {
              srv: window.location.host,
              ver_type: version_type,
              ver_from: "v3.9.1.1607051739",
              lang: g_now_lang,
              func: function (msg) {
                if (msg && msg.result == "") {
                  app_verson = msg.info.ver_to  //登录日志 app版本号
                  if (msg.info.p && msg.info.p[0].n == "checksum") {
                    //登录日志 app checksum
                    app_checksum = msg.info.p[0].v
                  }
                  if (window.location.protocol == "https:") {
                    msg.info.link_url = msg.info.link_url.replace(
                      "http://209.133.212.170:2080",
                      "https://us10.vimtag.com:2446"
                    )
                    msg.info.link_url = msg.info.link_url.replace(
                      "http://61.147.109.92:7080",
                      "https://js.vimtag.com:7446"
                    )
                  }
                  g_download_url = msg.info.link_url
                }
              }
            }
          })
          //If vimtag, remember the default password
          // // console.log("调用登录轮询")
          msdk_ctrl({ type: "mmq", data: { func: mmq_ack } })
          msdk_ctrl({
            type: "cmipcgw_get_req",
            data: {
              username: ref.user,
              srv: "vimtag.com",
              func: function (msg) {
                if (
                  msg &&
                  msg.data &&
                  msg.data.server &&
                  msg.data.server.param
                ) {
                  var param = msg.data.server.param
                  for (var i = 0; i < param.length; i++) {
                    if (
                      param[i].name == "f_multi_screen" &&
                      param[i].value == 1
                    ) {
                      mme.prototype.check_plug_install("", function (
                        ref,
                        version
                      ) {
                        if (!version) {
                          g_support_auto_play = 0
                        } else {
                          g_support_auto_play = 1
                          var auto_play = localStorage.getItem("auto_play")
                          if (auto_play != 0) {
                            g_auto_play = 1
                          } else {
                            g_auto_play = 0
                          }
                        }
                      })
                    }
                    if (param[i].name == "f_filter" && param[i].value == 1) {
                      g_support_filter = 1
                    }
                    if (param[i].name == "f_grp" && param[i].value == 1) {
                      g_support_tree = 1
                    }
                    if (param[i].name == "sc.logo") {
                      //给江门xhjymclz修改设备列表页面图标
                      g_supprot_clogo = 1
                      createPage("top", { parent: $("#top") })
                    }
                  }
                }
                g_download_manual_url = msg.data.server.signal[2]
                // upload_log("log_app_login")  //登录请求返回后发送日志
                createPage("devlist", { parent: obj.parent })
              }
            }
          })
          if (!g_experience) {
            // 记住密码状态/自动登录状态设置
            localStorage.setItem(
              "remember_msg_info",
              mcodec.obj_2_str({ user: username_value, password: l_pwd_val })
            )
            localStorage.setItem("auto_login", "1")
            g_is_login = 1
            // mx("#top_login_span").innerHTML = mcs_device_list 
          }
        } else {
          login_result = "fail"  //登录结果失败
          g_login_waiting_flag = 0
          if (msg.result == "accounts.user.offline") {
            msg_tips({ msg: mcs_offline, type: "warning", timeout: 3000 })
          } else if (msg.result == "accounts.user.unknown") {
            msg_tips({
              msg: mcs_username_does_not_exis,
              type: "warning",
              timeout: 3000
            })
          } else if (msg.result == "accounts.pass.invalid") {
            msg_tips({
              msg: mcs_invalid_password,
              type: "warning",
              timeout: 3000
            })
          } else if (msg.result == "accounts.user.inactive") {
            msg_tips({
              msg: mcs_email_inactive,
              type: "warning",
              timeout: 3000
            })
          } else {
            msg_tips({
              msg: mrs_request_error,
              type: "warning",
              timeout: 3000
            })
          }
          // upload_log("log_app_login")  //登录请求返回后发送日志
        }
      }

      // 轮询函数重复定义 devlist.page.js中也进行了定义 考虑做成项目通用的公共函数
      function mmq_ack (msg) {
        var mmq_data = msg.items
        for (var m = 0; m < mmq_data.length; m++) {
          if (mmq_data[m].code == "motion_alert") {
            if (mmq_data[m].type == "alert") {
              msg_tips({
                msg: mmq_data[m].sn + "&nbsp:&nbsp" + mcs_motion_alert,
                type: "warning",
                timeout: 3000
              })
            }
          } else if (mmq_data[m].code == "sound_detect") {
            if (mmq_data[m].type == "alert") {
              msg_tips({
                msg: mmq_data[m].sn + "&nbsp:&nbsp" + mcs_sound_detect_alert,
                type: "warning",
                timeout: 3000
              })
            }
          } else if (mmq_data[m].code == "face_alert") {
            if (mmq_data[m].type == "alert") {
              msg_tips({
                msg: mmq_data[m].sn + "&nbsp:&nbsp" + mcs_face_detect_alert,
                type: "warning",
                timeout: 3000
              })
            }
          } else if (mmq_data[m].code == "human_alert") {
            //人型检测
            if (mmq_data[m].type == "alert") {
              msg_tips({
                msg: mmq_data[m].sn + "&nbsp:&nbsp" + mrs_human_detect_alert,
                type: "warning",
                timeout: 3000
              })
            } //mrs_human_detect_alert
          } else if (mmq_data[m].code == "sos") {
            // 紧急按钮报警
            if (mmq_data[m].type == "alert") {
              msg_tips({
                msg: mmq_data[m].sn + "&nbsp:&nbsp" + mcs_sos + mcs_alarm,
                type: "warning",
                timeout: 3000
              })
            }
          } else if (mmq_data[m].code == "door") {
            // 门磁
            var door_status = ""
            for (var i = 0; i < mmq_data[m].p.length; i++) {
              if (mmq_data[m].p[i].n == "status") {
                door_status = mmq_data[m].p[i].v
              }
            }
            if (mmq_data[m].type == "alert" && door_status == "open") {
              msg_tips({
                msg: mmq_data[m].sn + "&nbsp:&nbsp  " + mrs_door_sensor_open,
                type: "warning",
                timeout: 3000
              })
            } else if (mmq_data[m].type == "alert" && door_status == "close") {
              msg_tips({
                msg: mmq_data[m].sn + "&nbsp:&nbsp  " + mrs_door_sensor_closed,
                type: "warning",
                timeout: 3000
              })
            }
          }
        }
      }

      // 注册页面点击注册按钮(注册验证提交)
      $("#register_btn").click(function () {
        var reg,
          username_value = $("#register_signin_name").val(),
          password_value = $("#register_signin_pw").val(),
          pw_confirm_value = $("#register_signin_pw_again").val()

        if (!username_value || username_value == mcs_input_username) {
          msg_tips({
            msg: mcs_the_user_name_is_empty,
            type: "error",
            timeout: 3000
          })
          return
        } else {
          reg = /^([a-zA-Z][a-zA-Z0-9]{5,31})$/
          if (!reg.exec(username_value)) {
            msg_tips({
              msg: mcs_user_letter_range_hint,
              type: "warning",
              timeout: 5000
            })
            return
          }
        }
        if (!password_value || password_value == mcs_input_password) {
          msg_tips({
            msg: mcs_the_password_is_empty,
            type: "error",
            timeout: 3000
          })
          return
        } else {
          reg = /^[0-9a-zA-Z]{8,32}$/
          if (!reg.exec(password_value)) {
            msg_tips({
              msg: mcs_password_range_hint,
              type: "warning",
              timeout: 5000
            })
            return
          }
        }
        if (!pw_confirm_value || pw_confirm_value == mcs_confirm_password) {
          msg_tips({ msg: mcs_password_empty, type: "error", timeout: 3000 })
          return
        }
        if (pw_confirm_value != password_value) {
          msg_tips({
            msg: mcs_two_password_input_inconsistent,
            type: "error",
            timeout: 3000
          })
          return
        }
        msdk_ctrl({
          type: "account_register",
          data: {
            username: username_value,
            password: password_value,
            func: function (msg) {
              if (msg == mcs_successful_sign_up) {
                msg_tips({ msg: msg, type: "success", timeout: 3000 })
                createPage("login", obj)
              } else {
                msg_tips({ msg: msg, type: "error", timeout: 3000 })
              }
            }
          }
        })
      })

      if (localStorage.getItem("auto_login") == 1) {
        // 自动登录状态为1时,相当于操作一次点击登录按钮
        $("#sign_in").click()
      }
    }
  },
  async mounted () {
    await this.create_login_page({ parent: $("#test") }) // 进入页面后加载
    await require("../../css/vimtagPublic.scss") // 页面加载完成后加载样式(如果加载过早则会无法改变jq填充的dom)
  }
}
</script>