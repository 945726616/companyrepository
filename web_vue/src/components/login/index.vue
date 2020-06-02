<template>
  <div id="test">加载内容</div>
</template>

<script>
export default {
  name: "testJq",
  data() {
    return {
        obj: ''
    }
  },
  methods: {
    testJq() {
      $("#test").html(
        "<div id='login_page'>" +
        "<div id='login_box'>" +
        "<div id='vimtag_signin_inner'>" +
        "<div id='signin_logo_vimtag'></div>" +
        "<div id='sigin_in_username' class='input_div'>" +
        "<div class='vimtag_login_user'></div>" +
        "<input id='signin_name' class='input_username' value='cccc'>" + // 登录时用户名
        "<div class='vimtag_login_input'></div>" +
        "</div>" +
        "<div id='register_username' class='input_div'>" +
        "<div class='vimtag_login_user'></div>" +
        "<input id='register_signin_name' class='input_username' value='aaaa'>" + // 注册时填写用户名
        "<div class='vimtag_login_input'></div>" +
        "</div>" +
        "<div id='sigin_in_password' class='input_div'>" +
        "<div class='vimtag_password_img'></div>" +
        "<input id='signin_pw' class='input_password' type='text' value='dada'>" + // 登录时密码
        "<div id='password_eye' class='password_eye_gray'></div>" +
        "<div class='vimtag_login_input'></div>" +
        "</div>" +
        "<div id='register_account_pwd' class='input_div'>" +
        "<div class='vimtag_password_img'></div>" +
        "<input id='register_signin_pw' class='input_password' type='text' value='eeee'>" + // 注册时填写密码
        "<div id='register_password_eye' class='password_eye_gray'></div>" +
        "<div class='vimtag_login_input'></div>" +
        "</div>" +
        "<div id='register_account_pwd_again' class='input_div'>" +
        "<div class='vimtag_password_img'></div>" +
        "<input id='register_signin_pw_again' class='input_password' type='text' value='bbbb'>" + // 注册时填写确认密码
        "<div id='register_password_eye_again' class='password_eye_gray'></div>" +
        "<div class='vimtag_login_input'></div>" +
        "</div>" +
        "<div id='keep_sign_in'>" +
        "<input id='keep_sign_in_check' type='checkbox'><span>123213213</span>" + // 记住密码选框
        "</div>" +
        "<button class='vimtag_btn' id='sign_in'>123123214214</button>" + // 登录页面中登录按钮
        "<button class='vimtag_btn' id='register_btn'>fareqw</button>" + // 注册页面中注册按钮
        "<div>" +
        "<span id='register_account'>12321fa</span>" + // 登录页面中注册文字按钮
        "<span id='forget_pass'>cdeqe?</span>" + // 登录页面中忘记密码文字按钮
        "<span id='sign_account'>ghqewq</span>" + // 注册页面中登录文字按钮
        "</div>" +
        "</div>" +
        "<div id='forget_pass_inner_main'>" + // 忘记密码点击弹窗渲染节点
          "</div>" +
          "</div>" +
          "</div>"
      );
    }
  },
  mounted() {
    this.testJq();
  }
};
</script>