import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from "universal-cookie";


const cookies = new Cookies();

function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [error,setError] = useState('')
    const [users, setUsers] = useState([]);
    const [authMode, setAuthMode] = useState('signin');

    //////////////////////
    useEffect(()=>{
      getSession();
    },[])

    const getSession = () => {
      fetch("/api/session/", {
        credentials: "same-origin",
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }

    const whoami = () => {
      fetch("/api/whoami/", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      })
      .then((res) => res.json())
      .then((data) => {
        console.log("You are logged in as: " + data.username);
      })
      .catch((err) => {
        console.log(err);
      });
    }

    //////////////////////로그인 관련 handler
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    }
  
    const handlemNumberChange = (e) => {
      setUsername(e.target.value);
    }
    //isResponseOk 이건 function인지 const로 써야하는지 헷갈림*********
    const isResponseOk = (response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    }

    ////로그인, 로그아웃
    const login = (e) => {
      e.preventDefault();
      fetch("/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: "same-origin",
        body: JSON.stringify({username: {username}, password: {password}}),
      })
      .then(this.isResponseOk)
      .then((data) => {
        console.log(data);
        setIsAuthenticated(true)
        setUsername("")
        setPassword("")
        setError("")
      })
      .catch((err) => {
        console.log(err);
        setError("Wrong mNumber or password")
      });
    }
  
    const logout = () => {
      fetch("/api/logout", {
        credentials: "same-origin",
      })
      .then(this.isResponseOk)
      .then((data) => {
        console.log(data);
        setIsAuthenticated(false)
      })
      .catch((err) => {
        console.log(err);
      });
    };
///////////////////////////////////////////////////////회원가입
// amdata는 sign up 사용/로그인 or 회원가입시 handler
    const changeAuthMode = () => {
        setAuthMode(authMode === "signin" ? "signup" : "signin")
    };

    const [amdata, setAmdata] = useState({});
    const nameChangeHandler = e => {
        setAmdata( prevState => {
            return { ...prevState, name: e.target.value }
        })
    }
    const emailChangeHandler = e => {
        setAmdata( prevState => {
            return { ...prevState, email: e.target.value }
        })
    }
    const usernameChangeHandler = e => {
        setAmdata( prevState => {
            return { ...prevState, username: e.target.value }
        })
    }
    const passwordChangeHandler = e => {
        setAmdata( prevState => {
            return { ...prevState, password: e.target.value }
        })
    }

    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    const navigate = useNavigate();

    if (isAuthenticated === true) {
        return navigate('/')
    }

///////////////////////////////////////////////
///////////////////////////////////////////////

    if (authMode === "signin") {
        return (
            <div className="Auth-form-container">
                <form className="Auth-form">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">로그인</h3>
                        <div className="text-center">
                            비회원이에요!{" "}
                            <span className="link-primary" onClick={changeAuthMode}>
                                회원가입하러 가기
                            </span>
                        </div>
                        <div className="form-group mt-3">
                            <label>군번</label>
                            <input
                                type="text"
                                className="form-control mt-1"
                                placeholder="군번"
                                onChange={e=>{setUsername(e.target.value)}}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>비밀번호</label>
                            <input
                                type="password"
                                className="form-control mt-1"
                                placeholder="비밀번호를 입력합니다."
                                onChange={e=>{setPassword(e.target.value)}}
                            />
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-dark" onClick={login}>
                                로그인
                            </button>
                        </div>
                    </div>
                </form>
                {/* null써도 되는지 모르겠음 */}
                {/* {
                  isAuthenticated === true ? navigate('/') : null
                } */}
            </div>

          // if (isAuthenticated === true) {
          //   return navigate('/')
          // }
        )
    } else {
      return (
        <div className="Auth-form-container">
            <form className="Auth-form">
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">회원가입</h3>
                    <div className="text-center">
                        회원이에요!{" "}
                        <span className="link-primary" onClick={changeAuthMode}>
                            로그인하러 가기
                        </span>
                    </div>
                    <div className="form-group mt-3">
                        <label>이름</label>
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="이름"
                            onChange={nameChangeHandler}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>이메일 주소</label>
                        <input
                            type="email"
                            className="form-control mt-1"
                            placeholder="이메일 주소"
                            onChange={emailChangeHandler}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>군번</label>
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="군번"
                            onChange={usernameChangeHandler}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>비밀번호</label>
                        <input
                            type="password"
                            className="form-control mt-1"
                            placeholder="비밀번호"
                            onChange={passwordChangeHandler}
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        {/* <button type="submit" className="btn btn-dark" onClick={()=>{
                            axios.post('URL', data)
                        }}>
                            가입하기
                        </button> */}
                        {/* 임시로 만들었음 */}
                        <button>가입하기</button>
                    </div>
                </div>
            </form>
        </div>
      )
    }
}


export default LoginForm;