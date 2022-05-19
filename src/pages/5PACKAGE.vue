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
              icon="el-icon-error"
              :disabled="!orderNo"
              @click="resetForm"
            ></el-button>
            <el-button
              slot="append"
              icon="el-icon-search"
              :disabled="!orderNo"
              @click="search"
            ></el-button
          ></el-input>
        </el-form-item>
        <div v-if="isSearch">
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
            <el-col :xs="24" :sm="24">
              <el-form-item label="報工人員" prop="SFFB002">
                <el-input
                  type="text"
                  v-model="form.SFFB002"
                  placeholder="SFFB002"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="{ span: 24 }">
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
            <el-col :xs="24" :sm="8">
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
            <el-col :xs="24" :sm="8">
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
            <el-col :xs="24" :sm="8">
              <el-form-item label="報廢數量" prop="SFFB018">
                <el-input
                  type="text"
                  :value="garbageCount"
                  disabled
                  placeholder="SFFB018"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="flex-box right">
            <el-button
              class="submit"
              type="primary"
              plain
              @click="modalOpen = true"
            >
              不良原因
              <i class="el-icon-warning-outline"></i>
            </el-button>
          </div>
          <div class="footer">
            <div class="footer-content">
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
          </div>
        </div>
      </el-form>
    </div>
    <!-- 不良原因列表 -->
    <el-dialog title="不良原因" :visible.sync="modalOpen">
      <div class="flex-box right">
        <el-button
          size="small"
          type="info"
          icon="el-icon-refresh"
          circle
          @click="getReasonList()"
        ></el-button>
        <el-button
          class="submit"
          type="primary"
          plain
          size="small"
          @click="addReason()"
        >
          新增不良原因
          <i class="el-icon-plus"></i>
        </el-button>
      </div>
      <el-divider></el-divider>
      <el-table :data="infoList">
        <el-table-column prop="SFFDSEQ1" label="SFFDSEQ1"></el-table-column>
        <el-table-column
          prop="SFFD001"
          label="異常原因"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="SFFD002"
          label="數量"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="SFFD003"
          label="備註"
          align="center"
        ></el-table-column>

        <!--第二步  开始进行修改和查询操作-->
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="editReason(scope.row)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="removeReason(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="modalOpen = false">關閉</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新增不良原因 -->
    <el-dialog
      width="400px"
      :title="resaonModalMode === 'add' ? '新增不良原因' : '編輯不良原因'"
      :visible.sync="reasonModalOpen"
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

          <el-col :span="24">
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
          <el-button @click="reasonModalOpen = false">取消</el-button>
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
    // 報廢數量
    garbageCount() {
      const a = this.form.SFFB017_1 || 0;
      const b = this.form.SFFB017 || 0;
      return a - b > 0 ? a - b : 0;
    },
    profile() {
      return this.$store.state.global.profile;
    },
  },
  data() {
    return {
      isSearch: false,
      infoList: [],
      modalOpen: false,
      reasonModalOpen: false,
      resaonModalMode: "add",
      loading: false,
      orderNo: "K-AASB-2205040001",
      reason: "",

      list: [],
      reasonForm: {
        // SFFDSEQ1: "5",
        SFFD001: "1",
        SFFD002: "1",
        SFFD003: "1",
      },
      reasonFormRules: {
        // SFFDSEQ1: [VALIDATIONS.isEmpty],
        SFFD001: [VALIDATIONS.isEmpty],
        SFFD002: [VALIDATIONS.isEmpty],
        SFFD003: [VALIDATIONS.isEmpty],
      },
      form: {
        SFFBDOCNO: "K-ACR1-2204210037",
        SFFB002: "2019021101",
        SFFB010: "TP050",
        SFFB017: "0",
        SFFB018: "0",
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
    /**
     * 重置表單
     */
    resetForm() {
      this.orderNo = "";
      this.isSearch = false;
      this.$refs["form"].resetFields();
    },
    /**
     * 新增不良原因
     */
    addReason() {
      this.reasonForm = {
        SFFDSEQ1: this.infoList.length + 1,
      };
      this.resaonModalMode = "add";
      this.reasonModalOpen = true;
    },
    /**
     * 編輯不良原因
     * @param {*} data row data
     */
    editReason(data) {
      console.log(">>>", data);
      this.reasonForm = { ...data };
      this.resaonModalMode = "edit";
      this.reasonModalOpen = true;
    },
    async removeReason(rowData) {
      // /5package/sfc/csft335_sffd_del01
      var yes = confirm("確定刪除?");

      console.log();

      if (yes) {
        this.$store.commit("global/setIsLoading", true);
        try {
          const data = {
            ENT: "20",
            SITE: "0001",
            SFFDDOCNO: this.form.SFFBDOCNO,
            SFFDSEQ1: rowData.SFFDSEQ1,
          };
          const res = await axios({
            url: "/5package/sfc/csft335_sffd_del01",
            method: "post",
            data,
          });
          this.$notify({
            title: "Success",
            message: "刪除成功",
            type: "success",
            duration: 1000,
          });
          this.getReasonList();
        } catch (e) {
          console.log(e);
        }
        this.$store.commit("global/setIsLoading", false);
      } else {
        // alert("你按了取消按鈕");
      }
    },
    /**
     * 報工
     */
    submitForm() {
      const formBbj = this?.$refs?.["form"];
      if (formBbj) {
        formBbj.validate((valid) => {
          if (valid) {
            this.postSave();
            this.resetForm();
          } else {
            console.log("error submit!!");
          }
        });
      }
    },
    /**
     * 不良原因送出
     */
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
    /**
     * [POST] 報工
     */
    async postSave() {
      this.$store.commit("global/setIsLoading", true);
      try {
        const data = {
          ENT: "20",
          SFFDDOCNO: this.form.SFFBDOCNO,
          ...this.form,
        };
        const res = await axios({
          url: "/5package/sfc/csft335_sffb_save01",
          method: "post",
          data,
        });
        this.$notify({
          title: "Success",
          message: "報工成功",
          type: "success",
          duration: 1000,
        });
      } catch (e) {
        console.log(e);
      }
      this.$store.commit("global/setIsLoading", false);
    },
    /**
     * 新增不良原因
     */
    async postReason() {
      this.$store.commit("global/setIsLoading", true);
      try {
        const data = {
          ENT: "20",
          SITE: "0001",
          SFFDDOCNO: this.form.SFFBDOCNO,
          // SFFDSEQ1: this.infoList.length + 1,
          ...this.reasonForm,
        };
        const res = await axios({
          url: "/5package/sfc/csft335_sffd_save01",
          method: "post",
          data,
        });
        this.$notify({
          title: "Success",
          message: "新增成功",
          type: "success",
          duration: 1000,
        });
        this.reasonModalOpen = false;
        this.getReasonList();
      } catch (e) {
        console.log(e);
      }
      this.$store.commit("global/setIsLoading", false);
    },
    /**
     * 修改不良原因
     */
    async putReason(data) {
      console.log(data);
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

    /**
     * [POST] 取得不良原因列表
     */
    async getReasonList() {
      this.$store.commit("global/setIsLoading", true);
      console.log(this.form);
      const res = await axios({
        url: "/5package/sfc/csft335_sffd_get01",
        method: "post",
        data: {
          ENT: "20",
          SFFDDOCNO: this.form.SFFBDOCNO,
        },
      });
      this.infoList = res?.data || [];

      this.$store.commit("global/setIsLoading", false);
    },

    /**
     * [POST] 尋找工單
     */
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
        this.isSearch = true;
        this.form = { ...this.form, ...data };
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
