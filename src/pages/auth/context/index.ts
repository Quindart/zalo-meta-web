import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
  phone: Yup.string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^[0-9]{9,12}$/, "Số điện thoại không hợp lệ"),
  password: Yup.string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

// import * as Yup from "yup";

// export const loginValidationSchema = Yup.object({
//   phone: Yup.string()
//     .required("Số điện thoại là bắt buộc")
//     .matches(/^[0-9]{9,12}$/, "Số điện thoại không hợp lệ"),
//   password: Yup.string()
//     .required("Mật khẩu là bắt buộc")
//     .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
//     .matches(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//       "Mật khẩu phải chứa ít nhất một chữ cái in hoa, một chữ cái thường, một số và một ký tự đặc biệt",
//     ),
// });
