import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

import closeButton from "../assets/images/closeButton.png";
import thumbnail1 from "../assets/images/thumnails/소녀재판.PNG";
import thumbnail2 from "../assets/images/thumnails/걔의질투.PNG";
import thumbnail3 from "../assets/images/thumnails/귀비나리.PNG";
import thumbnail4 from "../assets/images/thumnails/그날죽은나는.PNG";
import thumbnail5 from "../assets/images/thumnails/기자매.PNG";
import thumbnail6 from "../assets/images/thumnails/미래의골동품가게.PNG";
import thumbnail7 from "../assets/images/thumnails/사랑하는여름하늘.PNG";
import thumbnail8 from "../assets/images/thumnails/아르마딜로.PNG";
import thumbnail9 from "../assets/images/thumnails/여우놀이.PNG";
import thumbnail10 from "../assets/images/thumnails/예명여고.PNG";
import thumbnail11 from "../assets/images/thumnails/일립예고학생들.PNG";
import thumbnail12 from "../assets/images/thumnails/자멸기관.PNG";
import thumbnail13 from "../assets/images/thumnails/처음을줄게.PNG";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const pageTransition = {
  duration: 0.5,
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: black;
`;

const FooterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 10vh;
`;

const ButtonContainer = styled.img`
  width: 5vw;
  height: auto;
  position: absolute;
  cursor: pointer;
`;

const TextContainer = styled.div`
  font-family: "Pretendard";
  font-size: 1.1rem;
  font-weight: 400;
  color: white;
  white-space: nowrap;
  line-height: 1.2;
  text-align: center;
  margin: 3vh;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 60vh;
  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  background-color: ${(props) =>
    props.active ? "white" : "rgba(100, 100, 100, 0.6)"};
  color: ${(props) => (props.active ? "black" : "black")};
  width: 70vw;
  margin: 1vw 0;
  border-radius: 1.5vw;
  cursor: ${(props) => (props.active ? "pointer" : "default")};
  pointer-events: ${(props) => (props.active ? "auto" : "none")};

  &:hover {
    background-color: ${(props) =>
      props.active ? "#f0f0f0" : "rgba(100, 100, 100, 0.6)"};
  }
`;

const Thumbnail = styled.img`
  width: 12vw;
  height: 16vw;
  border-radius: 1.5vw 0 0 1.5vw;
  filter: ${(props) => (props.active ? "none" : "brightness(0.6)")};
`;

const Title = styled.div`
  font-family: "Pretendard";
  font-size: 0.9rem;
  font-weight: ${(props) => (props.active ? 500 : 200)};
  letter-spacing: -0.02em;
  padding-left: 2vw;
  padding-top: 0.5vh;
`;

const HashTagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-left: 1.8vw;
  margin-top: 1vh;
`;

const HashTag = styled.div`
  font-family: "Pretendard";
  font-size: 0.7rem;
  font-weight: ${(props) => (props.active ? 200 : 100)};
  margin: 0.5vw;
  padding: 0.7vw;
  letter-spacing: -0.02em;
  background-color: ${(props) => (props.active ? "#f5f5f5" : "transparent")};
  border-radius: 1.2vw;
  color: ${(props) => (props.active ? "#333" : "black")};
`;

const items = [
  {
    id: 1,
    thumbnail: thumbnail1,
    title: "소녀재판",
    hashtag: ["#드라마", "#공감성수치", "#완결무료"],
  },
  {
    id: 2,
    thumbnail: thumbnail2,
    title: "걔의 질투",
    hashtag: ["#로맨스", "#비밀연애", "#현실로맨스"],
  },
  {
    id: 3,
    thumbnail: thumbnail3,
    title: "귀비나리",
    hashtag: ["#스릴러", "#오컬트", "#복수극"],
  },
  {
    id: 4,
    thumbnail: thumbnail4,
    title: "그날 죽은 나는",
    hashtag: ["#드라마", "#서스펜스", "#구원서사"],
  },
  {
    id: 5,
    thumbnail: thumbnail5,
    title: "기자매",
    hashtag: ["#개그", "#병맛", "#힘숨찐"],
  },
  {
    id: 6,
    thumbnail: thumbnail6,
    title: "미래의 골동품 가게",
    hashtag: ["#스릴러", "#명작", "#동양풍판타지"],
  },
  {
    id: 7,
    thumbnail: thumbnail7,
    title: "사랑하는 여름 하늘",
    hashtag: ["#로맨스", "#성장물", "#청춘로맨스"],
  },
  {
    id: 8,
    thumbnail: thumbnail8,
    title: "아르마딜로",
    hashtag: ["#드라마", "#힐링", "#성장물"],
  },
  {
    id: 9,
    thumbnail: thumbnail9,
    title: "여우놀이",
    hashtag: ["#드라마", "#폭스남", "#학원로맨스"],
  },
  {
    id: 10,
    thumbnail: thumbnail10,
    title: "예명여고",
    hashtag: ["#스릴러", "#괴담", "#완결무료"],
  },
  {
    id: 11,
    thumbnail: thumbnail11,
    title: "일립예고 학생들",
    hashtag: ["#드라마", "#미친작화", "#학원물"],
  },
  {
    id: 12,
    thumbnail: thumbnail12,
    title: "자멸기관",
    hashtag: ["#스릴러", "#하이퍼리얼리즘", "#복수극"],
  },
  {
    id: 13,
    thumbnail: thumbnail13,
    title: "처음을 줄게!",
    hashtag: ["#로맨스", "#다정남", "#캠퍼스로맨스"],
  },
];

function SelectPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const handleClick = (index) => {
    setSelectedIndex(index);
    if (index === 0) {
      navigate("/chat");
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <Container>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        <TextContainer>어떤 웹툰이 궁금하세요?</TextContainer>

        <ListContainer>
          {items.map((item, index) => (
            <ListItem
              key={item.id}
              active={index === selectedIndex}
              onClick={() => handleClick(index)}
            >
              <Thumbnail
                src={item.thumbnail}
                alt={`Thumbnail ${index + 1}`}
                active={index === selectedIndex}
              />
              <div>
                <Title active={index === selectedIndex}>{item.title}</Title>
                <HashTagContainer>
                  {item.hashtag.map((tag, tagIndex) => (
                    <HashTag key={tagIndex} active={index === selectedIndex}>
                      {tag}
                    </HashTag>
                  ))}
                </HashTagContainer>
              </div>
            </ListItem>
          ))}
        </ListContainer>

        <FooterContainer>
          <ButtonContainer src={closeButton} onClick={handleBackClick} />
        </FooterContainer>
      </motion.div>
    </Container>
  );
}

export default SelectPage;
