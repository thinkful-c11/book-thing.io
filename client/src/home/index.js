import React from "react";
import "./home.css";

//OAuth
import * as Cookies from "js-cookie";

//components
import {Link} from "react-router-dom";
import {connect} from "react-redux";

//actions
import {fetchUser, logOutUser} from "../redux/actions";

export class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false
    }
  }
  componentDidMount() {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      this.setState({loggedIn: true});
      console.log("token", accessToken);
      this.props.dispatch(fetchUser(accessToken));
    }
  }

  handleLogOut() {
    Cookies.remove("accessToken");
    this.setState({loggedIn: false});
    this.props.dispatch(logOutUser());
  }

  render() {
    let userToggleLogin;
    if (this.state.loggedIn) {
      userToggleLogin = (
        <a className="logout" onClick={() => this.handleLogOut()} href="/api/auth/logout">
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
      <section>
        <header>
          <nav>
            <Link style={{
              textDecoration: "none"
            }} to="/library">
              <p>Library</p>
            </Link>
            <Link style={{
              textDecoration: "none"
            }} to="/recommendations">
              <p>Recommendations</p>
            </Link>
            {userToggleLogin}
          </nav>
          <section>
            <img src="/images/header-img.png" alt="Oh no! Something went wrong."/>
            <div>
              <h1>
                The Ultimate Book<br/>Recommendation Engine
              </h1>
              <Link to="/library">
                <button>Get Started</button>
              </Link>
            </div>
          </section>
        </header>
        <section className="home-body">
          <div>
            <h2>What we do</h2>
          </div>
          <section>
            <div>
              <h3>What is Book-Thing.io</h3>
              <p>The best book reommendation site in the world.</p>
            </div>
            <div>
              <h3>Why Use Book-Thing.io</h3>
              <p>
                We give you books you want to read not just the ones that sell the best!
              </p>
            </div>
            <div>
              <h3>How to Use Book-Thing.io</h3>
              <p>
                Simply Log-in, add books, and create recommendations for other users that have read those books
              </p>
            </div>
          </section>
        </section>
      </section>
    );
  }
}

const mapStateToProps = (state, props) => ({state: state, user: state.user});

export default connect(mapStateToProps)(Home);
