import React from 'react';
import {Link} from "gatsby";

interface HeaderProps {
}

function Header(props: HeaderProps) {
    return (
        <div>
            header
            <Link to={"/"}>home</Link>
            <Link to={"/about"}>about</Link>
        </div>
    );
}

export default Header;