<!-- 登入頁面 -->
<template>
  <Layout :auth="true">
    <div class="content">
      <h2>001 報工站</h2>
      <el-form
        :model="loginForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        label-width="80px"
        class="form"
      >
        <e-row :gutter="12"></e-row>
        <el-form-item label="工單">
          <el-input type="username" v-model="orderNumber" autocomplete="off">
            <el-button slot="append" icon="el-icon-search"></el-button
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col></el-col>
        </el-row>
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
import { mapMutations } from "vuex";

export default {
  computed: {
    profile() {
      return this.$store.state.auth.profile;
    },
  },
  data() {
    return {
      loading: false,
      orderNumber: "",
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
          url: "/api/auth/signin",
          method: "post",
          data,
        });
        const profile = res?.data || {};
        if (profile.accessToken) {
          this.$store.commit("auth/setProfile", profile);
          console.log(this.$router);
          this.$router.push({ name: "csft335" });
        }
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
