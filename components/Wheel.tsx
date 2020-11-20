import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { useAudio } from 'hooks/useAudio';
import { colorPalette } from 'constants/colorPalette';
import { User } from '@prisma/client';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from 'constants/mutations';
import { useApp } from 'context';

const colors = [...colorPalette];
const polygon = 'polygon(0 0, 0 200%, -100% 200%, -100% 0)';
const spinDuration = 6;
const confettiDuration = 4500;

const Wheel: React.FC = () => {
  const app = useApp();
  const { users } = useApp();
  const animation = useAnimation();
  const initialRotation = useMotionValue(0);
  const finalRotation = useMotionValue(0);

  const [isFade, setIsFade] = useState(false);
  const [hasWinner, setHasWinner] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isConfetti, setIsConfetti] = useState(false);
  const [updateUser] = useMutation(UPDATE_USER);

  const [winner, setWinner] = useState<{
    winner: any;
    index: number;
  }>({
    winner: { img: '' },
    index: 0,
  });

  const [playAudio] = useAudio('wheel/yo.mp3');

  const players = [...users].filter(
    (player: any) => !player.done && !player.sharer
  );

  const turnLength = 1 / players.length;
  const image = isSpinning ? 'pnani' : isHover ? 'pmonkas' : 'pok';

  let colorIncrementer = 0;
  const spinButton = async (): Promise<void> => {
    if (isSpinning) return;

    setIsSpinning(true);
    playAudio(true);

    const winner2 = Math.random() * players.length * turnLength;
    const spins = Math.floor(Math.random() * (5 - 3) + 3);

    finalRotation.set(finalRotation.get() + spins + winner2);

    await animation.start({
      rotate: [`${initialRotation.get()}turn`, `${finalRotation.get()}turn`],
      transition: { duration: spinDuration, ease: [0.37, 0.8, 0.37, 1] },
    });

    initialRotation.set(finalRotation.get());
    const getDecimal = finalRotation.get() - Math.floor(finalRotation.get());
    const findWinner = 1 - getDecimal;

    const index = Math.floor(findWinner / turnLength);

    const winner = players[index];

    setWinner({ winner, index });
    setIsSpinning(false);
    setHasWinner(true);
    setIsConfetti(true);
  };

  useEffect(() => {
    if (hasWinner) {
      setTimeout(() => {
        setHasWinner((_p) => false);
        setIsFade((_p) => true);

        if (!app.readOnly) {
          app.setUsers((users: any) => {
            const newUsers = [...users];
            newUsers.find(
              (user: any) => user.name === winner.winner.name
            ).sharer = true;

            return newUsers;
          });
        }

        setTimeout(() => {
          setIsFade((p) => false);
        }, 2000);
      }, confettiDuration);

      setTimeout(() => {
        setIsConfetti((p) => false);
      }, confettiDuration + 2000);
    }
  }, [winner.index, hasWinner, app, winner.winner.name]);

  return (
    <Container isFade={isFade} hasWinner={hasWinner}>
      <motion.div className='wheel' animate={animation}>
        <div className='circle'>
          {players.map((user: User, index: number) => {
            let clipPath = 'none';

            if (colorIncrementer === colors.length - 1) colorIncrementer = 0;
            colorIncrementer += 1;

            if (index >= 4 && players.length <= 8) {
              clipPath = polygon;
            } else if (players.length > 8) {
              if (index >= players.length / 2) clipPath = polygon;
            }

            const marginLeft = (Math.PI * 600) / players.length / 2 - 37.5;
            const turn = 1 / players.length / 2;

            return (
              <div className='slice-container' key={index} style={{ clipPath }}>
                <div
                  className='slice'
                  style={{
                    background: colors[colorIncrementer],
                    transform: `rotate(${turnLength * index}turn)`,
                    // border: "1px red solid",
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      // marginTop: `${turn * 35}rem`,
                      marginTop: '2rem',
                      marginLeft,
                      transformOrigin: '0 0',
                      transform: `rotate(${turn}turn)`,
                      // border: "1px red solid",
                    }}
                  >
                    <img
                      className='next-image'
                      src={user.img}
                      width={60}
                      height={60}
                      alt='player'
                    />

                    <div
                      style={{
                        marginTop: '0rem',
                        textAlign: 'center',
                        color: 'black',
                      }}
                    >
                      {user.name}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <button className='spin-button' onClick={spinButton}>
        <img
          className='next-image spin-image'
          src={`/wheel/${image}.png`}
          alt='pepe'
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          width={96}
          height={96}
        />
      </button>

      <div className='pointer' />

      <div className='winner'>
        <img
          className='spin-image'
          src={winner.winner.img || '/wheel/pok.png'}
          width={600}
          height={600}
          alt='winner'
        />
      </div>
    </Container>
  );
};

const Container = styled.div<{ isFade: boolean; hasWinner: boolean }>`
  position: relative;
  width: 600px;
  height: 600px;

  .next-image {
    border: 5px silver ridge;
    border-radius: 50%;
  }

  .spin-image {
    border: 5px silver ridge;
    border-radius: 50%;
  }

  .wheel {
    position: relative;
    width: inherit;
    height: inherit;
    border: 5px silver ridge;
    border-radius: 50%;
    overflow: hidden;

    .circle {
      position: relative;
      left: 50%;
      top: -5px;
      width: 50%;
      height: 50%;

      .slice-container {
        position: absolute;
        width: 100%;
        height: 100%;

        .slice {
          width: inherit;
          height: 300px;
          transform-origin: 0 100%;
          border: 2px darkgrey solid;
        }
      }
    }
  }

  .spin-button {
    position: absolute;
    width: 96px;
    height: 96px;
    background: white;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    outline: none;

    display: flex;
    justify-content: center;
    align-items: center;

    :hover {
      cursor: pointer;
    }
  }

  .pointer {
    position: absolute;
    left: 50%;
    top: -4%;
    transform: translateX(-50%);

    border: 16px silver solid;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid transparent;
  }

  .confetti {
    opacity: ${({ isFade }) => (isFade ? 0 : 1)};
    transition: 1s all ease;
  }

  .winner {
    position: absolute;
    left: 0;
    top: 0;

    opacity: ${({ hasWinner }) => (hasWinner ? 1 : 0)};
    transform: ${({ hasWinner }) => `scale(${hasWinner ? 1 : 0})`};
    transition: 2s all ease;
  }
`;

export default Wheel;
