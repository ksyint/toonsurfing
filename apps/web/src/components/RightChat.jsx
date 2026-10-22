import React from "react";
import styled from "styled-components";

const ChatContainer = styled.div`
  background-color: #fff;
  border-radius: 1.5vw;
  box-shadow: 1vw 1vw 1.5vw rgba(0, 0, 0, 0.3);
  display: inline-block;
  padding: 2vw 3vw;
  text-align: left;
  margin: 0.7vh 1vw 0.7vh 1vw;
  align-self: flex-end;
  max-width: 70%;
`;

const ChatText = styled.p`
  font-family: "Pretendard";
  font-size: 0.9rem;
  font-weight: 300;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.5;
  color: #333;
  margin: 0;
`;

export default function RightChat({ message, className }) {
  return (
    <ChatContainer className={className}>
      <ChatText>{message}</ChatText>
    </ChatContainer>
  );
}
