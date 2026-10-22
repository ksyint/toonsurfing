import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

import profileImage from "../assets/images/thumnails/소녀재판.svg";

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  margin-top: 3vh;
`;

const ChatContainer = styled.div`
  background-color: #f5f5f5;
  border-radius: 1.5vw;
  box-shadow: 1vw 1vw 1.5vw rgba(0, 0, 0, 0.3);
  display: inline-block;
  align-items: flex-start;
  padding: 2vw 3vw;
  text-align: left;
  margin: 1vw 0;
  max-width: 70%;
  width: fit-content;
`;

const ProfileImage = styled.img`
  width: 11vw;
  height: 11vw;
  border: solid 0.2vw #d9d9d9;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 2vh;
  margin-bottom: 0.5vh;
  margin-left: 1vw;
`;

const ChatText = styled.p`
  font-family: "Pretendard";
  font-size: 0.9rem;
  font-weight: 400;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.5;
  color: #000;
  margin: 0;
`;

export default function FailureChat({ className }) {
  return (
    <Container
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className={className}
    >
      <ProfileImage src={profileImage} alt="profile" />
      <ChatContainer>
        <ChatText>해당 장면이 있는 회차를 찾지 못했어요😢</ChatText>
        <ChatText>조금 더 정확하게 입력해주세요</ChatText>
      </ChatContainer>
    </Container>
  );
}
