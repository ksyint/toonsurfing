import React, { useRef, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  margin: 1vw;
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

const ImageContainer = styled.div`
  display: flex;
  overflow-x: auto;
  width: 100%;
  align-items: center;
  cursor: grab;
  margin-top: 1.5vh;
  margin-bottom: 0.5vh;

  &::-webkit-scrollbar {
    height: 0.65vh;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d9d9d9;
    border-radius: 5vw;
    border: 1px solid #d9d9d9;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #a9a9a9;
  }
`;

const ToonImage = styled.img`
  width: 40vw;
  height: 40vh;
  background: white;
  border: solid 0.2vw #d9d9d9;
  object-fit: contain;
  margin-right: 1.5vw;
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1vw 0;
  margin: 1vh 1.5vw 1vh 1.5vw;
`;

const ChatText = styled.p`
  font-family: "Pretendard";
  font-size: 0.9rem;
  font-weight: 500;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.2;
  color: #000;
  margin: 0;
`;

const ChatLink = styled.button`
  font-family: "Pretendard";
  font-size: 0.8rem;
  font-weight: 300;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.2;
  color: #333;
  margin-right: 1.5vw;
  background: none;
  border: none;
  padding: 0;
  text-decoration: none;
  cursor: pointer;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 0.1em;
    left: 0;
    bottom: -0.1em;
    background: #d9d9d9;
    transition: background-color 0.3s;
  }
`;

export default function LeftChat({ episode, num, imagePath, className }) {
  const link = `https://comic.naver.com/webtoon/detail?titleId=743838&no=${episode}`;
  const pathParts = imagePath.split("/");
  const base = pathParts[0]; // Should be "cuts"
  const currentNumber = parseInt(pathParts[1].split(".")[0]);

  const images = [
    `${base}/${currentNumber.toString().padStart(3, "0")}.jpg`,
    `${base}/${(currentNumber + 3).toString().padStart(3, "0")}.jpg`,
    `${base}/${(currentNumber + 5).toString().padStart(3, "0")}.jpg`,
  ];

  const fallbackImages = [
    `${base}/040.jpg`,
    `${base}/050.jpg`,
    `${base}/060.jpg`,
  ];

  const openLinkInNewWindow = () => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const imageContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const container = imageContainerRef.current;
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
    container.style.cursor = "grabbing";
    container.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = imageContainerRef.current;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // Adjust drag speed
    container.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const container = imageContainerRef.current;
    container.style.cursor = "grab";
    container.style.removeProperty("user-select");
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      const container = imageContainerRef.current;
      container.style.cursor = "grab";
      container.style.removeProperty("user-select");
    }
  };

  const handleError = (e) => {
    const randomFallback =
      fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    e.target.src = `/assets/images/cuts/${randomFallback}`;
  };

  return (
    <Container
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2 }}
      className={className}
    >
      <ChatContainer>
        <ImageContainer
          ref={imageContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {images.map((img, index) => (
            <ToonImage
              key={index}
              src={`/assets/images/cuts/${img}`}
              alt={`response-${index}`}
              onError={handleError}
            />
          ))}
        </ImageContainer>
        <TextContainer>
          <ChatText>{episode}화</ChatText>
          <ChatLink onClick={openLinkInNewWindow}>보러가기</ChatLink>
        </TextContainer>
      </ChatContainer>
    </Container>
  );
}
