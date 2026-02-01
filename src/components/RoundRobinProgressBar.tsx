import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';
import useSWR from 'swr';
import axios from 'axios';
import { RoundRobinState } from '@pages/api/user/round-robin-state';

const RoundRobinProgressBar: React.FC = () => {
  const fetcher = async (url: string) => axios.get(url).then((res) => res.data);

  const progressBarRefreshIntervalMs = 10000; // 10 seconds

  const { data: roundRobinState } = useSWR<RoundRobinState>(
    '/api/user/round-robin-state',
    fetcher,
    {
      refreshInterval: progressBarRefreshIntervalMs,
    },
  );

  if (!roundRobinState || !roundRobinState.active) {
    return null;
  }

  const progressPercent = (() => {
    if (roundRobinState.total <= 0) return 0;
    if (roundRobinState.completed === roundRobinState.total) return 100;
    return Math.min(Math.round((roundRobinState.completed / roundRobinState.total) * 100), 99);
  })();

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return 'N/A';
    try {
      return new Date(timestamp).toLocaleString('en-US');
    } catch {
      return timestamp;
    }
  };

  return (
    <Card className='mb-3'>
      <Card.Body>
        <Card.Title>
          Round Robin Playoff Progress
          {roundRobinState.bracket && (
            <span className='text-muted' style={{ fontSize: '0.8em', marginLeft: '10px' }}>
              ({roundRobinState.bracket})
            </span>
          )}
        </Card.Title>
        <ProgressBar
          now={progressPercent}
          label={`${progressPercent}%`}
          variant={progressPercent === 100 ? 'success' : 'primary'}
          animated={progressPercent < 100}
          style={{ height: '25px', fontSize: '14px' }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
            fontSize: '14px',
          }}
        >
          <span>
            <strong>Matches Completed:</strong> {roundRobinState.completed} / {roundRobinState.total}
          </span>
          <span>
            <strong>Matches Remaining:</strong> {roundRobinState.remaining}
          </span>
          <span>
            <strong>Last Updated:</strong> {formatTimestamp(roundRobinState.timestamp)}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RoundRobinProgressBar;
