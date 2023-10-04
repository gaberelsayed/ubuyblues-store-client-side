import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Logo from "../../../../public/images/Logo-ASFOUR-White-footer.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiSolidUser } from "react-icons/bi";
import { FiLogIn } from "react-icons/fi";

export default function AdminLogin() {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [isLoginingStatus, setIsLoginingStatus] = useState(false);

    const [errMsg, setErrorMsg] = useState("");

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const [isVisiblePassword, setIsVisiblePassword] = useState(false);

    const router = useRouter();

    const adminLogin = async (e) => {
        e.preventDefault();
        setFormValidationErrors({});
        let errorsObject = validations.inputValuesValidation([
            {
                name: "email",
                value: email,
                rules: {
                    isRequired: {
                        msg: "عذراً هذا الحقل لا يمكن أن يكون فارغاً",
                    },
                    isEmail: {
                        msg: "عذراً ، البريد الالكتروني المُدخل غير صالح",
                    }
                },
            },
            {
                name: "password",
                value: password,
                rules: {
                    isRequired: {
                        msg: "عذراً هذا الحقل لا يمكن أن يكون فارغاً",
                    },
                },
            },
        ]);
        setFormValidationErrors(errorsObject);
        if (Object.keys(errorsObject).length == 0) {
            setIsLoginingStatus(true);
            try {
                const res = await Axios.get(`${process.env.BASE_API_URL}/users/login?email=${email}&password=${password}`);
                const data = await res.data;
                if (typeof data === "string") {
                    setIsLoginingStatus(false);
                    setErrorMsg(data);
                    setTimeout(() => {
                        setErrorMsg("");
                    }, 2000);
                } else {
                    localStorage.setItem("syria-card-user-id", data._id);
                    router.push("/");
                }
            } catch (err) {
                console.log(err);
                setErrorMsg("عذراً ، حدث خطأ الرجاء إعادة العملية !!");
            }
        }
    }

    return (
        <div className="admin-login d-flex flex-column justify-content-center">
            <Head>
                <title>Asfour Store - Admin Dashboard Login</title>
            </Head>
            <div className="page-content text-center w-50 mx-auto">
                <div className="container p-4">
                    <img src={Logo.src} alt="logo" width="250" height="200" className="mb-5" />
                    <form className="admin-login-form mb-3" onSubmit={adminLogin}>
                        <div className="email-field-box">
                            <input
                                type="text"
                                placeholder="Please Enter Your Email"
                                className={`form-control p-3 border-2 ${formValidationErrors["email"] ? "border-danger mb-2" : "mb-4"}`}
                                onChange={(e) => setEmail(e.target.value.trim())}
                            />
                            <div className='icon-box'>
                                <BiSolidUser className="icon" />
                            </div>
                        </div>
                        {formValidationErrors["email"] && <p className='error-msg text-danger'>{formValidationErrors["email"]}</p>}
                        <div className="password-field-box">
                            <input
                                type={isVisiblePassword ? "text" : "password"}
                                placeholder="Please Enter Your Password"
                                className={`form-control p-3 border-2 ${formValidationErrors["password"] ? "border-danger mb-2" : "mb-4"}`}
                                onChange={(e) => setPassword(e.target.value.trim())}
                            />
                            <div className='icon-box'>
                                {!isVisiblePassword && <AiOutlineEye className='eye-icon icon' onClick={() => setIsVisiblePassword(value => value = !value)} />}
                                {isVisiblePassword && <AiOutlineEyeInvisible className='invisible-eye-icon icon' onClick={() => setIsVisiblePassword(value => value = !value)} />}
                            </div>
                        </div>
                        {formValidationErrors["password"] && <p className='error-msg text-danger'>{formValidationErrors["password"]}</p>}
                        {!isLoginingStatus && !errMsg && <button type="submit" className="btn btn-success mx-auto d-block mb-4 p-3">
                            <span className="me-2">Login</span>
                            <FiLogIn />
                        </button>}
                        {isLoginingStatus && <button disabled className="btn btn-primary mx-auto d-block mb-4">
                            <span className="me-2">Wait Loging ...</span>
                        </button>}
                        {errMsg && <button disabled className="btn btn-danger mx-auto d-block mb-4">
                            <span className="me-2">{errMsg}</span>
                            <FiLogIn />
                        </button>}
                    </form>
                </div>
            </div>
        </div>
    );
}