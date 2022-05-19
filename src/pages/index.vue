<!-- 登入頁面 -->
<template>
  <Layout :auth="false">
    <div class="login-container">
      <el-form
        :model="loginForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        label-width="80px"
        class="form"
      >
        <el-form-item label="Acount" prop="username">
          <el-input
            type="username"
            v-model="loginForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="submit"
            type="primary"
            size="medium"
            @click="submitForm('loginForm')"
            :loading="loading"
          >
            登入
          </el-button>
          <!-- <el-button @click="resetForm('loginForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </Layout>
</template>
<script>
import axios from "@/axios";

export default {
  computed: {
    profile() {
      return this.$store.state.auth.profile;
    },
  },
  data() {
    return {
      loading: false,
      loginForm: {
        username: "eray",
        password: "670325",
      },
      rules: {
        username: [
          {
            validator: (rule, value, callback, ...rest) => {
              if (!value) {
                callback(new Error("請輸入帳號"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        password: [
          {
            validator: (rule, value, callback, ...rest) => {
              if (!value) {
                callback(new Error("請輸入密碼"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    async login() {
      this.loading = true;
      try {
        const data = {
          ...this.loginForm,
        };
        const res = await axios({
          auth: true,
          url: "/api/auth/signin",
          method: "post",
          data,
        });
        const profile = res?.data || {};
        this.$store.commit("global/setProfile", profile);
        this.$router.push({ name: "5PACKAGE" });
      } catch (e) {
        console.log(e);
      }
      this.loading = false;
    },
    submitForm(formName) {
      const formBbj = this?.$refs?.[formName];
      if (formBbj) {
        formBbj.validate((valid) => {
          if (valid) {
            console.log("success");
            this.login();
          } else {
            console.log("error submit!!");
          }
        });
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
