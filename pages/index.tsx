import { Sharer, Wheel } from 'components';
// import { useAudio, useQuery } from 'hooks';
import { USERS } from 'constants/queries';
import styled from 'styled-components';
import { useApp } from 'context';

const Index: React.FC = () => {
  const app = useApp();
  // const [play, isPlaying] = useAudio('bgm.mp3');

  const handleSwitch = (e: any) => app.setReadOnly(!e.target.checked);

  const isLoading = app.loading || !app.users.length;

  return (
    <Container>
      <div className='content'>
        <div className='header'>
          <h1>High Output Wheel</h1>
        </div>

        <div className='main'>
          {!isLoading ? (
            <>
              <Wheel />
              <Sharer />
            </>
          ) : (
            <div className='fetching-data'>Fetching data...</div>
          )}
        </div>
      </div>

      <div className='button'>
        Real Thing?
        <label className='switch'>
          <input type='checkbox' onChange={handleSwitch} />
          <span className='slider round' />
        </label>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
  color: white;
  overflow: hidden;

  .content {
    width: 1280px;
    margin: auto;
    padding: 2rem;

    display: flex;
    flex-direction: column;
    align-items: center;

    .header {
      margin-bottom: 4rem;

      h1 {
        font-size: 4rem;
        text-align: center;
      }
    }

    .main {
      display: flex;
      width: 100%;
    }
  }

  .button {
    position: absolute;
    top: 2rem;
    right: 2rem;
    display: flex;
    align-items: center;

    .switch {
      margin-left: 1rem;
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    /* The slider */
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }

    .slider:before {
      position: absolute;
      content: '';
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }

    input:checked + .slider {
      background-color: #2196f3;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #2196f3;
    }

    input:checked + .slider:before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
    }

    /* Rounded sliders */
    .slider.round {
      border-radius: 34px;
    }

    .slider.round:before {
      border-radius: 50%;
    }
  }

  background-color: #0f0f0f;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%236d6d6d' fill-opacity='0.4'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
`;

export default Index;
