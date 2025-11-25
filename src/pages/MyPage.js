import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  padding: 30px;
`;

const Title = styled.h2`
  color: #00adb5;
  margin-bottom: 20px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
`;

const Label = styled.div`
  color: #666;
`;

const Value = styled.div`
  color: #333;
  font-weight: 600;
`;

const Tag = styled.span`
  display: inline-block;
  background: #f0f2f5;
  color: #555;
  padding: 6px 10px;
  border-radius: 16px;
  margin-right: 8px;
  margin-top: 6px;
`;

const MyPage = () => {
  const [profile, setProfile] = useState(null);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('jwtToken');
        if (!token) { setError('로그인이 필요합니다.'); setLoading(false); return; }

        const [meRes, majorsRes] = await Promise.all([
          axios.get('http://localhost:3000/api/users/me', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:3000/api/majors'),
        ]);
        setProfile(meRes.data);
        setMajors(Array.isArray(majorsRes.data) ? majorsRes.data : []);
      } catch (e) {
        console.error('마이페이지 로딩 실패:', e);
        setError('내 정보 로드에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const majorName = (() => {
    if (!profile || !profile.major_id) return '-';
    const m = majors.find(x => x.id === profile.major_id);
    return m ? `${m.college_name} ${m.major_name}` : `#${profile.major_id}`;
  })();

  const tags = (profile?.tags || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  if (loading) return <Container><p>불러오는 중...</p></Container>;
  if (error) return <Container><p style={{ color: 'red' }}>{error}</p></Container>;
  if (!profile) return <Container><p>내 정보를 찾을 수 없습니다.</p></Container>;

  return (
    <Container>
      <Title>내 정보</Title>
      <Row><Label>닉네임</Label><Value>{profile.nickname}</Value></Row>
      <Row><Label>학과</Label><Value>{majorName}</Value></Row>
      <Row><Label>MBTI</Label><Value>{profile.mbti || '-'}</Value></Row>
      <Row style={{ borderBottom: 'none', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Label>해시태그</Label>
        <div>{tags.length ? tags.map(t => <Tag key={t}>#{t}</Tag>) : <Value>-</Value>}</div>
      </Row>
    </Container>
  );
};

export default MyPage;
