import React from "react";
import { register, googleLogin } from "../Services/User";
import { toast } from "react-toastify";
import GoogleLogin from "react-google-login";
import GoogleLogo from "../Assets/images/Google.svg";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const LoginDiv = styled.button`
  margin-left: 39%;
  cursor: pointer;
  text-align: center;
  padding: 10px 20px;
  background: #022a40;
  border: 1px solid #4098ff;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonIcon = styled.img`
  height: 18px;
  width: 18px;
`;

const ButtonText = styled.p`
  margin: 0 0 0 10px;
  color: #bde7ff;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
`;

function Signup() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const handleChange = (e) => {
    e.preventDefault();
    var name = e.target.name;
    var value = e.target.value;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { password, cpassword } = user;

    register(user).then((data) => {
      if (data.data.message !== "User created successfully") {
        toast.warn(data.data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      } else if (password !== cpassword) {
        toast.warn("Password Does Not Match", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        return;
      } else {
        toast.success(data.data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        navigate("/login");
      }
    });
  };

  const handleGoogleLogin = async (googleData) => {
    register({
      name: googleData.profileObj.name,
      email: googleData.profileObj.email,
      password: "User",
      cpassword: "User",
    })
      .then((data) => {
        toast.success("Sign up Succesfully", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        googleLogin(googleData)
          .then((result) => {
            console.log(result);
            if (result.data.result) {
              navigate("/");
            }
          })
          .catch((err) => {
            if (err.response.data.message)
              toast.warn(err.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
              });
            else
              toast.warn("Login failed , please try again", {
                position: toast.POSITION.BOTTOM_RIGHT,
              });
          });
      })
      .catch((err) => {
        console.log("google catch", err);
        toast.warn("Login failed , please try again", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };

  const handleFailure = (err) => {
    console.log("google", err);
    if (
      err.error === "popup_closed_by_user" ||
      err.error === "idpiframe_initialization_failed"
    ) {
      toast.warn("Allow pop-ups and turn on third party cookies to sign in.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } else {
      toast.warn("Login failed, please try again", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  return (
    <>
      <div className="form">
        <h3 className="title">
          Welcome Aboard! <br /> <span>Get Started</span>
        </h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="72"
          height="72"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zM6.023 15.416C7.491 17.606 9.695 19 12.16 19c2.464 0 4.669-1.393 6.136-3.584A8.968 8.968 0 0 0 12.16 13a8.968 8.968 0 0 0-6.137 2.416zM12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        </svg>
        <div className="content">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              id="name"
              name="name"
              onChange={handleChange}
            ></input>
          </div>
          <div>
            <input
              className="input"
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              onChange={handleChange}
              required
            ></input>
          </div>
          <div>
            <input
              className="input"
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              onChange={handleChange}
              required
            ></input>
          </div>

          <div>
            <input
              className="input"
              type="password"
              placeholder="Confirm Password"
              id="cpassword"
              onChange={handleChange}
              name="cpassword"
              required
            ></input>
          </div>
          <div>
            <button type="submit" className="button2" onClick={handleLogin}>
              SIGN UP
            </button>
          </div>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            onSuccess={handleGoogleLogin}
            onFailure={handleFailure}
            cookiePolicy="single_host_origin"
            render={(counter) => (
              <LoginDiv
                onClick={counter.onClick}
                disabled={counter.disabled}
                type="button"
              >
                <ButtonIcon src={GoogleLogo} alt="Google Logo" />
                <ButtonText>Sign Up</ButtonText>
              </LoginDiv>
            )}
          />
          <p className="aha">
            Already have an account?{" "}
            <span>
              <a href="/login"> Sign In</a>
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;
