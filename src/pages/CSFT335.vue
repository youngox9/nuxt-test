<!-- 登入頁面 -->
<template>
  <Layout :auth="true">
    <div class="content">
      <h2>CSFT335</h2>

      <el-form
        :model="loginForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        label-width="80px"
        class="form"
      >
        <el-form-item label="工單">
          <el-input type="username" v-model="orderNo" autocomplete="off">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button
          ></el-input>
        </el-form-item>
        <el-row :gutter="6">
          <el-col :xs="24" :sm="12">
            <el-form-item label="NO">
              <el-input
                type="text"
                v-model="form.SFFBDOCNO"
                disabled
                placeholder="SFFBDOCNO"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="作業編號">
              <el-input
                type="text"
                v-model="form.SFFB007"
                disabled
                placeholder="SFFB007"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="報工料號">
              <el-input
                type="text"
                v-model="form.SFFB029"
                disabled
                placeholder="SFFB029"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="報工人員" prop="SFFB002">
              <el-input
                type="text"
                v-model="form.SFFB002"
                placeholder="SFFB002"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="報工機器" prop="SFFB010">
              <el-input
                type="text"
                v-model="form.SFFB010"
                placeholder="SFFB010"
                @blur.capture="checkSFFB010"
                @input="toUpperCase"
                ref="sffb010input"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="待處理量">
              <el-input
                type="text"
                v-model="form.SFFB017"
                disabled
                placeholder="SFFB017"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="良品數量" prop="SFFB017_1">
              <el-input
                type="text"
                v-model="form.SFFB017_1"
                placeholder="SFFB017"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="報廢數量" prop="SFFB018">
              <el-input
                type="text"
                v-model="calculate"
                disabled
                placeholder="SFFB018"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="footer">
        <el-button
          class="submit"
          type="primary"
          size="medium"
          @click="submitForm('loginForm')"
          :loading="loading"
        >
          報工
        </el-button>
      </div>
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
      orderNo: "K-ACRA-2004210001",
      form: {
        // SFFB005: "K-ACRA-2004210001",
        // SFFB007: "200",
        // SFFB017: 1,
        // SFFB029: "AXCR2512J100RZ",
        // SFFBDOCNO: "K-ACR1-2204210037",
        // SFFBSTUS: "N",
      },
      list: [],
      rules: {},
    };
  },
  created() {},
  methods: {
    async checkSFFB010() {
      const res = await axios({
        url: "/api/prod/csft335/CSFT335_01_01_CHK_SFFB010",
        method: "post",
        data: qs.stringify(this.form),
      });
      if (result.data[0].CNT === 0) {
        ElMessage.error("請確認報工機臺是否正確");
        //this.$refs.REFSFFB010.$el.focus();
        this.$refs.sffb010input.value.focus();
      }
      axios
        .post(
          "http://192.168.0.161:3000/api/prod/csft335/CSFT335_01_01_CHK_SFFB010",
          qs.stringify(params)
        )
        .then((result) => {
          //let _data = result.data;
          //console.log("checkSFFB010:"+result.data[0].CNT);
          if (result.data[0].CNT === 0) {
            ElMessage.error("請確認報工機臺是否正確");
            //this.$refs.REFSFFB010.$el.focus();
            this.$refs.sffb010input.value.focus();
          }
        });
    },
    async search() {
      try {
        const res = await axios({
          url: "/oratstapi/CSFT335_01_01_GET",
          method: "post",
          data: `filter=${this.orderNo}`,
        });
        const newForm = res?.data?.[0];
        this.form = newForm;
        // const res2 = await axios({
        //   url: "/oratstapi/CSFT335_01_02_GET",
        //   method: "post",
        //   data: formData,
        // });
        // console.log(res);
      } catch (e) {
        console.log(e);
      }
    },
    async submit() {},
  },
};
</script>
