import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import TagSelector from '../components/TagSelector';

// 💡 AuthPage.js에 정의된 것과 동일한 MAJOR_OPTIONS를 사용해야 합니다.
const MAJOR_OPTIONS = [
  '선택하세요',
  '간호학과',
  '보건의료행정과',
  '컴퓨터공학과',
  // ... 필요하면 더 추가 ...
];

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const FormContainer = styled.div`
  padding: 40px;
  max-width: 600px;
  margin: 40px auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const InputGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  background: #00adb5;
  color: white;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: #008891;
  }
`;

const ProfileEditPage = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('현재닉네임');
  const [major, setMajor] = useState('컴퓨터공학과');
  const [mbti, setMbti] = useState(['INTP']);
  const [talentTags, setTalentTags] = useState(['웹 개발', 'AI/ML']);

  // 태그 토글 로직
  const handleTagToggle = (tag, limit) => {
    const setState = limit === 1 ? setMbti : setTalentTags;
    setState((prev) => {
      const exists = prev.includes(tag);
      if (exists) {
        return prev.filter((t) => t !== tag);
      }
      if (limit && prev.length >= limit) {
        // 최대 개수 제한이 있으면 더 이상 추가하지 않음
        return prev;
      }
      return [...prev, tag];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const tagsString = talentTags.join(',');
    const mbtiString = mbti.join('');

    const updatedData = {
      nickname,
      major,
      mbti: mbtiString,
      tags: tagsString,
    };

    console.log('업데이트할 프로필 데이터:', updatedData);

    alert('프로필이 성공적으로 수정되었습니다. (임시 동작)');
    navigate('/profile/현재ID'); // ❗ 문자열 직접 사용 → no-useless-concat 해결
  };

  return (
    <FormContainer>
      <h2 style={{ color: '#D64560' }}>프로필 정보 수정</h2>
      <form onSubmit={handleSubmit}>
        {/* 닉네임 입력 */}
        <InputGroup>
          <label>닉네임</label>
          <Input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </InputGroup>

        {/* 학과 선택 드롭다운 */}
        <InputGroup>
          <label>학과</label>
          <Select
            value={major}
            onChange={(e) => setMajor(e.target.value)}
          >
            {MAJOR_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </InputGroup>

        {/* MBTI 및 재능 태그 선택 */}
        <InputGroup>
          <label>MBTI</label>
          <TagSelector
            type="mbti"
            selectedTags={mbti}
            onTagToggle={handleTagToggle}
          />
        </InputGroup>
        <InputGroup>
          <label>재능 태그</label>
          <TagSelector
            type="talent"
            selectedTags={talentTags}
            onTagToggle={handleTagToggle}
          />
        </InputGroup>

        <Button type="submit">정보 저장 (수정 완료)</Button>
      </form>
    </FormContainer>
  );
};

export default ProfileEditPage;
