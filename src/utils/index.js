export const VALIDATIONS = {
  isEmpty: {
    validator: (rule, value, callback, ...rest) => {
      if (!value) {
        callback(new Error("此欄位為必填"));
      } else {
        callback();
      }
    },
    trigger: "blur",
  },
};
