import React from 'react'

// REACT ROUTER
import { Link } from 'react-router-dom';

function Header() {
    return (
        <div className="header">
            <Link to="/panel"><h4 className="">Panel</h4></Link>
            <Link to="/jsonChallenge"><h4 className="">Json-Challenge</h4></Link>
            <Link to="/Optional"><h4 className="">Optional Task</h4></Link>
        </div>
    )
}

export default Header
