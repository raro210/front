import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// =====================================
// ✅ Styled Components 정의 (모바일 규격 포함)
// =====================================

const HeroSection = styled.div`
  background: radial-gradient(circle at 10% 20%, #0f2027 0%, #203a43 50%, #2c5364 100%);
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;

  @media (max-width: 768px) {
    height: 50vh;
    padding: 0 15px;
  }
`;

const Title = styled.h1`
  font-size: 3.5em;
  font-weight: bold;
  color: #ffd95a;
  margin-bottom: 15px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6);

  @media (max-width: 768px) {
    font-size: 2.2em;
    margin-bottom: 10px;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2em;
  color: #eee;
  margin-bottom: 40px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 1em;
    margin-bottom: 25px;
  }
`;

const StartButton = styled.button`
  background-color: #00adb5;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 50px;
  font-size: 1.1em;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background-color: #008891;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 10px 25px;
    font-size: 1em;
  }
`;

const RandomProfilesSection = styled.section`
  width: 100%;
  padding: 60px 20px;
  background-color: #f8f8f8;
  text-align: center;

  @media (max-width: 768px) {
    padding: 30px 10px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2em;
  color: #333;
  margin-bottom: 40px;
  &:after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background-color: #d64560;
    margin: 10px auto 0 auto;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 1.5em;
    margin-bottom: 30px;
  }
`;

// 💡 지도와 게시물 결합 섹션 스타일
const CombinedSection = styled.section`
  width: 100%;
  padding: 60px 20px;
  background-color: #ffffff;
  text-align: center;

  @media (max-width: 768px) {
    padding: 30px 10px;
  }
`;

const CombinedContent = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  text-align: left;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
`;

// 💡 왼쪽 (지도) 섹션 스타일
const MapContainer = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 550px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: center;

  @media (max-width: 1024px) {
    width: 95%;
    max-width: none;
    padding: 15px;
  }
`;

// 💡 오른쪽 (게시물) 섹션 스타일
const PostsContainer = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 550px;
  padding: 0;
  text-align: left;

  @media (max-width: 1024px) {
    width: 95%;
    max-width: none;
  }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
`;

const PostCard = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const PostTitle = styled.h4`
  color: #007bff;
  margin-bottom: 8px;
  font-size: 1.1em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

// =====================================
// ✅ MainPage 컴포넌트 로직
// =====================================

const MainPage = () => {
  const navigate = useNavigate();
  const [latestPosts, setLatestPosts] = useState([]);
  const [topMatches, setTopMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const postsRes = await axios.get(`${API_BASE_URL}/api/posts?limit=6`);
        setLatestPosts(Array.isArray(postsRes.data) ? postsRes.data : []);

        const token = localStorage.getItem('jwtToken');
        if (token) {
          const topRes = await axios.get(`${API_BASE_URL}/api/matches/top3`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          setTopMatches(Array.isArray(topRes.data) ? topRes.data : []);
        } else {
          setTopMatches([]);
        }
      } catch (err) {
        console.error('메인 데이터 로딩 오류:', err);
        setError('데이터를 불러오는 데 실패했습니다. (서버/DB 연결 확인 필요)');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <HeroSection>
        <Title>만남은 재능</Title>
        <Subtitle>세상의 숨겨진 재능을 연결하고, 당신의 가치를 공유하세요.</Subtitle>
        <StartButton onClick={() => navigate('/matching')}>매칭 시작 →</StartButton>
      </HeroSection>

      <RandomProfilesSection>
        <SectionTitle>만남은 재능에 오신 것을 환영합니다</SectionTitle>
        <p>아래에서 최신 게시물과 나와 잘 맞는 TOP3 인연을 확인하세요.</p>
        {error && (
          <p style={{ color: 'red', marginTop: '10px' }}>
            {error}
          </p>
        )}
      </RandomProfilesSection>

      <CombinedSection>
        <SectionTitle>가까운 재능 & 최신 소식</SectionTitle>
        <CombinedContent>
          <MapContainer>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>나와 잘 맞는 TOP 3</h3>
            {loading && <p>매칭 점수를 계산 중입니다...</p>}
            {!loading && topMatches.length === 0 && (
              <p style={{ color: '#777' }}>로그인 후 나와 맞는 인연 TOP3를 확인하세요.</p>
            )}
            {!loading && topMatches.length > 0 && (
              <div>
                {topMatches.map((u) => (
                  <div
                    key={u.id}
                    style={{
                      border: '1px solid #eee',
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ fontWeight: 'bold', color: '#00adb5' }}>{u.nickname}</div>
                    <div style={{ fontSize: 12, color: '#555' }}>{u.bio || '소개 없음'}</div>
                    <div style={{ marginTop: 6, fontSize: 13 }}>
                      매칭 점수:{' '}
                      <span style={{ color: '#d64560', fontWeight: 'bold' }}>
                        {u.match_score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </MapContainer>

          <PostsContainer>
            <h3
              style={{
                color: '#333',
                marginBottom: '15px',
                textAlign: 'center',
              }}
            >
              최신 등록된 재능 게시물
            </h3>
            <PostList>
              {latestPosts.map((post) => (
                <PostCard
                  key={post.id}
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  <PostTitle>{post.title}</PostTitle>
                  <p
                    style={{
                      fontSize: '0.9em',
                      color: '#00adb5',
                      marginBottom: '5px',
                    }}
                  >
                    작성자: {post.author_nickname || '익명'}
                  </p>
                  <p style={{ fontSize: '0.8em', color: '#888' }}>
                    등록일: {new Date(post.created_at).toLocaleString()}
                  </p>
                </PostCard>
              ))}
            </PostList>
          </PostsContainer>
        </CombinedContent>
      </CombinedSection>
    </>
  );
};

export default MainPage;
