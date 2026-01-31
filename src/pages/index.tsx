import type { NextPage } from 'next';
import { UserLayout } from '@layout';
import React from 'react';
import { Card } from 'react-bootstrap';

const Home: NextPage = () => (
  <UserLayout>
    <Card>
      <Card.Body>
        <Card.Title>Home</Card.Title>
        <Card.Text>
          Welcome to AWAP 2026! :D Thanks for registering and creating an
          account. Navigate to the getting started page to begin!

          <br />
          <br />
          Landing Page:{' '}
          <a
            href='http://awap.acmatcmu.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            awap.acmatcmu.com
          </a>
          <br />
          Dashboard:{' '}
          <a
            href='http://dashboard.awap.acmatcmu.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            dashboard.awap.acmatcmu.com
          </a>
          <br />
          Player Guide:{' '}
          <a
            href='https://tinyurl.com/awap2026api'
            target='_blank'
            rel='noopener noreferrer'
          >
            tinyurl.com/awap2026api
          </a>
          <br />
          Online 3D Replay Viewer:{' '}
          <a
            href='https://www.acmatcmu.com/awap-viewer-2026/'
            target='_blank'
            rel='noopener noreferrer'
          >
            www.acmatcmu.com/awap-viewer-2026/
          </a>
          <br />
        </Card.Text>
      </Card.Body>
    </Card>
  </UserLayout>
);

export default Home;
