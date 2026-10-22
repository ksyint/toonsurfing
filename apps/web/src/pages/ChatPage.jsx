import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { StageSpinner } from "react-spinners-kit";
import { motion } from "framer-motion";
import { apiClient } from "../apiClient";

import InitialChat from "../components/InitialChat";
import LeftChat from "../components/LeftChat";
import RightChat from "../components/RightChat";
import SuccessChat from "../components/SuccessChat";
import FailureChat from "../components/FailureChat";

import profile from "../assets/images/thumnails/소녀재판.PNG";
import backButton from "../assets/images/leftArrow.png";
import header from "../assets/images/header.png";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const pageTransition = {
  duration: 0.5,
};

const Container = styled(motion.div)`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 20vh;
  background-image: url(${header});
  background-size: cover;
  background-position: center;
  z-index: 1;
`;

const BackButton = styled.img`
  position: absolute;
  left: 2vw;
  top: 2vh;
  width: 5vw;
  cursor: pointer;
  z-index: 2;
`;

const WhiteContainer = styled.div`
  width: 100%;
  height: calc(100vh - 20vh);
  background: #fff;
  border-radius: 5vw 5vw 0 0;
  box-shadow: 0 -1.5vh 1vh rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  margin-top: -5vh;
  padding-top: 2vh;
  z-index: 2;
`;

const ChatContentContainer = styled.div`
  width: 100%;
  height: calc(
    100vh - 20vh - 10vh
  ); /* Adjust the height to ensure InputContainer does not overlap */
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0 3vw 1vh 3vw;
  box-sizing: border-box;
  z-index: 3;
  position: relative;

  .chat-bubble.left + .chat-bubble.right,
  .chat-bubble.right + .chat-bubble.left {
    margin-top: 2rem;
  }

  -ms-overflow-style: none; /* IE 및 Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari 및 Opera */
  }
`;

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background: #fff;
  z-index: 3;
  box-sizing: border-box;
  margin-top: 1vh;
`;

const Input = styled.input`
  width: 75%;
  border-radius: 1.5vw;
  border: 1px solid #ccc;
  outline: none;
  font-family: "Pretendard";
  font-size: 0.9rem;
  font-weight: 200;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.3;
  color: #333;
  padding-left: 0.5rem;

  &::placeholder {
    color: #999;
    font-size: 0.9rem;
    padding-left: 0.3rem;
    letter-spacing: -0.02em;
  }
`;

const Button = styled.button`
  width: 15%;
  margin-left: 1vw;
  padding: 2vw;
  border: none;
  border-radius: 1.5vw;
  background: ${(props) => (props.disabled ? "#d9d9d9" : "black")};
  color: white;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  font-family: "Pretendard";
  font-size: 0.9rem;
  font-weight: 500;

  &:disabled {
    cursor: default;
  }
`;

const LoadingContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  margin: 1vw 0;
  flex-direction: row;
`;

const ProfileImage = styled.img`
  width: 11vw;
  height: 11vw;
  border: solid 0.2vw #d9d9d9;
  border-radius: 50%;
  object-fit: cover;
  margin: 2vh 2vw 0.5vh 1vw;
`;

const LoadingOverlay = styled(motion.div)`
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 4;
  background: white;
  margin-left: 2vw;
`;

const fetchData = async (input) => {
  try {
    const response = await apiClient.post(
      `/search-by-final`,
      {
        text_kor: input,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("서버가 응답했습니다. 상태 코드:", error.response.status);
      console.error("응답 데이터:", error.response.data);
      if (error.response.status === 422) {
        throw new Error("Unprocessable Entity");
      }
    } else if (error.request) {
      console.error("응답을 받지 못했습니다:", error.request);
    } else {
      console.error("요청 설정 중 오류 발생:", error.message);
    }
    console.error("오류 구성:", error.config);
    throw error;
  }
};

export default function ChatPage() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputFocus = () => {
    inputRef.current.placeholder = "";
  };

  const handleInputBlur = () => {
    if (inputValue.trim() === "") {
      inputRef.current.placeholder = "메시지를 입력하세요";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      handleSendMessage();
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() !== "") {
      setMessages([...messages, { type: "right", text: inputValue }]);
      setInputValue("");
      setLoading(true);

      try {
        const response = await fetchData(inputValue);
        const responseMessages = response.search_list.map((item) => ({
          type: "left",
          episode: item.episode,
          num: item.num,
          similarity: item.similarity,
          imagePath: item.image_path,
        }));

        const successMessage = { type: "success" };
        setMessages((prevMessages) => [
          ...prevMessages,
          successMessage,
          ...responseMessages,
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prevMessages) => [...prevMessages, { type: "failure" }]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <HeaderContainer>
        <BackButton src={backButton} onClick={handleBackClick} />
      </HeaderContainer>
      <WhiteContainer>
        <ChatContentContainer>
          <InitialChat className="chat-bubble left" />
          {messages.map((message, index) =>
            message.type === "left" ? (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="chat-bubble left"
              >
                <LeftChat
                  episode={message.episode}
                  num={message.num}
                  similarity={message.similarity}
                  imagePath={message.imagePath}
                  profileImage={index === 0 ? profile : null}
                />
              </motion.div>
            ) : message.type === "success" ? (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="chat-bubble success"
              >
                <SuccessChat className="chat-bubble left" />
              </motion.div>
            ) : message.type === "failure" ? (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="chat-bubble failure"
              >
                <FailureChat className="chat-bubble left" />
              </motion.div>
            ) : (
              <RightChat
                key={index}
                message={message.text}
                className="chat-bubble right"
              />
            )
          )}
          {loading && (
            <LoadingContainer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProfileImage src={profile} />
              <LoadingOverlay>
                <StageSpinner color="#000" size={25} />
              </LoadingOverlay>
            </LoadingContainer>
          )}
          <div ref={chatEndRef} />
        </ChatContentContainer>

        <InputContainer>
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요"
            ref={inputRef}
          />
          <Button
            onClick={handleSendMessage}
            disabled={inputValue.trim() === ""}
          >
            전송
          </Button>
        </InputContainer>
      </WhiteContainer>
    </Container>
  );
}
