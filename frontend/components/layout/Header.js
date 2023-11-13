import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";

import AuthContext from "../../context/AuthContext";

const Header = () => {
  const { loading, user, logout } = useContext(AuthContext);

  const logoutHandler = () => {
    logout();
  };

  return (
    <div className="navWrapper">
      <div className="navContainer">
        <Link href="/">
          <div className="logoWrapper">
            <div className="logoImgWrapper">
              <Image width="50" height="50" src="/images/logo.png" alt="" />
            </div>
            <span className="logo1">Job</span>
            <span className="logo2">bee</span>
          </div>
        </Link>
        <div className="btnsWrapper">
          <Link href="/employeer/jobs/new">
            <button className="postAJobButton">
              <span>Post A Job</span>
            </button>
          </Link>
          {user ? (
            <div className="dropdown ml-3">
              <a
                className="btn dropdown-toggle mr-4"
                id="dropDownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span>Hi, {user.first_name}</span>{" "}
              </a>

              <div
                className="dropdown-menu"
                aria-labelledby="dropDownMenuButton"
              >
                <Link className="dropdown-item" href="/employeer/jobs" >
                  My Jobs
                </Link>

                <Link className="dropdown-item" href="/me/applied">
                   Jobs Applied
                </Link>

                <Link className="dropdown-item" href="/me">
                  Profile
                </Link>

                <Link className="dropdown-item" href="/upload/resume">
                  Upload Resume
                </Link>

                <Link className="dropdown-item text-danger" onClick={logoutHandler} href="/">
                    Logout
                </Link>
              </div>
            </div>
          ) : (
            !loading && (
              <Link href="/login">
                <button className="loginButtonHeader">
                  <span>Login</span>
                </button>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;