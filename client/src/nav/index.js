import React from "react";
import * as Cookies from "js-cookie";
import { connect } from "react-redux";
import "./nav.css";

//components
import { Link } from "react-router-dom";

//actions
import { fetchUser, logOutUser } from "../redux/actions";

export class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
  }
  componentDidMount() {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      this.setState({ loggedIn: true });
      this.props.dispatch(fetchUser(accessToken));
    }
  }

  render() {
    let userToggleLogin;
    if (this.state.loggedIn) {
      userToggleLogin = (
        <a className="logout" href="/api/auth/logout">
          <p>Log out</p>
        </a>
      );
    } else {
      userToggleLogin = (
        <a className="signIn" href="/api/auth/google">
          <p>Sign in</p>
        </a>
      );
    }
    return (
      <nav>
        <Link
          style={{
            textDecoration: "none"
          }}
          to="/library"
        >
          <p>Library</p>
        </Link>
        <Link
          style={{
            textDecoration: "none"
          }}
          to="/recommendations"
        >
          <p>Recommendations</p>
        </Link>
        {userToggleLogin}
      </nav>
    );
  }
}

export default connect()(Nav);
