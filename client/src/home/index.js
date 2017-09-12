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
    super(props);
    this.state = {
      loggedIn: false
    };
  }
  componentDidMount() {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      this.setState({loggedIn: true});
      this.props.dispatch(fetchUser(accessToken));
    }
  }

  handleLogOut() {
    this.setState({loggedIn: false});
    this.props.dispatch(logOutUser());
  }

  render() {
    return (
      <section>
        <header>
          <section>
            <img src="/images/header-img.png" alt="A book"/>
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
