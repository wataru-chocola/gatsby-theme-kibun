import React from "react";
import { Link } from "gatsby";

import Seo from "../components/seo"


const Layout: React.FC<{ pageTitle: string }> = ({ pageTitle, children }) => {
  return (
    <main>
      <Seo title={pageTitle} />
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
      {children}
    </main>
  )
}

export default Layout;