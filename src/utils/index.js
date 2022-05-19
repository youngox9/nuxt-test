import axios from "@/axios";
async function checkMachine(data) {
  // console.log(e);
  const res = await axios({
    url: "/5package/sfc/csft335_sffb010_chk01",
    method: "post",
    data,
  });

  return res?.data === "OK";
}

export const VALIDATIONS = {
  isEmpty: () => ({ required: true, message: "此欄位為必填", trigger: "blur" }),
  checkMachine: (props = {}) => ({
    validator: async (rule, value, callback) => {
      const { validator } = props;
      const result = await validator(value);
      if (!value) {
        callback();
        return;
      }
      if (!result) {
        callback(new Error("機台輸入錯誤"));
      } else {
        callback();
      }
    },
    trigger: ["blur", "change"],
  }),
  // isEmpty: {
  //   validator: async (rule, value, callback, ...rest) => {
  //     if (!value) {
  //       callback(new Error("此欄位為必填"));
  //     } else {
  //       callback();
  //     }
  //   },
  //   trigger: "blur",
  // },
};
