import { useState } from "react";
import { omit } from "lodash";
import { useNavigate } from "react-router-dom";

export const useForm = (doSignUp) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [fieldsErr, setAllFieldsErr] = useState("");
  const [confirmPasswordErr, setConfirmPasswordErr] = useState(false);
  const navigate = useNavigate();
  const validate = (event, name, value, values) => {
    switch (name) {
      case "name":
        if (value.length <= 4) {
          setErrors({
            ...errors,
            username: "Name atleast have 5 letters",
          });
        } else {
          let newObj = omit(errors, "username");
          setErrors(newObj);
        }
        break;

      case "email":
        if (
          !new RegExp(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ).test(value)
        ) {
          setErrors({
            ...errors,
            email: "Enter a valid email address",
          });
        } else {
          let newObj = omit(errors, "email");
          setErrors(newObj);
        }
        break;

      case "mobile":
        if (value.length <= 9 || value.length > 10) {
          setErrors({
            ...errors,
            mobile: "number must contain 10 digits",
          });
        } else {
          let newObj = omit(errors, "mobile");
          setErrors(newObj);
        }
        break;

      case "password":
        if (
          !new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).test(value)
        ) {
          setErrors({
            ...errors,
            password:
              "Password should contains atleast 8 charaters and containing uppercase,lowercase and numbers",
          });
        } else {
          let newObj = omit(errors, "password");
          setErrors(newObj);
        }
        break;

      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    if (values.password !== values.confirmPassword) {
      setConfirmPasswordErr(true);
    } else if (
      Object.keys(errors).length === 0 &&
      Object.keys(values).length === 5
    ) {
      // callback();
      doSignUp(values).then((data) => {
        if (data.success) {
          localStorage.setItem("tempUser", JSON.stringify(values));
          navigate("/otp");
        } else {
          setAllFieldsErr(`${data.errNested}`);
          setTimeout(() => {
            setAllFieldsErr("");
          }, "1500");
        }
      });
    } else if (Object.keys(values).length !== 5) {
      setAllFieldsErr("Please Fill all Fields");
      setTimeout(() => {
        setAllFieldsErr("");
      }, "1500");
    }
  };

  const handleChange = (event) => {
    event.persist();
    let name = event.target.name;
    let val = event.target.value;
    validate(event, name, val, values);

    setValues({
      ...values,
      [name]: val,
    });
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    fieldsErr,
    confirmPasswordErr,
  };
};
