import React from 'react';
import styled from 'styled-components';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NavContainer = styled.header`
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #eee;
  padding: 15px 30px; /* PC 기본 패딩 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  /* 💡 모바일 규격 (768px 이하) */
  @media (max-width: 768px) {
    padding: 10px 15px; /* 패딩 축소 */
    align-items: flex-start; 
    flex-wrap: wrap; /* 메뉴가 넘치면 줄바꿈 허용 */
  }
`;

const Logo = styled(Link)`
  font-size: 1.5em; /* PC 기본 */
  font-weight: bold;
  color: #D64560;
  text-decoration: none;
  
  @media (max-width: 768px) {
    font-size: 1.2em; /* 💡 모바일: 로고 폰트 크기 축소 */
    margin-right: auto; /* 나머지 메뉴를 오른쪽으로 밀어냄 */
    padding-top: 5px;
  }
`;

const NavMenu = styled.nav`
  display: flex;
  gap: 20px; /* PC 간격 */
  align-items: center;

  @media (max-width: 768px) {
    /* 💡 모바일: 메뉴 간격 축소 및 유연하게 배치 */
    gap: 8px; 
    font-size: 0.9em; 
    flex-wrap: wrap; 
    justify-content: flex-end;
  }
`;

// NavLink 대신 Link를 사용할 경우, active 스타일링을 직접 처리해야 하므로 NavLink를 사용했습니다.
const StyledNavLink = styled(NavLink)`
  color: #555;
  text-decoration: none;
  font-size: 1em; /* PC 기본 */
  padding: 5px 0;
  transition: color 0.2s;

  &:hover {
    color: #D64560;
  }
  
  &.active {
    font-weight: bold;
    color: #D64560;
    border-bottom: 2px solid #D64560;
  }

  @media (max-width: 768px) {
    font-size: 0.85em; /* 💡 모바일: 메뉴 폰트 크기 축소 */
    padding: 2px 5px;
  }
`;

const AuthButton = styled.button`
  background-color: #D64560;
  color: white;
  padding: 8px 15px; /* PC 기본 */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s;
  margin-left: 10px;

  &:hover {
    background-color: #B23A50;
  }

  @media (max-width: 768px) {
    padding: 5px 10px; /* 💡 모바일: 버튼 크기 축소 */
    font-size: 0.85em;
    margin-left: 5px;
  }
`;

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  return (
    <NavContainer>
      <Logo to="/">만남은 재능</Logo>
      <NavMenu>
        <StyledNavLink to="/manage">게시물</StyledNavLink>
        <StyledNavLink to="/matching">매칭</StyledNavLink>
        {isAuthenticated ? (
          <>
            <StyledNavLink to="/mypage">마이페이지</StyledNavLink>
            <AuthButton onClick={handleLogout}>로그아웃</AuthButton>
          </>
        ) : (
          <>
            <StyledNavLink to="/auth">로그인</StyledNavLink>
            <AuthButton onClick={() => navigate('/auth?mode=register')}>회원가입</AuthButton>
          </>
        )}
      </NavMenu>
    </NavContainer>
  );
};

export default Header;
