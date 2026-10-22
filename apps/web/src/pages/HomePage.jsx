import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import logo from "../assets/images/logo.png";
import button from "../assets/images/startButton.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: black;
`;

const ComponentContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LogoContainer = styled(motion.img)`
  width: 72vw;
  height: auto;
  margin-top: 10vh;
  margin-bottom: 4vh;
`;

const TextContainer = styled(motion.div)`
  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 300;
  color: #d9d9d9;
  white-space: nowrap;
  line-height: 1.2;
  text-align: center;
  margin: 0.5vh 0 0.5vh 0;
  letter-spacing: -0.02em;
`;

const ButtonWrapper = styled(motion.div)`
  margin: 11vh;
`;

const ButtonContainer = styled.img`
  width: 48vw;
  height: auto;
  cursor: pointer;
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 2,
      staggerChildren: 1,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 2 } },
};

function HomePage() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/select");
  };

  return (
    <Container>
      <ComponentContainer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <LogoContainer src={logo} variants={childVariants} />
        <TextContainer variants={childVariants}>
          어떤 장면이 궁금하세요?
        </TextContainer>
        <TextContainer variants={childVariants}>
          툰 서핑으로 더 쉽고, 더 빠른 웹툰
        </TextContainer>
        <ButtonWrapper variants={childVariants}>
          <ButtonContainer
            src={button}
            onClick={handleButtonClick}
            initial={{ scale: 1 }}
            whileTap={{ scale: 0.85 }}
          />
        </ButtonWrapper>
      </ComponentContainer>
    </Container>
  );
}

export default HomePage;
