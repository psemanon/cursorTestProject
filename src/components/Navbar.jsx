import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    
    &:hover {
      color: #3b82f6;
    }
  }
`;

const Navbar = () => {
  return (
    <Nav>
      <NavContainer>
        <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>
          <h1>百万级交流会-分享第17期-As Time Goes By</h1>
        </Link>
        <NavLinks>
          <Link to="/">首页</Link>
          <Link to="/chat-analysis">群聊分析</Link>
          <Link to="/about">关于我们</Link>
          <Link to="/services">服务</Link>
          <Link to="/contact">联系我们</Link>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar; 