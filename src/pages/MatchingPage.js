import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: 20px;
`;

const WaitingCircle = styled.div`
  width: 150px;
  height: 150px;
  border: 8px solid #00ADB5; 
  border-top-color: transparent; 
  border-radius: 50%;
  animation: ${pulse} 1.5s infinite ease-in-out;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  color: #D64560;
  font-weight: bold;
`;

const StatusText = styled.p`
  font-size: 1.5em;
  color: #555;
  margin-bottom: 30px;
`;

const Button = styled.button` 
  background-color: ${props => props.danger ? '#FF6347' : '#00ADB5'}; 
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 50px;
  font-size: 1.1em;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  margin: 0 10px;
  
  &:hover {
    background-color: ${props => props.danger ? '#E5533D' : '#008891'};
    transform: translateY(-2px);
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const MatchingPage = () => {
  // 상태 목록: 'intro' -> '대기'(로딩) -> '진행중' -> '성공' -> '실패/끝' 등
  const [matchingStatus, setMatchingStatus] = useState('intro');
  const [, setResultList] = useState([]); // 현재는 결과를 화면에서 사용 안 해서 setter만 사용

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const calc = async () => {
      if (matchingStatus !== '결과' || !token) return;
      try {
        const response = await axios.post(
          'http://localhost:3000/api/matches/score',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResultList(Array.isArray(response.data) ? response.data : []);
      } catch (e) {
        console.error('점수 계산 실패:', e);
      }
    };
    calc();
  }, [matchingStatus, setResultList]);

  // 1. 매칭 시작 (점수 계산 API 호출)
  const startSimpleMatching = async () => {
    setMatchingStatus('대기');
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        setMatchingStatus('intro');
        return;
      }
      const response = await axios.post(
        'http://localhost:3000/api/matches/score',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResultList(Array.isArray(response.data) ? response.data : []);
      setMatchingStatus('결과');
    } catch (error) {
      console.error('매칭 점수 계산 실패:', error);
      setMatchingStatus('실패');
    }
  };

  // --- [화면 렌더링] ---

  if (matchingStatus === 'intro') {
    return (
      <Container>
        <WaitingCircle style={{ animation: 'none' }}>✨</WaitingCircle>
        <StatusText>
          나의 해시태그와 모든 회원의 해시태그를 비교해 점수를 계산합니다.
        </StatusText>
        <Button onClick={startSimpleMatching}>매칭 시작</Button>
      </Container>
    );
  }

  if (matchingStatus === '대기') {
    return (
      <Container>
        <WaitingCircle>🔍</WaitingCircle>
        <StatusText>나와 딱 맞는 상대를 찾는 중...</StatusText>
      </Container>
    );
  }

  if (matchingStatus === '진행중') {
    return null;
  }

  if (matchingStatus === '성공') {
    return null;
  }

  if (matchingStatus === '실패') {
    return (
      <Container>
        <WaitingCircle style={{ borderColor: '#ccc', animation: 'none' }}>
          🏁
        </WaitingCircle>
        <StatusText>
          오류가 발생했습니다. 나중에 다시 시도해주세요.
        </StatusText>
        <Button onClick={() => setMatchingStatus('intro')}>다시 시작하기</Button>
      </Container>
    );
  }

  // '결과' 상태 등 아직 화면 UX를 안 만들었으면 일단 null
  return null;
};

export default MatchingPage;
