import React, { useEffect } from 'react'
import Workplace from "./components/Workplace"
import Login from "./components/Login"
import fire from "./components/fire"

import { connect } from "react-redux"
import { SET_USER } from './store/actions/actionTypes'

const App = (props) => {
  const authListener = () => {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        props.setUser(user)
      } else {
        props.setUser("")
      }
    })
  }
  useEffect(() => {
    authListener()
  }, [])
  return (
    <div className="WorkplaceWraper">
      {
        props.user ? <Workplace /> : <Login />
      }
    </div>
  )
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}
function mapDispatchToProps(dispatch) {
  return {
    setUser: (isUser) => dispatch({ type: SET_USER, isUser: isUser })

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)