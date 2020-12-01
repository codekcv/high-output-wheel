import { useMutation } from '@apollo/client';
import { UPDATE_USER } from 'src/constants/mutations';
import { USERS } from 'src/constants/queries';
import React from 'react';
import styled from 'styled-components';
import { useApp } from '../context';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

const CodeSharer: React.FC = () => {
  const app = useApp();
  // const [startDate, setStartDate] = useState(new Date());
  const [updateUser, { loading: mutating }] = useMutation(UPDATE_USER);

  const sharers = app.users.filter((user: any) => user.sharer);

  const updateDude = async (sharer: any) => {
    await updateUser({
      variables: {
        where: {
          id: sharer.id,
        },
        data: {
          sharer: {
            set: false,
          },
          done: {
            set: true,
          },
        },
      },
      refetchQueries: [{ query: USERS }],
    });

    app.refetch();
  };

  const sharerAmount = [1, 2];

  return (
    <Container>
      <h2>EVERY FRIDAY! :pkek:</h2>
      {/* <DatePicker
        selected={startDate}
        onChange={(date: any) => setStartDate(date)}
      /> */}
      <div className='code-sharer'>
        {sharerAmount.map((amount, index) => (
          <div className='sharer' key={index}>
            <div>{`Sharer ${amount}: ${sharers[index]?.name || 'TBD!'}`}</div>
            {sharers[index]?.name && !app.readOnly && (
              <button
                disabled={mutating}
                onClick={() => updateDude(sharers[index])}
              >
                COMPLETE!
              </button>
            )}
          </div>
        ))}
      </div>

      <div className='divider' />

      <div className='done'>
        <h2>DONE LIST</h2>
        {app.users.map((user: any, index: number) => (
          <p key={index}>
            {user.name}:{' '}
            <span
              style={{
                color: user.done ? 'green' : user.sharer ? 'orange' : 'red',
              }}
            >
              {user.done ? 'YES' : user.sharer ? 'IN-PROGRESS' : 'NO'}
            </span>
          </p>
        ))}
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  background: white;
  border-radius: 6px;
  margin-left: 32px;
  color: black;
  padding: 2rem;
  font-size: 1.5rem;

  p {
    margin: 0;
  }

  h2 {
    margin: 0;
  }

  .divider {
    border-bottom: 1px gray dashed;
    margin: 1rem 0;
  }

  .sharer {
    display: flex;
    margin-bottom: 0.5rem;

    button {
      margin-left: 12px;
      padding: 0 0.5rem;
    }
  }

  .done {
    .red {
      color: red;
    }
  }
`;

export default CodeSharer;
