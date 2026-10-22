import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

import profile from "../assets/images/thumnails/소녀재판.PNG";

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
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

const ChatContainer = styled.div`
  background-color: #f5f5f5;
  border-radius: 1.5vw;
  box-shadow: 1vw 1vw 1.5vw rgba(0, 0, 0, 0.3);
  display: inline-block;
  padding: 2vw 3vw;
  text-align: left;
  margin: 0.5vh 1vw 1.5vh 1vw;
  max-width: 70%;
`;

const ChatText = styled.p`
  font-family: "Pretendard";
  font-size: 0.9rem;
  font-weight: 400;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.5;
  color: #333;
  margin: 0;
`;

const ExampleText = styled.p`
  font-family: "Pretendard";
  font-size: 0.8rem;
  font-weight: 300;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.5;
  color: gray;
  margin: 0;
`;

export default function InitialChat({ className }) {
  return (
    <Container
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className={className}
    >
      <ProfileImage src={profile} alt="profile" />
      <ChatContainer>
        <ChatText>안녕하세요, 어떤 장면이 궁금하세요?</ChatText>
        <ChatText> </ChatText>
        <ChatText>어렴풋이 기억나는 장면에 등장했던 인물</ChatText>
        <ChatText>또는 상황이나 등장인물의 대사를 입력해보세요!</ChatText>
        <br />
        <ExampleText>예시)</ExampleText>
        <ExampleText>
          차태석이랑 박가을이랑 오토바이 타는 장면 몇 화인지 알려주세요
        </ExampleText>
        <ExampleText>
          안경 낀 사람 때리면 살인 몇 화에 나온 대사야??
        </ExampleText>
      </ChatContainer>
    </Container>
  );
}
