<!-- 登入頁面 -->
<template>
  <Layout :auth="true">
    <div class="content">
      <h2>5PACKAGE</h2>
      <el-form
        :model="form"
        status-icon
        :rules="rules"
        ref="form"
        label-width="80px"
        class="form"
      >
        <el-form-item label="工單">
          <el-input type="username" v-model="orderNo" autocomplete="off">
            <el-button
              slot="append"
              icon="el-icon-search"
              :disabled="!orderNo"
              @click="search"
            ></el-button
          ></el-input>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :xs="24" :sm="8">
            <el-form-item label="NO">
              <el-input
                type="text"
                v-model="form.SFFBDOCNO"
                disabled
                placeholder="SFFBDOCNO"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="作業編號">
              <el-input
                type="text"
                v-model="form.SFFB007"
                disabled
                placeholder="SFFB007"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="報工料號">
              <el-input
                type="text"
                v-model="form.SFFB029"
                disabled
                placeholder="SFFB029"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :xs="24" :sm="12">
            <el-form-item label="報工人員" prop="SFFB002">
              <el-input
                type="text"
                v-model="form.SFFB002"
                placeholder="SFFB002"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="{ span: 12 }">
            <el-form-item label="報工機器" prop="SFFB010">
              <el-input
                type="text"
                :value="form.SFFB010"
                placeholder="SFFB010"
                @blur.capture="checkMachine"
                @input="toUpperCase"
                ref="sffb010input"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :xs="24" :sm="6">
            <el-form-item label="待處理量">
              <el-input
                type="text"
                v-model="form.SFFB017"
                disabled
                placeholder="SFFB017"
              ></el-input>
            </el-form-item>
          </el-col>
          <!--  -->
          <el-col :xs="24" :sm="6">
            <el-form-item label="良品數量" prop="SFFB017_1">
              <el-input
                v-model="form.SFFB017_1"
                :min="1"
                :max="100"
                label="SFFB017"
                type="number"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6">
            <el-form-item label="報廢數量" prop="SFFB018">
              <el-input
                type="text"
                :value="garbageCount"
                disabled
                placeholder="SFFB018"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6">
            <el-button
              class="submit"
              type="primary"
              @click="modalOpen = true"
              :style="{
                width: '100%',
              }"
            >
              不良原因
            </el-button>
          </el-col>
        </el-row>
        <div class="order-footer">
          <el-button
            class="submit"
            type="primary"
            size="medium"
            @click="submitForm('form')"
            :loading="loading"
          >
            報工
          </el-button>
        </div>
      </el-form>
    </div>
    <!-- 不良原因列表 -->
    <el-dialog title="不良原因列表" :visible.sync="modalOpen" append-to-body>
      <el-button
        class="submit"
        type="primary"
        size="small"
        @click="
          reasonModalOpen = true;
          resaonModalMode = 'add';
        "
      >
        新增不良原因
      </el-button>
      <el-table :data="infoList">
        <el-table-column prop="id" label="ID"></el-table-column>
        <!-- <el-table-column prop="SFFDDOCNO" label="SFFDDOCNO" ></el-table-column> -->
        <!-- <el-table-column label="SFFDDOCNO" align="center" key="SFFDDOCNO" prop="SFFDDOCNO"  /> -->
        <el-table-column prop="SFFDSEQ1" label="SFFDSEQ1"></el-table-column>
        <el-table-column prop="SFFD001" label="異常原因"></el-table-column>
        <el-table-column prop="SFFD002" label="數量"></el-table-column>
        <el-table-column prop="SFFD003" label="備註"></el-table-column>

        <!--第二步  开始进行修改和查询操作-->
        <el-table-column label="操作" align="center" min-width="100">
          <template #default="scope">
            <!-- <el-button type="text"  @click="checkDetail(scope.row)">Detail</el-button>  -->
            <el-button type="primary" @click="getReason(scope.row)"
              >Modify</el-button
            >
            <!-- <el-button type="danger" @click="Delete(scope.row)">Delete</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="modalOpen = false">取 消</el-button>
          <el-button type="primary" @click="addSubmit">送出 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新增不良原因 -->
    <el-dialog
      :title="resaonModalMode === 'add' ? '新增不良原因' : '編輯不良原因'"
      :visible.sync="reasonModalOpen"
      append-to-body
    >
      <el-form
        :model="reasonForm"
        :rules="reasonFormRules"
        ref="reasonForm"
        label-width="120px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="SFFDSEQ1" prop="SFFDSEQ1">
              <el-input
                type="text"
                v-model="reasonForm.SFFDSEQ1"
                disabled
                placeholder="SFFDSEQ1"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="異常原因" prop="SFFD001">
              <el-input
                type="text"
                v-model="reasonForm.SFFD001"
                placeholder="SFFD001"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="數量" prop="SFFD002">
              <el-input
                type="number"
                min="1.000"
                max="500.000"
                step="0.001"
                v-model="reasonForm.SFFD002"
                placeholder="SFFD002"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="備註" prop="SFFD003">
              <el-input
                type="text"
                v-model="reasonForm.SFFD003"
                placeholder="SFFD003"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reasonModalOpen = false">取 消</el-button>
          <el-button type="primary" @click="submitReasonForm">送出 </el-button>
        </span>
      </template>
    </el-dialog>
  </Layout>
</template>
<script>
import axios from "@/axios";
import { VALIDATIONS } from "@/utils";

export default {
  computed: {
    garbageCount() {
      const a = this.form.SFFB017_1 || 0;
      const b = this.form.SFFB017 || 0;
      return a - b > 0 ? a - b : 0;
    },
    profile() {
      return this.$store.state.auth.profile;
    },
  },
  data() {
    return {
      infoList: [],
      modalOpen: false,
      reasonModalOpen: false,
      resaonModalMode: "add",
      loading: false,
      orderNo: "K-AASB-2205040001",
      reason: "",

      list: [],
      reasonForm: { SFFDSEQ1: "5", SFFD001: "1", SFFD002: "1", SFFD003: "1" },
      reasonFormRules: {
        // SFFDSEQ1: [VALIDATIONS.isEmpty],
        SFFD001: [VALIDATIONS.isEmpty],
        SFFD002: [VALIDATIONS.isEmpty],
        SFFD003: [VALIDATIONS.isEmpty],
      },
      form: {
        // SFFB005: "K-ACRA-2004210001",
        // SFFB007: "200",
        // SFFB017: 1,
        // SFFB029: "AXCR2512J100RZ",
        // SFFBDOCNO: "K-ACR1-2204210037",
        // SFFBSTUS: "N",
      },
      rules: {
        // 報工人員
        SFFB002: [VALIDATIONS.isEmpty],
        // 報工機器
        SFFB010: [VALIDATIONS.isEmpty],
        // 良品數量
        SFFB017_1: [VALIDATIONS.isEmpty],
      },
    };
  },
  created() {},
  watch: {
    modalOpen(val) {
      if (val) {
        this.getReasonList();
      }
    },
  },
  methods: {
    submitReason() {},
    openModal() {
      // this.modalOpen = true;
      // this.getReasonList();
    },

    async toUpperCase(e) {
      console.log(e);
    },
    submitForm(formName) {
      const formBbj = this?.$refs?.[formName];
      if (formBbj) {
        formBbj.validate((valid) => {
          if (valid) {
          } else {
            console.log("error submit!!");
          }
        });
      }
    },
    // 不良原因送出
    submitReasonForm() {
      const formBbj = this?.$refs?.["reasonForm"];

      if (formBbj) {
        formBbj.validate((valid) => {
          if (valid) {
            this.postReason();
          } else {
            console.log("error submit!!");
          }
        });
      }
    },
    async postReason() {
      const data = {
        ENT: "20",
        SITE: "0001",
        SFFDDOCNO: this.form.SFFBDOCNO,
        ...this.reasonForm,
      };
      const res = await axios({
        url: "/5package/sfc/csft335_sffd_save01",
        method: "post",
        data,
      });
      console.log(res);
    },
    async putReason(data) {
      console.log(data);
    },
    async getReasonList() {
      const res = await axios({
        url: "/5package/sfc/csft335_sffd_get01",
        method: "post",
        data: {
          ENT: "20",
          SFFDDOCNO: this.form.SFFBDOCNO,
        },
      });
      console.log(res);
    },
    async checkMachine() {
      const res = await axios({
        url: "/5package/sfc/csft335_sffb010_chk01",
        method: "post",
        data: {
          ENT: "20",
          SFFB005: "K-AASB-2205040001",
          SFFB007: "1700",
          SFFB009: "5 PACKAGE",
          SFFB010: "TP050",
        },
      });
    },
    async search() {
      try {
        const res = await axios({
          url: "/5package/sfc/csft335_sffb_get01",
          method: "post",
          data: {
            ENT: "20",
            SFFB005: "K-AASB-2205040001",
          },
        });
        const data = res?.data?.[0] || {};
        this.form = data;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
